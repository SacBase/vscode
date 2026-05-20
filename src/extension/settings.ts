/**
 * VS Code settings integration
 */
// import * as vscode from "vscode";

import { readSacConfigOverrides } from "$extension/config/settings";
import { DEFAULT_MESSAGING_ARGS, isCompilerChannel, normalizeStringArray } from "$sac2c/invoke/options";

/**
 * Compiler backend target selection.
 */
export type CompilerBackend = "local" | "wsl" | "docker";

/**
 * Compiler channel/version selection.
 */
export type CompilerChannel = "system" | "stable" | "develop";

/**
 * Compiler trace level.
 */
export type CompilerTraceLevel = "off" | "messages" | "verbose";

/**
 * Presentation mode for diagnostics.
 */
export type DiagnosticsPresentationMode = "expanded" | "smart" | "hybrid";

/**
 * Extension-wide user settings.
 */
export interface SacSettings {
  diagnosticsMode: "onSave" | "onType" | "manual";
  diagnosticsDebounceMs: number;
  diagnosticsPresentation: DiagnosticsPresentationMode;
  diagnosticsIncludeRelatedInformation: boolean;
  diagnosticsIncludeStackInMessage: boolean;
  diagnosticsMaxStackFrames: number;
  workspaceScanEnabled: boolean;
  workspaceScanOnInitialize: boolean;
  workspaceScanOnConfigurationChange: boolean;
  workspaceScanExcludeDirectories: string[];
  compilerChannel: CompilerChannel;
  compilerPath: string;
  fallbackToSystem: boolean;
  executionBackend: CompilerBackend;
  wslDistribution: string;
  dockerImage: string;
  dockerRunArgs: string[];
  messagingEnabled: boolean;
  messagingArgs: string[];
  compilerExtraArgs: string[];
  compilerTrace: CompilerTraceLevel;
  compilerOutputBase: "file-name" | "a";
}

export const DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS = [".git", "node_modules", "out", ".vscode-test"];

export function getDefaultSettings(): SacSettings {
  return {
    diagnosticsMode: "onSave",
    diagnosticsDebounceMs: 500,
    diagnosticsPresentation: "smart",
    diagnosticsIncludeRelatedInformation: true,
    diagnosticsIncludeStackInMessage: true,
    diagnosticsMaxStackFrames: 5,
    workspaceScanEnabled: true,
    workspaceScanOnInitialize: true,
    workspaceScanOnConfigurationChange: true,
    workspaceScanExcludeDirectories: [...DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS],
    compilerChannel: "system",
    compilerPath: "",
    fallbackToSystem: true,
    executionBackend: "local",
    wslDistribution: "",
    dockerImage: "",
    dockerRunArgs: [],
    messagingEnabled: true,
    messagingArgs: [...DEFAULT_MESSAGING_ARGS],
    compilerExtraArgs: [],
    compilerTrace: "off",
    compilerOutputBase: "file-name",
  };
}

