import * as vscode from "vscode";

import {
  CONTROL_OR_RETURN_HEADER_PATTERN,
  FUNCTION_DEFINITION_CAPTURE_PATTERN,
  MODULE_DECLARATION_CAPTURE_PATTERN,
} from "$constants/regex";
import { toGlobalRegex } from "$util/regex";
import { findMatchingBrace, maskNonCodeText } from "$util/sourceFile";

export function extractOutlineSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
  const source = document.getText();
  const maskedSource = maskNonCodeText(source);
  const symbols: vscode.DocumentSymbol[] = [];

  const classPattern = /^\s*class\s+([A-Za-z_][A-Za-z0-9_@]*)\s*;/gm;
  const classTypePattern = /^\s*classtype\s+(.+?)\s*;/gm;
  const objectPattern = /^\s*objdef\s+(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=.*;/gm;

  function lineStartOffset(offset: number): number {
    return Math.max(0, source.lastIndexOf("\n", offset - 1) + 1);
  }

  function createSymbol(
    name: string,
    detail: string,
    kind: vscode.SymbolKind,
    start: number,
    end: number,
    selectionStart: number,
    selectionEnd: number,
  ): void {
    const symbolRange = new vscode.Range(document.positionAt(start), document.positionAt(end));
    const selectionRange = new vscode.Range(document.positionAt(selectionStart), document.positionAt(selectionEnd));
    symbols.push(new vscode.DocumentSymbol(name, detail, kind, symbolRange, selectionRange));
  }

  function isFunctionHeader(functionName: string): boolean {
    return !CONTROL_OR_RETURN_HEADER_PATTERN.test(functionName);
  }

  function getFunctionDetail(functionStart: number): string {
    const prefix = source.slice(lineStartOffset(functionStart), functionStart).replace(/^\s*inline\s+/, "").trim();
    return prefix.length > 0 ? prefix : "function";
  }

  const modulePattern = toGlobalRegex(MODULE_DECLARATION_CAPTURE_PATTERN);
  for (let match = modulePattern.exec(maskedSource); match; match = modulePattern.exec(maskedSource)) {
    const moduleName = match[1];
    const start = match.index;
    const end = match.index + match[0].length;
    const moduleRange = new vscode.Range(document.positionAt(start), document.positionAt(end));
    const moduleNameOffset = start + Math.max(0, match[0].indexOf(moduleName));
    const selectionRange = new vscode.Range(
      document.positionAt(moduleNameOffset),
      document.positionAt(moduleNameOffset + moduleName.length),
    );

    symbols.push(new vscode.DocumentSymbol(moduleName, "module", vscode.SymbolKind.Namespace, moduleRange, selectionRange));
  }

  for (let match = classPattern.exec(maskedSource); match; match = classPattern.exec(maskedSource)) {
    const className = match[1];
    const start = match.index;
    const end = start + match[0].length;
    const nameOffset = start + Math.max(0, match[0].indexOf(className));
    createSymbol(className, "class", vscode.SymbolKind.Struct, start, end, nameOffset, nameOffset + className.length);
  }

  for (let match = classTypePattern.exec(maskedSource); match; match = classTypePattern.exec(maskedSource)) {
    const classTypeName = match[1].trim();
    if (!classTypeName) {
      continue;
    }

    const start = match.index;
    const end = start + match[0].length;
    const nameOffset = start + Math.max(0, match[0].indexOf(classTypeName));
    createSymbol(classTypeName, "classtype", vscode.SymbolKind.Struct, start, end, nameOffset, nameOffset + classTypeName.length);
  }

  for (let match = objectPattern.exec(maskedSource); match; match = objectPattern.exec(maskedSource)) {
    const objectType = match[1].trim();
    const objectName = match[2];
    const start = match.index;
    const end = start + match[0].length;
    const nameOffset = start + Math.max(0, match[0].lastIndexOf(objectName));
    createSymbol(objectName, objectType, vscode.SymbolKind.Variable, start, end, nameOffset, nameOffset + objectName.length);
  }

  const functionPattern = toGlobalRegex(FUNCTION_DEFINITION_CAPTURE_PATTERN);
  for (let match = functionPattern.exec(maskedSource); match; match = functionPattern.exec(maskedSource)) {
    const functionName = match[1];
    if (!isFunctionHeader(functionName)) {
      continue;
    }

    const matchText = match[0];
    const start = match.index;
    const openBraceInMatch = matchText.lastIndexOf("{");
    if (openBraceInMatch < 0) {
      continue;
    }

    const openBraceOffset = start + openBraceInMatch;
    const closeBraceOffset = findMatchingBrace(source, openBraceOffset, maskedSource);
    const end = Math.min(source.length, closeBraceOffset + 1);

    const nameInMatch = matchText.indexOf(functionName);
    const nameOffset = start + Math.max(0, nameInMatch);
    createSymbol(
      functionName,
      getFunctionDetail(start),
      vscode.SymbolKind.Function,
      start,
      end,
      nameOffset,
      nameOffset + functionName.length,
    );
  }

  return symbols.sort((left, right) => left.range.start.compareTo(right.range.start));
}