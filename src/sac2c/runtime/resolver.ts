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

function getExecutableName(): string {
  return process.platform === "win32" ? "sac2c.exe" : "sac2c";
}

function fileExists(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function splitPathEntries(pathValue: string | undefined): string[] {
  if (!pathValue) {
    return [];
  }

  return pathValue.split(path.delimiter).filter(Boolean);
}

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

function getBundledTargetDir(contextRoot: string, channel: "stable" | "develop"): string | null {
  const targetKey = `${process.platform}-${process.arch}`;
  const target = PLATFORM_ARCH_TO_TARGET[targetKey];

  if (!target) {
    return null;
  }

  return path.join(contextRoot, "vendor", "sac2c", channel, target);
}

export function resolveSac2cPath(config: CompilerResolutionSettings, workspaceRoot: string): CompilerResolution {
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