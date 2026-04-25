import * as fs from "fs";
import * as path from "path";

import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Connection, Diagnostic, TextDocuments } from "vscode-languageserver/node";

import type { SacSettings } from "$extension/settings/settings";
import { createInvocation, isLikelyMessagingFlagFailure, runSac2c, type SacCompilerRunResult } from "$sac2c/runtime/compilerRuntime";
import { groupDiagnostics, parseCompilerOutput, presentDiagnostics } from "$server/diagnostics/adapter";
import { buildDiagnosticWithRange } from "$server/diagnostics/range";
import { buildRelatedInformation } from "$server/diagnostics/relatedInfo";
import { collectSacFiles, createDocumentFromFile, isFileDocument, normalizePathForCompare, uriToFsPath } from "$util/documentUtils";

// Dependencies injected by server for isolation and testability.
interface DiagnosticsWorkflowDeps {
  connection: Connection;
  documents: TextDocuments<TextDocument>;
  pendingTimers: Map<string, ReturnType<typeof setTimeout>>;
  getSettings: () => SacSettings;
  getWorkspaceRoot: () => string;
  getWorkspaceRoots: () => string[];
  runSafely: (work: Promise<void>, context: string) => void;
}

// Public API: all methods exported by diagnostics workflow factory.
export interface DiagnosticsWorkflow {
  clearDocumentDiagnostics: (uri: string) => void;
  validateDocument: (document: TextDocument) => Promise<void>;
  validateAllWorkspaceSacFiles: () => Promise<void>;
  scheduleOnTypeValidation: (document: TextDocument) => void;
  handleDocumentClose: (uri: string) => void;
}

// Checks if compiler diagnostic (from parsed output) applies to requested file.
// Match by full path first, fallback to basename comparison (handle relative paths).
function diagnosticAppliesToDocument(parsedPath: string, requestedFilePath: string): boolean {
  const normalizedParsedPath = normalizePathForCompare(parsedPath);
  if (normalizedParsedPath === requestedFilePath) {
    return true;
  }

  const parsedBase = path.basename(normalizedParsedPath);
  const requestedBase = path.basename(requestedFilePath);
  return parsedBase.length > 0 && parsedBase === requestedBase;
}

