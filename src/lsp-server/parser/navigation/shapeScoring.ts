import type { NavigationIndex, NavigationSymbol, NavigationToken } from "$lsp-server/parser/navigation/types";

// Placeholder shape scoring: prefer symbol with lowest score value if present.
export function selectBestOverloadSymbol(index: NavigationIndex, target: NavigationToken, symbol: NavigationSymbol): NavigationSymbol {
  const candidates = index.symbols.filter((s) => s.name === symbol.name && s.moduleId === symbol.moduleId);
  if (candidates.length === 0) return symbol;
  candidates.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
  return candidates[0];
}
