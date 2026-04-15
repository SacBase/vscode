import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

import { FUNCTION_CALL_PATTERN, FUNCTION_DEFINITION_CAPTURE_PATTERN, MODULE_DECLARATION_CAPTURE_PATTERN } from "$constants/regex";
import { collectSacFiles } from "$util/documentUtils";
import { cloneRegex } from "$util/regex";
import { offsetToLineAndCharacter } from "$util/sourceFile";
import { Location } from "vscode-languageserver/node";

function extractDefinitionsFromText(uri: string, sourceText: string): Location[] {
  const locations: Location[] = [];

  const modulePattern = cloneRegex(MODULE_DECLARATION_CAPTURE_PATTERN);
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

  const definitionPattern = cloneRegex(FUNCTION_DEFINITION_CAPTURE_PATTERN);
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
    for (const filePath of collectSacFiles(root, new Set<string>())) {
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
        const callPattern = cloneRegex(FUNCTION_CALL_PATTERN);
        const definitionMatch = lineText.match(callPattern);
        if (definitionMatch?.[1] === symbolName) {
          locations.push(location);
        }
      }
    }
  }

  return locations;
}
