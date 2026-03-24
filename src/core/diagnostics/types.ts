export type CoreDiagnosticSeverity = "error" | "warning" | "information" | "hint";

export interface CoreDiagnosticLocation {
  filePath: string;
  line: number;
  column: number;
}

/**
 * Normalized single-line diagnostic extracted from compiler output.
 */
export interface CoreParsedDiagnostic {
  location: CoreDiagnosticLocation;
  severity: CoreDiagnosticSeverity;
  message: string;
}

/**
 * Group of diagnostics interpreted as one root cause with context frames.
 */
export interface CoreDiagnosticGroup {
  primary: CoreParsedDiagnostic;
  frames: CoreParsedDiagnostic[];
}

export type CoreDiagnosticsPresentationMode = "expanded" | "smart" | "hybrid";

export interface CoreDiagnosticsPresentationSettings {
  presentation: CoreDiagnosticsPresentationMode;
  includeStackInMessage: boolean;
  maxStackFrames: number;
}

/**
 * Rendered result independent from any specific editor protocol.
 */
export interface CoreRenderedDiagnostic {
  anchor: CoreParsedDiagnostic;
  message: string;
  related: CoreParsedDiagnostic[];
}

/**
 * Canonical JSON payload for external adapters.
 */
export interface CoreDiagnosticsReportV1 {
  schemaVersion: "sac.diagnostics/v1";
  tool: "sac2c";
  diagnostics: CoreRenderedDiagnostic[];
}
