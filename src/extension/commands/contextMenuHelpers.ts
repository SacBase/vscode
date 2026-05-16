import * as vscode from "vscode";

import type { SacSettings } from "$extension/settings";
import { getDefaultSettings } from "$extension/settings";
import { createInvocation, isLikelyMessagingFlagFailure, runSac2c } from "$sac2c/runtime/compilerRuntime";

/**
 * Normalizes string array from config values.
 */
export function normalizeStringArgs(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

/**
 * Reads SaC compiler settings from workspace configuration.
 */
export function readRuntimeCompilerSettings(): SacSettings {
  const defaults = getDefaultSettings();
  const config = vscode.workspace.getConfiguration("sac");

  const compilerChannel = config.get<string>("compiler.channel", defaults.compilerChannel);
  const executionBackend = config.get<string>("compiler.executionBackend", defaults.executionBackend);

  return {
    ...defaults,
    compilerChannel: compilerChannel === "stable" || compilerChannel === "develop" || compilerChannel === "system" ? compilerChannel : defaults.compilerChannel,
    compilerPath: config.get<string>("compiler.path", defaults.compilerPath),
    fallbackToSystem: config.get<boolean>("compiler.fallbackToSystem", defaults.fallbackToSystem),
    executionBackend: executionBackend === "local" || executionBackend === "wsl" || executionBackend === "docker" ? executionBackend : defaults.executionBackend,
    wslDistribution: config.get<string>("compiler.wsl.distribution", defaults.wslDistribution),
    dockerImage: config.get<string>("compiler.docker.image", defaults.dockerImage),
    dockerRunArgs: normalizeStringArgs(config.get<unknown>("compiler.docker.runArgs"), defaults.dockerRunArgs),
    messagingEnabled: config.get<boolean>("compiler.messaging.enabled", defaults.messagingEnabled),
    messagingArgs: normalizeStringArgs(config.get<unknown>("compiler.messaging.args"), defaults.messagingArgs),
    compilerExtraArgs: normalizeStringArgs(config.get<unknown>("compiler.extraArgs"), defaults.compilerExtraArgs),
  };
}

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
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const invocation = createInvocation(settings, workspaceRoot, fsPath, enableMessaging, (message) => vscode.window.showWarningMessage(message));
  if (!invocation) {
    throw new Error("Unable to build sac2c invocation from current settings.");
  }

  let result = await runSac2c(invocation.command, invocation.args, invocation.cwd);

  if (!(settings.messagingEnabled && settings.messagingArgs.length > 0 && isLikelyMessagingFlagFailure(result.stderr))) {
    return result;
  }

  // Retry without messaging flags
  const retryInvocation = createInvocation(settings, workspaceRoot, fsPath, false, (message) => vscode.window.showWarningMessage(message));
  if (!retryInvocation) {
    throw new Error("Unable to build fallback sac2c invocation.");
  }

  return runSac2c(retryInvocation.command, retryInvocation.args, retryInvocation.cwd);
}
