import * as path from "path";
import { pathToFileURL } from "url";

import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Location, Position } from "vscode-languageserver/node";

import { buildSymbolsArgs, runCompilerCommand, toDocumentFsPath } from "$lsp-server/symbols/navigation/compilerCommand";
import { parseSymbolsOutput } from "$lsp-server/symbols/navigation/parser";
import type { ParsedSymbolDumpEntry, SymbolsDefinitionQueryResult, SymbolsHoverQueryResult } from "$lsp-server/symbols/navigation/types";
import { getSymbolAtPosition } from "$lsp-server/navigation/symbol";
import type { CompilerNavigationRuntimeConfig, HoverDebugLogger } from "$lsp-server/navigation/types";

function normalizeCompilerPath(filePath: string, workspaceRoot: string): string {
  if (path.isAbsolute(filePath)) {
    return path.normalize(filePath);
  }

  return path.normalize(path.resolve(workspaceRoot, filePath));
}

function chooseEntry(
  entries: ParsedSymbolDumpEntry[],
  document: TextDocument,
  position: Position,
  workspaceRoot: string,
): ParsedSymbolDumpEntry | null {
  const symbol = getSymbolAtPosition(document, position);
  if (!symbol) {
    return null;
  }

  const documentFsPath = normalizeCompilerPath(toDocumentFsPath(document.uri), workspaceRoot);
  const hits = entries.filter(
    (entry) =>
      normalizeCompilerPath(entry.source.uri, workspaceRoot) === documentFsPath &&
      entry.source.line === position.line &&
      entry.source.character === symbol.start,
  );
  if (hits.length === 0) {
    return null;
  }

  return hits.find((entry) => entry.name === symbol.name) ?? hits[0];
}

function toLocation(entry: ParsedSymbolDumpEntry, workspaceRoot: string): Location {
  const target = entry.target ?? entry.source;
  const targetPath = normalizeCompilerPath(target.uri, workspaceRoot);
  return {
    uri: pathToFileURL(targetPath).toString(),
    range: {
      start: { line: target.line, character: target.character },
      end: { line: target.line, character: target.character },
    },
  };
}

function toHover(entry: ParsedSymbolDumpEntry, workspaceRoot: string): SymbolsHoverQueryResult {
  const target = entry.target ?? entry.source;
  const targetPath = normalizeCompilerPath(target.uri, workspaceRoot);
  const markdownLines = [`Kind: \`${entry.kind}\``];

  if (entry.target) {
    markdownLines.push(`Definition: ${targetPath}:${entry.target.line + 1}:${entry.target.character + 1}`);
  }

  return {
    markdown: markdownLines.join("\n"),
    signature: entry.kind === "funDef" ? entry.payload : null,
    symbolName: entry.name ?? entry.payload,
    symbolKind: entry.kind,
    symbolProvenance: "user",
    resolutionReason: entry.target ? "symbols-target" : "symbols-source",
    range: {
      start: { line: entry.source.line, character: entry.source.character },
      end: { line: entry.source.line, character: entry.source.character + Math.max((entry.name ?? "").length, 1) },
    },
    definitionPath: targetPath,
    definitionLine: target.line,
  };
}

export function parseCompilerSymbolsDefinitionOutput(
  stdout: string,
  document: TextDocument,
  position: Position,
  workspaceRoot: string,
): SymbolsDefinitionQueryResult | null {
  const entry = chooseEntry(parseSymbolsOutput(stdout), document, position, workspaceRoot);
  if (!entry) {
    return null;
  }

  return { locations: [toLocation(entry, workspaceRoot)] };
}

export function parseCompilerSymbolsHoverOutput(
  stdout: string,
  document: TextDocument,
  position: Position,
  workspaceRoot: string,
): SymbolsHoverQueryResult | null {
  const entry = chooseEntry(parseSymbolsOutput(stdout), document, position, workspaceRoot);
  if (!entry) {
    return null;
  }

  return toHover(entry, workspaceRoot);
}

export async function queryCompilerSymbolsDefinitions(context: {
  document: TextDocument;
  position: Position;
  workspaceRoot: string;
  runtime: CompilerNavigationRuntimeConfig;
}): Promise<SymbolsDefinitionQueryResult | null> {
  if (!context.runtime.executable) {
    return null;
  }

  const documentFsPath = toDocumentFsPath(context.document.uri);
  const stdout = await runCompilerCommand(
    context.runtime.executable,
    buildSymbolsArgs(documentFsPath, context.runtime.extraArgs),
    context.workspaceRoot,
    context.runtime.timeoutMs,
  );

  if (!stdout) {
    return null;
  }

  return parseCompilerSymbolsDefinitionOutput(stdout, context.document, context.position, context.workspaceRoot);
}

export async function queryCompilerSymbolsHover(
  context: {
    document: TextDocument;
    position: Position;
    workspaceRoot: string;
    runtime: CompilerNavigationRuntimeConfig;
  },
  debugLog?: HoverDebugLogger,
): Promise<SymbolsHoverQueryResult | null> {
  if (!context.runtime.executable) {
    debugLog?.("symbols-skip-no-executable");
    return null;
  }

  const documentFsPath = toDocumentFsPath(context.document.uri);
  const stdout = await runCompilerCommand(
    context.runtime.executable,
    buildSymbolsArgs(documentFsPath, context.runtime.extraArgs),
    context.workspaceRoot,
    context.runtime.timeoutMs,
  );

  if (!stdout) {
    return null;
  }

  return parseCompilerSymbolsHoverOutput(stdout, context.document, context.position, context.workspaceRoot);
}