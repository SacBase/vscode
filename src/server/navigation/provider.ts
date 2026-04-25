import type { TextDocument } from "vscode-languageserver-textdocument";
import type { Definition, Position } from "vscode-languageserver/node";

import { queryStdlibDefinitions } from "$sac2c/parser/navigation/stdlib";
import { queryCompilerDefinitions } from "$server/navigation/compilerAdapter";
import { getSymbolAtPosition } from "$server/navigation/symbol";
import type { CompilerNavigationRuntimeConfig } from "$server/navigation/types";
import { queryWorkspaceDefinitions } from "$server/navigation/workspaceDefinitions";

export interface ProvideDefinitionContext {
  document: TextDocument;
  position: Position;
  workspaceRoot: string;
  workspaceRoots: string[];
  openDocuments: TextDocument[];
  excludedDirNames: Set<string>;
  runtime: CompilerNavigationRuntimeConfig;
}

/**
 * Provides a baseline go-to-definition implementation.
 */
export async function provideDefinition(context: ProvideDefinitionContext): Promise<Definition | null> {
  const symbol = getSymbolAtPosition(context.document, context.position);
  if (!symbol) {
    return null;
  }

  const compilerResult = await queryCompilerDefinitions({
    document: context.document,
    position: context.position,
    workspaceRoot: context.workspaceRoot,
    runtime: context.runtime,
  });

  if (compilerResult && compilerResult.locations.length > 0) {
    return compilerResult.locations;
  }

  const fallback = queryWorkspaceDefinitions({
    symbolName: symbol.name,
    currentDocumentUri: context.document.uri,
    workspaceRoots: context.workspaceRoots,
    openDocuments: context.openDocuments,
    excludedDirNames: context.excludedDirNames,
  });

  if (fallback.length === 0) {
    const stdlibFallback = queryStdlibDefinitions(symbol.name, context.workspaceRoot);
    if (stdlibFallback.length === 0) {
      return null;
    }

    return stdlibFallback;
  }

  return fallback;
}
