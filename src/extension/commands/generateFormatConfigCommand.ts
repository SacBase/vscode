import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { SAC_FORMAT_FILENAME } from "$constants/language";
import type { ExtensionCommand } from "$extension/commands/types";

const GENERATE_FORMAT_CONFIG_COMMAND_ID = "sac.generateFormatConfig";

const DEFAULT_FORMAT_CONFIG = `# SaC Formatter Configuration File
#
# This file configures how the SaC formatter processes .sac files.
# Keys are case-insensitive. Settings in this file override VS Code settings (sac.format.*).

# Number of spaces per indentation level (minimum 2).
IndentSize: 4

# Normalize guard line prefixes to '| ' and ', ' with consistent spacing.
NormalizeGuards: true

# Expand inline with-loop bodies to multiline style when formatting.
ExpandInlineWithLoops: true

# Expand inline tensor comprehensions to multiline style when formatting.
ExpandInlineComprehensions: true

# Split inline function guards/conditions onto separate lines when formatting.
SplitInlineGuards: true
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
 * Generates a default `.sac-format` file in the workspace root.
 */
async function generateFormatConfig(): Promise<void> {
  const workspaceRoot = resolveWorkspaceRoot();
  const configPath = path.join(workspaceRoot, SAC_FORMAT_FILENAME);

  if (fs.existsSync(configPath)) {
    const selected = await vscode.window.showWarningMessage(
      `${SAC_FORMAT_FILENAME} already exists. Replace it?`,
      { modal: true },
      "Replace",
      "Cancel",
    );
    if (selected !== "Replace") {
      return;
    }
  }

  try {
    fs.writeFileSync(configPath, DEFAULT_FORMAT_CONFIG, "utf8");
    const doc = await vscode.workspace.openTextDocument(configPath);
    await vscode.window.showTextDocument(doc);
    vscode.window.showInformationMessage(`Generated ${SAC_FORMAT_FILENAME} in workspace root.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Failed to generate ${SAC_FORMAT_FILENAME}: ${message}`);
  }
}

export const generateFormatConfigCommand: ExtensionCommand = {
  id: GENERATE_FORMAT_CONFIG_COMMAND_ID,
  register(): vscode.Disposable {
    return vscode.commands.registerCommand(GENERATE_FORMAT_CONFIG_COMMAND_ID, () => generateFormatConfig());
  },
};
