import * as vscode from "vscode";

import { isSacFile, readRuntimeCompilerSettings, resolveWorkspaceRoot, runSac2cWithRetry } from "$extension/commands/contextMenuHelpers";
import type { ExtensionCommand } from "$extension/commands/types";
import { Logger } from "$util/logging";

const COMMAND_ID = "sac.compileSelectedFile";

/**
 * Compiles selected SaC file(s) via sac2c.
 */
async function compileSelectedSacFiles(fileUris: vscode.Uri[]): Promise<void> {
  if (fileUris.length === 0) {
    vscode.window.showWarningMessage("No SaC files selected.");
    return;
  }

  const settings = readRuntimeCompilerSettings();
  const output = vscode.window.createOutputChannel("SaC Compiler - Compile");
  output.clear();
  output.show(true);

  output.appendLine(`Compiling ${fileUris.length} file(s)...`);
  output.appendLine("");

  let successCount = 0;
  let failureCount = 0;

  for (const fileUri of fileUris) {
    const fsPath = fileUri.fsPath;
    const workspaceRoot = resolveWorkspaceRoot(fileUri);

    try {
      output.appendLine(`--- ${fsPath} ---`);
      const result = await runSac2cWithRetry(settings, workspaceRoot, fsPath, true);

      if (result.stdout.trim().length > 0) {
        output.appendLine(result.stdout);
      }

      if (result.stderr.trim().length > 0) {
        output.appendLine(result.stderr);
      }

      if (result.code === 0) {
        output.appendLine(`✓ Compiled successfully`);
        successCount++;
      } else {
        output.appendLine(`✗ Compilation failed (exit code ${result.code === null ? "unknown" : String(result.code)})`);
        failureCount++;
      }

      output.appendLine("");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      output.appendLine(`✗ Error: ${message}`);
      output.appendLine("");
      failureCount++;
    }
  }

  output.appendLine(`Summary: ${successCount} succeeded, ${failureCount} failed.`);

  if (failureCount === 0) {
    vscode.window.showInformationMessage(`SaC: Compilation completed for ${successCount} file(s).`);
  } else {
    vscode.window.showWarningMessage(`SaC: Compilation completed with ${failureCount} failure(s). Check output for details.`);
  }
}

/**
 * Handler for the "Compile Selected File" command.
 */
function handleCompileSelectedFile(clicked?: vscode.Uri, selected?: vscode.Uri[]): Promise<void> {
  const fileUris = selected?.filter(isSacFile) || (clicked && isSacFile(clicked) ? [clicked] : []);
  return compileSelectedSacFiles(fileUris);
}

/**
 * Command to compile selected SaC files via context menu.
 */
export const compileSelectedFileCommand: ExtensionCommand = {
  id: COMMAND_ID,
  register(): vscode.Disposable {
    return vscode.commands.registerCommand(COMMAND_ID, (clicked?: vscode.Uri, selected?: vscode.Uri[]) => {
      Logger.info(`[context-menu] ${COMMAND_ID} invoked`);
      return handleCompileSelectedFile(clicked, selected);
    });
  },
};
