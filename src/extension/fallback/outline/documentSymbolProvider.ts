import type * as vscode from "vscode";

import { extractOutlineSymbols } from "$extension/fallback/parser/symbolExtractor";

export class SacDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(document: vscode.TextDocument): vscode.ProviderResult<vscode.DocumentSymbol[]> {
    return extractOutlineSymbols(document);
  }
}