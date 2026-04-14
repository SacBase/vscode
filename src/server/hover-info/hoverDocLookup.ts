import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { HoverTarget } from "$sac2c/hover/types";
import { SAFE_DOC_NAME_PATTERN } from "../../constants/regex";

const DOCS_FOLDER_BY_KIND: Record<HoverTarget["kind"], string> = {
  stdlib: "stdlib",
  builtin: "builtins",
};

function isSafeDocName(name: string): boolean {
  return SAFE_DOC_NAME_PATTERN.test(name);
}

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

function appendUnique(values: string[], seen: Set<string>, value: string): void {
  const normalized = path.normalize(value);
  if (normalized.length === 0 || seen.has(normalized)) {
    return;
  }

  seen.add(normalized);
  values.push(normalized);
}

function collectAncestorRoots(documentUri: string): string[] {
  if (!documentUri.startsWith("file://")) {
    return [];
  }

  const roots: string[] = [];
  const seen = new Set<string>();

  let current = path.dirname(fileURLToPath(documentUri));
  while (true) {
    appendUnique(roots, seen, current);
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return roots;
}

function buildDocCandidates(root: string, target: HoverTarget): string[] {
  const kindFolder = DOCS_FOLDER_BY_KIND[target.kind];
  const docsRoot = path.join(root, "docs", kindFolder);
  const exactName = `${target.name}.md`;
  const lowerName = `${target.name.toLowerCase()}.md`;

  if (target.kind === "builtin") {
    const familyName = toBuiltinFamilyName(target.name);
    const familyLowerName = familyName.toLowerCase();

    const candidates = new Set<string>();
    candidates.add(path.join(docsRoot, familyName));
    candidates.add(path.join(docsRoot, familyLowerName));
    candidates.add(path.join(docsRoot, exactName));
    candidates.add(path.join(docsRoot, lowerName));
    return [...candidates];
  }

  if (exactName === lowerName) {
    return [path.join(docsRoot, exactName)];
  }

  return [path.join(docsRoot, exactName), path.join(docsRoot, lowerName)];
}

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
