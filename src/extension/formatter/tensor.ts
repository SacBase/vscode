import {
  COMMA_SPACING_PATTERN,
  INLINE_TENSOR_COMPREHENSION_PATTERN,
  TENSOR_ARROW_PATTERN,
  TENSOR_RETURN_BLOCK_END_PATTERN,
  TENSOR_RETURN_BLOCK_START_PATTERN,
  WHITESPACE_RUN_PATTERN,
} from "$constants/regex";
import { findTopLevelGuardPipe, findTopLevelToken, splitTopLevel } from "$extension/formatter/text";

type TensorComprehensionClause = {
  indexVector: string;
  valueExpr: string;
  conditionExpr: string;
};

/**
 * Normalizes comma spacing inside expression snippets.
 *
 * @param text Expression.
 * @returns Expression with `, ` spacing.
 */
function normalizeCommaSpacing(text: string): string {
  return text.replace(COMMA_SPACING_PATTERN, ", ").trim();
}

/**
 * Parses one tensor comprehension clause.
 *
 * @param clause Clause text in `iv -> value | cond` shape.
 * @returns Parsed clause or null when parse fails.
 */
function parseTensorClause(clause: string): TensorComprehensionClause | null {
  // Find the arrow separator between index vector and value expression.
  const arrowIndex = findTopLevelToken(clause, "->");
  if (arrowIndex < 0) {
    return null;
  }

  // Find the guard pipe separator between value and condition.
  const guardPipeIndex = findTopLevelGuardPipe(clause, arrowIndex + 2);
  if (guardPipeIndex < 0) {
    return null;
  }

  // Extract and validate all three components.
  const indexVector = clause.slice(0, arrowIndex).trim();
  const valueExpr = normalizeCommaSpacing(clause.slice(arrowIndex + 2, guardPipeIndex));
  const conditionExpr = normalizeCommaSpacing(clause.slice(guardPipeIndex + 1));
  if (indexVector.length === 0 || valueExpr.length === 0 || conditionExpr.length === 0) {
    return null;
  }

  return { indexVector, valueExpr, conditionExpr };
}

/**
 * Collapses simple inline tensor comprehension into one-line canonical form.
 *
 * @param line Source line.
 * @returns Normalized one-line TC or original line.
 */
export function expandInlineComprehension(line: string): string[] {
  const match = line.match(INLINE_TENSOR_COMPREHENSION_PATTERN);
  if (!match) {
    return [line];
  }

  const indexVector = match[1].trim();
  const expression = match[2].trim();
  const guardSegment = match[3].trim();
  const guards = guardSegment
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  const guardChain = guards.join(", ");
  return [`return { ${indexVector} -> ${expression} | ${guardChain} };`];
}

/**
 * Normalizes full tensor comprehension block.
 *
 * @param blockLines Block lines from `return {` to `};`.
 * @returns Normalized block or null when block should stay untouched.
 */
function normalizeTensorComprehensionBlock(blockLines: string[]): string[] | null {
  // Need at least `return {`, one clause, and `};`.
  if (blockLines.length < 3) {
    return null;
  }

  const start = blockLines[0].trim();
  const end = blockLines[blockLines.length - 1].trim();
  // Validate block boundaries.
  if (!TENSOR_RETURN_BLOCK_START_PATTERN.test(start) || !TENSOR_RETURN_BLOCK_END_PATTERN.test(end)) {
    return null;
  }

  // Extract inner lines (between `return {` and `};`).
  const innerLines = blockLines.slice(1, blockLines.length - 1).map((entry) => entry.trim());
  // Must contain at least one tensor arrow pattern.
  if (!innerLines.some((entry) => TENSOR_ARROW_PATTERN.test(entry))) {
    return null;
  }
  // Skip blocks with embedded comments (they need preservation).
  if (innerLines.some((entry) => entry.startsWith("//") || entry.includes("/*") || entry.includes("*/"))) {
    return null;
  }

  // Merge inner lines into single expression, normalize whitespace.
  const rawInner = innerLines.join(" ").replace(WHITESPACE_RUN_PATTERN, " ").trim();
  if (rawInner.length === 0) {
    return null;
  }

  // Split by semicolons to get individual clauses.
  const clauses = splitTopLevel(rawInner, ";")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  if (clauses.length === 0) {
    return null;
  }

  // Parse each clause to validate structure.
  const parsedClauses: TensorComprehensionClause[] = [];
  for (const clause of clauses) {
    const parsed = parseTensorClause(clause);
    if (!parsed) {
      return null;
    }
    parsedClauses.push(parsed);
  }

  // If single clause, format as one-liner.
  if (parsedClauses.length === 1) {
    const only = parsedClauses[0];
    return [`return { ${only.indexVector} -> ${only.valueExpr} | ${only.conditionExpr} };`];
  }

  // Multiple clauses: compute alignment widths for readability.
  const leftWidth = Math.max(...parsedClauses.map((entry) => entry.indexVector.length));
  const valueWidth = Math.max(...parsedClauses.map((entry) => entry.valueExpr.length));
  const output = ["return {"];

  // Format each clause with aligned columns.
  parsedClauses.forEach((entry, index) => {
    const lhs = entry.indexVector.padEnd(leftWidth, " ");
    const rhs = entry.valueExpr.padEnd(valueWidth, " ");
    const suffix = index < parsedClauses.length - 1 ? ";" : "";
    output.push(`${lhs} -> ${rhs} | ${entry.conditionExpr}${suffix}`);
  });

  output.push("};");
  return output;
}

/**
 * Walks lines and normalizes detected tensor comprehension blocks.
 *
 * @param lines Pre-expanded lines.
 * @returns Lines with normalized TC blocks.
 */
export function normalizeTensorComprehensions(lines: string[]): string[] {
  const output: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index].trim();
    // Look for start of tensor comprehension block.
    if (current !== "return {") {
      output.push(lines[index]);
      continue;
    }

    // Scan forward to find the closing `};`.
    let endIndex = index + 1;
    while (endIndex < lines.length && lines[endIndex].trim() !== "};") {
      endIndex += 1;
    }

    // No closing found: keep lines as-is.
    if (endIndex >= lines.length) {
      output.push(lines[index]);
      continue;
    }

    // Extract block and try to normalize it.
    const block = lines.slice(index, endIndex + 1);
    const normalized = normalizeTensorComprehensionBlock(block);
    if (!normalized) {
      // Keep original block if normalization fails.
      output.push(...block);
    } else {
      // Use normalized version.
      output.push(...normalized);
    }

    // Skip past the processed block.
    index = endIndex;
  }

  return output;
}
