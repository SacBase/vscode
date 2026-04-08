import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Location } from "vscode-languageserver/node";

import { SacDefinitionEntry } from "./types";

const FUNCTION_DEFINITION_PATTERN = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\([^;{}]*\)\s*\{/g;

function isSacFilePath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(".sac");
}

function collectSacFiles(rootDir: string, excludedDirNames: Set<string>): string[] {
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
        if (!excludedDirNames.has(entry.name)) {
          visit(fullPath);
        }
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

function getTextByUri(openDocuments: TextDocument[]): Map<string, string> {
  const result = new Map<string, string>();
  for (const document of openDocuments) {
    result.set(document.uri, document.getText());
  }
  return result;
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

function extractDefinitionsFromText(uri: string, sourceText: string): SacDefinitionEntry[] {
  const definitions: SacDefinitionEntry[] = [];

  let match: RegExpExecArray | null;
  while ((match = FUNCTION_DEFINITION_PATTERN.exec(sourceText)) !== null) {
    const fullMatch = match[0];
    const functionName = match[1];
    const relativeStart = fullMatch.indexOf(functionName);
    if (relativeStart < 0) {
      continue;
    }

    const absoluteStart = match.index + relativeStart;
    const start = offsetToLineAndCharacter(sourceText, absoluteStart);
    const end = {
      line: start.line,
      character: start.character + functionName.length,
    };

    definitions.push({
      name: functionName,
      uri,
      line: start.line,
      startCharacter: start.character,
      endCharacter: end.character,
    });
  }

  return definitions;
}

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function toLocation(entry: SacDefinitionEntry): Location {
  return {
    uri: entry.uri,
    range: {
      start: {
        line: entry.line,
        character: entry.startCharacter,
      },
      end: {
        line: entry.line,
        character: entry.endCharacter,
      },
    },
  };
}

export interface WorkspaceDefinitionQuery {
  symbolName: string;
  currentDocumentUri: string;
  workspaceRoots: string[];
  openDocuments: TextDocument[];
  excludedDirNames: Set<string>;
}

/**
 * Finds matching function definitions by scanning workspace source text.
 */
export function queryWorkspaceDefinitions(query: WorkspaceDefinitionQuery): Location[] {
  const openTextByUri = getTextByUri(query.openDocuments);
  const seenPaths = new Set<string>();
  const allEntries: SacDefinitionEntry[] = [];

  for (const root of query.workspaceRoots) {
    for (const filePath of collectSacFiles(root, query.excludedDirNames)) {
      const normalizedPath = path.normalize(filePath);
      if (seenPaths.has(normalizedPath)) {
        continue;
      }
      seenPaths.add(normalizedPath);

      const uri = pathToFileURL(filePath).toString();
      const sourceText = openTextByUri.get(uri) ?? readFileSafe(filePath);
      if (!sourceText) {
        continue;
      }

      allEntries.push(...extractDefinitionsFromText(uri, sourceText));
    }
  }

  const matches = allEntries.filter((entry) => entry.name === query.symbolName);
  matches.sort((left, right) => {
    if (left.uri === query.currentDocumentUri && right.uri !== query.currentDocumentUri) {
      return -1;
    }
    if (right.uri === query.currentDocumentUri && left.uri !== query.currentDocumentUri) {
      return 1;
    }
    if (left.uri !== right.uri) {
      return left.uri.localeCompare(right.uri);
    }
    return left.line - right.line;
  });

  return matches.map(toLocation);
}
