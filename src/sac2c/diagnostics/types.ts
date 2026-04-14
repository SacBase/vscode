export type DiagnosticSeverity = "error" | "warning" | "information" | "hint";

export interface DiagnosticLocation {
  file: string;
  line: number;
  column: number;
  endColumn?: number;
}

/**
 * Normalized single-line diagnostic extracted from compiler output.
 */
export interface ParsedDiagnostic {
  file: string;
  line: number;
  column: number;
  endColumn?: number;
  severity: DiagnosticSeverity;
  message: string;
}

/**
 * Group of diagnostics interpreted as one root cause with context frames.
 */
export interface DiagnosticGroup {
  primary: ParsedDiagnostic;
  frames: ParsedDiagnostic[];
}

export type DiagnosticsPresentationMode = "expanded" | "smart" | "hybrid";

export interface DiagnosticsPresentationSettings {
  presentation: DiagnosticsPresentationMode;
  includeStackInMessage: boolean;
  maxStackFrames: number;
}

/**
 * Rendered result independent from any specific editor protocol.
 */
export interface RenderedDiagnostic {
  anchor: ParsedDiagnostic;
  message: string;
  related: ParsedDiagnostic[];
}
