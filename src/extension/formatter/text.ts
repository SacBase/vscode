/**
 * Counts contiguous closing braces at line start.
 *
 * @param text Trimmed line text.
 * @returns Number of leading `}` characters.
 */
export function countLeadingClosers(text: string): number {
  let index = 0;
  while (index < text.length && text[index] === "}") {
    index += 1;
  }
  return index;
}

/**
 * Computes brace delta for single line while ignoring strings and comments.
 *
 * @param text Line content.
 * @returns Net depth change (`{` => +1, `}` => -1).
 */
export function countBraceDelta(text: string): number {
  let depth = 0;
  let inSingleLineComment = false;
  let inBlockComment = false;
  let inString = false;

  for (let index = 0; index < text.length; index += 1) {
    const current = text[index];
    const next = index + 1 < text.length ? text[index + 1] : "";

    if (inBlockComment) {
      if (current === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inSingleLineComment) {
      break;
    }

    if (!inString && current === "/" && next === "/") {
      inSingleLineComment = true;
      continue;
    }

    if (!inString && current === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (current === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (current === "{") {
      depth += 1;
    } else if (current === "}") {
      depth -= 1;
    }
  }

  return depth;
}

/**
 * Checks if line is a single-line comment after trim.
 *
 * @param text Trimmed line.
 * @returns True when line starts with `//`.
 */
export function isLineComment(text: string): boolean {
  return text.startsWith("//");
}

/**
 * Ensures `//` comments use at least one space before comment body.
 *
 * @param text Comment line.
 * @returns Normalized comment line.
 */
export function normalizeLineCommentSpacing(text: string): string {
  if (!isLineComment(text)) {
    return text;
  }

  if (text === "//") {
    return text;
  }

  const after = text.slice(2);
  if (after.startsWith(" ") || after.startsWith("/") || after.startsWith("\t")) {
    return text;
  }

  return `// ${after}`;
}

/**
 * Normalizes guard-line prefix spacing.
 *
 * @param text Guard or plain line.
 * @returns Line with normalized `|`, `||`, and `,` spacing.
 */
export function normalizeGuardPrefix(text: string): string {
  if (text.startsWith("|")) {
    const rest = text.slice(1).trimStart();
    if (rest.startsWith("|")) {
      const right = rest.slice(1).trimStart();
      return right.length > 0 ? `|| ${right}` : "||";
    }
    return rest.length > 0 ? `| ${rest.trim()}` : "|";
  }

  if (text.startsWith(",")) {
    const rest = text.slice(1).trim();
    return rest.length > 0 ? `, ${rest}` : ",";
  }

  return text;
}

/**
 * Splits string by delimiter only at top-level nesting.
 *
 * @param text Input expression.
 * @param delimiter Delimiter char to split on.
 * @returns Top-level split chunks.
 */
export function splitTopLevel(text: string, delimiter: string): string[] {
  const parts: string[] = [];
  let buffer = "";
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let inString = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = index + 1 < text.length ? text[index + 1] : "";

    // Handle escaped characters inside strings (e.g., \" or \\).
    if (char === "\\" && inString) {
      buffer += char;
      if (next.length > 0) {
        buffer += next;
        index += 1;
      }
      continue;
    }

    // Toggle string state on unescaped quote.
    if (char === '"') {
      inString = !inString;
      buffer += char;
      continue;
    }

    // Track nesting depth of brackets, parens, and braces (only when outside strings).
    if (!inString) {
      if (char === "(") {
        parenDepth += 1;
      } else if (char === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
      } else if (char === "[") {
        bracketDepth += 1;
      } else if (char === "]") {
        bracketDepth = Math.max(0, bracketDepth - 1);
      } else if (char === "{") {
        braceDepth += 1;
      } else if (char === "}") {
        braceDepth = Math.max(0, braceDepth - 1);
      }

      // Found a top-level delimiter: record it as a split point.
      if (char === delimiter && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
        parts.push(buffer.trim());
        buffer = "";
        continue;
      }
    }

    buffer += char;
  }

  parts.push(buffer.trim());
  return parts.filter((entry) => entry.length > 0);
}

/**
 * Finds first top-level token index, ignoring nested scopes/strings.
 *
 * @param text Input expression.
 * @param token Target token.
 * @returns Index or -1 when not found.
 */
export function findTopLevelToken(text: string, token: string): number {
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let inString = false;

  for (let index = 0; index <= text.length - token.length; index += 1) {
    const char = text[index];

    // Skip escaped chars in strings.
    if (char === "\\" && inString) {
      index += 1;
      continue;
    }

    // Toggle string state.
    if (char === '"') {
      inString = !inString;
      continue;
    }

    // Track nesting depth (only outside strings).
    if (!inString) {
      if (char === "(") {
        parenDepth += 1;
      } else if (char === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
      } else if (char === "[") {
        bracketDepth += 1;
      } else if (char === "]") {
        bracketDepth = Math.max(0, bracketDepth - 1);
      } else if (char === "{") {
        braceDepth += 1;
      } else if (char === "}") {
        braceDepth = Math.max(0, braceDepth - 1);
      }

      // Match token only at top level (all depths zero).
      if (parenDepth === 0 && bracketDepth === 0 && braceDepth === 0 && text.slice(index, index + token.length) === token) {
        return index;
      }
    }
  }

  return -1;
}

/**
 * Finds top-level guard separator `|` for tensor clauses.
 *
 * @param text Tensor clause text.
 * @param startIndex Search start index.
 * @returns Index or -1 when no top-level guard pipe exists.
 */
export function findTopLevelGuardPipe(text: string, startIndex: number): number {
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let inString = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];
    const prev = index > 0 ? text[index - 1] : "";
    const next = index + 1 < text.length ? text[index + 1] : "";

    // Skip escaped chars and string content.
    if (char === "\\" && inString) {
      index += 1;
      continue;
    }

    // Toggle string state.
    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    // Track nesting depth for (), [], and {}.
    if (char === "(") {
      parenDepth += 1;
      continue;
    }
    if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
      continue;
    }
    if (char === "[") {
      bracketDepth += 1;
      continue;
    }
    if (char === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      continue;
    }
    if (char === "{") {
      braceDepth += 1;
      continue;
    }
    if (char === "}") {
      braceDepth = Math.max(0, braceDepth - 1);
      continue;
    }

    // Found single `|` at top level (not `||`).
    if (char === "|" && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0 && prev !== "|" && next !== "|") {
      return index;
    }
  }

  return -1;
}

/**
 * Computes delimiter nesting balance for continuation detection.
 *
 * @param text Expression text.
 * @returns Positive when expression is still open.
 */
export function delimiterBalance(text: string): number {
  let balance = 0;
  let inString = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = index + 1 < text.length ? text[index + 1] : "";

    if (char === "\\" && inString) {
      index += 1;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "/" && next === "/") {
      break;
    }

    if (char === "(" || char === "[" || char === "{") {
      balance += 1;
    } else if (char === ")" || char === "]" || char === "}") {
      balance -= 1;
    }
  }

  return balance;
}
