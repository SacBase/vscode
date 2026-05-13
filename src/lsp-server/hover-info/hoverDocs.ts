import type { HoverTarget } from "$sac2c/parser/hover-info/types";
import { appendBuiltinLegend, appendStdlibTypeVariableNote, formatHoverDocumentationMarkdown } from "$lsp-server/hover-info/hoverDocFormatting";
import { lookupHoverDocumentation } from "$lsp-server/hover-info/hoverDocLookup";
export { formatHoverDocumentationMarkdown, HoverFormattingOptions } from "$lsp-server/hover-info/hoverDocFormatting";

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