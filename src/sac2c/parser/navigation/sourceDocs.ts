import * as fs from "fs";

import { escapeRegExp } from "$util/regex";
import { splitTopLevel } from "$util/textSplit";
import {
  CONTROL_FLOW_KEYWORD_PATTERN,
  DOC_TAG_EXAMPLE_PATTERN,
  DOC_TAG_PARAM_PATTERN,
  DOC_TAG_RETURN_PATTERN,
  FUNCTION_CALL_PATTERN,
  FUNCTION_DEFINITION_HEADER_PATTERN,
  RETURN_KEYWORD_PATTERN,
} from "../../../constants/regex";

function normalizeSimpleHtmlToMarkdown(text: string): string {
  return text
    .replace(/<\/?p\s*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?ul\s*>/gi, "\n")
    .replace(/<\/?ol\s*>/gi, "\n")
    .replace(/<li\s*>/gi, "- ")
    .replace(/<\/li\s*>/gi, "\n")
    .replace(/<(b|strong)\s*>/gi, "**")
    .replace(/<\/(b|strong)\s*>/gi, "**")
    .replace(/<(i|em)\s*>/gi, "*")
    .replace(/<\/(i|em)\s*>/gi, "*")
    .replace(/<code\s*>/gi, "`")
    .replace(/<\/code\s*>/gi, "`")
    .replace(/<pre\s*>/gi, "\n```\n")
    .replace(/<\/pre\s*>/gi, "\n```\n")
    .replace(/<[^>]+>/g, "");
}

function normalizeSpacing(text: string): string {
  const lines = text.split(/\r?\n/);
  const out: string[] = [];
  let emptyRun = 0;

  for (const line of lines) {
    const trimmedRight = line.replace(/[ \t]+$/g, "");
    if (trimmedRight.trim().length === 0) {
      emptyRun += 1;
      if (emptyRun <= 1) {
        out.push("");
      }
      continue;
    }

    emptyRun = 0;
    out.push(trimmedRight);
  }

  while (out.length > 0 && out[0].trim().length === 0) {
    out.shift();
  }

  while (out.length > 0 && out[out.length - 1].trim().length === 0) {
    out.pop();
  }

  return out.join("\n");
}

function trimBlankEdgesPreserve(text: string): string {
  const lines = text.split(/\r?\n/);
  let start = 0;
  let end = lines.length;

  while (start < end && lines[start].trim().length === 0) {
    start += 1;
  }

  while (end > start && lines[end - 1].trim().length === 0) {
    end -= 1;
  }

  return lines.slice(start, end).join("\n");
}

function formatDocTags(text: string): string {
  // Keep user formatting for code-heavy comments.
  if (/```/.test(text) || /^(?:\t| {4,})\S/m.test(text)) {
    return trimBlankEdgesPreserve(text);
  }

  const lines = text.split(/\r?\n/);
  const summaryLines: string[] = [];
  const paramLines: string[] = [];
  const returnLines: string[] = [];
  const exampleLines: string[] = [];
  const otherTagLines: string[] = [];

  const flushSummaryLine = (line: string): void => {
    summaryLines.push(line);
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      flushSummaryLine("");
      continue;
    }

    const paramMatch = trimmed.match(DOC_TAG_PARAM_PATTERN);
    if (paramMatch) {
      const name = paramMatch[1];
      const desc = paramMatch[2].trim();
      paramLines.push(`- \`${name}\`${desc.length > 0 ? `: ${desc}` : ""}`);
      continue;
    }

    const returnMatch = trimmed.match(DOC_TAG_RETURN_PATTERN);
    if (returnMatch) {
      const desc = returnMatch[1].trim();
      returnLines.push(desc.length > 0 ? `- ${desc}` : "- (none)");
      continue;
    }

    const exampleMatch = trimmed.match(DOC_TAG_EXAMPLE_PATTERN);
    if (exampleMatch) {
      const body = exampleMatch[1].trim();
      if (body.length > 0) {
        exampleLines.push(body);
      }
      continue;
    }

    if (trimmed.startsWith("@")) {
      otherTagLines.push(trimmed);
      continue;
    }

    flushSummaryLine(line);
  }

  const out: string[] = [];
  const summary = normalizeSpacing(summaryLines.join("\n"));
  if (summary.length > 0) {
    out.push(summary);
  }

  if (paramLines.length > 0) {
    if (out.length > 0) {
      out.push("");
    }
    out.push("**Parameters**");
    out.push(...paramLines);
  }

  if (returnLines.length > 0) {
    if (out.length > 0) {
      out.push("");
    }
    out.push("**Returns**");
    out.push(...returnLines);
  }

  if (exampleLines.length > 0) {
    if (out.length > 0) {
      out.push("");
    }
    out.push("**Example**");
    out.push("```sac");
    out.push(...exampleLines);
    out.push("```");
  }

  if (otherTagLines.length > 0) {
    if (out.length > 0) {
      out.push("");
    }
    out.push("**Tags**");
    out.push(...otherTagLines.map((tag) => `- ${tag}`));
  }

  return normalizeSpacing(out.join("\n"));
}

