import { SYMBOL_CHAR_PATTERN, SYMBOL_START_CHAR_PATTERN } from "$constants/regex";
import type * as vscode from "vscode";

export interface SacSymbolOccurrence {
  name: string;
  start: number;
  end: number;
}

function getLineText(document: vscode.TextDocument, line: number): string | null {
  return document.lineAt(line)?.text ?? null;
}

const OPERATOR_SYMBOL_PATTERN = /[+\-*/=<>&|!%^~]/;

function isOperatorChar(character: string | undefined): boolean {
  return typeof character === "string" && character.length === 1 && OPERATOR_SYMBOL_PATTERN.test(character);
}

function isIdentifierChar(character: string | undefined): boolean {
  return typeof character === "string" && character.length === 1 && SYMBOL_CHAR_PATTERN.test(character);
}

export function getSymbolAtPosition(document: vscode.TextDocument, position: vscode.Position): SacSymbolOccurrence | null {
  const lineText = getLineText(document, position.line);
  if (!lineText) {
    return null;
  }

  let left = Math.min(position.character, lineText.length - 1);
  let right = Math.min(position.character, lineText.length - 1);
  const currentChar = lineText[left];

  if (left < 0 || (!isIdentifierChar(currentChar) && !isOperatorChar(currentChar))) {
    const previous = position.character - 1;
    const previousChar = previous >= 0 && previous < lineText.length ? lineText[previous] : undefined;
    if (previous < 0 || previous >= lineText.length || (!isIdentifierChar(previousChar) && !isOperatorChar(previousChar))) {
      return null;
    }
    left = previous;
    right = previous;
  }

  const isSymbolChar = (character: string | undefined): boolean => isIdentifierChar(character) || isOperatorChar(character);

  while (left > 0 && isSymbolChar(lineText[left - 1])) {
    left -= 1;
  }

  while (right + 1 < lineText.length && isSymbolChar(lineText[right + 1])) {
    right += 1;
  }

  const name = lineText.slice(left, right + 1);
  if (!SYMBOL_START_CHAR_PATTERN.test(name[0]) && !isOperatorChar(name[0])) {
    return null;
  }

  if (!SYMBOL_START_CHAR_PATTERN.test(name[0]) && name.length > 1) {
    return null;
  }

  return {
    name,
    start: left,
    end: right + 1,
  };
}