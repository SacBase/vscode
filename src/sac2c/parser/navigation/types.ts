export interface NavigationPosition {
  line: number;
  character: number;
}

export interface NavigationRange {
  start: NavigationPosition;
  end: NavigationPosition;
}

export interface NavigationFileEntry {
  id: string;
  path: string;
}

export interface NavigationToken {
  id: string;
  fileId: string;
  range: NavigationRange;
  role: string;
  spelling?: string;
  scopeId?: string;
  stableKey?: string;
  type?: {
    typeShape?: {
      typeRepr?: string;
    };
  };
  enclosingSymbolId?: string;
}

export interface NavigationSymbol {
  id: string;
  kind: string;
  name: string;
  qualifiedName: string;
  parentSymbolId?: string;
  scopeId?: string;
  definitionTokenId: string;
  declarationTokenId?: string;
  moduleId: string;
  signatureIds?: string[];
  provenance: string;
  visibility?: string;
  completionKind?: string;
  score?: number;
  canRename?: boolean;
  immutable?: boolean;
  type?: {
    typeShape?: {
      typeRepr?: string;
    };
  };
  stableKey?: string;
}

export interface NavigationBinding {
  tokenId: string;
  resolution: "resolved" | "unresolved" | "ambiguous";
  candidateSymbolIds: string[];
  selectedSymbolId?: string;
  reason?: string;
}

export interface NavigationReference {
  symbolId: string;
  tokenId: string;
  role?: "read" | "write" | "call" | "import" | "type";
  isDefinition?: boolean;
  score?: number;
}

export interface NavigationSyntaxNode {
  id: string;
  fileId: string;
  kind: string;
  range: NavigationRange;
  scopeId?: string;
  symbolId?: string;
  stableKey?: string;
  parentId?: string;
}

export interface NavigationSignatureParameter {
  name: string;
  typeShape?: {
    typeRepr?: string;
  };
}

export interface NavigationSignature {
  display: string;
  parameters: NavigationSignatureParameter[];
  returns: Array<{
    typeRepr?: string;
  }>;
}

export interface NavigationSignatureEntry {
  id: string;
  signature: NavigationSignature;
}

export interface NavigationIndex {
  schemaVersion: number;
  indexKind?: string;
  files: NavigationFileEntry[];
  tokens: NavigationToken[];
  symbols: NavigationSymbol[];
  bindings: NavigationBinding[];
  references?: NavigationReference[];
  syntaxNodes?: NavigationSyntaxNode[];
  signatures?: NavigationSignatureEntry[];
}

export interface NavigationDefinitionHit {
  path: string;
  range: NavigationRange;
}

export interface NavigationHoverHit {
  markdown: string;
  signature: string | null;
  symbolName: string;
  symbolKind: string;
  symbolProvenance: string;
  resolutionReason: string | null;
  range: NavigationRange;
  definitionPath: string;
  definitionLine: number;
}

export interface ParseNavigationIndexResult {
  index: NavigationIndex | null;
  error: string | null;
}
