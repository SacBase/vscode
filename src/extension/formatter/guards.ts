import { CONTROL_FLOW_KEYWORD_PATTERN } from "../../constants/regex";
import { delimiterBalance, splitTopLevel } from "./text";

function isLikelyFunctionHeader(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return false;
  }

  if (trimmed.startsWith("return ") || trimmed.startsWith("if ") || trimmed.startsWith("for ") || trimmed.startsWith("while ") || trimmed.startsWith("switch ")) {
    return false;
  }

  if (trimmed.includes("{") || trimmed.includes(";") || trimmed.includes("?")) {
    return false;
  }

  return /\([^;{}]*\)\s*$/.test(trimmed);
}

/**
 * Splits inline function guards to canonical multiline guard form.
 *
 * @param line Source line.
 * @returns One or more normalized guard lines.
 */
export function splitFunctionInlineGuards(line: string): string[] {
  const match = line.match(/^(.*\))\s*\|\s*(.+)$/);
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
    const isPipeContinuation = /^\|\s*\|/.test(trimmed);
    const isLogicalContinuation = trimmed.startsWith("||") || trimmed.startsWith("&&") || isPipeContinuation;

    if (!isLogicalContinuation || merged.length === 0) {
      merged.push(line);
      continue;
    }

    const previous = merged[merged.length - 1].trim();
    const previousIsGuard = previous.startsWith("|") || previous.startsWith(",") || previous.startsWith("||") || previous.startsWith("&&");
    if (!previousIsGuard) {
      merged.push(line);
      continue;
    }

    const continuation = isPipeContinuation ? `|| ${trimmed.replace(/^\|\s*\|\s*/, "")}` : trimmed;
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
    const isCommaLine = trimmed.startsWith(", ") || trimmed === ",";

    if (!isCommaLine || merged.length === 0) {
      merged.push(line);
      continue;
    }

    const previous = merged[merged.length - 1].trim();
    const previousIsGuard = previous.startsWith("|") || previous.startsWith(",") || previous.startsWith("||") || previous.startsWith("&&");
    if (!previousIsGuard) {
      merged.push(line);
      continue;
    }

    if (delimiterBalance(previous) > 0) {
      merged[merged.length - 1] = `${previous}${trimmed}`;
      continue;
    }

    merged.push(line);
  }

  return merged;
}
