import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  createConnection,
  Diagnostic,
  Hover,
  HoverParams,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

import {
  groupDiagnostics,
  parseCompilerOutput,
  presentDiagnostics,
} from "./diagnostics/adapter";
import { buildDiagnosticWithRange } from "./diagnostics/range";
import { buildRelatedInformation } from "./diagnostics/relatedInfo";
import { DiagnosticsPresentationMode } from "./diagnostics/types";
import { provideHover } from "./hover-info/hover";
import {
  CompilerResolutionSettings,
  resolveSac2cPath,
} from "./sac2cResolver";

interface SacSettings extends CompilerResolutionSettings {
  diagnosticsMode: "onSave" | "onType" | "manual";
  diagnosticsDebounceMs: number;
  diagnosticsPresentation: DiagnosticsPresentationMode;
  diagnosticsIncludeRelatedInformation: boolean;
  diagnosticsIncludeStackInMessage: boolean;
  diagnosticsMaxStackFrames: number;
  workspaceScanEnabled: boolean;
  workspaceScanOnInitialize: boolean;
  workspaceScanOnConfigurationChange: boolean;
  workspaceScanExcludeDirectories: string[];
  executionBackend: "local" | "wsl" | "docker";
  wslDistribution: string;
  dockerImage: string;
  dockerRunArgs: string[];
  messagingEnabled: boolean;
  messagingArgs: string[];
  compilerExtraArgs: string[];
}

interface SacCompilerRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

interface SacInvocation {
  command: string;
  args: string[];
  cwd: string;
}

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
const DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS = [".git", "node_modules", "out", ".vscode-test"];

let workspaceRoot = process.cwd();
let workspaceRoots: string[] = [workspaceRoot];
let extensionInstallRoot = "";
let settings: SacSettings = getDefaultSettings();
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Safely runs a promise and reports errors to the LSP console instead of
 * letting unhandled rejections bubble and terminate the server process.
 *
 * @param work Promise to execute.
 * @param context Short label describing the task.
 */
function runSafely(work: Promise<void>, context: string): void {
  work.catch((error) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    connection.console.error(`[sac-server] ${context} failed: ${message}`);
  });
}

/**
 * Builds the default server settings used before workspace configuration arrives.
 *
 * !NOTE: Defaults prioritize deterministic compiler diagnostics formatting.
 *
 * @returns Default in-memory server settings.
 */
function getDefaultSettings(): SacSettings {
  return {
    diagnosticsMode: "onSave",
    diagnosticsDebounceMs: 500,
    diagnosticsPresentation: "smart",
    diagnosticsIncludeRelatedInformation: true,
    diagnosticsIncludeStackInMessage: true,
    diagnosticsMaxStackFrames: 5,
    workspaceScanEnabled: true,
    workspaceScanOnInitialize: true,
    workspaceScanOnConfigurationChange: true,
    workspaceScanExcludeDirectories: [...DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS],
    compilerChannel: "system",
    compilerPath: "",
    fallbackToSystem: true,
    executionBackend: "local",
    wslDistribution: "",
    dockerImage: "",
    dockerRunArgs: [],
    messagingEnabled: true,
    messagingArgs: [
      "-cti-no-color",
      "-cti-no-source",
      "-cti-no-hint",
      "-cti-no-explain",
      "-cti-message-length",
      "0",
      "-cti-primary-header-format",
      "%s: ",
      "-cti-continuation-header-format",
      "%.0s",
    ],
    compilerExtraArgs: [],
  };
}

/**
 * Checks whether a text document is backed by a local filesystem URI.
 *
 * @param document LSP text document.
 * @returns True when URI scheme is file.
 */
function isFileDocument(document: TextDocument): boolean {
  return document.uri.startsWith("file://");
}

/**
 * Converts a file URI to a platform-specific filesystem path.
 *
 * @param uri File URI.
 * @returns Native filesystem path.
 */
