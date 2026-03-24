import { Diagnostic } from "vscode-languageserver/node";

import { ParsedDiagnostic } from "./types";

/**
 * Clamps a number into a closed integer interval.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Builds a base LSP diagnostic from parsed payload.
 */
function toBaseDiagnostic(parsed: ParsedDiagnostic): Diagnostic {
  return {
    severity: parsed.severity,
    message: parsed.message,
    source: "sac2c",
    range: {
      start: { line: parsed.line, character: parsed.column },
      end: { line: parsed.line, character: parsed.column + 1 },
    },
  };
}

/**
 * Attempts to extract a relevant token from sac2c message text.
 */
function extractRelevantToken(message: string): string | null {
  const tokenFoundMatch = message.match(/,\s*`([^`]+)`\s+token\s+found/i)
    || message.match(/token\s+`([^`]+)`\s+found/i)
    || message.match(/^token\s+([^\s]+)\s+cannot\s+start/i);

  if (!tokenFoundMatch || !tokenFoundMatch[1]) {
    return null;
  }

  const token = tokenFoundMatch[1].trim();
  if (token.length === 0 || token.toLowerCase() === "eof") {
    return null;
  }

  return token;
}

/**
 * Extracts likely symbol names from context-style messages.
 */
function extractSymbolHint(message: string): string | null {
  const allInstancesMatch = message.match(/all\s+instances\s+of\s+"([A-Za-z_][A-Za-z0-9_]*)"/i);
  if (allInstancesMatch && allInstancesMatch[1]) {
    return allInstancesMatch[1];
  }

  const inFunctionMatch = message.match(/^--\s+in\s+[A-Za-z_][A-Za-z0-9_]*::([A-Za-z_][A-Za-z0-9_]*)\s*\(/i);
  if (inFunctionMatch && inFunctionMatch[1]) {
    return inFunctionMatch[1];
  }

  return null;
}

/**
 * Finds a token occurrence near expected column.
 */
function findTokenNearColumn(lineText: string, token: string, aroundColumn: number): number | null {
  const searchStart = clamp(aroundColumn - 8, 0, Math.max(lineText.length - 1, 0));
  const searchEnd = clamp(aroundColumn + 64, 0, lineText.length);
  const window = lineText.slice(searchStart, searchEnd);
  const offset = window.indexOf(token);

  if (offset >= 0) {
    return searchStart + offset;
  }

  const global = lineText.indexOf(token);
  return global >= 0 ? global : null;
}

/**
 * Finds bounds of a word-like symbol around an index.
 */
function expandWordBounds(lineText: string, index: number): [number, number] | null {
  if (index < 0 || index >= lineText.length) {
    return null;
  }

  const isWordChar = (ch: string): boolean => /[A-Za-z0-9_]/.test(ch);
  if (!isWordChar(lineText[index])) {
    return null;
  }

  let start = index;
  while (start > 0 && isWordChar(lineText[start - 1])) {
    start -= 1;
  }

  let end = index + 1;
  while (end < lineText.length && isWordChar(lineText[end])) {
    end += 1;
  }

  return [start, end];
}

/**
 * Computes fallback statement range when no precise token is available.
 */
function computeFallbackRange(lineText: string, preferredColumn: number): [number, number] {
  const firstNonWhitespace = lineText.search(/\S/);
  if (firstNonWhitespace < 0) {
    return [0, 0];
  }

  const trimmedEnd = lineText.trimEnd().length;
  const safeEnd = Math.max(trimmedEnd, firstNonWhitespace + 1);

  const clampedPreferred = clamp(preferredColumn, firstNonWhitespace, safeEnd - 1);
  const wordBounds = expandWordBounds(lineText, clampedPreferred);
  if (wordBounds) {
    return wordBounds;
  }

  if (preferredColumn <= firstNonWhitespace + 1) {
    // I intentionally widen near-column-1 diagnostics to avoid tiny useless squiggles.
    return [firstNonWhitespace, safeEnd];
  }

  return [clampedPreferred, Math.min(clampedPreferred + 1, safeEnd)];
}

/**
 * Creates a diagnostic with token-aware range.
 */
export function buildDiagnosticWithRange(parsed: ParsedDiagnostic, lineText: string): Diagnostic {
  const diagnostic = toBaseDiagnostic(parsed);
  const lineLength = lineText.length;

  if (lineLength === 0) {
    diagnostic.range.start.character = 0;
    diagnostic.range.end.character = 0;
    return diagnostic;
  }

  let start = clamp(parsed.column, 0, lineLength - 1);
  let end = clamp(start + 1, 0, lineLength);

  const token = extractRelevantToken(parsed.message);
  if (token) {
    const tokenStart = findTokenNearColumn(lineText, token, start);
    if (tokenStart !== null) {
      start = tokenStart;
      end = clamp(tokenStart + Math.max(token.length, 1), 0, lineLength);
    }
  } else {
    const symbolHint = extractSymbolHint(parsed.message);
    if (symbolHint) {
      const symbolStart = findTokenNearColumn(lineText, symbolHint, start);
      if (symbolStart !== null) {
        start = symbolStart;
        end = clamp(symbolStart + symbolHint.length, 0, lineLength);
      }
    }
  }

  if (end <= start || (start === 0 && end === 1 && parsed.column <= 1)) {
    const [fallbackStart, fallbackEnd] = computeFallbackRange(lineText, parsed.column);
    start = clamp(fallbackStart, 0, lineLength);
    end = clamp(fallbackEnd, 0, lineLength);
  }

  if (end <= start) {
    end = clamp(start + 1, 0, lineLength);
  }

  diagnostic.range.start.character = start;
  diagnostic.range.end.character = end;
  return diagnostic;
}
