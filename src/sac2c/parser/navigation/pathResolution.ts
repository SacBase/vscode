import * as path from "path";
import { fileURLToPath } from "url";

import {
  NavigationBinding,
  NavigationIndex,
  NavigationRange,
  NavigationSymbol,
  NavigationToken,
} from "./types";

export function normalizeComparePath(filePath: string): string {
  const normalized = path.normalize(filePath);
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

/**
 * Resolves navjson file path to absolute workspace path.
 */
function resolveIndexFilePath(workspaceRoot: string, filePath: string): string {
  if (filePath.startsWith("file://")) {
    return normalizeComparePath(fileURLToPath(filePath));
  }

  if (path.isAbsolute(filePath)) {
    return normalizeComparePath(filePath);
  }

  return normalizeComparePath(path.join(workspaceRoot, filePath));
}

export function buildFileMap(index: NavigationIndex, workspaceRoot: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const file of index.files) {
    map.set(file.id, resolveIndexFilePath(workspaceRoot, file.path));
  }
  return map;
}

function isInsideRange(range: NavigationRange, line: number, character: number): boolean {
  const lineStart = range.start.line;
  const lineEnd = range.end.line;

  if (line < lineStart || line > lineEnd) {
    return false;
  }

  if (lineStart === lineEnd) {
    return character >= range.start.character && character <= range.end.character;
  }

  if (line === lineStart) {
    return character >= range.start.character;
  }

  if (line === lineEnd) {
    return character <= range.end.character;
  }

  return true;
}

/**
 * Finds smallest token containing cursor in selected file.
 */
export function findTargetToken(
  index: NavigationIndex,
  fileMap: Map<string, string>,
  filePath: string,
  line: number,
  character: number,
): NavigationToken | null {
  let best: NavigationToken | null = null;
  let bestSpan = Number.MAX_SAFE_INTEGER;

  for (const token of index.tokens) {
    const tokenPath = fileMap.get(token.fileId);
    if (!tokenPath || tokenPath !== filePath) {
      continue;
    }

    if (!isInsideRange(token.range, line, character)) {
      continue;
    }

    const span = (token.range.end.line - token.range.start.line) * 1_000_000
      + (token.range.end.character - token.range.start.character);

    if (span < bestSpan) {
      best = token;
      bestSpan = span;
    }
  }

  return best;
}

export function findBinding(index: NavigationIndex, tokenId: string): NavigationBinding | null {
  return index.bindings.find((binding) => binding.tokenId === tokenId) ?? null;
}

export function findSymbol(index: NavigationIndex, symbolId: string | undefined): NavigationSymbol | null {
  if (!symbolId) {
    return null;
  }
  return index.symbols.find((symbol) => symbol.id === symbolId) ?? null;
}

export function findTokenById(index: NavigationIndex, tokenId: string | undefined): NavigationToken | null {
  if (!tokenId) {
    return null;
  }
  return index.tokens.find((token) => token.id === tokenId) ?? null;
}
