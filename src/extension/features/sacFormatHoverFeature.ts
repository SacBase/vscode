import * as vscode from "vscode";

/**
 * Describes a key in the .sac-format configuration file.
 */
interface SacFormatKeyInfo {
  description: string;
  valueType: "number" | "boolean";
  defaultValue: string;
  example: string;
}

const SAC_FORMAT_KEYS: Record<string, SacFormatKeyInfo> = {
  indentsize: {
    description: "Number of spaces per indentation level (minimum 2).",
    valueType: "number",
    defaultValue: "4",
    example: "IndentSize: 4",
  },
  tabwidth: {
    description: "Alias for IndentSize.",
    valueType: "number",
    defaultValue: "4",
    example: "TabWidth: 4",
  },
  normalizeguards: {
    description: "Normalize guard line prefixes to '| ' and ', ' with consistent spacing.",
    valueType: "boolean",
    defaultValue: "true",
    example: "NormalizeGuards: true",
  },
  expandinlinewithloops: {
    description: "Expand inline with-loop bodies to multiline style when formatting.",
    valueType: "boolean",
    defaultValue: "true",
    example: "ExpandInlineWithLoops: true",
  },
  expandinlinecomprehensions: {
    description: "Expand inline tensor comprehensions to multiline style when formatting.",
    valueType: "boolean",
    defaultValue: "true",
    example: "ExpandInlineComprehensions: true",
  },
  splitinlineguards: {
    description: "Split inline function guards/conditions onto separate lines when formatting.",
    valueType: "boolean",
    defaultValue: "true",
    example: "SplitInlineGuards: true",
  },
  assertions: {
    description: "Deprecated alias for SplitInlineGuards.",
    valueType: "boolean",
    defaultValue: "true",
    example: "Assertions: true",
  },
};

/**
 * Provides hover information for .sac-format configuration keys.
 */
export class SacFormatHoverProvider implements vscode.HoverProvider {
  /**
   * Provides hover for a position in .sac-format files.
   *
   * @param document Text document.
   * @param position Cursor position.
   * @returns Hover information or undefined.
   */
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Hover | undefined {
    const line = document.lineAt(position.line).text;
    const trimmed = line.trim();

    // Skip empty lines, comments, and colons.
    if (trimmed.length === 0 || trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed === ":") {
      return undefined;
    }

    // Extract the key (everything before the colon).
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex < 0) {
      return undefined;
    }

    const key = trimmed.slice(0, colonIndex).trim().toLowerCase();
    const keyInfo = SAC_FORMAT_KEYS[key];
    if (!keyInfo) {
      return undefined;
    }

    // Build markdown hover content.
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`**${key}** (${keyInfo.valueType})\n\n`);
    markdown.appendText(keyInfo.description);
    markdown.appendMarkdown(`\n\n**Default:** \`${keyInfo.defaultValue}\`\n\n`);
    markdown.appendMarkdown(`**Example:** \`\`\`\n${keyInfo.example}\n\`\`\``);

    return new vscode.Hover(markdown);
  }
}
