import { SAC_CONFIG_SECTION, SAC_LANGUAGE_ID, SAC_URI_FILE_SCHEME } from "$constants/language";
import { getSymbolAtPosition } from "$extension/fallback/navigation/symbol";
import { queryWorkspaceDefinitions } from "$extension/fallback/navigation/workspaceDefinitions";
import type { FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";
import * as vscode from "vscode";
import { TextDocument } from "vscode-languageserver-textdocument";

function getWorkspaceRoots(): string[] {
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return folders.map((folder) => folder.uri.fsPath);
  }

  const rootPath = vscode.workspace.rootPath;
  return rootPath ? [rootPath] : [];
}

function getExcludedDirNames(): Set<string> {
  const config = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION);
  const values = config.get<string[]>("diagnostics.workspaceScan.excludeDirectories", []);
  return new Set(values);
}

function getOpenDocuments(): TextDocument[] {
  return vscode.workspace.textDocuments
    .filter((document) => document.languageId === SAC_LANGUAGE_ID)
    .map((document) => TextDocument.create(document.uri.toString(), SAC_LANGUAGE_ID, 0, document.getText()));
}

function buildSymbolPattern(symbolName: string): RegExp {
  const escaped = symbolName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(symbolName)) {
    return new RegExp(`\\b${escaped}\\b`, "g");
  }

  return new RegExp(escaped, "g");
}

export async function provideReferencesFallback(
  document: vscode.TextDocument,
  position: vscode.Position,
): Promise<vscode.Location[] | undefined> {
  const symbol = getSymbolAtPosition(document, position);
  if (!symbol) {
    return undefined;
  }

  const workspaceRoots = getWorkspaceRoots();
  if (workspaceRoots.length === 0) {
    return undefined;
  }

  const openDocuments = getOpenDocuments();
  const definitionLocations = queryWorkspaceDefinitions({
    symbolName: symbol.name,
    currentDocumentUri: document.uri.toString(),
    workspaceRoots,
    openDocuments,
    excludedDirNames: getExcludedDirNames(),
  });

  const results: vscode.Location[] = [];
  const seen = new Set<string>();
  const symbolPattern = buildSymbolPattern(symbol.name);

  for (const location of definitionLocations) {
    const key = `${location.uri}:${location.range.start.line}:${location.range.start.character}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push(new vscode.Location(vscode.Uri.parse(location.uri), new vscode.Range(
        new vscode.Position(location.range.start.line, location.range.start.character),
        new vscode.Position(location.range.end.line, location.range.end.character),
      )));
    }
  }

  for (const root of workspaceRoots) {
    const files = await vscode.workspace.findFiles(new vscode.RelativePattern(root, "**/*.sac"), "**/node_modules/**");
    for (const file of files) {
      const textDocument = await vscode.workspace.openTextDocument(file);
      const text = textDocument.getText();
      symbolPattern.lastIndex = 0;

      let match: RegExpExecArray | null;
      while ((match = symbolPattern.exec(text)) !== null) {
        const start = textDocument.positionAt(match.index);
        const end = textDocument.positionAt(match.index + match[0].length);
        const key = `${file.toString()}:${start.line}:${start.character}`;
        if (seen.has(key)) {
          continue;
        }

        seen.add(key);
        results.push(new vscode.Location(file, new vscode.Range(start, end)));
      }
    }
  }

  return results.length > 0 ? results : undefined;
}

export class ReferencesFallbackFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  public async activate(): Promise<void> {
    const enabled = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION).get<boolean>("features.fallback.enable", true);
    if (!enabled) {
      return;
    }

    const selector: vscode.DocumentSelector = [{ language: SAC_LANGUAGE_ID, scheme: SAC_URI_FILE_SCHEME }];
    this.disposables.push(
      vscode.languages.registerReferenceProvider(selector, {
        provideReferences: (document, position) => provideReferencesFallback(document, position),
      }),
    );
  }

  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}