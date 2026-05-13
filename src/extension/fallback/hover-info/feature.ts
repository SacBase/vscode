import * as vscode from "vscode";

import type { FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";
import { SacFormatHoverProvider } from "$extension/fallback/hover-info/sacFormatHoverProvider";

export class SacFormatFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  public async activate(): Promise<void> {
    const selector: vscode.DocumentSelector = [{ language: "sac-format" }];
    const provider = new SacFormatHoverProvider();
    this.disposables.push(vscode.languages.registerHoverProvider(selector, provider));
  }

  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}