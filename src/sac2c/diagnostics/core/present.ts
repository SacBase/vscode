import {
  CoreDiagnosticGroup,
  CoreDiagnosticsPresentationMode,
  CoreDiagnosticsPresentationSettings,
  CoreParsedDiagnostic,
  CoreRenderedDiagnostic,
} from "./types";

function formatLocationLabel(diagnostic: CoreParsedDiagnostic): string {
  const fileName = diagnostic.location.filePath.split("/").filter(Boolean).pop() || diagnostic.location.filePath;
  return `${fileName}:${diagnostic.location.line + 1}`;
}

function getLocalFrames(group: CoreDiagnosticGroup, normalizedDocumentPath: string): CoreParsedDiagnostic[] {
  return group.frames.filter((entry) => entry.location.filePath === normalizedDocumentPath);
}

function pickAnchor(group: CoreDiagnosticGroup, normalizedDocumentPath: string): CoreParsedDiagnostic | null {
  const localFrames = getLocalFrames(group, normalizedDocumentPath);
  if (localFrames.length > 0) {
    return localFrames[localFrames.length - 1];
  }

  if (group.primary.location.filePath === normalizedDocumentPath) {
    return group.primary;
  }

  return null;
}

function buildSmartMessage(
  group: CoreDiagnosticGroup,
  anchor: CoreParsedDiagnostic,
  settings: CoreDiagnosticsPresentationSettings,
): string {
  const lines: string[] = [group.primary.message];

  if (settings.includeStackInMessage) {
    lines.push(`Origin: ${formatLocationLabel(group.primary)}`);

    const localFrames = group.frames.filter((entry) => entry.location.filePath === anchor.location.filePath);
    const limited = localFrames.slice(-Math.max(settings.maxStackFrames, 0));
    if (limited.length > 0) {
      const via = limited.map((entry) => formatLocationLabel(entry)).join(" -> ");
      lines.push(`Via: ${via}`);
    }
  }

  return lines.join("\n");
}

function isWrapperMessage(message: string): boolean {
  return /all\s+instances\s+of\s+"[^"]+"\s+contain\s+type\s+errors/i.test(message);
}

function renderExpanded(parsed: CoreParsedDiagnostic[], normalizedDocumentPath: string): CoreRenderedDiagnostic[] {
  return parsed
    .filter((entry) => entry.location.filePath === normalizedDocumentPath)
    .map((entry) => ({
      anchor: entry,
      message: entry.message,
      related: [],
    }));
}

function renderSmartLike(
  groups: CoreDiagnosticGroup[],
  normalizedDocumentPath: string,
  settings: CoreDiagnosticsPresentationSettings,
  mode: CoreDiagnosticsPresentationMode,
): CoreRenderedDiagnostic[] {
  const rendered: CoreRenderedDiagnostic[] = [];

  for (const group of groups) {
    const anchor = pickAnchor(group, normalizedDocumentPath);
    if (!anchor) {
      continue;
    }

    if (isWrapperMessage(group.primary.message) && group.frames.length === 0) {
      continue;
    }

    const related: CoreParsedDiagnostic[] = [];
    if (group.primary.location.filePath !== anchor.location.filePath
      || group.primary.location.line !== anchor.location.line
      || group.primary.message !== anchor.message
    ) {
      related.push(group.primary);
    }

    const limitedFrames = group.frames.slice(-Math.max(settings.maxStackFrames, 0));
    for (const frame of limitedFrames) {
      if (frame.location.filePath === anchor.location.filePath
        && frame.location.line === anchor.location.line
        && frame.message === anchor.message
      ) {
        continue;
      }
      related.push(frame);
    }

    rendered.push({
      anchor,
      message: buildSmartMessage(group, anchor, settings),
      related,
    });

    if (mode === "hybrid") {
      const localFrames = getLocalFrames(group, normalizedDocumentPath);
      for (const frame of localFrames.slice(0, Math.max(localFrames.length - 1, 0))) {
        rendered.push({
          anchor: frame,
          message: frame.message,
          related: [group.primary],
        });
      }
    }
  }

  return rendered;
}

/**
 * Converts grouped diagnostics to editor-agnostic rendered diagnostics.
 */
export function renderCoreDiagnostics(
  parsed: CoreParsedDiagnostic[],
  groups: CoreDiagnosticGroup[],
  normalizedDocumentPath: string,
  settings: CoreDiagnosticsPresentationSettings,
): CoreRenderedDiagnostic[] {
  if (settings.presentation === "expanded") {
    return renderExpanded(parsed, normalizedDocumentPath);
  }

  return renderSmartLike(groups, normalizedDocumentPath, settings, settings.presentation);
}
