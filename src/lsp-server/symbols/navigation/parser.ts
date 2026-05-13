import type { ParsedSymbolDumpEntry, SymbolDumpLocation } from "$lsp-server/symbols/navigation/types";

const SYMBOL_LINE_PATTERN = /^(.*?):(\d+):(\d+):\[([^\]]+)\]\s*(.*)$/;
const TARGET_LOCATION_PATTERN = /^(.*?):(\d+):(\d+)\s*$/;

function parseLocation(text: string): SymbolDumpLocation | null {
  const match = text.match(TARGET_LOCATION_PATTERN);
  if (!match) {
    return null;
  }

  return {
    uri: match[1],
    line: Number(match[2]),
    character: Number(match[3]),
  };
}

function extractFunctionName(payload: string): string | null {
  const match = payload.match(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
  return match?.[1] ?? null;
}

function extractTrailingIdentifier(payload: string): string | null {
  const matches = payload.match(/[A-Za-z_][A-Za-z0-9_]*/g);
  return matches && matches.length > 0 ? matches[matches.length - 1] : null;
}

function extractName(kind: string, payload: string): string | null {
  if (kind === "funDef") {
    return extractFunctionName(payload) ?? extractTrailingIdentifier(payload);
  }

  if (kind === "id") {
    return null;
  }

  return extractTrailingIdentifier(payload);
}

export function parseSymbolsOutput(stdout: string): ParsedSymbolDumpEntry[] {
  const entries: ParsedSymbolDumpEntry[] = [];

  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const match = line.match(SYMBOL_LINE_PATTERN);
    if (!match) {
      continue;
    }

    const source: SymbolDumpLocation = {
      uri: match[1],
      line: Number(match[2]),
      character: Number(match[3]),
    };
    const kind = match[4];
    const payload = match[5].trimEnd();
    const target = kind === "id" || kind === "ids" ? parseLocation(payload) : null;

    entries.push({
      source,
      kind,
      name: extractName(kind, payload),
      payload,
      target,
    });
  }

  return entries;
}