export function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function updateSettings(configuration: unknown): SacSettings {
  const root = configuration as Record<string, unknown> | undefined;
  const sac = (root?.sac as Record<string, unknown> | undefined) || {};
  const diagnostics = (sac.diagnostics as Record<string, unknown> | undefined) || {};
  const workspaceScan = (diagnostics.workspaceScan as Record<string, unknown> | undefined) || {};
  const compiler = (sac.compiler as Record<string, unknown> | undefined) || {};
  const wsl = (compiler.wsl as Record<string, unknown> | undefined) || {};
  const docker = (compiler.docker as Record<string, unknown> | undefined) || {};
  const messaging = (compiler.messaging as Record<string, unknown> | undefined) || {};
  const trace = compiler.trace;

  const compilerTrace: SacSettings["compilerTrace"] = trace === "messages" || trace === "verbose" ? trace : "off";
  const mode = diagnostics.mode;
  const diagnosticsMode: SacSettings["diagnosticsMode"] = mode === "onType" || mode === "manual" || mode === "onSave" ? mode : "onSave";

  const presentation = diagnostics.presentation;
  const diagnosticsPresentation: DiagnosticsPresentationMode = presentation === "expanded" || presentation === "smart" || presentation === "hybrid" ? presentation : "expanded";

  const channel = compiler.channel;
  const compilerChannel: SacSettings["compilerChannel"] = isCompilerChannel(channel) ? channel : "system";

  const backend = compiler.executionBackend;
  const executionBackend: SacSettings["executionBackend"] = backend === "local" || backend === "wsl" || backend === "docker" ? backend : "local";

  const outputBaseRaw = String(compiler.outputBase || "").trim();
  const compilerOutputBase: SacSettings["compilerOutputBase"] = outputBaseRaw === "a" ? "a" : "file-name";

  return {
    diagnosticsMode,
    diagnosticsDebounceMs: Math.max(Number(diagnostics.debounceMs || 500), 100),
    diagnosticsPresentation,
    diagnosticsIncludeRelatedInformation: diagnostics.includeRelatedInformation !== false,
    diagnosticsIncludeStackInMessage: diagnostics.includeStackInMessage !== false,
    diagnosticsMaxStackFrames: Math.max(Number(diagnostics.maxStackFrames || 5), 0),
    workspaceScanEnabled: (workspaceScan.enabled as boolean) !== false,
    workspaceScanOnInitialize: (workspaceScan.onInitialize as boolean) !== false,
    workspaceScanOnConfigurationChange: (workspaceScan.onConfigurationChange as boolean) !== false,
    workspaceScanExcludeDirectories: normalizeStringList(workspaceScan.excludeDirectories, DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS),
    compilerChannel,
    compilerPath: String(compiler.path || "").trim(),
    fallbackToSystem: (compiler.fallbackToSystem as boolean) !== false,
    executionBackend,
    wslDistribution: String(wsl.distribution || "").trim(),
    dockerImage: String(docker.image || "").trim(),
    dockerRunArgs: normalizeStringArray(docker.runArgs, []),
    messagingEnabled: (messaging.enabled as boolean) !== false,
    messagingArgs: normalizeStringArray(messaging.args, [
      "-cti-no-color",
      "-cti-no-source",
      "-cti-no-hint",
      "-cti-no-explain",
      "-cti-message-length",
      "0",
      "-cti-primary-header-format",
      "%s: ",
      "-cti-continuation-header-format",
      "%.0s",
    ]),
    compilerExtraArgs: normalizeStringArray(compiler.extraArgs, []),
    compilerTrace,
    compilerOutputBase,
  };
}

/**
 * Read compiler settings from VS Code configuration.
 * If a .sac-config file exists for document path, it can override per-project compiler settings.
 */
export function readRuntimeCompilerSettings(configurationSection = "sac", resourcePath?: string): SacSettings {
  const defaults = getDefaultSettings();
  // TODO: if we use `vscode` then we cannot use this in lsp-server, the server likely needs a full rewrite in, I prefer; Rust.
  // TODO: so for now we do a require here but a "shared" module might be a good idea later...
  const vscode = require("vscode") as typeof import("vscode");
  const config = vscode.workspace.getConfiguration(configurationSection);
  const sacConfig = resourcePath ? readSacConfigOverrides(resourcePath) : {};

  const channel = config.get<string>("compiler.channel");
  const backend = config.get<string>("compiler.executionBackend");

  return {
    ...defaults,
    compilerChannel: isCompilerChannel(channel) ? channel : defaults.compilerChannel,
    compilerPath: config.get<string>("compiler.path", defaults.compilerPath),
    fallbackToSystem: config.get<boolean>("compiler.fallbackToSystem", defaults.fallbackToSystem),
    executionBackend: backend === "local" || backend === "wsl" || backend === "docker" ? backend : defaults.executionBackend,
    wslDistribution: config.get<string>("compiler.wsl.distribution", defaults.wslDistribution),
    dockerImage: config.get<string>("compiler.docker.image", defaults.dockerImage),
    dockerRunArgs: normalizeStringArray(config.get<unknown>("compiler.docker.runArgs"), defaults.dockerRunArgs),
    messagingEnabled: config.get<boolean>("compiler.messaging.enabled", defaults.messagingEnabled),
    messagingArgs: normalizeStringArray(config.get<unknown>("compiler.messaging.args"), defaults.messagingArgs),
    compilerExtraArgs: normalizeStringArray(config.get<unknown>("compiler.extraArgs"), defaults.compilerExtraArgs),
    compilerOutputBase: sacConfig.compilerOutputBase ?? config.get<"file-name" | "a">("compiler.outputBase", defaults.compilerOutputBase),
  };
}
