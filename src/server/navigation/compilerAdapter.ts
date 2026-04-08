import { TextDocument } from "vscode-languageserver-textdocument";
import { Position } from "vscode-languageserver/node";

import { SacDefinitionQueryResult } from "./types";

export interface CompilerDefinitionAdapterContext {
  document: TextDocument;
  position: Position;
  workspaceRoot: string;
}

/**
 * Placeholder parser for future sac2c symbol-index output.
 */
export function parseCompilerDefinitionOutput(_stdout: string): SacDefinitionQueryResult | null {
  //! NOTE: we still need support from the sac2c compiler to emit a stable
  //! NOTE: definition/call index format (JSON or structured plaintext).
  return null;
}

/**
 * Queries compiler-backed definition data when available.
 */
export async function queryCompilerDefinitions(
  _context: CompilerDefinitionAdapterContext,
): Promise<SacDefinitionQueryResult | null> {
  //! NOTE: we still need support from the sac2c compiler before this adapter
  //! NOTE: can invoke a real command and parse definition/call information.
  return null;
}
