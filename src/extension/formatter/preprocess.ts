import {
  mergeGuardExpressionContinuations,
  mergeGuardLogicalContinuations,
  splitFunctionInlineGuards,
  splitGuardChain,
} from "$extension/formatter/guards";
import { expandInlineComprehension, normalizeTensorComprehensions } from "$extension/formatter/tensor";
import { isLineComment, normalizeLineCommentSpacing } from "$extension/formatter/text";
import { type SacFormattingOptions } from "$extension/formatter/types";
import { expandInlineWithLoop } from "$extension/formatter/withLoop";
import { splitNormalizedLines } from "$util/newlines";

/**
 * Applies all pre-indentation transforms.
 *
 * @param input Raw source text.
 * @param options Formatter options.
 * @returns Preprocessed line array for final indentation pass.
 */
export function preExpandSacLines(input: string, options: SacFormattingOptions): string[] {
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

    if (options.splitInlineGuards) {
      chunks = chunks.flatMap((chunk) => splitFunctionInlineGuards(chunk));
      chunks = chunks.flatMap((chunk) => splitGuardChain(chunk));
    }

    expanded.push(...chunks);
  }

  return normalizeTensorComprehensions(mergeGuardLogicalContinuations(mergeGuardExpressionContinuations(expanded)));
}