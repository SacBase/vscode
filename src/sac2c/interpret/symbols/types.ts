import type { Location } from "vscode-languageserver/node";

export interface SymbolDumpLocation {
  uri: string;
  line: number;
  character: number;
}

export interface ParsedSymbolDumpEntry {
  source: SymbolDumpLocation;
  kind: string;
  name: string | null;
  payload: string;
  target: SymbolDumpLocation | null;
}

export interface SymbolsDefinitionQueryResult {
  locations: Location[];
}

export interface SymbolsHoverQueryResult {
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