import * as path from "path";
import * as vscode from "vscode";

import type { SacSettings } from "$extension/settings";
import { createInvocation, isLikelyMessagingFlagFailure, runSac2c } from "$sac2c/invoke";
import { getCompilerOutputArtifactPaths, resolveCompilerOutputBaseName } from "$sac2c/invoke/compiler";

export { readRuntimeCompilerSettings } from "$extension/settings";

/**
 * Resolves workspace root from a given URI.
 */
export function resolveWorkspaceRoot(uri: vscode.Uri): string {
  const folder = vscode.workspace.getWorkspaceFolder(uri);
  if (folder) {
    return folder.uri.fsPath;
  }

  const firstWorkspace = vscode.workspace.workspaceFolders?.[0];
  return firstWorkspace ? firstWorkspace.uri.fsPath : process.cwd();
}

/**
 * Validates that a file is a SaC file.
 */
export function isSacFile(uri: vscode.Uri): boolean {
  return uri.fsPath.endsWith(".sac");
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function getExecutablePath(settings: SacSettings, fsPath: string): string {
  const outputBase = resolveCompilerOutputBaseName(settings, fsPath);
  return path.join(path.dirname(fsPath), outputBase);
}

export function getGeneratedArtifactPaths(settings: SacSettings, fsPath: string): string[] {
  return getCompilerOutputArtifactPaths(settings, fsPath);
}

export async function cleanupGeneratedArtifacts(settings: SacSettings, fsPath: string): Promise<void> {
  const paths = getGeneratedArtifactPaths(settings, fsPath);
  await Promise.all(
    paths.map(async (artifactPath) => {
      try {
        await vscode.workspace.fs.delete(vscode.Uri.file(artifactPath));
      } catch {
        // Ignore missing files and cleanup races.
      }
    }),
  );
}

export function buildTerminalRunScript(executablePath: string, cleanupPaths: string[]): string {
  const cleanupCommand = cleanupPaths.length > 0 ? `rm -f ${cleanupPaths.map(shellQuote).join(" ")}` : "";
  const lines: string[] = [];

  if (cleanupCommand.length > 0) {
    lines.push(`trap ${shellQuote(cleanupCommand)} EXIT`);
  }

  lines.push(shellQuote(executablePath));
  return lines.join("\n");
}

export function runCompiledFileInTerminal(
  terminal: vscode.Terminal,
  settings: SacSettings,
  fsPath: string,
): void {
  const executablePath = getExecutablePath(settings, fsPath);
  const cleanupPaths = getGeneratedArtifactPaths(settings, fsPath);
  terminal.sendText(buildTerminalRunScript(executablePath, cleanupPaths));
  terminal.show(true);
}

/**
 * Recursively finds all .sac files in a directory.
 */
export async function findSacFilesInDirectory(dirUri: vscode.Uri): Promise<vscode.Uri[]> {
  const results: vscode.Uri[] = [];
  const entries = await vscode.workspace.fs.readDirectory(dirUri);

  for (const [name, type] of entries) {
    const uri = vscode.Uri.joinPath(dirUri, name);

    if ((type & vscode.FileType.File) !== 0 && name.endsWith(".sac")) {
      results.push(uri);
    } else if ((type & vscode.FileType.Directory) !== 0) {
      const subResults = await findSacFilesInDirectory(uri);
      results.push(...subResults);
    }
  }

  return results;
}

/**
 * Gets all SaC files from selected URIs (filters folders recursively for .sac files).
 */
export async function getSacFilesFromSelection(selected: vscode.Uri[]): Promise<vscode.Uri[]> {
  const sacFiles: vscode.Uri[] = [];

  for (const uri of selected) {
    const stat = await vscode.workspace.fs.stat(uri);
    if ((stat.type & vscode.FileType.File) !== 0) {
      if (isSacFile(uri)) {
        sacFiles.push(uri);
      }
    } else if ((stat.type & vscode.FileType.Directory) !== 0) {
      const found = await findSacFilesInDirectory(uri);
      sacFiles.push(...found);
    }
  }

  return sacFiles;
}

/**
 * Runs sac2c on a file with optional messaging retry logic.
 */
export async function runSac2cWithRetry(
  settings: SacSettings,
  workspaceRoot: string,
  fsPath: string,
  enableMessaging: boolean,
  emitOutputs = true,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const invocation = createInvocation(
    settings,
    workspaceRoot,
    fsPath,
    enableMessaging,
    (message) => vscode.window.showWarningMessage(message),
    emitOutputs,
  );
  if (!invocation) {
    throw new Error("Unable to build sac2c invocation from current settings.");
  }

  let result = await runSac2c(invocation.command, invocation.args, invocation.cwd);

  if (!(settings.messagingEnabled && settings.messagingArgs.length > 0 && isLikelyMessagingFlagFailure(result.stderr))) {
    return result;
  }

  // Retry without messaging flags
  const retryInvocation = createInvocation(
    settings,
    workspaceRoot,
    fsPath,
    false,
    (message) => vscode.window.showWarningMessage(message),
    emitOutputs,
  );
  if (!retryInvocation) {
    throw new Error("Unable to build fallback sac2c invocation.");
  }

  return runSac2c(retryInvocation.command, retryInvocation.args, retryInvocation.cwd);
}
