import {
  DOC_BLOCK_ASTERISK_PREFIX_PATTERN,
  TRAILING_WHITESPACE_PATTERN,
} from "$constants/regex";
import {
  nextGuardIndentHint,
  resolveGuardBaseIndent,
} from "$extension/formatter/guards";
import { preExpandSacLines } from "$extension/formatter/preprocess";
import {
  countBraceDelta,
  countLeadingClosers,
  isLineComment,
  normalizeGuardPrefix,
  normalizeLineCommentSpacing,
} from "$extension/formatter/text";
import { DEFAULT_OPTIONS, type SacFormattingOptions } from "$extension/formatter/types";
import { formatWithLoopAlignedLine, registerWithLoopColumn } from "$extension/formatter/withLoop";
import { preserveTrailingNewlines, trimTrailingNewlines } from "$util/newlines";

/**
 * Formats SaC source using lightweight syntax-aware heuristics.
 *
 * @param source Raw source text.
 * @param userOptions Partial formatter overrides.
 * @returns Formatted source while preserving trailing newline count.
 */
export function formatSacSource(source: string, userOptions: Partial<SacFormattingOptions> = {}): string {
  const options: SacFormattingOptions = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };
  const lines = preExpandSacLines(source, options);
  const formatted: string[] = [];
  let indentLevel = 0;
  let guardIndentHint: number | null = null;
  let inDocBlock = false;
  let docIndentBase = 0;
  const withColumnStack: number[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.length === 0) {
      formatted.push("");
      continue;
    }

    if (isLineComment(trimmed)) {
      const normalizedComment = normalizeLineCommentSpacing(trimmed);
      const normalized = `${" ".repeat(options.indentSize * indentLevel)}${normalizedComment}`;
      formatted.push(normalized.replace(TRAILING_WHITESPACE_PATTERN, ""));
      continue;
    }

    const leadingClosers = countLeadingClosers(trimmed);
    const effectiveIndent = Math.max(0, indentLevel - leadingClosers);

    let content = trimmed;
    if (options.normalizeGuards) {
      content = normalizeGuardPrefix(content);
    }

    if (inDocBlock) {
      if (content.startsWith("*/")) {
        formatted.push(`${" ".repeat(docIndentBase * options.indentSize + 1)}*/`);
        inDocBlock = false;
      } else {
        const body = content.replace(DOC_BLOCK_ASTERISK_PREFIX_PATTERN, "").trim();
        formatted.push(`${" ".repeat(docIndentBase * options.indentSize + 1)}*${body.length > 0 ? ` ${body}` : ""}`);
      }
      continue;
    }

    if (content.startsWith("/**")) {
      docIndentBase = effectiveIndent;
      formatted.push(`${" ".repeat(docIndentBase * options.indentSize)}/**`);
      inDocBlock = !content.endsWith("*/");
      continue;
    }

    const baseIndent = resolveGuardBaseIndent(content, effectiveIndent, guardIndentHint);

    registerWithLoopColumn(content, baseIndent, options.indentSize, withColumnStack);

    const withAligned = formatWithLoopAlignedLine(content, withColumnStack, TRAILING_WHITESPACE_PATTERN);
    if (withAligned !== null) {
      formatted.push(withAligned);
    } else {
      const normalized = `${" ".repeat(options.indentSize * baseIndent)}${content}`;
      formatted.push(normalized.replace(TRAILING_WHITESPACE_PATTERN, ""));
    }

    guardIndentHint = nextGuardIndentHint(content, baseIndent, guardIndentHint);

    indentLevel = Math.max(0, indentLevel + countBraceDelta(content));
  }

  const output = trimTrailingNewlines(formatted.join("\n"));
  return preserveTrailingNewlines(output, source);
}