function uriToFsPath(uri: string): string {
  return fileURLToPath(uri);
}

/**
 * Normalizes filesystem paths for stable cross-platform string comparisons.
 *
 * !NOTE: Windows comparisons are case-insensitive.
 *
 * @param filePath Input filesystem path.
 * @returns Normalized comparison path.
 */
function normalizePathForCompare(filePath: string): string {
  const normalized = path.normalize(filePath);
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

/**
 * Checks whether a filesystem path points to a SaC source file.
 *
 * @param filePath Candidate path.
 * @returns True when path ends in .sac.
 */
function isSacFilePath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(".sac");
}

/**
 * Recursively collects .sac files from a workspace root.
 *
 * @param rootDir Root directory to scan.
 * @returns Absolute file paths of discovered SaC files.
 */
function collectSacFiles(rootDir: string, excludedDirNames: Set<string>): string[] {
  const files: string[] = [];

  const visit = (dirPath: string): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (!excludedDirNames.has(entry.name)) {
          visit(fullPath);
        }
        continue;
      }

      if (entry.isFile() && isSacFilePath(fullPath)) {
        files.push(fullPath);
      }
    }
  };

  visit(rootDir);
  return files;
}

/**
 * Creates an ephemeral text document from disk for files not currently open.
 *
 * @param fsPath Absolute source file path.
 * @returns TextDocument when file could be read, otherwise null.
 */
function createDocumentFromFile(fsPath: string): TextDocument | null {
  try {
    const content = fs.readFileSync(fsPath, "utf8");
    return TextDocument.create(pathToFileURL(fsPath).toString(), "sac", 0, content);
  } catch {
    return null;
  }
}

/**
 * Validates all discovered SaC files in configured workspace roots.
 */
async function validateAllWorkspaceSacFiles(): Promise<void> {
  if (settings.diagnosticsMode === "manual" || !settings.workspaceScanEnabled) {
    return;
  }

  const excludedDirNames = new Set(settings.workspaceScanExcludeDirectories);

  const openByPath = new Map<string, TextDocument>();
  for (const openDocument of documents.all()) {
    if (!isFileDocument(openDocument)) {
      continue;
    }
    openByPath.set(normalizePathForCompare(uriToFsPath(openDocument.uri)), openDocument);
  }

  const seenPaths = new Set<string>();
  for (const root of workspaceRoots) {
    for (const fsPath of collectSacFiles(root, excludedDirNames)) {
      const normalizedPath = normalizePathForCompare(fsPath);
      if (seenPaths.has(normalizedPath)) {
        continue;
      }
      seenPaths.add(normalizedPath);

      const openDocument = openByPath.get(normalizedPath);
      if (openDocument) {
        try {
          await validateDocument(openDocument);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          connection.console.error(`[sac-server] validate open document failed (${fsPath}): ${message}`);
        }
        continue;
      }

      const ephemeral = createDocumentFromFile(fsPath);
      if (ephemeral) {
        try {
          await validateDocument(ephemeral);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          connection.console.error(`[sac-server] validate file failed (${fsPath}): ${message}`);
        }
      }
    }
  }
}

/**
 * Normalizes unknown config values into a string-array compiler argument list.
 *
 * @param value Candidate config value.
 * @param fallback Fallback argument list used when value is invalid.
 * @returns Sanitized argument list.
 */
