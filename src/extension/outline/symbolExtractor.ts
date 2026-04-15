import * as vscode from "vscode";

import { FUNCTION_DEFINITION_CAPTURE_PATTERN, MODULE_DECLARATION_CAPTURE_PATTERN } from "$constants/regex";
import { toGlobalRegex } from "$util/regex";
import { findMatchingBrace, maskNonCodeText } from "$util/sourceFile";

/**
 * Extracts top-level module/function symbols for VS Code Outline view.
 *
 * @param document SaC document.
 * @returns Document symbols in lexical order.
 */
export function extractOutlineSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
  const source = document.getText();
  const maskedSource = maskNonCodeText(source);
  const symbols: vscode.DocumentSymbol[] = [];

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

  const functionPattern = toGlobalRegex(FUNCTION_DEFINITION_CAPTURE_PATTERN);
  for (let match = functionPattern.exec(maskedSource); match; match = functionPattern.exec(maskedSource)) {
    const functionName = match[1];
    const matchText = match[0];
    const start = match.index;
    const openBraceInMatch = matchText.lastIndexOf("{");
    if (openBraceInMatch < 0) {
      continue;
    }

    const openBraceOffset = start + openBraceInMatch;
    const closeBraceOffset = findMatchingBrace(source, openBraceOffset, maskedSource);
    const end = Math.min(source.length, closeBraceOffset + 1);
    const fnRange = new vscode.Range(document.positionAt(start), document.positionAt(end));

    const nameInMatch = matchText.indexOf(functionName);
    const nameOffset = start + Math.max(0, nameInMatch);
    const selectionRange = new vscode.Range(document.positionAt(nameOffset), document.positionAt(nameOffset + functionName.length));

    symbols.push(new vscode.DocumentSymbol(functionName, "function", vscode.SymbolKind.Function, fnRange, selectionRange));
  }

  return symbols.sort((left, right) => left.range.start.compareTo(right.range.start));
}
