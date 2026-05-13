import type * as vscode from "vscode";

import { generateFormatConfigCommand } from "$extension/commands/generateFormatConfigCommand";
import { runSac2cCommand } from "$extension/commands/runSac2cCommand";
import type { ExtensionCommand } from "$extension/commands/types";
import { Logger } from "$util/logging";

const COMMANDS: ExtensionCommand[] = [runSac2cCommand, generateFormatConfigCommand];

/**
 * Registers all extension commands and returns disposables.
 */
export function registerExtensionCommands(): vscode.Disposable[] {
  Logger.info(`[commands] Registering ${COMMANDS.length} command(s)...`);
  const disposables = COMMANDS.map((command) => {
    Logger.info(`[commands] Registering command: ${command.id}`);
    return command.register();
  });
  Logger.info(`[commands] All ${COMMANDS.length} command(s) registered.`);
  return disposables;
}
