import type * as vscode from "vscode";

/**
 * Descriptor for extension command registration.
 */
export interface ExtensionCommand {
  id: string;
  register(): vscode.Disposable;
}
