import { TextDocument } from "vscode-languageserver-textdocument";
import { Position } from "vscode-languageserver/node";
import { SYMBOL_CHAR_PATTERN, SYMBOL_START_CHAR_PATTERN } from "../../constants/regex";

import { SacSymbolOccurrence } from "./types";

function getLineText(document: TextDocument, line: number): string | null {
  const lines = document.getText().split(/\r?\n/);
  return lines[line] ?? null;
}

/**
 * Extracts the symbol at the cursor position.
 */
export function getSymbolAtPosition(
  document: TextDocument,
  position: Position,
): SacSymbolOccurrence | null {
  const lineText = getLineText(document, position.line);
  if (!lineText) {
    return null;
  }

  let left = Math.min(position.character, lineText.length - 1);
  let right = Math.min(position.character, lineText.length - 1);

  if (left < 0 || !SYMBOL_CHAR_PATTERN.test(lineText[left])) {
    const previous = position.character - 1;
    if (previous < 0 || previous >= lineText.length || !SYMBOL_CHAR_PATTERN.test(lineText[previous])) {
      return null;
    }
    left = previous;
    right = previous;
  }

  while (left > 0 && SYMBOL_CHAR_PATTERN.test(lineText[left - 1])) {
    left -= 1;
  }

  while (right + 1 < lineText.length && SYMBOL_CHAR_PATTERN.test(lineText[right + 1])) {
    right += 1;
  }

  const name = lineText.slice(left, right + 1);
  if (!SYMBOL_START_CHAR_PATTERN.test(name[0])) {
    return null;
  }

  return {
    name,
    start: left,
    end: right + 1,
  };
}
