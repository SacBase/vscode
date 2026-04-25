import {
  BUILTIN_SHAPE_CLASS_LEGEND_PATTERN,
  STDLIB_TYPE_VARIABLE_MARKER_PATTERN,
  STDLIB_TYPE_VARIABLE_NOTE_PATTERN,
} from "$constants/regex";
import {
  extractSignatureLine,
  findSignatureSection,
  normalizeHeadingLabel,
  parseDocSections,
  trimBlankEdges,
} from "$sac2c/parser/hover-info/hoverDocSectionParser";

// Markdown block appended to builtin hover docs explaining shape-class notation.
const BUILTIN_SHAPE_CLASS_LEGEND_MARKDOWN = [
  "### Shape-Class Legend",
  "- `S` = scalar",
  "- `V` = vector",
  "- `A` = array",
  "- In signatures like `SxV`, `x` separates argument shape classes.",
].join("\n");

// Markdown block appended to stdlib hover docs explaining type variables.
const STDLIB_TYPE_VARIABLE_NOTE_MARKDOWN = [
  "### Type Variable Note",
  "- `<a>` denotes a generic type variable.",
  "- It can be any supported SAC type (for example `int`, `float`, `double`, `bool`, ...).",
  "- Matching `<a>` occurrences in one signature refer to the same type.",
].join("\n");

export interface HoverFormattingOptions {
  signature?: string | null;
}

// Order to present structured sections in hover markdown (e.g., Description, Parameters, Returns, Examples).
const STRUCTURED_SECTION_ORDER = ["description", "parameters", "returns", "return", "example", "examples"] as const;

// Append section block if it has content (skip empty sections).
function addSectionBlock(blocks: string[], title: string, bodyLines: string[]): void {
  const trimmed = trimBlankEdges(bodyLines);
  if (trimmed.length === 0) {
    return;
  }

  blocks.push(`**${title}**\n${trimmed.join("\n")}`);
}

// Format hover markdown: extract signature, parse sections, render in canonical layout.
export function formatHoverDocumentationMarkdown(markdown: string, options: HoverFormattingOptions = {}): string {
  const { sections, headingCount, preamble } = parseDocSections(markdown);

  const signatureSection = findSignatureSection(sections);
  const extractedSignatureLine = extractSignatureLine(signatureSection);
  const signatureLine = options.signature?.trim() || extractedSignatureLine;

  const descriptionSection = sections.get("description");
  const descriptionLines = descriptionSection ? descriptionSection.lines : preamble;

  const hasStructuredContent = Boolean(signatureLine) || headingCount > 0 || trimBlankEdges(descriptionLines).length > 0;
  if (!hasStructuredContent) {
    return markdown;
  }

  const blocks: string[] = [];
  if (signatureLine) {
    blocks.push(["```sac", signatureLine, "```"].join("\n"));
  }

  const trimmedDescription = trimBlankEdges(descriptionLines);
  if (trimmedDescription.length > 0) {
    blocks.push(trimmedDescription.join("\n"));
  }

  const consumedSections = new Set<string>();
  // Track consumed sections to avoid duplicates or reordering.
  if (descriptionSection) {
    consumedSections.add("description");
  }
  if (signatureSection) {
    consumedSections.add(normalizeHeadingLabel(signatureSection.heading));
  }

  // Add structured sections in preferred order.
  for (const key of STRUCTURED_SECTION_ORDER) {
    if (consumedSections.has(key)) {
      continue;
    }

    const section = sections.get(key);
    if (!section) {
      continue;
    }

    addSectionBlock(blocks, section.heading, section.lines);
    consumedSections.add(key);
  }

  // Add remaining sections (not in preferred order).
  for (const [key, section] of sections.entries()) {
    if (consumedSections.has(key)) {
      continue;
    }

    // Skip signature-related sections (already extracted).
    if (key === "signature" || key === "common signatures" || key === "signatures") {
      continue;
    }

    addSectionBlock(blocks, section.heading, section.lines);
  }

  const compactBlocks = blocks.filter((block) => block.trim().length > 0);
  if (compactBlocks.length === 0) {
    return markdown;
  }

  return `${compactBlocks.join("\n\n---\n\n").trimEnd()}\n`;
}

// Append shape-class legend to builtin docs (skip if already present).
export function appendBuiltinLegend(markdown: string): string {
  if (BUILTIN_SHAPE_CLASS_LEGEND_PATTERN.test(markdown)) {
    return markdown;
  }

  return `${markdown.trimEnd()}\n\n${BUILTIN_SHAPE_CLASS_LEGEND_MARKDOWN}`;
}

// Append type-variable note to stdlib docs if <a> found (skip if already present).
export function appendStdlibTypeVariableNote(markdown: string): string {
  if (!STDLIB_TYPE_VARIABLE_MARKER_PATTERN.test(markdown)) {
    return markdown;
  }

  if (STDLIB_TYPE_VARIABLE_NOTE_PATTERN.test(markdown)) {
    return markdown;
  }

  return `${markdown.trimEnd()}\n\n${STDLIB_TYPE_VARIABLE_NOTE_MARKDOWN}`;
}
