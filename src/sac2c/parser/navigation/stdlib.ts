import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

import { Location } from "vscode-languageserver/node";
import {
  FUNCTION_CALL_PATTERN,
  FUNCTION_DEFINITION_CAPTURE_PATTERN,
  MODULE_DECLARATION_CAPTURE_PATTERN,
} from "../../../constants/regex";

function isSacFilePath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(".sac");
}

function collectSacFiles(rootDir: string): string[] {
  const files: string[] = [];

  const visit = (dirPath: string): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }

      if (entry.isFile() && isSacFilePath(fullPath)) {
        files.push(fullPath);
      }
    }
  };

  visit(rootDir);
  return files;
}

function offsetToLineAndCharacter(sourceText: string, offset: number): { line: number; character: number } {
  let line = 0;
  let character = 0;

  for (let index = 0; index < offset && index < sourceText.length; index += 1) {
    if (sourceText[index] === "\n") {
      line += 1;
      character = 0;
      continue;
    }
    character += 1;
  }

  return { line, character };
}

function extractDefinitionsFromText(uri: string, sourceText: string): Location[] {
  const locations: Location[] = [];

  const modulePattern = new RegExp(MODULE_DECLARATION_CAPTURE_PATTERN.source, MODULE_DECLARATION_CAPTURE_PATTERN.flags);
  const moduleMatch = modulePattern.exec(sourceText);
  if (moduleMatch) {
    const moduleName = moduleMatch[1];
    const moduleStart = moduleMatch.index + moduleMatch[0].indexOf(moduleName);
    const start = offsetToLineAndCharacter(sourceText, moduleStart);
    locations.push({
      uri,
      range: {
        start,
        end: {
          line: start.line,
          character: start.character + moduleName.length,
        },
      },
    });
  }

  const definitionPattern = new RegExp(FUNCTION_DEFINITION_CAPTURE_PATTERN.source, FUNCTION_DEFINITION_CAPTURE_PATTERN.flags);
  let match: RegExpExecArray | null;
  while ((match = definitionPattern.exec(sourceText)) !== null) {
    const fullMatch = match[0];
    const functionName = match[1];
    const relativeStart = fullMatch.indexOf(functionName);
    if (relativeStart < 0) {
      continue;
    }

    const absoluteStart = match.index + relativeStart;
    const start = offsetToLineAndCharacter(sourceText, absoluteStart);
    locations.push({
      uri,
      range: {
        start,
        end: {
          line: start.line,
          character: start.character + functionName.length,
        },
      },
    });
  }

  return locations;
}

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function discoverStdlibSrcRoots(workspaceRoot: string): string[] {
  const candidates: string[] = [];
  let current = path.resolve(workspaceRoot);

  for (let depth = 0; depth < 5; depth += 1) {
    candidates.push(path.join(current, "Stdlib", "src"));
    candidates.push(path.join(current, "..", "Stdlib", "src"));
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return candidates.filter((candidate, index, all) => all.indexOf(candidate) === index && fs.existsSync(candidate));
}

/**
 * Finds Stdlib function definitions by scanning sibling Stdlib/src tree.
 */
export function queryStdlibDefinitions(symbolName: string, workspaceRoot: string): Location[] {
  const locations: Location[] = [];
  const seen = new Set<string>();

  for (const root of discoverStdlibSrcRoots(workspaceRoot)) {
    for (const filePath of collectSacFiles(root)) {
      const normalizedPath = path.normalize(filePath);
      if (seen.has(normalizedPath)) {
        continue;
      }
      seen.add(normalizedPath);

      const sourceText = readFileSafe(filePath);
      if (!sourceText) {
        continue;
      }

      for (const location of extractDefinitionsFromText(pathToFileURL(filePath).toString(), sourceText)) {
        const lineText = sourceText.split(/\r?\n/)[location.range.start.line] ?? "";
        const callPattern = new RegExp(FUNCTION_CALL_PATTERN.source);
        const definitionMatch = lineText.match(callPattern);
        if (definitionMatch?.[1] === symbolName) {
          locations.push(location);
        }
      }
    }
  }

  return locations;
}
