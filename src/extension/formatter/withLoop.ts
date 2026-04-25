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

  return ["return with {", `${generator} :`, expression, `} : genarray(${genarrayArgs});`];
}

/**
 * Records absolute `with` column when a with-loop header is encountered.
 *
 * @param content Current formatted content line.
 * @param baseIndent Effective line indent level.
 * @param indentSize Spaces per indent level.
 * @param withColumnStack Stack of active with-loop columns.
 */
export function registerWithLoopColumn(
  content: string,
  baseIndent: number,
  indentSize: number,
  withColumnStack: number[],
): void {
  if (!content.includes("with {")) {
    return;
  }

  const withIndex = content.indexOf("with");
  const absoluteWithColumn = baseIndent * indentSize + Math.max(0, withIndex);
  withColumnStack.push(absoluteWithColumn);
}

/**
 * Applies with-loop specific alignment for close/generator lines.
 *
 * @param content Current line content.
 * @param withColumnStack Stack of active with-loop columns.
 * @param trailingWhitespacePattern Regex used to trim trailing spaces.
 * @returns Aligned line when with-loop rule applies; otherwise null.
 */
export function formatWithLoopAlignedLine(
  content: string,
  withColumnStack: number[],
  trailingWhitespacePattern: RegExp,
): string | null {
  if (withColumnStack.length === 0) {
    return null;
  }

  if (content.startsWith("} :")) {
    const withColumn = withColumnStack[withColumnStack.length - 1];
    withColumnStack.pop();
    return `${" ".repeat(withColumn)}${content}`.replace(trailingWhitespacePattern, "");
  }

  if (content.startsWith("(")) {
    const withColumn = withColumnStack[withColumnStack.length - 1];
    return `${" ".repeat(withColumn + 2)}${content}`.replace(trailingWhitespacePattern, "");
  }

  return null;
}
