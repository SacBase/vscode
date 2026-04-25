import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { SAFE_DOC_NAME_PATTERN } from "$constants/regex";
import { HoverTarget } from "$sac2c/parser/hover-info/types";

const DOCS_FOLDER_BY_KIND: Record<HoverTarget["kind"], string> = {
  stdlib: "stdlib",
  builtin: "builtins",
};

// Validates that symbol name is safe for file path (no path traversal, special chars, etc).
function isSafeDocName(name: string): boolean {
  return SAFE_DOC_NAME_PATTERN.test(name);
}

// Tries to read the first non-empty file from a list of candidates.
function readFirstExistingFile(pathsToCheck: string[]): string | null {
  for (const filePath of pathsToCheck) {
    try {
      if (!fs.existsSync(filePath)) {
        continue;
      }

      const text = fs.readFileSync(filePath, "utf8");
      if (text.trim().length > 0) {
        return text;
      }
    } catch {
      // Ignore single-file IO failures and continue with fallback candidates.
    }
  }

  return null;
}

// Appends unique normalized path to list, skipping duplicates.
function appendUnique(values: string[], seen: Set<string>, value: string): void {
  const normalized = path.normalize(value);
  if (normalized.length === 0 || seen.has(normalized)) {
    return;
  }

  seen.add(normalized);
  values.push(normalized);
}

// Collects ancestor directory paths by walking up from document URI.
function collectAncestorRoots(documentUri: string): string[] {
  if (!documentUri.startsWith("file://")) {
    return [];
  }

  const roots: string[] = [];
  const seen = new Set<string>();

  // Start from document directory and walk upward.
  let current = path.dirname(fileURLToPath(documentUri));
  while (true) {
    appendUnique(roots, seen, current);
    const parent = path.dirname(current);
    // Stop when reaching root (parent === current).
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return roots;
}

// Builds candidate file paths for a given symbol, applying naming conventions.
function buildDocCandidates(root: string, target: HoverTarget): string[] {
  const kindFolder = DOCS_FOLDER_BY_KIND[target.kind];
  const docsRoot = path.join(root, "docs", kindFolder);
  const exactName = `${target.name}.md`;
  const lowerName = `${target.name.toLowerCase()}.md`;

  if (target.kind === "builtin") {
    // For builtins like `_add_SxS_`, extract family name `_add_` and generate candidates.
    const familyName = toBuiltinFamilyName(target.name);
    const familyLowerName = familyName.toLowerCase();

    const candidates = new Set<string>();
    candidates.add(path.join(docsRoot, familyName));
    candidates.add(path.join(docsRoot, familyLowerName));
    candidates.add(path.join(docsRoot, exactName));
    candidates.add(path.join(docsRoot, lowerName));
    return [...candidates];
  }

  // For stdlib, try exact name and lowercase variant.
  if (exactName === lowerName) {
    return [path.join(docsRoot, exactName)];
  }

  return [path.join(docsRoot, exactName), path.join(docsRoot, lowerName)];
}

// Extracts builtin family name from variant (e.g., `_add_SxS_` -> `_add_.md`).
function toBuiltinFamilyName(name: string): string {
  if (!name.startsWith("_") || !name.endsWith("_")) {
    return `${name}.md`;
  }

  const core = name.slice(1, -1);
  const separatorIndex = core.indexOf("_");
  if (separatorIndex < 0) {
    return `${name}.md`;
  }

  const family = core.slice(0, separatorIndex);
  if (family.length === 0) {
    return `${name}.md`;
  }

  return `_${family}_.md`;
}

/**
 * Resolves markdown hover content from docs/<kind>/<symbol>.md when available.
 */
export function lookupHoverDocumentation(
  workspaceRoot: string,
  extensionInstallRoot: string,
  target: HoverTarget,
  documentUri: string,
): string | null {
  if (!isSafeDocName(target.name)) {
    return null;
  }

  const rootsToCheck: string[] = [];
  const seenRoots = new Set<string>();

  if (extensionInstallRoot) {
    appendUnique(rootsToCheck, seenRoots, extensionInstallRoot);
  }

  if (workspaceRoot) {
    appendUnique(rootsToCheck, seenRoots, workspaceRoot);
  }

  appendUnique(rootsToCheck, seenRoots, process.cwd());

  for (const ancestor of collectAncestorRoots(documentUri)) {
    appendUnique(rootsToCheck, seenRoots, ancestor);
  }

  for (const root of rootsToCheck) {
    const markdown = readFirstExistingFile(buildDocCandidates(root, target));
    if (markdown !== null) {
      return markdown;
    }
  }

  return null;
}
