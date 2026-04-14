// Splits text by delimiter while ignoring delimiters inside (), [], {}, and quoted strings.
export function splitTopLevel(text: string, delimiter: string): string[] {
  const pieces: string[] = [];
  let current = "";
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;
  let quote: string | null = null;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quote) {
      current += character;
      if (character === quote && text[index - 1] !== "\\") {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      current += character;
      continue;
    }

    if (character === "(") {
      depthParen += 1;
      current += character;
      continue;
    }

    if (character === ")") {
      depthParen -= 1;
      current += character;
      continue;
    }

    if (character === "[") {
      depthBracket += 1;
      current += character;
      continue;
    }

    if (character === "]") {
      depthBracket -= 1;
      current += character;
      continue;
    }

    if (character === "{") {
      depthBrace += 1;
      current += character;
      continue;
    }

    if (character === "}") {
      depthBrace -= 1;
      current += character;
      continue;
    }

    if (character === delimiter && depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
      const piece = current.trim();
      if (piece.length > 0) {
        pieces.push(piece);
      }
      current = "";
      continue;
    }

    current += character;
  }

  const tail = current.trim();
  if (tail.length > 0) {
    pieces.push(tail);
  }

  return pieces;
}
