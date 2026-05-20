function getLineOffsets(sourceText: string): number[] {
  const offsets: number[] = [0];
  for (let index = 0; index < sourceText.length; index += 1) {
    if (sourceText[index] === "\n") {
      offsets.push(index + 1);
    }
  }
  return offsets;
}

function offsetForPosition(sourceText: string, line: number, character: number): number | null {
  const offsets = getLineOffsets(sourceText);
  const lineOffset = offsets[line];
  if (lineOffset === undefined) {
    return null;
  }

  return lineOffset + character;
}

/**
 * Extracts raw argument text for call expression at given token end position.
 */
export function extractCallExpressionSource(sourceText: string, line: number, character: number): string | null {
  const startOffset = offsetForPosition(sourceText, line, character);
  if (startOffset === null) {
    return null;
  }

  const remainder = sourceText.slice(startOffset);
  const openParenOffset = remainder.indexOf("(");
  if (openParenOffset < 0) {
    return null;
  }

  let depth = 0;
  let closeOffset = -1;
  for (let index = startOffset + openParenOffset; index < sourceText.length; index += 1) {
    const characterAt = sourceText[index];
    if (characterAt === "(") {
      depth += 1;
      continue;
    }

    if (characterAt === ")") {
      depth -= 1;
      if (depth === 0) {
        closeOffset = index;
        break;
      }
    }
  }

  if (closeOffset < 0) {
    return null;
  }

  return sourceText.slice(startOffset + openParenOffset + 1, closeOffset);
}
