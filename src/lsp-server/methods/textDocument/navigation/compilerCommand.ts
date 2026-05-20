import { fileURLToPath } from "url";

import { runSac2c } from "$sac2c/invoke";

export function buildSymbolsArgs(documentFsPath: string, extraArgs: string[]): string[] {
  return ["-v0", "-symbols", ...extraArgs, documentFsPath];
}

export function toDocumentFsPath(documentUri: string): string {
  return fileURLToPath(documentUri);
}

export async function runCompilerCommand(command: string, args: string[], cwd: string, timeoutMs: number): Promise<string | null> {
  const result = await runSac2c(command, args, cwd);
  if (result.code !== 0 && result.stderr.trim().length > 0) {
    return null;
  }

  return result.stdout;
}