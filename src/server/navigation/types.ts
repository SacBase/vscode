import { Location } from "vscode-languageserver/node";

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