// Factory creates workflow instance with injected deps.
export function createDiagnosticsWorkflow(deps: DiagnosticsWorkflowDeps): DiagnosticsWorkflow {
  // Send empty diagnostics array to clear all issues for doc.
  const clearDocumentDiagnostics = (uri: string): void => {
    try {
      deps.connection.sendDiagnostics({ uri, diagnostics: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      deps.connection.console.error(`[sac-server] clear diagnostics failed (${uri}): ${message}`);
    }
  };

  // Parse compiler output, normalize paths, render formatted diagnostics.
  const gatherDiagnosticsForDocument = (document: TextDocument, stdout: string, stderr: string): Diagnostic[] => {
    const settings = deps.getSettings();
    const requestedFilePath = normalizePathForCompare(uriToFsPath(document.uri));
    const parsedDiagnostics = parseCompilerOutput(stdout, stderr);
    // Normalize all file paths for consistent comparison.
    const normalizedParsedDiagnostics = parsedDiagnostics.map((entry: any) => ({
      ...entry,
      file: normalizePathForCompare(entry.file),
    }));
    const groups = groupDiagnostics(normalizedParsedDiagnostics);
    const lines = document.getText().split(/\r?\n/);

    // Format diagnostics respecting user settings (stack frames, related info, etc).
    const rendered = presentDiagnostics(normalizedParsedDiagnostics, groups, requestedFilePath, {
      presentation: settings.diagnosticsPresentation,
      includeRelatedInformation: settings.diagnosticsIncludeRelatedInformation,
      includeStackInMessage: settings.diagnosticsIncludeStackInMessage,
      maxStackFrames: settings.diagnosticsMaxStackFrames,
    });

    // Filter to requested doc only, build VS Code Diagnostic objects.
    return rendered
      .filter((entry: any) => diagnosticAppliesToDocument(entry.anchor.file, requestedFilePath))
      .map((entry: any) => {
        const lineText = lines[entry.anchor.line] || "";
        const diagnostic = buildDiagnosticWithRange(entry.anchor, lineText);
        diagnostic.message = entry.message;

        // Attach related info if enabled and available.
        if (settings.diagnosticsIncludeRelatedInformation && entry.related.length > 0) {
          diagnostic.relatedInformation = buildRelatedInformation(entry.related);
        }

        return diagnostic;
      });
  };

  // Compile single doc and collect diagnostics.
  const validateDocument = async (document: TextDocument): Promise<void> => {
    // Skip if not file-backed (e.g., unsaved, temp docs).
    if (!isFileDocument(document)) {
      return;
    }

    const settings = deps.getSettings();
    const workspaceRoot = deps.getWorkspaceRoot();
    const fsPath = uriToFsPath(document.uri);

    // File must exist on disk.
    if (!fs.existsSync(fsPath)) {
      clearDocumentDiagnostics(document.uri);
      return;
    }

    // Build invocation with messaging flags enabled.
    const invocationWithMessaging = createInvocation(settings, workspaceRoot, fsPath, true, (message) =>
      deps.connection.window.showWarningMessage(message),
    );
    if (!invocationWithMessaging) {
      clearDocumentDiagnostics(document.uri);
      return;
    }

    let runResult: SacCompilerRunResult;
    try {
      runResult = await runSac2c(invocationWithMessaging.command, invocationWithMessaging.args, invocationWithMessaging.cwd);
    } catch (error) {
      const err = error as Error;
      deps.connection.window.showErrorMessage(`Failed to execute sac2c: ${err.message}`);
      clearDocumentDiagnostics(document.uri);
      return;
    }

    // If messaging failed, retry without messaging flags.
    if (settings.messagingEnabled && isLikelyMessagingFlagFailure(runResult.stderr) && settings.messagingArgs.length > 0) {
      const invocationWithoutMessaging = createInvocation(settings, workspaceRoot, fsPath, false, (message) =>
        deps.connection.window.showWarningMessage(message),
      );
      if (!invocationWithoutMessaging) {
        clearDocumentDiagnostics(document.uri);
        return;
      }

      try {
        runResult = await runSac2c(invocationWithoutMessaging.command, invocationWithoutMessaging.args, invocationWithoutMessaging.cwd);
      } catch (error) {
        const err = error as Error;
        deps.connection.window.showErrorMessage(`Failed to execute sac2c: ${err.message}`);
        clearDocumentDiagnostics(document.uri);
        return;
      }
    }

    // Extract and format diagnostics from compiler output.
    const diagnostics = gatherDiagnosticsForDocument(document, runResult.stdout, runResult.stderr);

    try {
      deps.connection.sendDiagnostics({
        uri: document.uri,
        diagnostics,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      deps.connection.console.error(`[sac-server] publish diagnostics failed (${document.uri}): ${message}`);
    }
  };

  // Scan workspace and validate all .sac files (skip if manual mode or disabled).
  const validateAllWorkspaceSacFiles = async (): Promise<void> => {
    const settings = deps.getSettings();
    if (settings.diagnosticsMode === "manual" || !settings.workspaceScanEnabled) {
      return;
    }

    const excludedDirNames = new Set(settings.workspaceScanExcludeDirectories);

    // Index open docs by normalized path for quick lookup.
    const openByPath = new Map<string, TextDocument>();
    for (const openDocument of deps.documents.all()) {
      if (!isFileDocument(openDocument)) {
        continue;
      }
      openByPath.set(normalizePathForCompare(uriToFsPath(openDocument.uri)), openDocument);
    }

    // Collect all .sac files from workspace roots (skip duplicates).
    const seenPaths = new Set<string>();
    for (const root of deps.getWorkspaceRoots()) {
      for (const fsPath of collectSacFiles(root, excludedDirNames)) {
        const normalizedPath = normalizePathForCompare(fsPath);
        if (seenPaths.has(normalizedPath)) {
          continue;
        }
        seenPaths.add(normalizedPath);

        // If doc is open, use it; otherwise create ephemeral doc from disk.
        const openDocument = openByPath.get(normalizedPath);
        if (openDocument) {
          try {
            await validateDocument(openDocument);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            deps.connection.console.error(`[sac-server] validate open document failed (${fsPath}): ${message}`);
          }
          continue;
        }

        const ephemeral = createDocumentFromFile(fsPath);
        if (ephemeral) {
          try {
            await validateDocument(ephemeral);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            deps.connection.console.error(`[sac-server] validate file failed (${fsPath}): ${message}`);
          }
        }
      }
    }
  };

  // Schedule doc validation with debounce (cancel prev timer if exists).
  const scheduleOnTypeValidation = (document: TextDocument): void => {
    const existingTimer = deps.pendingTimers.get(document.uri);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      deps.pendingTimers.delete(document.uri);
      deps.runSafely(validateDocument(document), `onType document validate (${document.uri})`);
    }, deps.getSettings().diagnosticsDebounceMs);

    deps.pendingTimers.set(document.uri, timer);
  };

  // Clean up pending timer and clear diagnostics on doc close.
  const handleDocumentClose = (uri: string): void => {
    const existingTimer = deps.pendingTimers.get(uri);
    if (existingTimer) {
      clearTimeout(existingTimer);
      deps.pendingTimers.delete(uri);
    }

    clearDocumentDiagnostics(uri);
  };

  return {
    clearDocumentDiagnostics,
    validateDocument,
    validateAllWorkspaceSacFiles,
    scheduleOnTypeValidation,
    handleDocumentClose,
  };
}
