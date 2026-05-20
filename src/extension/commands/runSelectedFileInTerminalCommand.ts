import * as vscode from "vscode";

import {
    cleanupGeneratedArtifacts,
    isSacFile,
    readRuntimeCompilerSettings,
    resolveWorkspaceRoot,
    runCompiledFileInTerminal,
    runSac2cWithRetry,
} from "$extension/commands/contextMenuHelpers";
import type { ExtensionCommand } from "$extension/commands/types";
import { Logger } from "$util/logging";

const COMMAND_ID = "sac.runSelectedFileInTerminal";

/**
 * Runs sac2c on selected file(s) in a new integrated terminal.
 */
async function runSelectedSacFilesInTerminal(fileUris: vscode.Uri[]): Promise<void> {
  if (fileUris.length === 0) {
    vscode.window.showWarningMessage("No SaC files selected.");
    return;
  }

  for (const fileUri of fileUris) {
    const workspaceRoot = resolveWorkspaceRoot(fileUri);
    const settings = readRuntimeCompilerSettings("sac", fileUri.fsPath);

    try {
      const result = await runSac2cWithRetry(settings, workspaceRoot, fileUri.fsPath, true, true);
      if (result.code !== 0) {
        await cleanupGeneratedArtifacts(settings, fileUri.fsPath);
        vscode.window.showErrorMessage(`sac2c exited with code ${result.code === null ? "unknown" : String(result.code)} for ${fileUri.fsPath}.`);
        continue;
      }

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
      const terminal = vscode.window.createTerminal({
        name: "SaC Compiler",
        cwd: workspaceFolder?.uri.fsPath || workspaceRoot,
      });

      runCompiledFileInTerminal(terminal, settings, fileUri.fsPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await cleanupGeneratedArtifacts(settings, fileUri.fsPath);
      vscode.window.showErrorMessage(`Failed to run ${fileUri.fsPath}: ${message}`);
    }
  }
}

/**
 * Handler for the "Run Selected File in Terminal" command.
 */
function handleRunSelectedFileInTerminal(clicked?: vscode.Uri, selected?: vscode.Uri[]): Promise<void> {
  const fileUris = selected?.filter(isSacFile) || (clicked && isSacFile(clicked) ? [clicked] : []);
  return runSelectedSacFilesInTerminal(fileUris);
}

/**
 * Command to run selected SaC files in a new terminal via context menu.
 */
export const runSelectedFileInTerminalCommand: ExtensionCommand = {
  id: COMMAND_ID,
  register(): vscode.Disposable {
    return vscode.commands.registerCommand(COMMAND_ID, (clicked?: vscode.Uri, selected?: vscode.Uri[]) => {
      Logger.info(`[context-menu] ${COMMAND_ID} invoked`);
      return handleRunSelectedFileInTerminal(clicked, selected);
    });
  },
};
