import { TextDocument } from "vscode-languageserver-textdocument";
import {
  createConnection,
  Definition,
  DefinitionParams,
  Hover,
  HoverParams,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

import { getDefaultSettings, SacSettings, updateSettings } from "$extension/settings/settings";
import { createDiagnosticsWorkflow } from "$sac2c/diagnostics/workflow";
import { getCompilerNavigationRuntime } from "$sac2c/runtime/compilerRuntime";
import { uriToFsPath } from "$util/documentUtils";
import { provideHover } from "$server/hover-info/hover";
import { provideDefinition } from "$server/navigation/provider";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
let workspaceRoot = process.cwd();
let workspaceRoots: string[] = [workspaceRoot];
let extensionInstallRoot = "";
let settings: SacSettings = getDefaultSettings();
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

const diagnosticsWorkflow = createDiagnosticsWorkflow({
  connection,
  documents,
  pendingTimers,
  getSettings: () => settings,
  getWorkspaceRoot: () => workspaceRoot,
  getWorkspaceRoots: () => workspaceRoots,
  runSafely,
});

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

function createHoverDebugLogger(
  enabled: boolean,
  prefix: string,
): ((message: string, payload?: Record<string, unknown>) => void) | undefined {
  if (!enabled) {
    return undefined;
  }

  return (message: string, payload?: Record<string, unknown>): void => {
    const serialized = payload ? ` ${JSON.stringify(payload)}` : "";
    connection.console.error(`[${prefix}] ${message}${serialized}`);
  };
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
      definitionProvider: true,
    },
  };
});

connection.onHover(async (params: HoverParams & TextDocumentPositionParams): Promise<Hover | null> => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  try {
    return await provideHover(
      document,
      params.position,
      workspaceRoot,
      extensionInstallRoot,
      getCompilerNavigationRuntime(settings, workspaceRoot),
      createHoverDebugLogger(settings.compilerTrace !== "off", "hover"),
    );
  } catch (error) {
    const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
    connection.console.error(`[hover] provider crashed: ${message}`);
    return null;
  }
});

connection.onDefinition(async (params: DefinitionParams): Promise<Definition | null> => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  return provideDefinition({
    document,
    position: params.position,
    workspaceRoot,
    workspaceRoots,
    openDocuments: documents.all(),
    excludedDirNames: new Set(settings.workspaceScanExcludeDirectories),
    runtime: getCompilerNavigationRuntime(settings, workspaceRoot),
  });
});

connection.onInitialized(() => {
  runSafely(
    (async () => {
      const sacConfig = await connection.workspace.getConfiguration("sac");
      settings = updateSettings({ sac: sacConfig as unknown });
      if (settings.workspaceScanOnInitialize) {
        await diagnosticsWorkflow.validateAllWorkspaceSacFiles();
      }
    })(),
    "onInitialized",
  );
});

connection.onDidChangeConfiguration((change) => {
  settings = updateSettings(change.settings as unknown);

  if (settings.workspaceScanOnConfigurationChange) {
    runSafely(diagnosticsWorkflow.validateAllWorkspaceSacFiles(), "configuration workspace scan");
    return;
  }

  for (const document of documents.all()) {
    runSafely(diagnosticsWorkflow.validateDocument(document), `configuration document validate (${document.uri})`);
  }
});

documents.onDidOpen((event) => {
  if (settings.diagnosticsMode === "manual") {
    return;
  }

  if (settings.diagnosticsMode === "onType") {
    diagnosticsWorkflow.scheduleOnTypeValidation(event.document);
    return;
  }

  runSafely(diagnosticsWorkflow.validateDocument(event.document), `open document validate (${event.document.uri})`);
});

documents.onDidChangeContent((event) => {
  if (settings.diagnosticsMode !== "onType") {
    return;
  }

  diagnosticsWorkflow.scheduleOnTypeValidation(event.document);
});

documents.onDidSave((event) => {
  if (settings.diagnosticsMode === "onSave") {
    runSafely(diagnosticsWorkflow.validateDocument(event.document), `save document validate (${event.document.uri})`);
  }
});

documents.onDidClose((event) => {
  diagnosticsWorkflow.handleDocumentClose(event.document.uri);
});

documents.listen(connection);
connection.listen();
