import { DiagnosticSeverity } from "vscode-languageserver/node";

import {
  CoreDiagnosticGroup,
  CoreDiagnosticSeverity,
  CoreDiagnosticsPresentationSettings,
  CoreParsedDiagnostic,
  CoreRenderedDiagnostic,
  groupCoreDiagnostics,
  parseSacCompilerOutput,
  renderCoreDiagnostics,
} from "../../core/diagnostics";
import {
  DiagnosticGroup,
  DiagnosticsPresentationSettings,
  ParsedDiagnostic,
  RenderedDiagnostic,
} from "./types";

function toLspSeverity(severity: CoreDiagnosticSeverity): DiagnosticSeverity {
  if (severity === "warning") {
    return DiagnosticSeverity.Warning;
  }
  if (severity === "information") {
    return DiagnosticSeverity.Information;
  }
  if (severity === "hint") {
    return DiagnosticSeverity.Hint;
  }
  return DiagnosticSeverity.Error;
}

function toCoreSeverity(severity: DiagnosticSeverity): CoreDiagnosticSeverity {
  if (severity === DiagnosticSeverity.Warning) {
    return "warning";
  }
  if (severity === DiagnosticSeverity.Information) {
    return "information";
  }
  if (severity === DiagnosticSeverity.Hint) {
    return "hint";
  }
  return "error";
}

export function toCoreParsedDiagnostic(entry: ParsedDiagnostic): CoreParsedDiagnostic {
  return {
    location: {
      filePath: entry.file,
      line: entry.line,
      column: entry.column,
    },
    severity: toCoreSeverity(entry.severity),
    message: entry.message,
  };
}

export function fromCoreParsedDiagnostic(entry: CoreParsedDiagnostic): ParsedDiagnostic {
  return {
    file: entry.location.filePath,
    line: entry.location.line,
    column: entry.location.column,
    severity: toLspSeverity(entry.severity),
    message: entry.message,
  };
}

export function toCoreGroups(groups: DiagnosticGroup[]): CoreDiagnosticGroup[] {
  return groups.map((group) => ({
    primary: toCoreParsedDiagnostic(group.primary),
    frames: group.frames.map(toCoreParsedDiagnostic),
  }));
}

export function fromCoreGroups(groups: CoreDiagnosticGroup[]): DiagnosticGroup[] {
  return groups.map((group) => ({
    primary: fromCoreParsedDiagnostic(group.primary),
    frames: group.frames.map(fromCoreParsedDiagnostic),
  }));
}

export function fromCoreRendered(entries: CoreRenderedDiagnostic[]): RenderedDiagnostic[] {
  return entries.map((entry) => ({
    anchor: fromCoreParsedDiagnostic(entry.anchor),
    message: entry.message,
    related: entry.related.map(fromCoreParsedDiagnostic),
  }));
}

export function toCoreRendered(entries: RenderedDiagnostic[]): CoreRenderedDiagnostic[] {
  return entries.map((entry) => ({
    anchor: toCoreParsedDiagnostic(entry.anchor),
    message: entry.message,
    related: entry.related.map(toCoreParsedDiagnostic),
  }));
}

/**
 * Parses compiler output through the editor-agnostic diagnostics core.
 */
export function parseCompilerOutput(stdout: string, stderr: string): ParsedDiagnostic[] {
  return parseSacCompilerOutput(stdout, stderr).map(fromCoreParsedDiagnostic);
}

/**
 * Groups diagnostics using the editor-agnostic diagnostics core.
 */
export function groupDiagnostics(parsed: ParsedDiagnostic[]): DiagnosticGroup[] {
  const coreGroups = groupCoreDiagnostics(parsed.map(toCoreParsedDiagnostic));
  return fromCoreGroups(coreGroups);
}

/**
 * Renders diagnostics using core presentation and applies server toggles.
 */
export function presentDiagnostics(
  parsed: ParsedDiagnostic[],
  groups: DiagnosticGroup[],
  requestedFilePath: string,
  settings: DiagnosticsPresentationSettings,
): RenderedDiagnostic[] {
  const coreSettings: CoreDiagnosticsPresentationSettings = {
    presentation: settings.presentation,
    includeStackInMessage: settings.includeStackInMessage,
    maxStackFrames: settings.maxStackFrames,
  };

  const rendered = renderCoreDiagnostics(
    parsed.map(toCoreParsedDiagnostic),
    toCoreGroups(groups),
    requestedFilePath,
    coreSettings,
  );

  const serverRendered = fromCoreRendered(rendered);
  if (!settings.includeRelatedInformation) {
    return serverRendered.map((entry) => ({
      ...entry,
      related: [],
    }));
  }

  return serverRendered;
}
