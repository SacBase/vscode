import { CoreDiagnosticGroup, CoreParsedDiagnostic } from "./types";

function isContextFrame(message: string): boolean {
  return /^--\s+in\s+/i.test(message.trim());
}

/**
 * Groups ordered diagnostics into cause chains.
 */
export function groupCoreDiagnostics(parsed: CoreParsedDiagnostic[]): CoreDiagnosticGroup[] {
  const groups: CoreDiagnosticGroup[] = [];
  let currentGroup: CoreDiagnosticGroup | null = null;

  for (const diagnostic of parsed) {
    if (!isContextFrame(diagnostic.message)) {
      currentGroup = { primary: diagnostic, frames: [] };
      groups.push(currentGroup);
      continue;
    }

    if (!currentGroup) {
      // I keep orphan frames instead of dropping potentially useful context.
      currentGroup = { primary: diagnostic, frames: [] };
      groups.push(currentGroup);
      continue;
    }

    currentGroup.frames.push(diagnostic);
  }

  return groups;
}
