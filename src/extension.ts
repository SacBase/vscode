import { type ExtensionFeatureController, registerExtensionFeatures } from "$extension/features";
import { Logger } from "$util/logging";
import * as vscode from "vscode";

let controller: ExtensionFeatureController | undefined;

/**
 * Activates the extension and starts the SaC language client.
 *
 * !IMPORTANT: The server module is loaded from compiled output under out/server.
 * TODO: Add a startup self-check command that validates configured backend availability
 *        (local, WSL, Docker) and reports actionable guidance to users.
 *
 * @param context VS Code extension activation context.
 * @returns Promise resolved once the language client has started.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    Logger.init(context);
    Logger.setOutputChannel("SaC Extension");
    Logger.info("[extension] Activating...");
    controller = await registerExtensionFeatures(context);
    Logger.info("[extension] Activation complete.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    Logger.error(`[extension] Activation failed: ${message}`);
    vscode.window.showErrorMessage(`SaC extension activation failed: ${message}`);
    controller = undefined;
  }
}

/**
 * Deactivates the extension and stops the language client if running.
 *
 * @returns Promise resolved when shutdown is complete.
 */
export async function deactivate(): Promise<void> {
  Logger.info("[extension] Deactivating...");
  if (!controller) {
    Logger.info("[extension] No active controller to dispose.");
    return;
  }

  await controller.dispose();
  controller = undefined;
  Logger.info("[extension] Deactivation complete.");
  Logger.dispose();
}
