import { fileURLToPath, pathToFileURL } from "url";

import { TextDocument } from "vscode-languageserver-textdocument";
import { Location, Position } from "vscode-languageserver/node";

import { parseNavigationIndex } from "$sac2c/parser/navigation/parser";
import { resolveDefinitionFromIndex, resolveHoverFromIndex } from "$sac2c/parser/navigation/query";

import { buildNavArgs, runCompilerCommand } from "$server/navigation/compilerCommand";
import { CompilerNavigationRuntimeConfig, HoverDebugLogger, SacDefinitionQueryResult, SacHoverQueryResult } from "$server/navigation/types";

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

/**
 * Parses raw compiler output and extracts definition locations for target cursor.
 */
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

/**
 * Parses raw compiler output and extracts hover markdown for target cursor.
 */
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
    logNavDebug(
      "parse-hover-failed",
      {
        error: parsed.error,
        stdoutPreview: stdout.slice(0, 500),
      },
      debugLog,
    );
    return null;
  }

  const hit = resolveHoverFromIndex(parsed.index, workspaceRoot, documentFsPath, position.line, position.character, sourceText);

  if (!hit) {
    logNavDebug(
      "hover-no-hit",
      {
        file: documentFsPath,
        line: position.line,
        character: position.character,
      },
      debugLog,
    );
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

/**
 * Queries compiler-backed definition data when compiler is configured/available.
 */
export async function queryCompilerDefinitions(context: CompilerDefinitionAdapterContext): Promise<SacDefinitionQueryResult | null> {
  if (!context.document.uri.startsWith("file://")) {
    return null;
  }

  if (!context.runtime.executable) {
    logNavDebug("definition-skip-no-executable");
    return null;
  }

  const documentFsPath = fileURLToPath(context.document.uri);
  const stdout = await runCompilerCommand(
    context.runtime.executable,
    buildNavArgs("definition", documentFsPath, context.position, context.runtime.extraArgs),
    context.workspaceRoot,
    context.runtime.timeoutMs,
  );

  if (!stdout) {
    logNavDebug("definition-no-stdout", {
      executable: context.runtime.executable,
    });
    return null;
  }

  return parseCompilerDefinitionOutput(stdout, documentFsPath, context.position, context.workspaceRoot, context.document.getText());
}

/**
 * Queries compiler-backed hover data when compiler is configured/available.
 */
export async function queryCompilerHover(
  context: CompilerDefinitionAdapterContext,
  debugLog?: HoverDebugLogger,
): Promise<SacHoverQueryResult | null> {
  if (!context.document.uri.startsWith("file://")) {
    return null;
  }

  if (!context.runtime.executable) {
    logNavDebug("hover-skip-no-executable", undefined, debugLog);
    return null;
  }

  const documentFsPath = fileURLToPath(context.document.uri);
  const stdout = await runCompilerCommand(
    context.runtime.executable,
    buildNavArgs("hover", documentFsPath, context.position, context.runtime.extraArgs),
    context.workspaceRoot,
    context.runtime.timeoutMs,
  );

  if (!stdout) {
    logNavDebug(
      "hover-no-stdout",
      {
        executable: context.runtime.executable,
      },
      debugLog,
    );
    return null;
  }

  return parseCompilerHoverOutput(stdout, documentFsPath, context.position, context.workspaceRoot, context.document.getText(), debugLog);
}
