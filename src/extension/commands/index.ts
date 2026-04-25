import type * as vscode from "vscode";

import { runSac2cCommand } from "$extension/commands/runSac2cCommand";
import type { ExtensionCommand } from "$extension/commands/types";

const COMMANDS: ExtensionCommand[] = [runSac2cCommand];

/**
 * Registers all extension commands and returns disposables.
 */
export function registerExtensionCommands(): vscode.Disposable[] {
  return COMMANDS.map((command) => command.register());
}
