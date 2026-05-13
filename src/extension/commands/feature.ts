import * as vscode from "vscode";

import { SAC_CONFIG_SECTION } from "$constants/language";
import { registerExtensionCommands } from "$extension/commands";
import type { FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";

export class CommandFeature implements FeatureLifecycle {
  private readonly disposables: vscode.Disposable[] = [];

  public async activate(): Promise<void> {
    const enabled = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION).get<boolean>("features.commands.enable", true);
    if (!enabled) {
      return;
    }

    this.disposables.push(...registerExtensionCommands());
  }

  public async deactivate(): Promise<void> {
    while (this.disposables.length > 0) {
      const disposable = this.disposables.pop();
      disposable?.dispose();
    }
  }
}
