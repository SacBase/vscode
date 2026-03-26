import { DiagnosticSeverity } from "vscode-languageserver/node";

/**
 * Parsed single-line diagnostic emitted by sac2c.
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
 * Group of diagnostics that belong to one root-cause chain.
 *
 * The first non-context message is treated as the root cause and any following
 * context entries (for example "-- in ...") become stack-like frames.
 */
export interface DiagnosticGroup {
  primary: ParsedDiagnostic;
  frames: ParsedDiagnostic[];
}

/**
 * Presentation style for diagnostics shown in the editor.
 */
export type DiagnosticsPresentationMode = "expanded" | "smart" | "hybrid";

/**
 * Settings used to render grouped diagnostics for one open document.
 */
export interface DiagnosticsPresentationSettings {
  presentation: DiagnosticsPresentationMode;
  includeRelatedInformation: boolean;
  includeStackInMessage: boolean;
  maxStackFrames: number;
}

/**
 * Intermediate rendered diagnostic before converting to LSP structures.
 */
export interface RenderedDiagnostic {
  anchor: ParsedDiagnostic;
  message: string;
  related: ParsedDiagnostic[];
}
