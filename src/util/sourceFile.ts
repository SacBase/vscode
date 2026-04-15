const MASK_CHAR = " ";

/**
 * Replaces comments and string literals with spaces while preserving source length.
 *
 * Newlines are kept intact so line/column math and multiline regex anchors remain stable.
 */
export function maskNonCodeText(source: string): string {
  const chars = source.split("");
  let inLineComment = false;
  let inBlockComment = false;
  let inString = false;
  let stringQuote = "";

  for (let index = 0; index < chars.length; index += 1) {
    const current = chars[index];
    const next = index + 1 < chars.length ? chars[index + 1] : "";

    if (inLineComment) {
      if (current === "\n") {
        inLineComment = false;
      } else {
        chars[index] = MASK_CHAR;
      }
      continue;
    }

    if (inBlockComment) {
      if (current !== "\n") {
        chars[index] = MASK_CHAR;
      }

      if (current === "*" && next === "/") {
        chars[index + 1] = MASK_CHAR;
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      if (current === "\\") {
        chars[index] = MASK_CHAR;
        if (index + 1 < chars.length && chars[index + 1] !== "\n") {
          chars[index + 1] = MASK_CHAR;
        }
        index += 1;
        continue;
      }

      if (current !== "\n") {
        chars[index] = MASK_CHAR;
      }

      if (current === stringQuote) {
        inString = false;
        stringQuote = "";
      }
      continue;
    }

    if (current === "/" && next === "/") {
      chars[index] = MASK_CHAR;
      chars[index + 1] = MASK_CHAR;
      inLineComment = true;
      index += 1;
      continue;
    }

    if (current === "/" && next === "*") {
      chars[index] = MASK_CHAR;
      chars[index + 1] = MASK_CHAR;
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (current === '"' || current === "'") {
      chars[index] = MASK_CHAR;
      inString = true;
      stringQuote = current;
    }
  }

  return chars.join("");
}

/**
 * Finds matching closing brace for opening brace offset.
 *
 * Optional maskedSource should be produced by maskNonCodeText(source).
 */
export function findMatchingBrace(source: string, openOffset: number, maskedSource?: string): number {
  const scan = maskedSource ?? maskNonCodeText(source);
  let depth = 1;

  for (let index = openOffset + 1; index < scan.length; index += 1) {
    const current = scan[index];
    if (current === "{") {
      depth += 1;
      continue;
    }
    if (current === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return Math.max(openOffset, source.length - 1);
}

/**
 * Converts character offset to zero-based line/column position.
 */
export function offsetToLineAndCharacter(sourceText: string, offset: number): { line: number; character: number } {
  let line = 0;
  let character = 0;

  for (let index = 0; index < offset && index < sourceText.length; index += 1) {
    if (sourceText[index] === "\n") {
      line += 1;
      character = 0;
      continue;
    }
    character += 1;
  }

  return { line, character };
}
