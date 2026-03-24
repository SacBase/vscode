import { Diagnostic } from "vscode-languageserver/node";

import { parseCompilerOutput as parseCompilerOutputInternal } from "./diagnostics/adapter";
import { ParsedDiagnostic } from "./diagnostics/types";

export type { ParsedDiagnostic };

/**
 * Compatibility helper kept while server-side diagnostics code is modularized.
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
 * Compatibility re-export for parser behavior.
 */
export function parseCompilerOutput(stdout: string, stderr: string): ParsedDiagnostic[] {
  return parseCompilerOutputInternal(stdout, stderr);
}
