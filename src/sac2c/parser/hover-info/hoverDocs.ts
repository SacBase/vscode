import {
  appendBuiltinLegend,
  appendStdlibTypeVariableNote,
  formatHoverDocumentationMarkdown,
} from "$sac2c/parser/hover-info/hoverDocFormatting";
import { lookupHoverDocumentation } from "$sac2c/parser/hover-info/hoverDocLookup";
import type { HoverTarget } from "$sac2c/parser/hover-info/types";
export { formatHoverDocumentationMarkdown, HoverFormattingOptions } from "$sac2c/parser/hover-info/hoverDocFormatting";

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
