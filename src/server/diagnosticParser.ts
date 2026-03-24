import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node";

export interface ParsedDiagnostic {
  file: string;
  line: number;
  column: number;
  severity: DiagnosticSeverity;
  message: string;
}

/**
 * Converts textual severity labels produced by sac2c into LSP severities.
 *
 * @param level Raw severity text such as error, warning, note, or hint.
 * @returns The mapped LSP diagnostic severity.
 */
function toDiagnosticSeverity(level: string | undefined): DiagnosticSeverity {
  const normalized = (level || "error").toLowerCase();
  if (normalized.includes("warn")) {
    return DiagnosticSeverity.Warning;
  }
  if (normalized.includes("note") || normalized.includes("info")) {
    return DiagnosticSeverity.Information;
  }
  if (normalized.includes("hint")) {
    return DiagnosticSeverity.Hint;
  }
  return DiagnosticSeverity.Error;
}

/**
 * Normalizes path separators to forward slashes for consistent downstream matching.
 *
 * @param value Raw path from compiler output.
 * @returns Path with normalized separators.
 */
function normalizePath(value: string): string {
  return value.replace(/\\\\/g, "/");
}

/**
 * Parses diagnostics from a tab-separated format.
 *
 * !NOTE: This is kept for compatibility with older or customized output setups.
 *
 * @param line A single compiler output line.
 * @returns Parsed diagnostic when matched, otherwise null.
 */
function parseTabSeparatedLine(line: string): ParsedDiagnostic | null {
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
    file: normalizePath(file),
    line: Math.max(lineNumber - 1, 0),
    column: Number.isNaN(columnNumber) ? 0 : Math.max(columnNumber - 1, 0),
    severity: toDiagnosticSeverity(severity),
    message: message || "sac2c reported a diagnostic",
  };
}

/**
 * Parses GNU-like diagnostics in the form path:line:column: severity: message.
 *
 * !IMPORTANT: This path is the primary parser for current CTI-based defaults.
 * ?TODO: Extend parser support for multi-location diagnostics if sac2c emits
 *        additional location payloads in future releases.
 *
 * @param line A single compiler output line.
 * @returns Parsed diagnostic when matched, otherwise null.
 */
function parseFallbackLine(line: string): ParsedDiagnostic | null {
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
    file: normalizePath(file),
    line: Math.max(lineNumber - 1, 0),
    column: Number.isNaN(columnNumber) ? 0 : Math.max(columnNumber - 1, 0),
    severity: toDiagnosticSeverity(severity),
    message: message || "sac2c reported a diagnostic",
  };
}

/**
 * Attempts all known single-line parser variants in priority order.
 *
 * @param line A single compiler output line.
 * @returns Parsed diagnostic when one parser matches, otherwise null.
 */
function parseDiagnosticLine(line: string): ParsedDiagnostic | null {
  return parseTabSeparatedLine(line) || parseFallbackLine(line);
}

/**
 * Converts internal parsed diagnostics into the LSP diagnostic structure.
 *
 * @param parsed Parsed diagnostic payload.
 * @returns LSP diagnostic object ready for publication.
 */
export function toLspDiagnostic(parsed: ParsedDiagnostic): Diagnostic {
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
 * Parses compiler stdout/stderr streams into structured diagnostics.
 *
 * !NOTE: Non-matching lines are ignored intentionally to tolerate summary output
 *        (for example "Compilation failed ...").
 *
 * @param stdout Compiler standard output.
 * @param stderr Compiler standard error.
 * @returns Array of parsed diagnostics.
 */
export function parseCompilerOutput(stdout: string, stderr: string): ParsedDiagnostic[] {
  const lines = `${stdout || ""}\n${stderr || ""}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed: ParsedDiagnostic[] = [];
  for (const line of lines) {
    const diagnostic = parseDiagnosticLine(line);
    if (diagnostic) {
      parsed.push(diagnostic);
    }
  }

  return parsed;
}
