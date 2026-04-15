import * as vscode from "vscode";

import { extractOutlineSymbols } from "$extension/outline/symbolExtractor";

/**
 * Local SaC document symbol provider for Outline view.
 *
 * This provider does not invoke sac2c and therefore has zero compiler churn.
 */
export class SacDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(document: vscode.TextDocument): vscode.ProviderResult<vscode.DocumentSymbol[]> {
    return extractOutlineSymbols(document);
  }
}
