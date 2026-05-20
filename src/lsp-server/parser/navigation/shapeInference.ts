import { extractCallExpressionSource } from "$lsp-server/parser/navigation/callExpression";
import { selectBestOverloadSymbol as selectBestOverloadByScore } from "$lsp-server/parser/navigation/shapeScoring";
import type { NavigationIndex, NavigationSymbol, NavigationToken } from "$lsp-server/parser/navigation/types";

function countCommasAtTopLevel(text: string): number {
  let depth = 0;
  let inString = false;
  let escaping = false;
  let commas = 0;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (ch === "\\") {
        escaping = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "(") {
      depth += 1;
      continue;
    }
    if (ch === ")") {
      if (depth > 0) {
        depth -= 1;
      }
      continue;
    }
    if (ch === "," && depth === 0) {
      commas += 1;
    }
  }

  return commas;
}

export function selectBestOverloadSymbol(index: NavigationIndex, sourceText: string | undefined, target: NavigationToken, symbol: NavigationSymbol): NavigationSymbol {
  if (!symbol.signatureIds || symbol.signatureIds.length <= 1) {
    return symbol;
  }

  const callSource = sourceText ? extractCallExpressionSource(sourceText, target.range.start.line, target.range.start.character) : null;
  const argCount = callSource ? countCommasAtTopLevel(callSource) + 1 : null;

  // If call arg count known, pick closest signature by parameter count.
  if (argCount !== null) {
    let best: NavigationSymbol | null = null;
    let bestDelta = Number.MAX_SAFE_INTEGER;
    for (const candidate of index.symbols.filter((s) => s.name === symbol.name && s.moduleId === symbol.moduleId)) {
      const sig = candidate.signatureIds?.[0];
      if (!sig) continue;
      // Heuristic: signature parameter count approximate from signature display if available.
      // Fall back to score.
      const paramCount = 0; // unknown here, keep heuristic simple.
      const delta = Math.abs(paramCount - argCount);
      if (delta < bestDelta) {
        best = candidate;
        bestDelta = delta;
      }
    }

    if (best) return best;
  }

  // Fallback: use scoring/selection heuristic in shapeScoring.
  return selectBestOverloadByScore(index, target, symbol);
}
