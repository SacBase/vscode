/**
 * SaC project config (.sac-config) parsing and lookup.
 */
import * as fs from "fs";
import * as path from "path";

import { SAC_CONFIG_FILENAME } from "$constants/language";

export type SacConfigOutputBase = "file-name" | "a";

export interface SacConfigOverrides {
  compilerOutputBase?: SacConfigOutputBase;
}

type CachedSacConfig = {
  mtimeMs: number;
  overrides: SacConfigOverrides;
};

const sacConfigCache = new Map<string, CachedSacConfig>();

function parseOutputBase(value: string): SacConfigOutputBase | undefined {
  const normalized = value.trim().toLowerCase();
  if (normalized === "a") {
    return "a";
  }
  if (normalized === "file-name" || normalized === "filename") {
    return "file-name";
  }
  return undefined;
}

function parseSacConfigFile(content: string): SacConfigOverrides {
  const overrides: SacConfigOverrides = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#") || line.startsWith("//")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (key === "outputbase" || key === "compiler.outputbase") {
      const parsed = parseOutputBase(value);
      if (parsed) {
        overrides.compilerOutputBase = parsed;
      }
    }
  }

  return overrides;
}

function readSacConfigFile(filePath: string): SacConfigOverrides {
  try {
    const stat = fs.statSync(filePath);
    const cached = sacConfigCache.get(filePath);
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      return cached.overrides;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const overrides = parseSacConfigFile(content);
    sacConfigCache.set(filePath, { mtimeMs: stat.mtimeMs, overrides });
    return overrides;
  } catch {
    sacConfigCache.delete(filePath);
    return {};
  }
}

function findNearestSacConfig(startPath: string): string | null {
  let current = path.dirname(startPath);

  while (true) {
    const candidate = path.join(current, SAC_CONFIG_FILENAME);
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }

    current = parent;
  }
}

export function readSacConfigOverrides(resourcePath: string): SacConfigOverrides {
  const configPath = findNearestSacConfig(resourcePath);
  if (!configPath) {
    return {};
  }

  return readSacConfigFile(configPath);
}

export function clearSacConfigCache(): void {
  sacConfigCache.clear();
}
