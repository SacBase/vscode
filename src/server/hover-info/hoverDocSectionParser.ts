import {
  normalizeHeadingLabel,
  readFirstCodeBlockFirstLine,
  trimBlankEdges,
} from "$util/markdown";
import {
  DOC_SECTION_HEADING_PATTERN,
  SIGNATURE_CODE_BLOCK_PATTERN,
  TOP_LEVEL_HEADING_PATTERN,
} from "$constants/regex";

export { normalizeHeadingLabel, trimBlankEdges };

type ParsedSection = {
  heading: string;
  lines: string[];
};

export interface ParsedDocSections {
  sections: Map<string, ParsedSection>;
  headingCount: number;
  preamble: string[];
}

export function findSignatureSection(sections: Map<string, ParsedSection>): ParsedSection | null {
  return sections.get("signature")
    ?? sections.get("signatures")
    ?? sections.get("common signatures")
    ?? sections.get("call form")
    ?? sections.get("call forms")
    ?? sections.get("typical call form")
    ?? sections.get("typical call forms")
    ?? null;
}

export function extractSignatureLine(signatureSection: ParsedSection | null): string | null {
  if (!signatureSection) {
    return null;
  }

  return readFirstCodeBlockFirstLine(signatureSection.lines.join("\n"), SIGNATURE_CODE_BLOCK_PATTERN);
}

export function parseDocSections(markdown: string): ParsedDocSections {
  const lines = markdown.split(/\r?\n/);
  const sections = new Map<string, ParsedSection>();
  const preamble: string[] = [];

  let headingCount = 0;
  let currentSectionKey: string | null = null;

  for (const line of lines) {
    if (TOP_LEVEL_HEADING_PATTERN.test(line)) {
      continue;
    }

    const sectionMatch = line.match(DOC_SECTION_HEADING_PATTERN);
    if (sectionMatch) {
      headingCount += 1;
      const heading = sectionMatch[1].trim();
      const key = normalizeHeadingLabel(heading);
      currentSectionKey = key;

      if (!sections.has(key)) {
        sections.set(key, { heading, lines: [] });
      }

      continue;
    }

    if (currentSectionKey === null) {
      preamble.push(line);
      continue;
    }

    const section = sections.get(currentSectionKey);
    if (section) {
      section.lines.push(line);
    }
  }

  return {
    sections,
    headingCount,
    preamble,
  };
}
