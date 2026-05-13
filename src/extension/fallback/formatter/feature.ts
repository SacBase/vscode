import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import {
  SAC_CONFIG_SECTION,
  SAC_FORMAT_CONFIG_SECTION,
  SAC_FORMAT_FILENAME,
  SAC_LANGUAGE_ID,
  SAC_URI_FILE_SCHEME,
} from "$constants/language";
import { TRAILING_SINGLE_NEWLINE_PATTERN } from "$constants/regex";
import type { FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";
import { formatSacSource } from "./sacFormatter";
import { preserveTrailingNewlines, splitNormalizedLines } from "$util/newlines";

type RuntimeFormatConfig = {
  enabled: boolean;
  onSave: boolean;
  indentSize: number;
  normalizeGuards: boolean;
  expandInlineWithLoops: boolean;
  expandInlineComprehensions: boolean;
  splitInlineGuards: boolean;
};

interface CachedSacFormatConfig {
  mtimeMs: number;
  overrides: Partial<RuntimeFormatConfig>;
}

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
  const endLine = Math.max(0, document.lineCount - 1);
  const endChar = document.lineAt(endLine).text.length;
  return new vscode.Range(new vscode.Position(0, 0), new vscode.Position(endLine, endChar));
}

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

function parseNumber(value: string): number | undefined {
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return Math.floor(parsed);
}

function parseSacFormatFile(content: string): Partial<RuntimeFormatConfig> {
  const overrides: Partial<RuntimeFormatConfig> = {};
  const lines = splitNormalizedLines(content);

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

    if (key === "splitinlineguards") {
      const parsed = parseBoolean(value);
      if (typeof parsed === "boolean") {
        overrides.splitInlineGuards = parsed;
      }
    }
  }

  return overrides;
}

function readSacFormatOverrides(filePath: string, cache: Map<string, CachedSacFormatConfig>): Partial<RuntimeFormatConfig> {
  try {
    const stat = fs.statSync(filePath);
    const cached = cache.get(filePath);
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      return cached.overrides;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const overrides = parseSacFormatFile(content);
    cache.set(filePath, { mtimeMs: stat.mtimeMs, overrides });
    return overrides;
  } catch {
    cache.delete(filePath);
    return {};
  }
}

function findNearestSacFormat(document: vscode.TextDocument): string | null {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const workspaceRoot = workspaceFolder?.uri.fsPath;
  let current = path.dirname(document.uri.fsPath);

  while (true) {
    const candidate = path.join(current, SAC_FORMAT_FILENAME);
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

function readFormatConfig(document: vscode.TextDocument, cache: Map<string, CachedSacFormatConfig>): RuntimeFormatConfig {
  const formatFilePath = findNearestSacFormat(document);
  const fileOverrides = formatFilePath ? readSacFormatOverrides(formatFilePath, cache) : {};

  const config = vscode.workspace.getConfiguration(SAC_FORMAT_CONFIG_SECTION);
  const resolved: RuntimeFormatConfig = {
    enabled: config.get<boolean>("enable", true),
    onSave: config.get<boolean>("onSave", false),
    indentSize: Math.max(2, config.get<number>("indentSize", 4)),
    normalizeGuards: config.get<boolean>("normalizeGuards", true),
    expandInlineWithLoops: config.get<boolean>("expandInlineWithLoops", true),
    expandInlineComprehensions: config.get<boolean>("expandInlineComprehensions", true),
    splitInlineGuards: config.get<boolean>("splitInlineGuards", config.get<boolean>("assertions", true)),
  };

  return {
    ...resolved,
    ...fileOverrides,
  };
}

function readOnSaveConfig(document: vscode.TextDocument, cache: Map<string, CachedSacFormatConfig>): RuntimeFormatConfig {
  const resolved = readFormatConfig(document, cache);
  return {
    ...resolved,
    indentSize: Math.max(2, resolved.indentSize),
  };
}

export class FormattingFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];
  private readonly sacFormatConfigCache = new Map<string, CachedSacFormatConfig>();

  public async activate(): Promise<void> {
    const featureEnabled = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION).get<boolean>("features.formatter.enable", true);
    if (!featureEnabled) {
      return;
    }

    const selector: vscode.DocumentSelector = [{ language: SAC_LANGUAGE_ID, scheme: SAC_URI_FILE_SCHEME }];
    const formatConfigCache = this.sacFormatConfigCache;

    const provider: vscode.DocumentFormattingEditProvider & vscode.DocumentRangeFormattingEditProvider = {
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const config = readFormatConfig(document, formatConfigCache);
        if (!config.enabled) {
          return [];
        }

        const formatted = preserveTrailingNewlines(formatSacSource(document.getText(), config), document.getText());
        if (formatted === document.getText()) {
          return [];
        }

        return [vscode.TextEdit.replace(fullDocumentRange(document), formatted)];
      },

      provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
        const config = readFormatConfig(document, formatConfigCache);
        if (!config.enabled) {
          return [];
        }

        const selected = document.getText(range);
        const formatted = preserveTrailingNewlines(formatSacSource(selected, config), selected).replace(
          TRAILING_SINGLE_NEWLINE_PATTERN,
          "",
        );
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
        if (event.document.languageId !== SAC_LANGUAGE_ID || event.document.uri.scheme !== SAC_URI_FILE_SCHEME) {
          return;
        }

        const config = readOnSaveConfig(event.document, formatConfigCache);
        if (!config.enabled || !config.onSave) {
          return;
        }

        event.waitUntil(
          vscode.commands
            .executeCommand<vscode.TextEdit[]>("vscode.executeFormatDocumentProvider", event.document.uri, {
              tabSize: config.indentSize,
              insertSpaces: true,
            })
            .then((edits) => edits ?? []),
        );
      }),
    );

    void this.primeWorkspaceSacFormatCache();
  }

  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
    this.sacFormatConfigCache.clear();
  }

  private async primeWorkspaceSacFormatCache(): Promise<void> {
    const files = await vscode.workspace.findFiles(`**/${SAC_FORMAT_FILENAME}`, "**/node_modules/**", 200);
    for (const file of files) {
      readSacFormatOverrides(file.fsPath, this.sacFormatConfigCache);
    }
  }
}