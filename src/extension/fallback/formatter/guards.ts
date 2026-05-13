import { SAC_NON_FUNCTION_HEADER_KEYWORDS } from "$constants/language";
import {
  CONTROL_FLOW_KEYWORD_PATTERN,
  CONTROL_OR_RETURN_HEADER_PATTERN,
  FUNCTION_HEADER_CANDIDATE_PATTERN,
  FUNCTION_SIGNATURE_TRAILING_PAREN_PATTERN,
  INLINE_GUARD_SPLIT_PATTERN,
  PIPE_LOGICAL_CONTINUATION_PATTERN,
  PIPE_LOGICAL_PREFIX_PATTERN,
  RETURN_STATEMENT_START_PATTERN,
} from "$constants/regex";
import { delimiterBalance, splitTopLevel } from "./text";

// Helper: checks if text is exactly the keyword or starts with "keyword ".
function startsWithKeyword(trimmed: string, keyword: string): boolean {
  return trimmed === keyword || trimmed.startsWith(`${keyword} `);
}

// Helper: detects if line looks like a function signature (not a control flow statement).
function isLikelyFunctionHeader(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return false;
  }

  // Exclude return/if/while/for keywords.
  if (SAC_NON_FUNCTION_HEADER_KEYWORDS.some((keyword) => startsWithKeyword(trimmed, keyword))) {
    return false;
  }

  // Exclude lines that contain body markers or ternary operators.
  if (trimmed.includes("{") || trimmed.includes(";") || trimmed.includes("?")) {
    return false;
  }

  // Check if line has trailing paren (function signature pattern).
  return FUNCTION_SIGNATURE_TRAILING_PAREN_PATTERN.test(trimmed);
}

/**
 * Splits inline function guards to canonical multiline guard form.
 *
 * @param line Source line.
 * @returns One or more normalized guard lines.
 */
export function splitFunctionInlineGuards(line: string): string[] {
  const match = line.match(INLINE_GUARD_SPLIT_PATTERN);
  if (!match) {
    return [line];
  }

  const signature = match[1].trim();
  const guardPart = match[2].trim();
  if (!isLikelyFunctionHeader(signature) || CONTROL_FLOW_KEYWORD_PATTERN.test(signature)) {
    return [line];
  }

  const guards = splitTopLevel(guardPart, ",");
  if (guards.length === 0) {
    return [signature];
  }

  const result = [signature, `| ${guards[0]}`];
  for (let index = 1; index < guards.length; index += 1) {
    result.push(`, ${guards[index]}`);
  }

  return result;
}

/**
 * Splits comma-separated guard chains at top level only.
 *
 * @param line Guard line.
 * @returns Guard lines with one condition per line.
 */
export function splitGuardChain(line: string): string[] {
  const trimmed = line.trim();
  if (!(trimmed.startsWith("|") || trimmed.startsWith(","))) {
    return [line];
  }

  const marker = trimmed[0];
  const payload = trimmed.slice(1).trim();
  if (payload.length === 0) {
    return [marker];
  }

  const chunks = splitTopLevel(payload, ",");
  if (chunks.length <= 1) {
    return [`${marker} ${payload}`];
  }

  const output = [`${marker} ${chunks[0]}`];
  for (let index = 1; index < chunks.length; index += 1) {
    output.push(`, ${chunks[index]}`);
  }
  return output;
}

/**
 * Merges guard continuation lines starting with logical operators.
 *
 * @param lines Candidate lines.
 * @returns Lines with merged logical continuations.
 */
export function mergeGuardLogicalContinuations(lines: string[]): string[] {
  const merged: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isPipeContinuation = PIPE_LOGICAL_CONTINUATION_PATTERN.test(trimmed);
    // Check if line starts with `||`, `&&`, or a pipe-based logical operator.
    const isLogicalContinuation = trimmed.startsWith("||") || trimmed.startsWith("&&") || isPipeContinuation;

    // If not a continuation line or no previous line to merge into, keep as-is.
    if (!isLogicalContinuation || merged.length === 0) {
      merged.push(line);
      continue;
    }

    const previous = merged[merged.length - 1].trim();
    // Only merge if previous line is also a guard line (starts with guard marker).
    const previousIsGuard = previous.startsWith("|") || previous.startsWith(",") || previous.startsWith("||") || previous.startsWith("&&");
    if (!previousIsGuard) {
      merged.push(line);
      continue;
    }

    // Append logical continuation to previous guard line.
    const continuation = isPipeContinuation ? `|| ${trimmed.replace(PIPE_LOGICAL_PREFIX_PATTERN, "")}` : trimmed;
    merged[merged.length - 1] = `${previous} ${continuation}`;
  }

  return merged;
}

/**
 * Merges comma-start guard lines when previous expression remains open.
 *
 * @param lines Candidate lines.
 * @returns Lines with merged expression continuations.
 */
export function mergeGuardExpressionContinuations(lines: string[]): string[] {
  const merged: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Check if line is a comma continuation (starts with `,`).
    const isCommaLine = trimmed.startsWith(", ") || trimmed === ",";

    // If not a continuation or no previous line, keep as-is.
    if (!isCommaLine || merged.length === 0) {
      merged.push(line);
      continue;
    }

    const previous = merged[merged.length - 1].trim();
    // Only merge if previous line is a guard line.
    const previousIsGuard = previous.startsWith("|") || previous.startsWith(",") || previous.startsWith("||") || previous.startsWith("&&");
    if (!previousIsGuard) {
      merged.push(line);
      continue;
    }

    // If previous guard has open delimiters (unclosed parens/brackets/braces), merge the comma line.
    if (delimiterBalance(previous) > 0) {
      merged[merged.length - 1] = `${previous}${trimmed}`;
      continue;
    }

    // Otherwise keep comma line separate.
    merged.push(line);
  }

  return merged;
}

/**
 * Resolves indentation for guard lines (`|`, `,`) using current hint.
 *
 * @param content Current line content.
 * @param effectiveIndent Effective non-closer indent level.
 * @param guardIndentHint Active guard hint.
 * @returns Base indent level for current line.
 */
export function resolveGuardBaseIndent(content: string, effectiveIndent: number, guardIndentHint: number | null): number {
  if (content.startsWith("|") || content.startsWith(",")) {
    return guardIndentHint ?? Math.max(1, effectiveIndent + 1);
  }

  return effectiveIndent;
}

/**
 * Updates guard indent hint based on current line shape.
 *
 * @param content Current line content.
 * @param baseIndent Computed base indent for line.
 * @param currentHint Existing hint.
 * @returns Next guard indent hint.
 */
export function nextGuardIndentHint(content: string, baseIndent: number, currentHint: number | null): number | null {
  if (FUNCTION_HEADER_CANDIDATE_PATTERN.test(content) && !CONTROL_OR_RETURN_HEADER_PATTERN.test(content)) {
    return baseIndent + 1;
  }

  if (!(content.startsWith("|") || content.startsWith(","))) {
    if (content.startsWith("{") || content.endsWith(";") || RETURN_STATEMENT_START_PATTERN.test(content)) {
      return null;
    }
  }

  return currentHint;
}
