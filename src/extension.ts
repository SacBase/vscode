import * as vscode from "vscode";
import {
  ExtensionFeatureController,
  registerExtensionFeatures,
} from "./extension/features";

let controller: ExtensionFeatureController | undefined;

/**
 * Activates the extension and starts the SaC language client.
 *
 * !IMPORTANT: The server module is loaded from compiled output under out/server.
 * ?TODO: Add a startup self-check command that validates configured backend availability
 *        (local, WSL, Docker) and reports actionable guidance to users.
 *
 * @param context VS Code extension activation context.
 * @returns Promise resolved once the language client has started.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    controller = await registerExtensionFeatures(context);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
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
  if (!controller) {
    return;
  }

  await controller.dispose();
  controller = undefined;
}
