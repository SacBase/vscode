import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Definition, Position } from "vscode-languageserver/node";

import { queryBackendDefinitions } from "$lsp-server/navigation/backend";
import { getSymbolAtPosition } from "$lsp-server/navigation/symbol";
import type { CompilerNavigationRuntimeConfig } from "$lsp-server/navigation/types";

export interface ProvideDefinitionContext {
  document: TextDocument;
  position: Position;
  workspaceRoot: string;
  workspaceRoots: string[];
  openDocuments: TextDocument[];
  excludedDirNames: Set<string>;
  navigationBackend: "navjson" | "symbols";
  runtime: CompilerNavigationRuntimeConfig;
}

export async function provideDefinition(context: ProvideDefinitionContext): Promise<Definition | null> {
  const symbol = getSymbolAtPosition(context.document, context.position);
  if (!symbol) {
    return null;
  }

  const compilerResult = await queryBackendDefinitions({
    backend: context.navigationBackend,
    document: context.document,
    position: context.position,
    workspaceRoot: context.workspaceRoot,
    runtime: context.runtime,
  });

  if (compilerResult && compilerResult.locations.length > 0) {
    return compilerResult.locations;
  }

  // Do not perform any client-side fallback here. Let client decide
  // whether to run workspace/stdlib fallbacks when it receives
  // a "sac/compiler/failed" notification from the server.
  return null;
}