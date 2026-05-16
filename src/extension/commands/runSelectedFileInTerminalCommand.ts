import * as vscode from "vscode";

import { isSacFile, readRuntimeCompilerSettings, resolveWorkspaceRoot } from "$extension/commands/contextMenuHelpers";
import type { ExtensionCommand } from "$extension/commands/types";
import { createInvocation } from "$sac2c/runtime/compilerRuntime";
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

  const settings = readRuntimeCompilerSettings();
  const firstUri = fileUris[0];
  const workspaceRoot = resolveWorkspaceRoot(firstUri);
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(firstUri);

  const terminal = vscode.window.createTerminal({
    name: "SaC Compiler",
    cwd: workspaceFolder?.uri.fsPath || workspaceRoot,
  });

  // Build command for all selected files
  const filePaths = fileUris.map((uri) => `"${uri.fsPath}"`).join(" ");
  const invocation = createInvocation(settings, workspaceRoot, fileUris[0].fsPath, true, (message) => vscode.window.showWarningMessage(message));

  if (!invocation) {
    vscode.window.showErrorMessage("Unable to build sac2c invocation from current settings.");
    terminal.dispose();
    return;
  }

  // Replace the file path in the invocation args with all selected files
  const args = invocation.args.map((arg) => (arg === fileUris[0].fsPath ? filePaths : arg)).join(" ");
  const command = `${invocation.command} ${args}`;

  terminal.sendText(command);
  terminal.show();
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