function normalizeCompilerArgs(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

/**
 * Normalizes unknown config values into a cleaned string list.
 *
 * @param value Candidate config value.
 * @param fallback Fallback list used when value is invalid.
 * @returns Sanitized string list.
 */
function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

/**
 * Updates runtime settings from configuration payload provided by the client.
 *
 * !IMPORTANT: Invalid or missing values are coerced back to safe defaults.
 * ?TODO: Validate Docker and WSL settings more aggressively and expose a
 *        user-facing setup diagnostics command.
 *
 * @param configuration Raw configuration object from LSP notifications.
 */
function updateSettings(configuration: unknown): void {
  const root = configuration as Record<string, unknown> | undefined;
  const sac = (root?.sac as Record<string, unknown> | undefined) || {};
  const diagnostics = (sac.diagnostics as Record<string, unknown> | undefined) || {};
  const workspaceScan = (diagnostics.workspaceScan as Record<string, unknown> | undefined) || {};
  const compiler = (sac.compiler as Record<string, unknown> | undefined) || {};
  const wsl = (compiler.wsl as Record<string, unknown> | undefined) || {};
  const docker = (compiler.docker as Record<string, unknown> | undefined) || {};
  const messaging = (compiler.messaging as Record<string, unknown> | undefined) || {};

  const mode = diagnostics.mode;
  const diagnosticsMode: SacSettings["diagnosticsMode"] =
    mode === "onType" || mode === "manual" || mode === "onSave" ? mode : "onSave";

  const presentation = diagnostics.presentation;
  const diagnosticsPresentation: DiagnosticsPresentationMode =
    presentation === "expanded" || presentation === "smart" || presentation === "hybrid"
      ? presentation
      : "expanded";

  settings = {
    diagnosticsMode,
    diagnosticsDebounceMs: Math.max(Number(diagnostics.debounceMs || 500), 100),
    diagnosticsPresentation,
    diagnosticsIncludeRelatedInformation: diagnostics.includeRelatedInformation !== false,
    diagnosticsIncludeStackInMessage: diagnostics.includeStackInMessage !== false,
    diagnosticsMaxStackFrames: Math.max(Number(diagnostics.maxStackFrames || 5), 0),
    workspaceScanEnabled: workspaceScan.enabled !== false,
    workspaceScanOnInitialize: workspaceScan.onInitialize !== false,
    workspaceScanOnConfigurationChange: workspaceScan.onConfigurationChange !== false,
    workspaceScanExcludeDirectories: normalizeStringList(
      workspaceScan.excludeDirectories,
      [...DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS],
    ),
    compilerChannel:
      compiler.channel === "stable" || compiler.channel === "develop" || compiler.channel === "system"
        ? compiler.channel
        : "system",
    compilerPath: typeof compiler.path === "string" ? compiler.path : "",
    fallbackToSystem: compiler.fallbackToSystem !== false,
    executionBackend:
      compiler.executionBackend === "wsl"
        || compiler.executionBackend === "docker"
        || compiler.executionBackend === "local"
        ? compiler.executionBackend
        : "local",
    wslDistribution: typeof wsl.distribution === "string" ? wsl.distribution : "",
    dockerImage: typeof docker.image === "string" ? docker.image : "",
    dockerRunArgs: normalizeCompilerArgs(docker.runArgs, []),
    messagingEnabled: messaging.enabled !== false,
    messagingArgs: normalizeCompilerArgs(messaging.args, [
      "-cti-no-color",
      "-cti-no-source",
      "-cti-no-hint",
      "-cti-no-explain",
      "-cti-message-length",
      "0",
      "-cti-primary-header-format",
      "%s: ",
      "-cti-continuation-header-format",
      "%.0s",
    ]),
    compilerExtraArgs: normalizeCompilerArgs(compiler.extraArgs, []),
  };
}

/**
 * Clears all published diagnostics for a document URI.
 *
 * @param uri Document URI.
 */
function clearDocumentDiagnostics(uri: string): void {
  try {
    connection.sendDiagnostics({ uri, diagnostics: [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    connection.console.error(`[sac-server] clear diagnostics failed (${uri}): ${message}`);
  }
}

/**
 * Heuristically detects whether compiler output indicates unknown messaging flags.
 *
 * @param stderrText Compiler stderr text.
 * @returns True when output looks like unsupported option errors.
 */
function isLikelyMessagingFlagFailure(stderrText: string): boolean {
  const text = (stderrText || "").toLowerCase();
  return (
    text.includes("unknown option")
    || text.includes("unknown argument")
    || text.includes("invalid option")
    || text.includes("unrecognized option")
  );
}

/**
 * Runs the compiler process and captures stdout/stderr until completion.
 *
 * @param executable Executable command name or path.
 * @param args Compiler invocation arguments.
 * @param cwd Working directory for the process.
 * @returns Process completion payload with exit code and output streams.
 */
function runSac2c(executable: string, args: string[], cwd: string): Promise<SacCompilerRunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd,
      env: process.env,
      shell: false,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += String(chunk);
    });

    child.on("error", (error: Error) => {
      reject(error);
    });

    child.on("close", (code: number | null) => {
      resolve({ code, stdout, stderr });
    });
  });
}

