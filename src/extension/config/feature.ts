import * as vscode from "vscode";

import { SAC_CONFIG_LANGUAGE_ID } from "$constants/language";
import { SacConfigHoverProvider } from "$extension/config/sacConfigHoverProvider";
import type { FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";

export class SacConfigFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  public async activate(): Promise<void> {
    const selector: vscode.DocumentSelector = [{ language: SAC_CONFIG_LANGUAGE_ID }];
    const provider = new SacConfigHoverProvider();
    this.disposables.push(vscode.languages.registerHoverProvider(selector, provider));
  }

  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}
