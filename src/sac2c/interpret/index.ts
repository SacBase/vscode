/**
 * Compiler output interpretation.
 * Feature-specific wiring (hover, navigation, LSP) lives outside this module.
 */

// Base types for compiler output
export interface CompilerDiagnostic {
  location: {
    file: string;
    line: number;
    column: number;
  };
  message: string;
  severity: "error" | "warning" | "info" | "note";
  code?: string;
  relatedInformation?: Array<{
    location: { file: string; line: number; column: number };
    message: string;
  }>;
}

// Symbol information from -symbols output
export interface SymbolInfo {
  name: string;
  kind: string; // "function", "variable", "type", etc.
  location: { file: string; line: number; column: number };
  definition?: { file: string; line: number; column: number };
  type?: string;
}

// Raw compiler output parsed into structured data
export interface ParsedCompilerOutput {
  diagnostics: CompilerDiagnostic[];
  symbols?: SymbolInfo[];
  exitCode: number;
}

export * from "./diagnostics";
export * from "./symbols";

