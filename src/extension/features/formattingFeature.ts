import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { formatSacSource } from "../formatter/sacFormatter";
import { FeatureLifecycle } from "./languageClientFeature";

const SAC_LANGUAGE = "sac";
const SAC_FORMAT_FILE = ".sac-format";

type RuntimeFormatConfig = {
  enabled: boolean;
  onSave: boolean;
  indentSize: number;
  normalizeGuards: boolean;
  expandInlineWithLoops: boolean;
  expandInlineComprehensions: boolean;
};

/**
 * Counts trailing newline characters in normalized newline space.
 *
 * @param text Input text.
 * @returns Number of trailing `\n` characters.
 */
function trailingNewlineCount(text: string): number {
  const segment = text.match(/(?:\r?\n)+$/)?.[0] ?? "";
  return segment.length === 0 ? 0 : segment.replace(/\r/g, "").length;
}

/**
 * Reapplies original trailing newline shape after formatting pass.
 *
 * @param formatted Formatter output.
 * @param original Original source text.
 * @returns Text with preserved trailing newline count.
 */
function preserveTrailingNewlines(formatted: string, original: string): string {
  const expected = trailingNewlineCount(original);
  const normalizedBody = formatted.replace(/\n+$/g, "");
  return `${normalizedBody}${"\n".repeat(expected)}`;
}

/**
 * Computes full editable range for document replacement.
 *
 * @param document Text document.
 * @returns Range covering entire document.
 */
function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
  const endLine = Math.max(0, document.lineCount - 1);
  const endChar = document.lineAt(endLine).text.length;
  return new vscode.Range(new vscode.Position(0, 0), new vscode.Position(endLine, endChar));
}

/**
 * Parses flexible boolean literals from `.sac-format`.
 *
 * @param value Raw value text.
 * @returns Boolean value when recognized.
 */
function parseBoolean(value: string): boolean | undefined {
  const normalized = value.trim().toLowerCase();
  if (["true", "yes", "on", "1"].includes(normalized)) {
    return true;
  }
  if (["false", "no", "off", "0"].includes(normalized)) {
    return false;
  }
  return undefined;
}

/**
 * Parses integer-like numeric value from `.sac-format`.
 *
 * @param value Raw value text.
 * @returns Floor-normalized number when valid.
 */
function parseNumber(value: string): number | undefined {
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return Math.floor(parsed);
}

/**
 * Parses `.sac-format` key/value overrides.
 *
 * @param content File content.
 * @returns Partial runtime config overrides.
 */
function parseSacFormatFile(content: string): Partial<RuntimeFormatConfig> {
  const overrides: Partial<RuntimeFormatConfig> = {};
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#") || line.startsWith("//")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (key === "indentsize" || key === "tabwidth") {
      const parsed = parseNumber(value);
      if (typeof parsed === "number" && parsed >= 2) {
        overrides.indentSize = parsed;
      }
      continue;
    }

    if (key === "normalizeguards") {
      const parsed = parseBoolean(value);
      if (typeof parsed === "boolean") {
        overrides.normalizeGuards = parsed;
      }
      continue;
    }

    if (key === "expandinlinewithloops") {
      const parsed = parseBoolean(value);
      if (typeof parsed === "boolean") {
        overrides.expandInlineWithLoops = parsed;
      }
      continue;
    }

    if (key === "expandinlinecomprehensions") {
      const parsed = parseBoolean(value);
      if (typeof parsed === "boolean") {
        overrides.expandInlineComprehensions = parsed;
      }
      continue;
    }
  }

  return overrides;
}

/**
 * Finds nearest `.sac-format` from document directory toward workspace root.
 *
 * @param document Active text document.
 * @returns Absolute path to nearest config file, or null.
 */
function findNearestSacFormat(document: vscode.TextDocument): string | null {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const workspaceRoot = workspaceFolder?.uri.fsPath;
  let current = path.dirname(document.uri.fsPath);

  while (true) {
    const candidate = path.join(current, SAC_FORMAT_FILE);
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    if (workspaceRoot && path.resolve(current) === path.resolve(workspaceRoot)) {
      return null;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }

    current = parent;
  }
}

