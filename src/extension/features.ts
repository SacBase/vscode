import type * as vscode from "vscode";

import { ChatParticipantFeature } from "$copilot/chatParticipantFeature";
import { CommandFeature } from "$extension/commands/feature";
import {
  FormattingFeature,
  OutlineFeature,
  ReferencesFallbackFeature,
  SacFormatFeature,
} from "$extension/fallback";
import { createLspClientFeatures, type FeatureLifecycle } from "$extension/lsp-client/client";
import { Logger } from "$util/logging";

export interface ExtensionFeatureController {
  dispose(): Promise<void>;
}

/**
 * Registers all extension features through independent modules.
 */
export async function registerExtensionFeatures(context: vscode.ExtensionContext): Promise<ExtensionFeatureController> {
  const features: FeatureLifecycle[] = [
    new CommandFeature(),
    new FormattingFeature(),
    new ReferencesFallbackFeature(),
    new OutlineFeature(),
    new SacFormatFeature(),
    new ChatParticipantFeature(),
    ...createLspClientFeatures(context),
  ];

  const activated: FeatureLifecycle[] = [];

  try {
    // Async enable features:
    await Promise.all(
      features.map(async (feature) => {
        const featureName = feature.constructor.name;
        Logger.info(`[features] Activating ${featureName}...`);
        await feature.activate();
        Logger.info(`[features] ${featureName} activated.`);
        activated.push(feature);
      }),
    ).finally(() => {
      Logger.info(`[features] All features activation attempted. Total: ${features.length}, Activated: ${activated.length}.`);
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    Logger.error(`[features] Activation failed: ${errorMsg}. Rolling back...`);
    for (const feature of [...activated].reverse()) {
      try {
        const featureName = feature.constructor.name;
        await feature.deactivate();
        Logger.info(`[features] Rolled back ${featureName}.`);
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