/**
 * Pulls markdown-ish doc comment right above definition line.
 * Keeps body text so VS Code renders bullets/formatting in hover.
 */
export function extractLeadingDocCommentMarkdown(sourceText: string, definitionLine: number): string | null {
  const lines = sourceText.split(/\r?\n/);
  let index = definitionLine - 1;

  // Require adjacency: blank separator means no associated doc comment.
  if (index < 0 || lines[index].trim().length === 0) {
    return null;
  }

  if (index < 0 || !lines[index].includes("*/")) {
    if (index < 0 || !lines[index].trim().startsWith("//")) {
      return null;
    }

    const lineCommentLines: string[] = [];
    while (index >= 0) {
      const line = lines[index].trim();
      if (!line.startsWith("//")) {
        break;
      }
      lineCommentLines.push(line.replace(/^\/\/\s?/, ""));
      index -= 1;
    }

    lineCommentLines.reverse();
    const lineBody = formatDocTags(normalizeSimpleHtmlToMarkdown(lineCommentLines.join("\n")));
    return lineBody.length > 0 ? lineBody : null;
  }

  const commentLines: string[] = [];
  while (index >= 0) {
    const line = lines[index];
    commentLines.push(line);
    if (line.includes("/**")) {
      break;
    }
    index -= 1;
  }

  if (commentLines.length === 0 || !commentLines[commentLines.length - 1].includes("/**")) {
    return null;
  }

  commentLines.reverse();
  const bodyLines = commentLines.map((line) => {
    let cleaned = line;

    // Strip comment frame in stable order so closing */ never leaks as "/".
    cleaned = cleaned.replace(/^\s*\/\*\*?/, "");
    cleaned = cleaned.replace(/\*\/\s*$/, "");
    cleaned = cleaned.replace(/^\s*\*\s?/, "");

    return cleaned.trimEnd();
  });

  const body = formatDocTags(normalizeSimpleHtmlToMarkdown(bodyLines.join("\n")));

  return body.length > 0 ? body : null;
}

/**
 * Reads source file and extracts doc comment above definition line.
 */
export function readDefinitionDocComment(filePath: string, definitionLine: number): string | null {
  try {
    const sourceText = fs.readFileSync(filePath, "utf8");
    return extractLeadingDocCommentMarkdown(sourceText, definitionLine);
  } catch {
    return null;
  }
}

function isPotentialFunctionDefinitionLine(lineText: string, nextNonEmptyLine?: string): boolean {
  if (RETURN_KEYWORD_PATTERN.test(lineText) || CONTROL_FLOW_KEYWORD_PATTERN.test(lineText)) {
    return false;
  }

  const match = lineText.match(FUNCTION_DEFINITION_HEADER_PATTERN);
  if (!match || match.index === undefined) {
    return false;
  }

  const tail = lineText.slice(match.index + match[0].length);
  const nextStartsBody = nextNonEmptyLine?.trim().startsWith("{") === true;
  const nextStartsAssertions = nextNonEmptyLine?.trim().startsWith("|") === true;
  return !tail.includes(";")
    && (tail.includes("{") || lineText.includes("|") || nextStartsBody || nextStartsAssertions);
}

/**
 * Finds function definition line under cursor on source line.
 * Supports straight function headers and overloaded variants.
 */
export function findFunctionDefinitionAtPosition(
  sourceText: string,
  line: number,
  character: number,
): { name: string; definitionLine: number; startCharacter: number; endCharacter: number } | null {
  const lines = sourceText.split(/\r?\n/);
  const lineText = lines[line];
  if (lineText === undefined) {
    return null;
  }

  const nextNonEmptyLine = lines.slice(line + 1).find((nextLine) => nextLine.trim().length > 0);

  const match = lineText.match(FUNCTION_DEFINITION_HEADER_PATTERN);
  if (!match || match.index === undefined) {
    return null;
  }

  if (!isPotentialFunctionDefinitionLine(lineText, nextNonEmptyLine)) {
    return null;
  }

  const startCharacter = match.index + match[1].length + lineText.slice(match.index + match[1].length).indexOf(match[2]);
  const endCharacter = startCharacter + match[2].length;
  if (character < startCharacter || character >= endCharacter) {
    return null;
  }

  return {
    name: match[2],
    definitionLine: line,
    startCharacter,
    endCharacter,
  };
}

