/**
 * Normalizes markdown heading labels to lowercase lookup keys.
 */
export function normalizeHeadingLabel(value: string): string {
  return value
    .replace(/`/g, "")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Trims leading and trailing blank lines.
 */
export function trimBlankEdges(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;

  while (start < end && lines[start].trim().length === 0) {
    start += 1;
  }

  while (end > start && lines[end - 1].trim().length === 0) {
    end -= 1;
  }

  return lines.slice(start, end);
}

/**
 * Reads first non-empty line from first fenced code block.
 */
export function readFirstCodeBlockFirstLine(markdown: string, codeBlockPattern: RegExp): string | null {
  const pattern = new RegExp(codeBlockPattern.source, codeBlockPattern.flags);
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(markdown)) !== null) {
    const lines = match[1]
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length > 0) {
      return lines[0];
    }
  }

  return null;
}