/**
 * Builds compiler arguments for a document validation pass.
 *
 * @param documentPath Source document path.
 * @param includeMessaging Whether configured messaging arguments should be included.
 * @returns Argument array passed to the compiler executable.
 */
function buildCompilerArgs(documentPath: string, includeMessaging: boolean): string[] {
  const args: string[] = [];

  if (includeMessaging && settings.messagingEnabled && settings.messagingArgs.length > 0) {
    args.push(...settings.messagingArgs);
  }

  if (settings.compilerExtraArgs.length > 0) {
    args.push(...settings.compilerExtraArgs);
  }

  args.push(documentPath);
  return args;
}

/**
 * Creates a backend-specific compiler invocation.
 *
 * !IMPORTANT: Backend selection is explicit and never auto-enables WSL/Docker.
 * ?TODO: Improve Windows path translation when invoking WSL with Windows file paths.
 * ?TODO: Add optional persistent Docker container mode for faster repeated checks.
 *
 * @param documentPath Source document path.
 * @param includeMessaging Whether messaging args should be included.
 * @returns Invocation payload or null when setup is incomplete.
 */
function createInvocation(documentPath: string, includeMessaging: boolean): SacInvocation | null {
  const cwd = path.dirname(documentPath);

  if (settings.executionBackend === "local") {
    const resolution = resolveSac2cPath(settings, workspaceRoot);
    if (!resolution.executable) {
      connection.window.showWarningMessage(
        `SaC diagnostics unavailable: ${resolution.reason}`,
      );
      return null;
    }

    return {
      command: resolution.executable,
      args: buildCompilerArgs(documentPath, includeMessaging),
      cwd,
    };
  }

  if (settings.executionBackend === "wsl") {
    if (process.platform !== "win32") {
      connection.window.showWarningMessage(
        "SaC backend 'wsl' is intended for Windows hosts. Use 'local' on Linux/macOS.",
      );
      return null;
    }

    const executable = settings.compilerPath.trim() || "sac2c";
    const args: string[] = [];
    if (settings.wslDistribution.trim().length > 0) {
      args.push("-d", settings.wslDistribution.trim());
    }
    args.push("--", executable, ...buildCompilerArgs(documentPath, includeMessaging));

    return {
      command: "wsl.exe",
      args,
      cwd,
    };
  }

  const dockerImage = settings.dockerImage.trim();
  if (dockerImage.length === 0) {
    connection.window.showWarningMessage(
      "SaC diagnostics unavailable: set sac.compiler.docker.image when using docker backend.",
    );
    return null;
  }

  const executable = settings.compilerPath.trim() || "sac2c";
  const args = [
    "run",
    "--rm",
    "-v",
    `${cwd}:/work`,
    "-w",
    "/work",
    ...settings.dockerRunArgs,
    dockerImage,
    executable,
    ...buildCompilerArgs(path.basename(documentPath), includeMessaging),
  ];

  return {
    command: "docker",
    args,
    cwd,
  };
}

