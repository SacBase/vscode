import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { SAC_CONFIG_FILENAME } from "$constants/language";
import type { ExtensionCommand } from "$extension/commands/types";

const GENERATE_COMPILER_CONFIG_COMMAND_ID = "sac.generateCompilerConfig";
//? Maybe we can implement the outline feature for .sac-config and .sac-format files as well as it is simple key-value??
// TODO: finish this default template
const DEFAULT_COMPILER_CONFIG = `# SaC Compiler Configuration File
#
# This file configures how the SaC compiler processes .sac files.
# Keys are case-insensitive. Settings in this file override VS Code settings (sac.compiler.*).

# Compiler backend to use: "local", "wsl", or "docker".
Backend: local

# Compiler channel to use: "system", "stable", or "develop".
Channel: stable

# Trace level for compiler output: "off", "messages", or "verbose".
TraceLevel: off
`;

/**
 * Resolves workspace root from currently open folders or active document.
 *
 * @returns Absolute path to workspace root.
 */
function resolveWorkspaceRoot(): string {
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return folders[0].uri.fsPath;
  }

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (folder) {
      return folder.uri.fsPath;
    }
  }

  return process.cwd();
}

/**
 * Generates a default `.sac-config` file in the workspace root.
 */
async function generateCompilerConfig(): Promise<void> {
  const workspaceRoot = resolveWorkspaceRoot();
  const configPath = path.join(workspaceRoot, SAC_CONFIG_FILENAME);

  if (fs.existsSync(configPath)) {
    const selected = await vscode.window.showWarningMessage(
      `${SAC_CONFIG_FILENAME} already exists. Replace it?`,
      { modal: true },
      "Replace",
      "Cancel",
    );
    if (selected !== "Replace") {
      return;
    }
  }

  try {
    fs.writeFileSync(configPath, DEFAULT_COMPILER_CONFIG, "utf8");
    const doc = await vscode.workspace.openTextDocument(configPath);
    await vscode.window.showTextDocument(doc);
    vscode.window.showInformationMessage(`Generated ${SAC_CONFIG_FILENAME} in workspace root.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Failed to generate ${SAC_CONFIG_FILENAME}: ${message}`);
  }
}

export const generateCompilerConfigCommand: ExtensionCommand = {
  id: GENERATE_COMPILER_CONFIG_COMMAND_ID,
  register(): vscode.Disposable {
    return vscode.commands.registerCommand(GENERATE_COMPILER_CONFIG_COMMAND_ID, () => generateCompilerConfig());
  },
};
