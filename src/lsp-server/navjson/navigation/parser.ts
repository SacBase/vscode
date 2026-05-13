import type { NavigationIndex, ParseNavigationIndexResult } from "$sac2c/parser/navigation/types";

function extractFirstJsonObject(text: string): string | null {
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (start < 0) {
      if (char === "{") {
        start = index;
        depth = 1;
        inString = false;
        escaped = false;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
}

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
  if (!Array.isArray(index.files) || !Array.isArray(index.tokens) || !Array.isArray(index.symbols) || !Array.isArray(index.bindings)) {
    return {
      index: null,
      error: "navjson missing required arrays: files/tokens/symbols/bindings.",
    };
  }

  return { index: index as NavigationIndex, error: null };
}