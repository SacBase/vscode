import { SAC_CONFIG_SECTION, SAC_LANGUAGE_ID, SAC_URI_FILE_SCHEME } from "$constants/language";
import { getSymbolAtPosition } from "$extension/fallback/navigation/symbol";
import { queryWorkspaceDefinitions } from "$extension/fallback/navigation/workspaceDefinitions";
import type { FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";
import { DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS } from "$extension/settings";
import { queryStdlibDefinitions } from "$sac2c/parser/navigation/stdlib";
import * as vscode from "vscode";
import { TextDocument } from "vscode-languageserver-textdocument";

function toLocation(location: { uri: string; range: { start: { line: number; character: number }; end: { line: number; character: number } } }): vscode.Location {
  return new vscode.Location(
    vscode.Uri.parse(location.uri),
    new vscode.Range(
      new vscode.Position(location.range.start.line, location.range.start.character),
      new vscode.Position(location.range.end.line, location.range.end.character),
    ),
  );
}

export function provideDefinitionFallback(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Definition> {
  const symbol = getSymbolAtPosition(document, position);
  if (!symbol) {
    return undefined;
  }

  const workspaceRoots = getWorkspaceRoots();
  if (workspaceRoots.length === 0) {
    return undefined;
  }

  const currentDocumentUri = document.uri.toString();
  const openDocuments = getOpenDocuments();
  const excludedDirNames = getExcludedDirNames();
  const fallbackLocations = queryWorkspaceDefinitions({
    symbolName: symbol.name,
    currentDocumentUri,
    workspaceRoots,
    openDocuments,
    excludedDirNames,
  }).map(toLocation);

  if (fallbackLocations.length > 0) {
    return fallbackLocations.length === 1 ? fallbackLocations[0] : fallbackLocations;
  }

  const stdlibLocations = queryStdlibDefinitions(symbol.name, workspaceRoots[0]).map(toLocation);
  if (stdlibLocations.length > 0) {
    return stdlibLocations.length === 1 ? stdlibLocations[0] : stdlibLocations;
  }

  return undefined;
}

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
  const values = config.get<string[]>("diagnostics.workspaceScan.excludeDirectories", [...DEFAULT_WORKSPACE_SCAN_EXCLUDE_DIRS]);
  return new Set(values);
}

function getOpenDocuments(): TextDocument[] {
  return vscode.workspace.textDocuments
    .filter((document) => document.languageId === SAC_LANGUAGE_ID)
    .map((document) => TextDocument.create(document.uri.toString(), SAC_LANGUAGE_ID, 0, document.getText()));
}

export class SacDefinitionFallbackProvider implements vscode.DefinitionProvider {
  public provideDefinition(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Definition> {
    return provideDefinitionFallback(document, position);
  }
}

export class DefinitionFallbackFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  public async activate(): Promise<void> {
    const enabled = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION).get<boolean>("features.fallback.enable", true);
    if (!enabled) {
      return;
    }

    const selector: vscode.DocumentSelector = [{ language: SAC_LANGUAGE_ID, scheme: SAC_URI_FILE_SCHEME }];
    this.disposables.push(vscode.languages.registerDefinitionProvider(selector, new SacDefinitionFallbackProvider()));
  }

  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}