import { CoreDiagnosticSeverity, CoreParsedDiagnostic } from "./types";

const NOISY_MESSAGE_PATTERNS: RegExp[] = [
  /^compilation failed\b/i,
  /^abort\b/i,
];

function toSeverity(level: string | undefined): CoreDiagnosticSeverity {
  const normalized = (level || "error").toLowerCase();
  if (normalized.includes("warn")) {
    return "warning";
  }
  if (normalized.includes("note") || normalized.includes("info")) {
    return "information";
  }
  if (normalized.includes("hint")) {
    return "hint";
  }
  return "error";
}

function normalizePath(value: string): string {
  return value.replace(/\\\\/g, "/");
}

function parseTabSeparatedLine(line: string): CoreParsedDiagnostic | null {
  const parts = line.split("\t");
  if (parts.length < 5) {
    return null;
  }

  const file = parts[0].trim();
  const lineNumber = Number.parseInt(parts[1], 10);
  const columnNumber = Number.parseInt(parts[2], 10);
  const severity = parts[3].trim();
  const message = parts.slice(4).join("\t").trim();

  if (!file || Number.isNaN(lineNumber)) {
    return null;
  }

  return {
    location: {
      filePath: normalizePath(file),
      line: Math.max(lineNumber - 1, 0),
      column: Number.isNaN(columnNumber) ? 0 : Math.max(columnNumber - 1, 0),
    },
    severity: toSeverity(severity),
    message: message || "sac2c reported a diagnostic",
  };
}

function parseFallbackLine(line: string): CoreParsedDiagnostic | null {
  const fallbackRegex = /^(.*?):(\d+)(?::(\d+))?(?::\s*(warning|error|fatal|note|info))?\s*:?\s*(.*)$/i;
  const match = line.match(fallbackRegex);
  if (!match) {
    return null;
  }

  const file = match[1].trim();
  const lineNumber = Number.parseInt(match[2], 10);
  const columnNumber = Number.parseInt(match[3] || "1", 10);
  const severity = match[4] || "error";
  const message = (match[5] || "").trim();

  if (!file || Number.isNaN(lineNumber)) {
    return null;
  }

  return {
    location: {
      filePath: normalizePath(file),
      line: Math.max(lineNumber - 1, 0),
      column: Number.isNaN(columnNumber) ? 0 : Math.max(columnNumber - 1, 0),
    },
    severity: toSeverity(severity),
    message: message || "sac2c reported a diagnostic",
  };
}

function parseDiagnosticLine(line: string): CoreParsedDiagnostic | null {
  return parseTabSeparatedLine(line) || parseFallbackLine(line);
}

function shouldIgnoreMessage(message: string): boolean {
  const text = message.trim();
  if (text.length === 0) {
    return true;
  }

  return NOISY_MESSAGE_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Parses sac2c output into normalized diagnostics without editor-specific types.
 */
export function parseSacCompilerOutput(stdout: string, stderr: string): CoreParsedDiagnostic[] {
  const lines = `${stdout || ""}\n${stderr || ""}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed: CoreParsedDiagnostic[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const diagnostic = parseDiagnosticLine(line);
    if (!diagnostic || shouldIgnoreMessage(diagnostic.message)) {
      continue;
    }

    const key = `${diagnostic.location.filePath}:${diagnostic.location.line}:${diagnostic.location.column}:${diagnostic.severity}:${diagnostic.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      parsed.push(diagnostic);
    }
  }

  return parsed;
}
