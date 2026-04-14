import { NavigationIndex, ParseNavigationIndexResult } from "./types";

/**
 * Extracts first complete JSON object from mixed compiler output.
 * Compiler may print warnings/noise around navjson payload.
 */
function extractFirstJsonObject(text: string): string | null {
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaping = false;

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

    if (ch === "{") {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
      continue;
    }

    if (ch === "}") {
      if (depth === 0) {
        continue;
      }
      depth -= 1;
      if (depth === 0 && start >= 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * Parses navigation JSON emitted by compiler and validates required arrays.
 */
export function parseNavigationIndex(stdout: string): ParseNavigationIndexResult {
  const payload = extractFirstJsonObject(stdout);
  if (!payload) {
    return { index: null, error: "No JSON object found in compiler output." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { index: null, error: `Invalid navjson payload: ${message}` };
  }

  if (!parsed || typeof parsed !== "object") {
    return { index: null, error: "navjson root is not an object." };
  }

  const index = parsed as Partial<NavigationIndex>;
  if (!Array.isArray(index.files) || !Array.isArray(index.tokens)
    || !Array.isArray(index.symbols) || !Array.isArray(index.bindings)) {
    return {
      index: null,
      error: "navjson missing required arrays: files/tokens/symbols/bindings.",
    };
  }

  return { index: index as NavigationIndex, error: null };
}
