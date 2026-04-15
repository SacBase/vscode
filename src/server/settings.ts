import { DiagnosticsPresentationMode } from "$server/diagnostics/types";
import { CompilerResolutionSettings } from "$server/sac2cResolver";

export interface SacSettings extends CompilerResolutionSettings {
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
  executionBackend: "local" | "wsl" | "docker";
  wslDistribution: string;
  dockerImage: string;
  dockerRunArgs: string[];
  messagingEnabled: boolean;
  messagingArgs: string[];
  compilerExtraArgs: string[];
  compilerTrace: "off" | "messages" | "verbose";
}

export const DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS = [".git", "node_modules", "out", ".vscode-test"];

/**
 * Builds default server settings used before workspace configuration arrives.
 */
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
    messagingArgs: [
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
    ],
    compilerExtraArgs: [],
    compilerTrace: "off",
  };
}

/**
 * Normalizes unknown config values into a string-array compiler argument list.
 */
export function normalizeCompilerArgs(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

/**
 * Normalizes unknown config values into a cleaned string list.
 */
export function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

/**
 * Updates runtime settings from configuration payload provided by client.
 */
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

  const compilerTrace: SacSettings["compilerTrace"] = trace === "messages" || trace === "verbose" || trace === "off" ? trace : "off";

  const mode = diagnostics.mode;
  const diagnosticsMode: SacSettings["diagnosticsMode"] = mode === "onType" || mode === "manual" || mode === "onSave" ? mode : "onSave";

  const presentation = diagnostics.presentation;
  const diagnosticsPresentation: DiagnosticsPresentationMode =
    presentation === "expanded" || presentation === "smart" || presentation === "hybrid" ? presentation : "expanded";

  return {
    diagnosticsMode,
    diagnosticsDebounceMs: Math.max(Number(diagnostics.debounceMs || 500), 100),
    diagnosticsPresentation,
    diagnosticsIncludeRelatedInformation: diagnostics.includeRelatedInformation !== false,
    diagnosticsIncludeStackInMessage: diagnostics.includeStackInMessage !== false,
    diagnosticsMaxStackFrames: Math.max(Number(diagnostics.maxStackFrames || 5), 0),
    workspaceScanEnabled: workspaceScan.enabled !== false,
    workspaceScanOnInitialize: workspaceScan.onInitialize !== false,
    workspaceScanOnConfigurationChange: workspaceScan.onConfigurationChange !== false,
    workspaceScanExcludeDirectories: normalizeStringList(workspaceScan.excludeDirectories, [...DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS]),
    compilerChannel:
      compiler.channel === "stable" || compiler.channel === "develop" || compiler.channel === "system" ? compiler.channel : "system",
    compilerPath: typeof compiler.path === "string" ? compiler.path : "",
    fallbackToSystem: compiler.fallbackToSystem !== false,
    executionBackend:
      compiler.executionBackend === "wsl" || compiler.executionBackend === "docker" || compiler.executionBackend === "local"
        ? compiler.executionBackend
        : "local",
    wslDistribution: typeof wsl.distribution === "string" ? wsl.distribution : "",
    dockerImage: typeof docker.image === "string" ? docker.image : "",
    dockerRunArgs: normalizeCompilerArgs(docker.runArgs, []),
    messagingEnabled: messaging.enabled !== false,
    messagingArgs: normalizeCompilerArgs(messaging.args, [
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
    compilerExtraArgs: normalizeCompilerArgs(compiler.extraArgs, []),
    compilerTrace,
  };
}
