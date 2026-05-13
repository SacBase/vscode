import { pathToFileURL } from "url";

import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Location, Position } from "vscode-languageserver/node";

import { buildNavArgs, runCompilerCommand } from "$lsp-server/navjson/navigation/compilerCommand";
import { parseNavigationIndex } from "$lsp-server/navjson/navigation/parser";
import { resolveDefinitionFromIndex, resolveHoverFromIndex } from "$lsp-server/navjson/navigation/query";
import type { CompilerNavigationRuntimeConfig, HoverDebugLogger, SacDefinitionQueryResult, SacHoverQueryResult } from "$lsp-server/navigation/types";

const NAV_DEBUG_ENABLED = process.env.SAC_NAV_DEBUG === "1";

function logNavDebug(message: string, payload?: Record<string, unknown>, debugLog?: HoverDebugLogger): void {
  if (debugLog) {
    debugLog(message, payload);
    return;
  }

  if (!NAV_DEBUG_ENABLED) {
    return;
  }

  const serialized = payload ? ` ${JSON.stringify(payload)}` : "";
  process.stderr.write(`[sac-nav] ${message}${serialized}\n`);
}

export interface CompilerDefinitionAdapterContext {
  document: TextDocument;
  position: Position;
  workspaceRoot: string;
  runtime: CompilerNavigationRuntimeConfig;
}

export function parseCompilerDefinitionOutput(
  stdout: string,
  documentFsPath: string,
  position: Position,
  workspaceRoot: string,
  sourceText?: string,
): SacDefinitionQueryResult | null {
  const parsed = parseNavigationIndex(stdout);
  if (!parsed.index) {
    logNavDebug("parse-definition-failed", {
      error: parsed.error,
      stdoutPreview: stdout.slice(0, 500),
    });
    return null;
  }

  const hits = resolveDefinitionFromIndex(parsed.index, workspaceRoot, documentFsPath, position.line, position.character, sourceText);

  if (hits.length === 0) {
    logNavDebug("definition-no-hit", {
      file: documentFsPath,
      line: position.line,
      character: position.character,
    });
    return null;
  }

  const locations: Location[] = hits.map((hit: any) => ({
    uri: pathToFileURL(hit.path).toString(),
    range: hit.range,
  }));

  return { locations };
}

export function parseCompilerHoverOutput(
  stdout: string,
  documentFsPath: string,
  position: Position,
  workspaceRoot: string,
  sourceText?: string,
  debugLog?: HoverDebugLogger,
): SacHoverQueryResult | null {
  const parsed = parseNavigationIndex(stdout);
  if (!parsed.index) {
    logNavDebug("parse-hover-failed", { error: parsed.error, stdoutPreview: stdout.slice(0, 500) }, debugLog);
    return null;
  }

  const hit = resolveHoverFromIndex(parsed.index, workspaceRoot, documentFsPath, position.line, position.character, sourceText);
  if (!hit) {
    logNavDebug("hover-no-hit", { file: documentFsPath, line: position.line, character: position.character }, debugLog);
    return null;
  }

  return {
    markdown: hit.markdown,
    signature: hit.signature,
    symbolName: hit.symbolName,
    symbolKind: hit.symbolKind,
    symbolProvenance: hit.symbolProvenance,
    resolutionReason: hit.resolutionReason,
    range: hit.range,
    definitionPath: hit.definitionPath,
    definitionLine: hit.definitionLine,
  };
}

export async function queryCompilerDefinitions(context: CompilerDefinitionAdapterContext): Promise<SacDefinitionQueryResult | null> {
  if (!context.runtime.executable) {
    logNavDebug("definition-skip-no-executable");
    return null;
  }

  const documentFsPath = context.document.uri.startsWith("file://") ? new URL(context.document.uri).pathname : context.document.uri;
  const stdout = await runCompilerCommand(
    context.runtime.executable,
    buildNavArgs("definition", documentFsPath, context.position, context.runtime.extraArgs),
    context.workspaceRoot,
    context.runtime.timeoutMs,
  );

  if (!stdout) {
    logNavDebug("definition-no-stdout", {
      file: documentFsPath,
      line: context.position.line,
      character: context.position.character,
    });
    return null;
  }

  return parseCompilerDefinitionOutput(stdout, documentFsPath, context.position, context.workspaceRoot, context.document.getText());
}

export async function queryCompilerHover(
  context: CompilerDefinitionAdapterContext,
  debugLog?: HoverDebugLogger,
): Promise<SacHoverQueryResult | null> {
  if (!context.runtime.executable) {
    logNavDebug("hover-skip-no-executable", undefined, debugLog);
    return null;
  }

  const documentFsPath = context.document.uri.startsWith("file://") ? new URL(context.document.uri).pathname : context.document.uri;
  const stdout = await runCompilerCommand(
    context.runtime.executable,
    buildNavArgs("hover", documentFsPath, context.position, context.runtime.extraArgs),
    context.workspaceRoot,
    context.runtime.timeoutMs,
  );

  if (!stdout) {
    logNavDebug("hover-no-stdout", {
      file: documentFsPath,
      line: context.position.line,
      character: context.position.character,
    }, debugLog);
    return null;
  }

  return parseCompilerHoverOutput(stdout, documentFsPath, context.position, context.workspaceRoot, context.document.getText(), debugLog);
}
