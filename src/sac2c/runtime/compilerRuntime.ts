import { spawn } from "child_process";
import * as path from "path";

import type { SacSettings } from "$extension/settings";
import type { CompilerNavigationRuntimeConfig } from "$lsp-server/navigation/types";
import { resolveSac2cPath } from "$sac2c/runtime/resolver";

export interface SacCompilerRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

export interface SacInvocation {
  command: string;
  args: string[];
  cwd: string;
}

/**
 * Heuristically detects whether compiler output indicates unknown messaging flags.
 */
export function isLikelyMessagingFlagFailure(stderrText: string): boolean {
  const text = (stderrText || "").toLowerCase();
  return (
    text.includes("unknown option") ||
    text.includes("unknown argument") ||
    text.includes("invalid option") ||
    text.includes("unrecognized option")
  );
}

/**
 * Runs compiler process and captures stdout/stderr.
 */
export function runSac2c(executable: string, args: string[], cwd: string): Promise<SacCompilerRunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd,
      env: process.env,
      shell: false,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += String(chunk);
    });

    child.on("error", (error: Error) => {
      reject(error);
    });

    child.on("close", (code: number | null) => {
      resolve({ code, stdout, stderr });
    });
  });
}

/**
 * Builds compiler args for document validation pass.
 */
export function buildCompilerArgs(settings: SacSettings, documentPath: string, includeMessaging: boolean): string[] {
  const args: string[] = [];

  if (includeMessaging && settings.messagingEnabled && settings.messagingArgs.length > 0) {
    args.push(...settings.messagingArgs);
  }

  if (settings.compilerExtraArgs.length > 0) {
    args.push(...settings.compilerExtraArgs);
  }

  args.push(documentPath);
  return args;
}

/**
 * Creates backend-specific compiler invocation.
 */
export function createInvocation(
  settings: SacSettings,
  workspaceRoot: string,
  documentPath: string,
  includeMessaging: boolean,
  warn: (message: string) => void,
): SacInvocation | null {
  const cwd = path.dirname(documentPath);

  if (settings.executionBackend === "local") {
    const resolution = resolveSac2cPath(settings, workspaceRoot);
    if (!resolution.executable) {
      warn(`SaC diagnostics unavailable: ${resolution.reason}`);
      return null;
    }

    return {
      command: resolution.executable,
      args: buildCompilerArgs(settings, documentPath, includeMessaging),
      cwd,
    };
  }

  if (settings.executionBackend === "wsl") {
    if (process.platform !== "win32") {
      warn("SaC backend 'wsl' is intended for Windows hosts. Use 'local' on Linux/macOS.");
      return null;
    }

    const executable = settings.compilerPath.trim() || "sac2c";
    const args: string[] = [];
    if (settings.wslDistribution.trim().length > 0) {
      args.push("-d", settings.wslDistribution.trim());
    }
    args.push("--", executable, ...buildCompilerArgs(settings, documentPath, includeMessaging));

    return {
      command: "wsl.exe",
      args,
      cwd,
    };
  }

  const dockerImage = settings.dockerImage.trim();
  if (dockerImage.length === 0) {
    warn("SaC diagnostics unavailable: set sac.compiler.docker.image when using docker backend.");
    return null;
  }

  const executable = settings.compilerPath.trim() || "sac2c";
  const args = [
    "run",
    "--rm",
    "-v",
    `${cwd}:/work`,
    "-w",
    "/work",
    ...settings.dockerRunArgs,
    dockerImage,
    executable,
    ...buildCompilerArgs(settings, path.basename(documentPath), includeMessaging),
  ];

  return {
    command: "docker",
    args,
    cwd,
  };
}

/**
 * Resolves runtime config for navigation/hover compiler adapters.
 */
export function getCompilerNavigationRuntime(settings: SacSettings, workspaceRoot: string): CompilerNavigationRuntimeConfig {
  if (settings.executionBackend !== "local") {
    return {
      executable: null,
      extraArgs: [],
      timeoutMs: 4000,
    };
  }

  const resolution = resolveSac2cPath(settings, workspaceRoot);
  return {
    executable: resolution.executable,
    extraArgs: settings.compilerExtraArgs,
    timeoutMs: 4000,
  };
}
