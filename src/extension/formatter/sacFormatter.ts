import {
  CONTROL_OR_RETURN_HEADER_PATTERN,
  DOC_BLOCK_ASTERISK_PREFIX_PATTERN,
  FUNCTION_HEADER_CANDIDATE_PATTERN,
  RETURN_STATEMENT_START_PATTERN,
  TRAILING_WHITESPACE_PATTERN,
} from "$constants/regex";
import { mergeGuardExpressionContinuations, mergeGuardLogicalContinuations, splitFunctionInlineGuards, splitGuardChain } from "$extension/formatter/guards";
import { expandInlineComprehension, normalizeTensorComprehensions } from "$extension/formatter/tensor";
import { countBraceDelta, countLeadingClosers, isLineComment, normalizeGuardPrefix, normalizeLineCommentSpacing } from "$extension/formatter/text";
import { DEFAULT_OPTIONS, SacFormattingOptions } from "$extension/formatter/types";
import { expandInlineWithLoop } from "$extension/formatter/withLoop";
import { preserveTrailingNewlines, splitNormalizedLines, trimTrailingNewlines } from "$util/newlines";

/**
 * Applies all pre-indentation transforms.
 *
 * @param input Raw source text.
 * @param options Formatter options.
 * @returns Preprocessed line array for final indentation pass.
 */
function preExpand(input: string, options: SacFormattingOptions): string[] {
  const sourceLines = splitNormalizedLines(input);
  const expanded: string[] = [];

  for (const line of sourceLines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      expanded.push("");
      continue;
    }

    if (isLineComment(trimmed)) {
      expanded.push(normalizeLineCommentSpacing(trimmed));
      continue;
    }

    let chunks = [trimmed];
    if (options.expandInlineWithLoops) {
      chunks = chunks.flatMap((chunk) => expandInlineWithLoop(chunk));
    }
    if (options.expandInlineComprehensions) {
      chunks = chunks.flatMap((chunk) => expandInlineComprehension(chunk));
    }

    chunks = chunks.flatMap((chunk) => splitFunctionInlineGuards(chunk));
    chunks = chunks.flatMap((chunk) => splitGuardChain(chunk));

    expanded.push(...chunks);
  }

  return normalizeTensorComprehensions(
    mergeGuardLogicalContinuations(
      mergeGuardExpressionContinuations(expanded),
    ),
  );
}

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
  const lines = preExpand(source, options);
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

    let baseIndent = effectiveIndent;
    if (content.startsWith("|") || content.startsWith(",")) {
      baseIndent = guardIndentHint ?? Math.max(1, effectiveIndent + 1);
    }

    if (content.includes("with {")) {
      const withIndex = content.indexOf("with");
      const absoluteWithColumn = baseIndent * options.indentSize + Math.max(0, withIndex);
      withColumnStack.push(absoluteWithColumn);
    }

    // Keep with-loop close arm aligned to original `with` column.
    if (withColumnStack.length > 0 && content.startsWith("} :")) {
      const withColumn = withColumnStack[withColumnStack.length - 1];
      formatted.push(`${" ".repeat(withColumn)}${content}`.replace(TRAILING_WHITESPACE_PATTERN, ""));
      withColumnStack.pop();
    } else if (withColumnStack.length > 0 && content.startsWith("(")) {
      const withColumn = withColumnStack[withColumnStack.length - 1];
      formatted.push(`${" ".repeat(withColumn + 2)}${content}`.replace(TRAILING_WHITESPACE_PATTERN, ""));
    } else {
      const normalized = `${" ".repeat(options.indentSize * baseIndent)}${content}`;
      formatted.push(normalized.replace(TRAILING_WHITESPACE_PATTERN, ""));
    }

    if (FUNCTION_HEADER_CANDIDATE_PATTERN.test(content)
      && !CONTROL_OR_RETURN_HEADER_PATTERN.test(content)) {
      guardIndentHint = baseIndent + 1;
    }

    if (!(content.startsWith("|") || content.startsWith(","))) {
      if (content.startsWith("{") || content.endsWith(";") || RETURN_STATEMENT_START_PATTERN.test(content)) {
        guardIndentHint = null;
      }
    }

    indentLevel = Math.max(0, indentLevel + countBraceDelta(content));
  }

  const output = trimTrailingNewlines(formatted.join("\n"));
  return preserveTrailingNewlines(output, source);
}
