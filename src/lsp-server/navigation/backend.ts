import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Position } from "vscode-languageserver/node";

import { queryCompilerDefinitions as queryNavjsonDefinitions, queryCompilerHover as queryNavjsonHover } from "$lsp-server/navjson/navigation/compilerAdapter";
import {
  queryCompilerSymbolsDefinitions,
  queryCompilerSymbolsHover,
} from "$lsp-server/symbols/navigation/compilerAdapter";
import type { CompilerNavigationRuntimeConfig, HoverDebugLogger, SacDefinitionQueryResult, SacHoverQueryResult } from "$lsp-server/navigation/types";

export type NavigationBackendMode = "navjson" | "symbols";

export interface NavigationBackendQueryContext {
  backend: NavigationBackendMode;
  document: TextDocument;
  position: Position;
  workspaceRoot: string;
  runtime: CompilerNavigationRuntimeConfig;
}

export async function queryBackendDefinitions(context: NavigationBackendQueryContext): Promise<SacDefinitionQueryResult | null> {
  if (context.backend === "symbols") {
    console.error(`[nav] Querying symbols backend for definitions at ${context.document.uri}`);
    return queryCompilerSymbolsDefinitions(context);
  }

  console.error(`[nav] Querying navjson backend for definitions at ${context.document.uri}`);
  return queryNavjsonDefinitions(context);
}

export async function queryBackendHover(
  context: NavigationBackendQueryContext,
  debugLog?: HoverDebugLogger,
): Promise<SacHoverQueryResult | null> {
  if (context.backend === "symbols") {
    console.error(`[nav] Querying symbols backend for hover at ${context.document.uri}`);
    return queryCompilerSymbolsHover(context, debugLog);
  }

  console.error(`[nav] Querying navjson backend for hover at ${context.document.uri}`);
  return queryNavjsonHover(context, debugLog);
}