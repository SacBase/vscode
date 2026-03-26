import { existsSync } from "fs";
import { pathToFileURL } from "url";
import {
  DiagnosticRelatedInformation,
  Location,
  Position,
} from "vscode-languageserver/node";

import { ParsedDiagnostic } from "./types";

/**
 * Converts parsed diagnostics into LSP related-information entries.
 */
export function buildRelatedInformation(entries: ParsedDiagnostic[]): DiagnosticRelatedInformation[] {
  const related: DiagnosticRelatedInformation[] = [];

  for (const entry of entries) {
    if (!entry.file || !existsSync(entry.file)) {
      continue;
    }

    const uri = pathToFileURL(entry.file).toString();
    const start: Position = {
      line: entry.line,
      character: Math.max(entry.column, 0),
    };

    const location: Location = {
      uri,
      range: {
        start,
        end: {
          line: start.line,
          character: entry.endColumn !== undefined
            ? Math.max(entry.endColumn, start.character + 1)
            : start.character + 1,
        },
      },
    };

    related.push({
      location,
      message: entry.message,
    });
  }

  return related;
}
