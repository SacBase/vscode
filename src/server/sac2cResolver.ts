import * as fs from "fs";
import * as path from "path";

export interface CompilerResolutionSettings {
  compilerChannel: "stable" | "develop" | "system";
  compilerPath: string;
  fallbackToSystem: boolean;
}

export interface CompilerResolution {
  source: "explicit" | "bundled-stable" | "bundled-develop" | "system" | "system-fallback" | "missing";
  executable: string | null;
  reason?: string;
}

const PLATFORM_ARCH_TO_TARGET: Record<string, string> = {
  "linux-x64": "linux-x64",
  "linux-arm64": "linux-arm64",
  "darwin-x64": "darwin-x64",
  "darwin-arm64": "darwin-arm64",
  "win32-x64": "win32-x64",
  "win32-arm64": "win32-arm64",
};

/**
 * Returns the expected executable name for the host platform.
 *
 * @returns Platform-specific compiler executable file name.
 */
function getExecutableName(): string {
  return process.platform === "win32" ? "sac2c.exe" : "sac2c";
}

/**
 * Checks whether a path points to an existing regular file.
 *
 * @param filePath Candidate file path.
 * @returns True when the file exists and is a regular file.
 */
function fileExists(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

/**
 * Splits a PATH-like environment variable into candidate directories.
 *
 * @param pathValue Raw PATH string or undefined.
 * @returns Non-empty directory entries.
 */
function splitPathEntries(pathValue: string | undefined): string[] {
  if (!pathValue) {
    return [];
  }

  return pathValue.split(path.delimiter).filter(Boolean);
}

/**
 * Resolves an executable by searching all directories in PATH.
 *
 * @param executableName Executable file name to search for.
 * @returns Absolute executable path when found, otherwise null.
 */
function resolveFromPath(executableName: string): string | null {
  const pathEntries = splitPathEntries(process.env.PATH);

  for (const entry of pathEntries) {
    const candidate = path.join(entry, executableName);
    if (fileExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Computes the bundled compiler directory for a selected channel and host target.
 *
 * !NOTE: This only maps the current host target and does not cross-compile.
 * ?TODO: Support richer target mapping and fallback aliases when additional
 *        package naming conventions are introduced.
 *
 * @param contextRoot Root directory of the extension workspace/runtime.
 * @param channel Compiler channel to resolve.
 * @returns Bundled target directory path when supported, otherwise null.
 */
function getBundledTargetDir(contextRoot: string, channel: "stable" | "develop"): string | null {
  const targetKey = `${process.platform}-${process.arch}`;
  const target = PLATFORM_ARCH_TO_TARGET[targetKey];

  if (!target) {
    return null;
  }

  return path.join(contextRoot, "vendor", "sac2c", channel, target);
}

/**
 * Resolves the compiler executable path from explicit settings, bundled assets,
 * or host PATH fallback.
 *
 * !IMPORTANT: This function only resolves local executable paths; backend-specific
 * invocation wrapping (WSL/Docker) is handled separately in the server layer.
 * ?TODO: Add optional probing of known install prefixes on Linux and macOS where
 *        users may install sac2c outside PATH.
 *
 * @param config Compiler resolution settings from extension configuration.
 * @param workspaceRoot Workspace root used to resolve bundled binaries.
 * @returns Resolution result containing executable path or an explanatory reason.
 */
export function resolveSac2cPath(
  config: CompilerResolutionSettings,
  workspaceRoot: string,
): CompilerResolution {
  const executableName = getExecutableName();
  const explicitPath = (config.compilerPath || "").trim();

  if (explicitPath.length > 0) {
    return {
      source: "explicit",
      executable: explicitPath,
    };
  }

  const channel = config.compilerChannel;

  if (channel === "stable" || channel === "develop") {
    const bundledDir = getBundledTargetDir(workspaceRoot, channel);
    if (bundledDir) {
      const bundledBinary = path.join(bundledDir, executableName);
      if (fileExists(bundledBinary)) {
        return {
          source: channel === "stable" ? "bundled-stable" : "bundled-develop",
          executable: bundledBinary,
        };
      }
    }

    if (config.fallbackToSystem) {
      const systemBinary = resolveFromPath(executableName);
      if (systemBinary) {
        return {
          source: "system-fallback",
          executable: systemBinary,
        };
      }
    }

    return {
      source: "missing",
      executable: null,
      reason: `No bundled sac2c found for channel '${channel}' and platform '${process.platform}-${process.arch}'.`,
    };
  }

  const systemBinary = resolveFromPath(executableName);
  if (systemBinary) {
    return {
      source: "system",
      executable: systemBinary,
    };
  }

  return {
    source: "missing",
    executable: null,
    reason: "sac2c not found on PATH and no explicit sac.compiler.path configured.",
  };
}
