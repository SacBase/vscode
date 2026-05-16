import type * as vscode from "vscode";

import { compileSelectedFileCommand } from "$extension/commands/compileSelectedFileCommand";
import { generateFormatConfigCommand } from "$extension/commands/generateFormatConfigCommand";
import { runSac2cCommand } from "$extension/commands/runSac2cCommand";
import { runSelectedFileCommand } from "$extension/commands/runSelectedFileCommand";
import { runSelectedFileInTerminalCommand } from "$extension/commands/runSelectedFileInTerminalCommand";
import type { ExtensionCommand } from "$extension/commands/types";
import { Logger } from "$util/logging";

const COMMANDS: ExtensionCommand[] = [
  runSac2cCommand,
  generateFormatConfigCommand,
  runSelectedFileCommand,
  runSelectedFileInTerminalCommand,
  compileSelectedFileCommand,
];

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
