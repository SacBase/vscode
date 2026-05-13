import { FUNCTION_DEFINITION_CAPTURE_PATTERN } from "$constants/regex";
import { collectSacFiles } from "$util/documentUtils";
import { cloneRegex } from "$util/regex";
import { offsetToLineAndCharacter } from "$util/sourceFile";
import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Location } from "vscode-languageserver/node";

import type { SacDefinitionEntry } from "$lsp-server/navigation/types";

function getTextByUri(openDocuments: TextDocument[]): Map<string, string> {
  const result = new Map<string, string>();
  for (const document of openDocuments) {
    result.set(document.uri, document.getText());
  }
  return result;
}

function extractDefinitionsFromText(uri: string, sourceText: string): SacDefinitionEntry[] {
  const definitions: SacDefinitionEntry[] = [];

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