import * as vscode from "vscode";

import { SAC_CONFIG_SECTION } from "$constants/language";
import { registerExtensionCommands } from "$extension/commands";
import type { FeatureLifecycle } from "$extension/features/languageClientFeature";

/**
 * Command feature wrapper to keep command registration modular.
 */
export class CommandFeature implements FeatureLifecycle {
  private readonly disposables: vscode.Disposable[] = [];

  /**
   * Registers extension commands when feature is enabled.
   */
  public async activate(): Promise<void> {
    const enabled = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION).get<boolean>("features.commands.enable", true);
    if (!enabled) {
      return;
    }

    this.disposables.push(...registerExtensionCommands());
  }

  /**
   * Unregisters extension commands.
   */
  public async deactivate(): Promise<void> {
    while (this.disposables.length > 0) {
      const disposable = this.disposables.pop();
      disposable?.dispose();
    }
  }
}
