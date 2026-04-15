import {
  CARRIAGE_RETURN_PATTERN,
  CRLF_PATTERN,
  TRAILING_NEWLINE_SEGMENT_PATTERN,
  TRAILING_NEWLINES_PATTERN,
} from "$constants/regex";

/**
 * Normalizes CRLF to LF for parser/formatter operations.
 */
export function normalizeLineEndings(text: string): string {
  return text.replace(CRLF_PATTERN, "\n");
}

/**
 * Splits text into LF-normalized line array.
 */
export function splitNormalizedLines(text: string): string[] {
  return normalizeLineEndings(text).split("\n");
}

/**
 * Counts trailing newlines after LF normalization.
 */
export function countTrailingNewlines(text: string): number {
  const segment = text.match(TRAILING_NEWLINE_SEGMENT_PATTERN)?.[0] ?? "";
  return segment.length === 0 ? 0 : segment.replace(CARRIAGE_RETURN_PATTERN, "").length;
}

/**
 * Trims trailing LF newline run from text body.
 */
export function trimTrailingNewlines(text: string): string {
  return text.replace(TRAILING_NEWLINES_PATTERN, "");
}

/**
 * Reapplies original trailing newline count to formatted body.
 */
export function preserveTrailingNewlines(formatted: string, original: string): string {
  return `${trimTrailingNewlines(formatted)}${"\n".repeat(countTrailingNewlines(original))}`;
}
