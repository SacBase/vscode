import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Hover,
  MarkupKind,
  Position,
  Range,
} from "vscode-languageserver/node";

import { formatHoverMarkdown, lookupHoverTarget } from "$core/hover";
import { resolveHoverDocumentation } from "./hoverDocs";

function getLineText(document: TextDocument, line: number): string | null {
  const lines = document.getText().split(/\r?\n/);
  return lines[line] ?? null;
}

function createLineRange(line: number, start: number, end: number): Range {
  return {
    start: { line, character: start },
    end: { line, character: end },
  };
}

/**
 * Produces a basic hover response for StdLib and builtin functions.
 */
export function provideHover(
  document: TextDocument,
  position: Position,
  workspaceRoot: string,
  extensionInstallRoot: string,
): Hover | null {
  const lineText = getLineText(document, position.line);
  if (lineText === null) {
    return null;
  }

  const match = lookupHoverTarget(lineText, position.character);
  if (!match) {
    return null;
  }

  const markdownFromDocs = resolveHoverDocumentation(
    workspaceRoot,
    extensionInstallRoot,
    match.target,
    document.uri,
  );

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: markdownFromDocs ?? formatHoverMarkdown(match.target),
    },
    range: createLineRange(position.line, match.start, match.end),
  };
}
