import { TextDocument } from "vscode-languageserver-textdocument";
import { Definition, Position } from "vscode-languageserver/node";

import { queryCompilerDefinitions } from "./compilerAdapter";
import { getSymbolAtPosition } from "./symbol";
import { queryWorkspaceDefinitions } from "./workspaceDefinitions";

export interface ProvideDefinitionContext {
  document: TextDocument;
  position: Position;
  workspaceRoot: string;
  workspaceRoots: string[];
  openDocuments: TextDocument[];
  excludedDirNames: Set<string>;
}

/**
 * Provides a baseline go-to-definition implementation.
 */
export async function provideDefinition(
  context: ProvideDefinitionContext,
): Promise<Definition | null> {
  const symbol = getSymbolAtPosition(context.document, context.position);
  if (!symbol) {
    return null;
  }

  const compilerResult = await queryCompilerDefinitions({
    document: context.document,
    position: context.position,
    workspaceRoot: context.workspaceRoot,
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
    return null;
  }

  return fallback;
}
