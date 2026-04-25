import type { Location } from "vscode-languageserver/node";

export interface SacSymbolOccurrence {
  name: string;
  start: number;
  end: number;
}

export interface SacDefinitionEntry {
  name: string;
  uri: string;
  line: number;
  startCharacter: number;
  endCharacter: number;
}

export interface SacDefinitionQueryResult {
  locations: Location[];
}

export interface SacHoverQueryResult {
  markdown: string;
  signature: string | null;
  symbolName: string;
  symbolKind: string;
  symbolProvenance: string;
  resolutionReason: string | null;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  definitionPath: string;
  definitionLine: number;
}

export interface CompilerNavigationRuntimeConfig {
  executable: string | null;
  extraArgs: string[];
  timeoutMs: number;
}

export type HoverDebugLogger = (message: string, payload?: Record<string, unknown>) => void;