/**
 * Reads effective formatter config from VS Code settings + `.sac-format`.
 *
 * @param document Active text document.
 * @returns Fully resolved runtime formatter config.
 */
function readFormatConfig(document: vscode.TextDocument): RuntimeFormatConfig {
  const config = vscode.workspace.getConfiguration("sac.format");
  const resolved: RuntimeFormatConfig = {
    enabled: config.get<boolean>("enable", true),
    onSave: config.get<boolean>("onSave", false),
    indentSize: Math.max(2, config.get<number>("indentSize", 4)),
    normalizeGuards: config.get<boolean>("normalizeGuards", true),
    expandInlineWithLoops: config.get<boolean>("expandInlineWithLoops", true),
    expandInlineComprehensions: config.get<boolean>("expandInlineComprehensions", true),
  };

  const formatFilePath = findNearestSacFormat(document);
  if (!formatFilePath) {
    return resolved;
  }

  try {
    const content = fs.readFileSync(formatFilePath, "utf8");
    return {
      ...resolved,
      ...parseSacFormatFile(content),
    };
  } catch {
    return resolved;
  }
}

/**
 * Reads config used for format-on-save execution.
 *
 * @param document Active text document.
 * @returns Runtime formatter config.
 */
function readOnSaveConfig(document: vscode.TextDocument): RuntimeFormatConfig {
  const resolved = readFormatConfig(document);
  return {
    ...resolved,
    // Formatter intentionally spaces-only for SaC/C style consistency.
    indentSize: Math.max(2, resolved.indentSize),
  };
}

export class FormattingFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  /**
   * Activates document/range formatter + optional format-on-save hook.
   */
  public async activate(): Promise<void> {
    const featureEnabled = vscode.workspace.getConfiguration("sac").get<boolean>("features.formatter.enable", true);
    if (!featureEnabled) {
      return;
    }

    const selector: vscode.DocumentSelector = [{ language: SAC_LANGUAGE, scheme: "file" }];

    const provider: vscode.DocumentFormattingEditProvider & vscode.DocumentRangeFormattingEditProvider = {
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const config = readFormatConfig(document);
        if (!config.enabled) {
          return [];
        }

        // Guard against accidental EOF newline drift.
        const formatted = preserveTrailingNewlines(formatSacSource(document.getText(), config), document.getText());
        if (formatted === document.getText()) {
          return [];
        }

        return [vscode.TextEdit.replace(fullDocumentRange(document), formatted)];
      },

      provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
      ): vscode.TextEdit[] {
        const config = readFormatConfig(document);
        if (!config.enabled) {
          return [];
        }

        const selected = document.getText(range);
        // Range formatting should not force extra trailing newline in selection.
        const formatted = preserveTrailingNewlines(formatSacSource(selected, config), selected).replace(/\n$/, "");
        if (formatted === selected) {
          return [];
        }

        return [vscode.TextEdit.replace(range, formatted)];
      },
    };

    this.disposables.push(vscode.languages.registerDocumentFormattingEditProvider(selector, provider));
    this.disposables.push(vscode.languages.registerDocumentRangeFormattingEditProvider(selector, provider));

    this.disposables.push(
      vscode.workspace.onWillSaveTextDocument((event) => {
        if (event.document.languageId !== SAC_LANGUAGE || event.document.uri.scheme !== "file") {
          return;
        }

        const config = readOnSaveConfig(event.document);
        if (!config.enabled || !config.onSave) {
          return;
        }

        event.waitUntil(
          vscode.commands.executeCommand<vscode.TextEdit[]>(
            "vscode.executeFormatDocumentProvider",
            event.document.uri,
            {
              tabSize: config.indentSize,
              insertSpaces: true,
            },
          ).then((edits) => edits ?? []),
        );
      }),
    );
  }

  /**
   * Disposes formatter registrations and save hooks.
   */
  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}
