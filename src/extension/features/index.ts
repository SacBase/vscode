import * as vscode from "vscode";

import { FeatureLifecycle, LanguageClientFeature } from "./languageClientFeature";
import { SnippetFeature } from "./snippetFeature";

export interface ExtensionFeatureController {
  dispose(): Promise<void>;
}

/**
 * Registers all extension features through independent modules.
 */
export async function registerExtensionFeatures(
  context: vscode.ExtensionContext,
): Promise<ExtensionFeatureController> {
  const features: FeatureLifecycle[] = [
    new SnippetFeature(),
    new LanguageClientFeature(context),
  ];

  for (const feature of features) {
    await feature.activate();
  }

  return {
    async dispose(): Promise<void> {
      for (const feature of [...features].reverse()) {
        await feature.deactivate();
      }
    },
  };
}
