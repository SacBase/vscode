import { CoreDiagnosticsReportV1, CoreRenderedDiagnostic } from "./types";

interface SarifRegion {
  startLine: number;
  startColumn: number;
}

interface SarifLocation {
  physicalLocation: {
    artifactLocation: {
      uri: string;
    };
    region: SarifRegion;
  };
}

interface SarifResult {
  level: "error" | "warning" | "note";
  message: { text: string };
  locations: SarifLocation[];
  relatedLocations?: Array<SarifLocation & { message: { text: string } }>;
}

interface SarifLog {
  version: "2.1.0";
  $schema: string;
  runs: Array<{
    tool: { driver: { name: string } };
    results: SarifResult[];
  }>;
}

function toSarifLevel(severity: string): "error" | "warning" | "note" {
  if (severity === "error") {
    return "error";
  }
  if (severity === "warning") {
    return "warning";
  }
  return "note";
}

function toSarifLocation(filePath: string, line: number, column: number): SarifLocation {
  return {
    physicalLocation: {
      artifactLocation: {
        uri: filePath,
      },
      region: {
        startLine: line + 1,
        startColumn: column + 1,
      },
    },
  };
}

/**
 * Creates a stable JSON report adapters can consume from any editor integration.
 */
export function buildCoreDiagnosticsReport(diagnostics: CoreRenderedDiagnostic[]): CoreDiagnosticsReportV1 {
  return {
    schemaVersion: "sac.diagnostics/v1",
    tool: "sac2c",
    diagnostics,
  };
}

/**
 * Converts the canonical report into a SARIF 2.1.0 log.
 */
export function toSarifLog(report: CoreDiagnosticsReportV1): SarifLog {
  return {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: report.tool,
          },
        },
        results: report.diagnostics.map((entry) => ({
          level: toSarifLevel(entry.anchor.severity),
          message: { text: entry.message },
          locations: [
            toSarifLocation(
              entry.anchor.location.filePath,
              entry.anchor.location.line,
              entry.anchor.location.column,
            ),
          ],
          relatedLocations: entry.related.length > 0
            ? entry.related.map((related) => ({
              ...toSarifLocation(
                related.location.filePath,
                related.location.line,
                related.location.column,
              ),
              message: { text: related.message },
            }))
            : undefined,
        })),
      },
    ],
  };
}
