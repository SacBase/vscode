import * as vscode from "vscode";

import { FeatureLifecycle, LanguageClientFeature } from "./languageClientFeature";

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
    new LanguageClientFeature(context),
  ];

  const activated: FeatureLifecycle[] = [];

  try {
    for (const feature of features) {
      await feature.activate();
      activated.push(feature);
    }
  } catch (error) {
    for (const feature of [...activated].reverse()) {
      try {
        await feature.deactivate();
      } catch {
        // I intentionally ignore rollback errors to keep startup failure handling deterministic.
      }
    }

    throw error;
  }

  return {
    async dispose(): Promise<void> {
      for (const feature of [...activated].reverse()) {
        try {
          await feature.deactivate();
        } catch {
          // I intentionally ignore shutdown errors to avoid noisy dispose failures.
        }
      }
    },
  };
}