/**
 * Determines whether a parsed diagnostic belongs to the requested document.
 *
 * !NOTE: A filename-only fallback is used to tolerate path rewriting across
 *        containerized backends.
 * ?TODO: Replace basename fallback with robust source map/path mapping logic
 *        for mixed Windows, WSL, and Docker filesystem views.
 *
 * @param parsedPath Path reported by compiler output.
 * @param requestedFilePath Path of the currently validated document.
 * @returns True when the diagnostic should be attached to the document.
 */
function diagnosticAppliesToDocument(parsedPath: string, requestedFilePath: string): boolean {
  const normalizedParsedPath = normalizePathForCompare(parsedPath);
  if (normalizedParsedPath === requestedFilePath) {
    return true;
  }

  const parsedBase = path.basename(normalizedParsedPath);
  const requestedBase = path.basename(requestedFilePath);
  if (parsedBase.length > 0 && parsedBase === requestedBase) {
    return true;
  }

  return false;
}

/**
 * Collects and converts compiler output diagnostics for a single document URI.
 *
 * @param document Document being validated.
 * @param stdout Compiler standard output.
 * @param stderr Compiler standard error.
 * @returns LSP diagnostics applicable to the requested document.
 */
function gatherDiagnosticsForDocument(document: TextDocument, stdout: string, stderr: string): Diagnostic[] {
  const requestedFilePath = normalizePathForCompare(uriToFsPath(document.uri));
  const parsedDiagnostics = parseCompilerOutput(stdout, stderr);
  const normalizedParsedDiagnostics = parsedDiagnostics.map((entry) => ({
    ...entry,
    file: normalizePathForCompare(entry.file),
  }));
  const groups = groupDiagnostics(normalizedParsedDiagnostics);
  const lines = document.getText().split(/\r?\n/);

  const rendered = presentDiagnostics(
    normalizedParsedDiagnostics,
    groups,
    requestedFilePath,
    {
      presentation: settings.diagnosticsPresentation,
      includeRelatedInformation: settings.diagnosticsIncludeRelatedInformation,
      includeStackInMessage: settings.diagnosticsIncludeStackInMessage,
      maxStackFrames: settings.diagnosticsMaxStackFrames,
    },
  );

  return rendered
    .filter((entry) => diagnosticAppliesToDocument(entry.anchor.file, requestedFilePath))
    .map((entry) => {
      const lineText = lines[entry.anchor.line] || "";
      const diagnostic = buildDiagnosticWithRange(entry.anchor, lineText);
      diagnostic.message = entry.message;

      if (settings.diagnosticsIncludeRelatedInformation && entry.related.length > 0) {
        diagnostic.relatedInformation = buildRelatedInformation(entry.related);
      }

      return diagnostic;
    });
}

/**
 * Validates a single document by invoking sac2c and publishing diagnostics.
 *
 * !IMPORTANT: This method retries once without messaging flags when compiler
 * output indicates unsupported options.
 *
 * @param document Document to validate.
 * @returns Promise resolved once diagnostics are published or cleared.
 */