export function extractDefinitionSignatureFromText(sourceText: string, definitionLine: number): string | null {
  const lines = sourceText.split(/\r?\n/);
  if (lines[definitionLine] === undefined) {
    return null;
  }

  const lineText = lines[definitionLine];
  const nextNonEmptyLine = lines.slice(definitionLine + 1).find((nextLine) => nextLine.trim().length > 0);
  if (!isPotentialFunctionDefinitionLine(lineText, nextNonEmptyLine)) {
    return null;
  }

  const headerLines: string[] = [];
  for (let lineIndex = definitionLine; lineIndex < lines.length && lineIndex < definitionLine + 12; lineIndex += 1) {
    const current = lines[lineIndex];
    headerLines.push(current);
    if (current.includes("{") || current.includes(";")) {
      break;
    }
  }

  let header = headerLines.join(" ").replace(/\s+/g, " ").trim();
  if (header.length === 0) {
    return null;
  }

  const blockStart = header.indexOf("{");
  if (blockStart >= 0) {
    header = header.slice(0, blockStart).trim();
  }

  header = header.replace(/^inline\s+/, "").trim();

  const closeParenIndex = header.lastIndexOf(")");
  if (closeParenIndex < 0) {
    return null;
  }

  const signatureStem = header.slice(0, closeParenIndex + 1).trim();
  if (!/\b[A-Za-z_][A-Za-z0-9_]*\s*\(/.test(signatureStem)) {
    return null;
  }

  const assertionTail = header.slice(closeParenIndex + 1).trim();
  if (!assertionTail.startsWith("|")) {
    return signatureStem;
  }

  const rawAssertions = assertionTail.slice(1).trim();
  if (rawAssertions.length === 0) {
    return signatureStem;
  }

  const assertions = splitTopLevel(rawAssertions, ",");

  if (assertions.length === 0) {
    return signatureStem;
  }

  const formattedAssertions = assertions.map((assertion, index) => {
    const prefix = index === 0 ? "|" : ",";
    return `\t${prefix} ${assertion}`;
  });

  return `${signatureStem}\n${formattedAssertions.join("\n")}`;
}

export function readDefinitionSignature(filePath: string, definitionLine: number): string | null {
  try {
    const sourceText = fs.readFileSync(filePath, "utf8");
    return extractDefinitionSignatureFromText(sourceText, definitionLine);
  } catch {
    return null;
  }
}

export function findFunctionCallAtPosition(
  sourceText: string,
  line: number,
  character: number,
): { name: string; startCharacter: number; endCharacter: number } | null {
  const lines = sourceText.split(/\r?\n/);
  const lineText = lines[line];
  if (lineText === undefined) {
    return null;
  }

  const pattern = FUNCTION_CALL_PATTERN;
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(lineText)) !== null) {
    const name = match[1];
    const startCharacter = match.index;
    const endCharacter = startCharacter + name.length;
    if (character < startCharacter || character >= endCharacter) {
      continue;
    }

    return {
      name,
      startCharacter,
      endCharacter,
    };
  }

  return null;
}

export function findFunctionDefinitionLineByName(sourceText: string, functionName: string): number | null {
  const lines = sourceText.split(/\r?\n/);
  const escapedName = escapeRegExp(functionName);
  const pattern = new RegExp(`^\\s*(?:inline\\s+)?(?:[A-Za-z0-9_\\[\\].,:<>*\\s]+)?\\b${escapedName}\\s*\\(`);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const lineText = lines[lineIndex];
    if (pattern.test(lineText)) {
      return lineIndex;
    }
  }

  return null;
}

/**
 * Builds markdown hover for source-defined function docs.
 */
export function buildSourceDefinitionHoverMarkdown(sourceText: string, line: number): string | null {
  return readDefinitionDocCommentFromText(sourceText, line);
}

function readDefinitionDocCommentFromText(sourceText: string, definitionLine: number): string | null {
  return extractLeadingDocCommentMarkdown(sourceText, definitionLine);
}
