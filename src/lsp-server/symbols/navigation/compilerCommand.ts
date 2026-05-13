import { fileURLToPath } from "url";

export function buildSymbolsArgs(documentFsPath: string, extraArgs: string[]): string[] {
  return ["-v0", "-symbols", ...extraArgs, documentFsPath];
}

export function toDocumentFsPath(documentUri: string): string {
  return fileURLToPath(documentUri);
}

export { runCompilerCommand } from "$lsp-server/navjson/navigation/compilerCommand";