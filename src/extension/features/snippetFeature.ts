import type { FeatureLifecycle } from "./languageClientFeature";

/**
 * Snippets are currently contributed statically via package.json, so this
 * feature is intentionally a no-op runtime hook.
 */
export class SnippetFeature implements FeatureLifecycle {
  public async activate(): Promise<void> {
    return;
  }

  public async deactivate(): Promise<void> {
    return;
  }
}
