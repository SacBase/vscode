/**
 * Runtime options for SaC source formatter.
 */
export interface SacFormattingOptions {
  indentSize: number;
  normalizeGuards: boolean;
  expandInlineWithLoops: boolean;
  expandInlineComprehensions: boolean;
}

export const DEFAULT_OPTIONS: SacFormattingOptions = {
  indentSize: 4,
  normalizeGuards: true,
  expandInlineWithLoops: true,
  expandInlineComprehensions: true,
};