async function validateDocument(document: TextDocument): Promise<void> {
  if (!isFileDocument(document)) {
    return;
  }

  const fsPath = uriToFsPath(document.uri);

  if (!fs.existsSync(fsPath)) {
    clearDocumentDiagnostics(document.uri);
    return;
  }

  const invocationWithMessaging = createInvocation(fsPath, true);
  if (!invocationWithMessaging) {
    clearDocumentDiagnostics(document.uri);
    return;
  }

  let runResult: SacCompilerRunResult;
  try {
    runResult = await runSac2c(
      invocationWithMessaging.command,
      invocationWithMessaging.args,
      invocationWithMessaging.cwd,
    );
  } catch (error) {
    const err = error as Error;
    connection.window.showErrorMessage(`Failed to execute sac2c: ${err.message}`);
    clearDocumentDiagnostics(document.uri);
    return;
  }

  if (
    settings.messagingEnabled
    && isLikelyMessagingFlagFailure(runResult.stderr)
    && settings.messagingArgs.length > 0
  ) {
    const invocationWithoutMessaging = createInvocation(fsPath, false);
    if (!invocationWithoutMessaging) {
      clearDocumentDiagnostics(document.uri);
      return;
    }

    try {
      runResult = await runSac2c(invocationWithoutMessaging.command, invocationWithoutMessaging.args, invocationWithoutMessaging.cwd);
    } catch (error) {
      const err = error as Error;
      connection.window.showErrorMessage(`Failed to execute sac2c: ${err.message}`);
      clearDocumentDiagnostics(document.uri);
      return;
    }
  }

  const diagnostics = gatherDiagnosticsForDocument(document, runResult.stdout, runResult.stderr);

  try {
    connection.sendDiagnostics({
      uri: document.uri,
      diagnostics,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    connection.console.error(`[sac-server] publish diagnostics failed (${document.uri}): ${message}`);
  }
}

/**
 * Schedules debounced validation used in on-type diagnostics mode.
 *
 * @param document Document to validate after debounce.
 */
function scheduleOnTypeValidation(document: TextDocument): void {
  const existingTimer = pendingTimers.get(document.uri);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    pendingTimers.delete(document.uri);
    runSafely(validateDocument(document), `onType document validate (${document.uri})`);
  }, settings.diagnosticsDebounceMs);

  pendingTimers.set(document.uri, timer);
}

connection.onInitialize((params) => {
  const init = params.initializationOptions as { extensionPath?: unknown } | undefined;
  extensionInstallRoot = typeof init?.extensionPath === "string" ? init.extensionPath : "";

  if (params.workspaceFolders && params.workspaceFolders.length > 0) {
    workspaceRoot = uriToFsPath(params.workspaceFolders[0].uri);
    workspaceRoots = params.workspaceFolders.map((folder) => uriToFsPath(folder.uri));
  } else if (params.rootUri) {
    workspaceRoot = uriToFsPath(params.rootUri);
    workspaceRoots = [workspaceRoot];
  } else {
    workspaceRoots = [workspaceRoot];
  }

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      diagnosticProvider: undefined,
      hoverProvider: true,
    },
  };
});

connection.onHover((params: HoverParams & TextDocumentPositionParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  return provideHover(document, params.position, workspaceRoot, extensionInstallRoot);
});

connection.onInitialized(() => {
  runSafely((async () => {
    const sacConfig = await connection.workspace.getConfiguration("sac");
    updateSettings({ sac: sacConfig as unknown });
    if (settings.workspaceScanOnInitialize) {
      await validateAllWorkspaceSacFiles();
    }
  })(), "onInitialized");
});

connection.onDidChangeConfiguration((change) => {
  updateSettings(change.settings as unknown);

  if (settings.workspaceScanOnConfigurationChange) {
    runSafely(validateAllWorkspaceSacFiles(), "configuration workspace scan");
    return;
  }

  for (const document of documents.all()) {
    runSafely(validateDocument(document), `configuration document validate (${document.uri})`);
  }
});

documents.onDidOpen((event) => {
  if (settings.diagnosticsMode === "manual") {
    return;
  }

  if (settings.diagnosticsMode === "onType") {
    scheduleOnTypeValidation(event.document);
    return;
  }

  runSafely(validateDocument(event.document), `open document validate (${event.document.uri})`);
});

documents.onDidChangeContent((event) => {
  if (settings.diagnosticsMode !== "onType") {
    return;
  }

  scheduleOnTypeValidation(event.document);
});

documents.onDidSave((event) => {
  if (settings.diagnosticsMode === "onSave") {
    runSafely(validateDocument(event.document), `save document validate (${event.document.uri})`);
  }
});

documents.onDidClose((event) => {
  const existingTimer = pendingTimers.get(event.document.uri);
  if (existingTimer) {
    clearTimeout(existingTimer);
    pendingTimers.delete(event.document.uri);
  }

  clearDocumentDiagnostics(event.document.uri);
});

documents.listen(connection);
connection.listen();
