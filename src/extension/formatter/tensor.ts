import {
  INLINE_TENSOR_COMPREHENSION_PATTERN,
  TENSOR_ARROW_PATTERN,
  TENSOR_RETURN_BLOCK_END_PATTERN,
  TENSOR_RETURN_BLOCK_START_PATTERN,
} from "../../constants/regex";
import { findTopLevelGuardPipe, findTopLevelToken, splitTopLevel } from "./text";

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
  return text.replace(/\s*,\s*/g, ", ").trim();
}

/**
 * Parses one tensor comprehension clause.
 *
 * @param clause Clause text in `iv -> value | cond` shape.
 * @returns Parsed clause or null when parse fails.
 */
function parseTensorClause(clause: string): TensorComprehensionClause | null {
  const arrowIndex = findTopLevelToken(clause, "->");
  if (arrowIndex < 0) {
    return null;
  }

  const guardPipeIndex = findTopLevelGuardPipe(clause, arrowIndex + 2);
  if (guardPipeIndex < 0) {
    return null;
  }

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
  if (blockLines.length < 3) {
    return null;
  }

  const start = blockLines[0].trim();
  const end = blockLines[blockLines.length - 1].trim();
  if (!TENSOR_RETURN_BLOCK_START_PATTERN.test(start) || !TENSOR_RETURN_BLOCK_END_PATTERN.test(end)) {
    return null;
  }

  const innerLines = blockLines.slice(1, blockLines.length - 1).map((entry) => entry.trim());
  if (!innerLines.some((entry) => TENSOR_ARROW_PATTERN.test(entry))) {
    return null;
  }
  if (innerLines.some((entry) => entry.startsWith("//") || entry.includes("/*") || entry.includes("*/"))) {
    return null;
  }

  const rawInner = innerLines.join(" ").replace(/\s+/g, " ").trim();
  if (rawInner.length === 0) {
    return null;
  }

  const clauses = splitTopLevel(rawInner, ";").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  if (clauses.length === 0) {
    return null;
  }

  const parsedClauses: TensorComprehensionClause[] = [];
  for (const clause of clauses) {
    const parsed = parseTensorClause(clause);
    if (!parsed) {
      return null;
    }
    parsedClauses.push(parsed);
  }

  if (parsedClauses.length === 1) {
    const only = parsedClauses[0];
    return [`return { ${only.indexVector} -> ${only.valueExpr} | ${only.conditionExpr} };`];
  }

  const leftWidth = Math.max(...parsedClauses.map((entry) => entry.indexVector.length));
  const valueWidth = Math.max(...parsedClauses.map((entry) => entry.valueExpr.length));
  const output = ["return {"];

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
    if (current !== "return {") {
      output.push(lines[index]);
      continue;
    }

    let endIndex = index + 1;
    while (endIndex < lines.length && lines[endIndex].trim() !== "};") {
      endIndex += 1;
    }

    if (endIndex >= lines.length) {
      output.push(lines[index]);
      continue;
    }

    const block = lines.slice(index, endIndex + 1);
    const normalized = normalizeTensorComprehensionBlock(block);
    if (!normalized) {
      output.push(...block);
    } else {
      output.push(...normalized);
    }

    index = endIndex;
  }

  return output;
}
