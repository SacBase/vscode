/**
 * Navigation utilities for finding symbol definitions in stdlib and workspace
 */
import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import type { Location } from "vscode-languageserver/node";

/**
 * Query stdlib definitions for a symbol
 * Searches in docs/stdlib and docs/builtins directories
 */
export function queryStdlibDefinitions(symbolName: string, workspaceRoot: string): Location[] {
  const locations: Location[] = [];

  // Search in stdlib docs
  const stdlibPath = path.join(workspaceRoot, "docs", "stdlib");
  const stdlibFile = path.join(stdlibPath, `${symbolName}.md`);
  if (fileExists(stdlibFile)) {
    locations.push({
      uri: pathToFileURL(stdlibFile).toString(),
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 },
      },
    });
  }

  // Search in builtins docs
  const builtinsPath = path.join(workspaceRoot, "docs", "builtins");
  const builtinFile = path.join(builtinsPath, `_${symbolName}_.md`);
  if (fileExists(builtinFile)) {
    locations.push({
      uri: pathToFileURL(builtinFile).toString(),
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 },
      },
    });
  }

  // Fallback: try exact name as-is
  const exactFile = path.join(builtinsPath, `${symbolName}.md`);
  if (fileExists(exactFile) && !locations.some((loc) => loc.uri === pathToFileURL(exactFile).toString())) {
    locations.push({
      uri: pathToFileURL(exactFile).toString(),
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 },
      },
    });
  }

  return locations;
}

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}
