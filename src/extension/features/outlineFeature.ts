import * as vscode from "vscode";

import { SAC_CONFIG_SECTION, SAC_LANGUAGE_ID, SAC_URI_FILE_SCHEME } from "$constants/language";
import type { FeatureLifecycle } from "$extension/features/languageClientFeature";
import { SacDocumentSymbolProvider } from "$extension/outline/documentSymbolProvider";

/**
 * Registers local Outline provider for SaC documents.
 */
export class OutlineFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  public async activate(): Promise<void> {
    const enabled = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION).get<boolean>("features.outline.enable", true);
    if (!enabled) {
      return;
    }

    const selector: vscode.DocumentSelector = [{ language: SAC_LANGUAGE_ID, scheme: SAC_URI_FILE_SCHEME }];
    const provider = new SacDocumentSymbolProvider();
    this.disposables.push(vscode.languages.registerDocumentSymbolProvider(selector, provider));
  }

  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}
