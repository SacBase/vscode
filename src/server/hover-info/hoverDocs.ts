import { HoverTarget } from "$sac2c/hover/types";
import { appendBuiltinLegend, appendStdlibTypeVariableNote, formatHoverDocumentationMarkdown } from "$server/hover-info/hoverDocFormatting";
import { lookupHoverDocumentation } from "$server/hover-info/hoverDocLookup";
export { formatHoverDocumentationMarkdown, HoverFormattingOptions } from "$server/hover-info/hoverDocFormatting";

/**
 * Resolves markdown hover content from docs/<kind>/<symbol>.md when available.
 * Builtins are resolved by family first (for example _add_SxS_ -> _add_.md).
 */
export function resolveHoverDocumentation(
  workspaceRoot: string,
  extensionInstallRoot: string,
  target: HoverTarget,
  documentUri: string,
): string | null {
  const markdown = lookupHoverDocumentation(workspaceRoot, extensionInstallRoot, target, documentUri);
  if (markdown === null) {
    return null;
  }

  const formatted = formatHoverDocumentationMarkdown(markdown);
  if (target.kind === "builtin") {
    return appendBuiltinLegend(formatted);
  }

  if (target.kind === "stdlib") {
    return appendStdlibTypeVariableNote(formatted);
  }

  return formatted;
}
