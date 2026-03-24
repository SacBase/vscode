import {
  buildCoreDiagnosticsReport,
  toSarifLog,
} from "../../core/diagnostics";
import { toCoreRendered } from "./adapter";
import { RenderedDiagnostic } from "./types";

/**
 * Builds the canonical diagnostics JSON report for external adapters.
 */
export function buildDiagnosticsJsonReport(rendered: RenderedDiagnostic[]): string {
  const report = buildCoreDiagnosticsReport(toCoreRendered(rendered));
  return JSON.stringify(report, null, 2);
}

/**
 * Builds a SARIF JSON log for tooling that already supports SARIF.
 */
export function buildDiagnosticsSarifReport(rendered: RenderedDiagnostic[]): string {
  const report = buildCoreDiagnosticsReport(toCoreRendered(rendered));
  return JSON.stringify(toSarifLog(report), null, 2);
}
