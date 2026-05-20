import * as vscode from "vscode";

interface SacConfigKeyInfo {
  description: string;
  valueType: string;
  defaultValue: string;
  example: string;
}

const SAC_CONFIG_KEYS: Record<string, SacConfigKeyInfo> = {
  outputbase: {
    description: "Base name for sac2c output files. file-name uses source filename without .sac; a keeps classic a-style output.",
    valueType: "enum",
    defaultValue: "file-name",
    example: "outputBase: file-name",
  },
  "compiler.outputbase": {
    description: "Base name for sac2c output files. file-name uses source filename without .sac; a keeps classic a-style output.",
    valueType: "enum",
    defaultValue: "file-name",
    example: "compiler.outputBase: file-name",
  },
};

export class SacConfigHoverProvider implements vscode.HoverProvider {
  public provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
    const line = document.lineAt(position.line).text;
    const trimmed = line.trim();

    if (trimmed.length === 0 || trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed === ":") {
      return undefined;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex < 0) {
      return undefined;
    }

    const key = trimmed.slice(0, colonIndex).trim().toLowerCase();
    const keyInfo = SAC_CONFIG_KEYS[key];
    if (!keyInfo) {
      return undefined;
    }

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`**${key}** (${keyInfo.valueType})\n\n`);
    markdown.appendText(keyInfo.description);
    markdown.appendMarkdown(`\n\n**Default:** \`${keyInfo.defaultValue}\`\n\n`);
    markdown.appendMarkdown(`**Example:** \`\`\`\n${keyInfo.example}\n\`\`\``);

    return new vscode.Hover(markdown);
  }
}
