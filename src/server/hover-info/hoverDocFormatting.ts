import {
  extractSignatureLine,
  findSignatureSection,
  normalizeHeadingLabel,
  parseDocSections,
  trimBlankEdges,
} from "$server/hover-info/hoverDocSectionParser";

const BUILTIN_SHAPE_CLASS_LEGEND_MARKDOWN = [
  "### Shape-Class Legend",
  "- `S` = scalar",
  "- `V` = vector",
  "- `A` = array",
  "- In signatures like `SxV`, `x` separates argument shape classes.",
].join("\n");

const STDLIB_TYPE_VARIABLE_NOTE_MARKDOWN = [
  "### Type Variable Note",
  "- `<a>` denotes a generic type variable.",
  "- It can be any supported SAC type (for example `int`, `float`, `double`, `bool`, ...).",
  "- Matching `<a>` occurrences in one signature refer to the same type.",
].join("\n");

export interface HoverFormattingOptions {
  signature?: string | null;
}

const STRUCTURED_SECTION_ORDER = ["description", "parameters", "returns", "return", "example", "examples"] as const;

function addSectionBlock(blocks: string[], title: string, bodyLines: string[]): void {
  const trimmed = trimBlankEdges(bodyLines);
  if (trimmed.length === 0) {
    return;
  }

  blocks.push(`**${title}**\n${trimmed.join("\n")}`);
}

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
  if (descriptionSection) {
    consumedSections.add("description");
  }
  if (signatureSection) {
    consumedSections.add(normalizeHeadingLabel(signatureSection.heading));
  }

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

  for (const [key, section] of sections.entries()) {
    if (consumedSections.has(key)) {
      continue;
    }

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

export function appendBuiltinLegend(markdown: string): string {
  if (/^###\s+Shape-Class\s+Legend\b/im.test(markdown)) {
    return markdown;
  }

  return `${markdown.trimEnd()}\n\n${BUILTIN_SHAPE_CLASS_LEGEND_MARKDOWN}`;
}

export function appendStdlibTypeVariableNote(markdown: string): string {
  if (!/<a>/i.test(markdown)) {
    return markdown;
  }

  if (/^###\s+Type\s+Variable\s+Note\b/im.test(markdown)) {
    return markdown;
  }

  return `${markdown.trimEnd()}\n\n${STDLIB_TYPE_VARIABLE_NOTE_MARKDOWN}`;
}
