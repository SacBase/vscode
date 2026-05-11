import * as vscode from "vscode";

import type { FeatureLifecycle } from "$extension/features/languageClientFeature";
import { SacFormatHoverProvider } from "$extension/features/sacFormatHoverFeature";

/**
 * Registers hover provider for `.sac-format` configuration files.
 */
export class SacFormatFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  /**
   * Activates .sac-format hover support.
   */
  public async activate(): Promise<void> {
    const selector: vscode.DocumentSelector = [{ language: "sac-format" }];
    const provider = new SacFormatHoverProvider();
    this.disposables.push(vscode.languages.registerHoverProvider(selector, provider));
  }

  /**
   * Disposes .sac-format feature registrations.
   */
  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}
