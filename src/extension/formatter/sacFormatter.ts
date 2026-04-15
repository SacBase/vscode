import { mergeGuardExpressionContinuations, mergeGuardLogicalContinuations, splitFunctionInlineGuards, splitGuardChain } from "./guards";
import { expandInlineComprehension, normalizeTensorComprehensions } from "./tensor";
import { countBraceDelta, countLeadingClosers, isLineComment, normalizeGuardPrefix, normalizeLineCommentSpacing } from "./text";
import { DEFAULT_OPTIONS, SacFormattingOptions } from "./types";
import { expandInlineWithLoop } from "./withLoop";

/**
 * Applies all pre-indentation transforms.
 *
 * @param input Raw source text.
 * @param options Formatter options.
 * @returns Preprocessed line array for final indentation pass.
 */
function preExpand(input: string, options: SacFormattingOptions): string[] {
  const sourceLines = input.replace(/\r\n/g, "\n").split("\n");
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
  // Preserve EOF newline shape exactly as input (0/1/many).
  const trailingSegment = source.match(/(?:\r?\n)+$/)?.[0] ?? "";
  const trailingNewlineCount = trailingSegment.length === 0
    ? 0
    : trailingSegment.replace(/\r/g, "").length;

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
      formatted.push(normalized.replace(/[ \t]+$/g, ""));
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
        const body = content.replace(/^\*+\s?/, "").trim();
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
      formatted.push(`${" ".repeat(withColumn)}${content}`.replace(/[ \t]+$/g, ""));
      withColumnStack.pop();
    } else if (withColumnStack.length > 0 && content.startsWith("(")) {
      const withColumn = withColumnStack[withColumnStack.length - 1];
      formatted.push(`${" ".repeat(withColumn + 2)}${content}`.replace(/[ \t]+$/g, ""));
    } else {
      const normalized = `${" ".repeat(options.indentSize * baseIndent)}${content}`;
      formatted.push(normalized.replace(/[ \t]+$/g, ""));
    }

    if (/^[A-Za-z_][\w\[\]\s,:*<>]*\([^;{}]*\)\s*$/.test(content)
      && !/^(if|for|while|switch|return)\b/.test(content)) {
      guardIndentHint = baseIndent + 1;
    }

    if (!(content.startsWith("|") || content.startsWith(","))) {
      if (content.startsWith("{") || content.endsWith(";") || content.startsWith("return ")) {
        guardIndentHint = null;
      }
    }

    indentLevel = Math.max(0, indentLevel + countBraceDelta(content));
  }

  const output = formatted.join("\n").replace(/\n+$/g, "");
  return `${output}${"\n".repeat(trailingNewlineCount)}`;
}
