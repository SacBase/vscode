import { INLINE_WITH_LOOP_PATTERN } from "$constants/regex";

/**
 * Expands inline return-with-loop pattern into multiline block.
 *
 * @param line Source line.
 * @returns Expanded lines or original line.
 */
export function expandInlineWithLoop(line: string): string[] {
  const match = line.match(INLINE_WITH_LOOP_PATTERN);
  if (!match) {
    return [line];
  }

  const generator = match[1].trim();
  const expression = match[2].trim();
  const genarrayArgs = match[3].trim();

  return [
    "return with {",
    `${generator} :`,
    expression,
    `} : genarray(${genarrayArgs});`,
  ];
}
