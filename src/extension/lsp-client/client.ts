import type * as vscode from "vscode";

import { LanguageClientFeature, type FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";

/**
 * Creates LSP client-specific features (language client connection).
 */
export function createLspClientFeatures(context: vscode.ExtensionContext): FeatureLifecycle[] {
  return [new LanguageClientFeature(context)];
}

export type { FeatureLifecycle };