import * as fs from "fs";
import * as path from "path";

import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Connection, Diagnostic, TextDocuments } from "vscode-languageserver/node";

import { createInvocation, isLikelyMessagingFlagFailure, runSac2c, type SacCompilerRunResult } from "$server/compilerRuntime";
import { groupDiagnostics, parseCompilerOutput, presentDiagnostics } from "$server/diagnostics/adapter";
import { buildDiagnosticWithRange } from "$server/diagnostics/range";
import { buildRelatedInformation } from "$server/diagnostics/relatedInfo";
import type { SacSettings } from "$server/settings";
import { collectSacFiles, createDocumentFromFile, isFileDocument, normalizePathForCompare, uriToFsPath } from "$util/documentUtils";

interface DiagnosticsWorkflowDeps {
  connection: Connection;
  documents: TextDocuments<TextDocument>;
  pendingTimers: Map<string, ReturnType<typeof setTimeout>>;
  getSettings: () => SacSettings;
  getWorkspaceRoot: () => string;
  getWorkspaceRoots: () => string[];
  runSafely: (work: Promise<void>, context: string) => void;
}

export interface DiagnosticsWorkflow {
  clearDocumentDiagnostics: (uri: string) => void;
  validateDocument: (document: TextDocument) => Promise<void>;
  validateAllWorkspaceSacFiles: () => Promise<void>;
  scheduleOnTypeValidation: (document: TextDocument) => void;
  handleDocumentClose: (uri: string) => void;
}

function diagnosticAppliesToDocument(parsedPath: string, requestedFilePath: string): boolean {
  const normalizedParsedPath = normalizePathForCompare(parsedPath);
  if (normalizedParsedPath === requestedFilePath) {
    return true;
  }

  const parsedBase = path.basename(normalizedParsedPath);
  const requestedBase = path.basename(requestedFilePath);
  return parsedBase.length > 0 && parsedBase === requestedBase;
}

export function createDiagnosticsWorkflow(deps: DiagnosticsWorkflowDeps): DiagnosticsWorkflow {
  const clearDocumentDiagnostics = (uri: string): void => {
    try {
      deps.connection.sendDiagnostics({ uri, diagnostics: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      deps.connection.console.error(`[sac-server] clear diagnostics failed (${uri}): ${message}`);
    }
  };

  const gatherDiagnosticsForDocument = (document: TextDocument, stdout: string, stderr: string): Diagnostic[] => {
    const settings = deps.getSettings();
    const requestedFilePath = normalizePathForCompare(uriToFsPath(document.uri));
    const parsedDiagnostics = parseCompilerOutput(stdout, stderr);
    const normalizedParsedDiagnostics = parsedDiagnostics.map((entry) => ({
      ...entry,
      file: normalizePathForCompare(entry.file),
    }));
    const groups = groupDiagnostics(normalizedParsedDiagnostics);
    const lines = document.getText().split(/\r?\n/);

    const rendered = presentDiagnostics(normalizedParsedDiagnostics, groups, requestedFilePath, {
      presentation: settings.diagnosticsPresentation,
      includeRelatedInformation: settings.diagnosticsIncludeRelatedInformation,
      includeStackInMessage: settings.diagnosticsIncludeStackInMessage,
      maxStackFrames: settings.diagnosticsMaxStackFrames,
    });

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
  };

  const validateDocument = async (document: TextDocument): Promise<void> => {
    if (!isFileDocument(document)) {
      return;
    }

    const settings = deps.getSettings();
    const workspaceRoot = deps.getWorkspaceRoot();
    const fsPath = uriToFsPath(document.uri);

    if (!fs.existsSync(fsPath)) {
      clearDocumentDiagnostics(document.uri);
      return;
    }

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

  const validateAllWorkspaceSacFiles = async (): Promise<void> => {
    const settings = deps.getSettings();
    if (settings.diagnosticsMode === "manual" || !settings.workspaceScanEnabled) {
      return;
    }

    const excludedDirNames = new Set(settings.workspaceScanExcludeDirectories);

    const openByPath = new Map<string, TextDocument>();
    for (const openDocument of deps.documents.all()) {
      if (!isFileDocument(openDocument)) {
        continue;
      }
      openByPath.set(normalizePathForCompare(uriToFsPath(openDocument.uri)), openDocument);
    }

    const seenPaths = new Set<string>();
    for (const root of deps.getWorkspaceRoots()) {
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
