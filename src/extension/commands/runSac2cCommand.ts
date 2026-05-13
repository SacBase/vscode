import * as vscode from "vscode";

import { SAC_CONFIG_SECTION, SAC_LANGUAGE_ID, SAC_URI_FILE_SCHEME } from "$constants/language";
import type { SacSettings } from "$extension/settings";
import { getDefaultSettings } from "$extension/settings";
import { createInvocation, isLikelyMessagingFlagFailure, runSac2c } from "$sac2c/runtime/compilerRuntime";

import type { ExtensionCommand } from "$extension/commands/types";
import { Logger } from "$util/logging";

const RUN_ACTIVE_FILE_COMMAND_ID = "sac.runActiveFile";
const SAC_OUTPUT_CHANNEL_NAME = "SaC Compiler";
let outputChannel: vscode.OutputChannel | undefined;

function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel(SAC_OUTPUT_CHANNEL_NAME);
  }

  return outputChannel;
}

function normalizeStringArgs(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function readRuntimeCompilerSettings(): SacSettings {
  const defaults = getDefaultSettings();
  const config = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION);

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

function resolveWorkspaceRoot(uri: vscode.Uri): string {
  const folder = vscode.workspace.getWorkspaceFolder(uri);
  if (folder) {
    return folder.uri.fsPath;
  }

  const firstWorkspace = vscode.workspace.workspaceFolders?.[0];
  return firstWorkspace ? firstWorkspace.uri.fsPath : process.cwd();
}

function resolveTargetDocument(resource?: unknown): vscode.TextDocument | null {
  if (resource instanceof vscode.Uri) {
    const openDocument = vscode.workspace.textDocuments.find((document) => document.uri.toString() === resource.toString());
    if (openDocument) {
      return openDocument;
    }
  }

  return vscode.window.activeTextEditor?.document ?? null;
}

function ensureRunnableSacDocument(document: vscode.TextDocument): boolean {
  if (document.languageId !== SAC_LANGUAGE_ID || document.uri.scheme !== SAC_URI_FILE_SCHEME) {
    vscode.window.showWarningMessage("Open a local .sac file to run sac2c.");
    return false;
  }

  return true;
}

async function ensureSavedDocument(document: vscode.TextDocument): Promise<boolean> {
  if (!document.isDirty) {
    return true;
  }

  const saved = await document.save();
  if (!saved) {
    vscode.window.showWarningMessage("Save canceled. sac2c run aborted.");
  }
  return saved;
}

async function runWithOptionalMessagingRetry(
  settings: SacSettings,
  workspaceRoot: string,
  fsPath: string,
  output: vscode.OutputChannel,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const invocation = createInvocation(settings, workspaceRoot, fsPath, true, (message) => vscode.window.showWarningMessage(message));
  if (!invocation) {
    throw new Error("Unable to build sac2c invocation from current settings.");
  }

  output.appendLine(`$ ${invocation.command} ${invocation.args.join(" ")}`);
  let result = await runSac2c(invocation.command, invocation.args, invocation.cwd);

  if (!(settings.messagingEnabled && settings.messagingArgs.length > 0 && isLikelyMessagingFlagFailure(result.stderr))) {
    return result;
  }

  output.appendLine("\nMessaging flags rejected by compiler. Retrying without messaging flags...\n");

  const retryInvocation = createInvocation(settings, workspaceRoot, fsPath, false, (message) => vscode.window.showWarningMessage(message));
  if (!retryInvocation) {
    throw new Error("Unable to build fallback sac2c invocation.");
  }

  output.appendLine(`$ ${retryInvocation.command} ${retryInvocation.args.join(" ")}`);
  result = await runSac2c(retryInvocation.command, retryInvocation.args, retryInvocation.cwd);
  return result;
}

async function runSac2cForResource(resource?: unknown): Promise<void> {
  Logger.info("[command] sac.runActiveFile invoked");
  const document = resolveTargetDocument(resource);
  if (!document) {
    Logger.warn("[command] No active document found.");
    vscode.window.showWarningMessage("No active document to run with sac2c.");
    return;
  }

  if (!ensureRunnableSacDocument(document)) {
    Logger.warn("[command] Document is not a valid .sac file.");
    return;
  }

  if (!(await ensureSavedDocument(document))) {
    Logger.warn("[command] Document not saved, aborting.");
    return;
  }

  const output = getOutputChannel();
  output.clear();
  output.show(true);

  const settings = readRuntimeCompilerSettings();
  const workspaceRoot = resolveWorkspaceRoot(document.uri);
  const fsPath = document.uri.fsPath;

  Logger.info(`[command] Running sac2c on ${fsPath}`);
  Logger.info(`[command] Compiler channel: ${settings.compilerChannel}`);
  output.appendLine(`Running sac2c for ${fsPath}`);
  output.appendLine("");

  let result: { code: number | null; stdout: string; stderr: string };
  try {
    result = await runWithOptionalMessagingRetry(settings, workspaceRoot, fsPath, output);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    output.appendLine(`\n[error] ${message}`);
    vscode.window.showErrorMessage(`sac2c run failed: ${message}`, "Show Output").then((selection) => {
      if (selection === "Show Output") {
        output.show(true);
      }
    });
    return;
  }

  if (result.stdout.trim().length > 0) {
    output.appendLine("\n--- stdout ---");
    output.appendLine(result.stdout);
  }

  if (result.stderr.trim().length > 0) {
    output.appendLine("\n--- stderr ---");
    output.appendLine(result.stderr);
  }

  if (result.code === 0) {
    vscode.window.setStatusBarMessage("SaC: sac2c run completed.", 4000);
    return;
  }

  const exitCode = result.code === null ? "unknown" : String(result.code);
  vscode.window.showErrorMessage(`sac2c exited with code ${exitCode}.`, "Show Output").then((selection) => {
    if (selection === "Show Output") {
      output.show(true);
    }
  });
}

export const runSac2cCommand: ExtensionCommand = {
  id: RUN_ACTIVE_FILE_COMMAND_ID,
  register(): vscode.Disposable {
    return vscode.commands.registerCommand(RUN_ACTIVE_FILE_COMMAND_ID, (resource?: unknown) => runSac2cForResource(resource));
  },
};
