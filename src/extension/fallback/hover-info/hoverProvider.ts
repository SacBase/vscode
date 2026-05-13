import { SAC_CONFIG_SECTION, SAC_LANGUAGE_ID, SAC_URI_FILE_SCHEME } from "$constants/language";
import { BUILTIN_SYMBOL_NAME_PATTERN, IDENTIFIER_NAME_PATTERN } from "$constants/regex";
import { getSymbolAtPosition } from "$extension/fallback/navigation/symbol";
import type { FeatureLifecycle } from "$extension/lsp-client/languageClientFeature";
import { formatHoverDocumentationMarkdown, resolveHoverDocumentation } from "$lsp-server/hover-info/hoverDocs";
import { formatHoverMarkdown, lookupHoverTarget } from "$sac2c/parser/hover-info";
import type { HoverTarget } from "$sac2c/parser/hover-info/types";
import {
  findFunctionCallAtPosition,
  findFunctionDefinitionAtPosition,
  findFunctionDefinitionLineByName,
  readDefinitionDocComment,
  readDefinitionSignature,
} from "$sac2c/parser/navigation/sourceDocs";
import * as vscode from "vscode";

export async function provideHoverFallback(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | undefined> {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? vscode.workspace.rootPath ?? process.cwd();
  const extensionInstallRoot = vscode.extensions.getExtension("SacBase.sac-language-support")?.extensionPath ?? "";

  const sourceText = document.getText();
  const sourceDefinition = findFunctionDefinitionAtPosition(sourceText, position.line, position.character);
  if (sourceDefinition && document.uri.scheme === "file") {
    const docComment = readDefinitionDocComment(document.uri.fsPath, sourceDefinition.definitionLine);
    const signature = readDefinitionSignature(document.uri.fsPath, sourceDefinition.definitionLine);
    if (docComment || signature) {
      return new vscode.Hover(
        createMarkdownContent(formatHoverDocumentationMarkdown(docComment ?? "", { signature })),
        toRange(position.line, sourceDefinition.startCharacter, sourceDefinition.endCharacter),
      );
    }
  }

  if (document.uri.scheme === "file") {
    const sourceCall = findFunctionCallAtPosition(sourceText, position.line, position.character);
    if (sourceCall) {
      const definitionLine = findFunctionDefinitionLineByName(sourceText, sourceCall.name);
      if (definitionLine !== null) {
        const docComment = readDefinitionDocComment(document.uri.fsPath, definitionLine);
        const signature = readDefinitionSignature(document.uri.fsPath, definitionLine);
        if (docComment || signature) {
          return new vscode.Hover(
            createMarkdownContent(formatHoverDocumentationMarkdown(docComment ?? "", { signature })),
            toRange(position.line, sourceCall.startCharacter, sourceCall.endCharacter),
          );
        }
      }
    }
  }

  const lineText = getLineText(document, position.line);
  if (lineText === null) {
    return undefined;
  }

  const match = lookupHoverTarget(lineText, position.character);
  if (!match) {
    const symbol = getSymbolAtPosition(document, position);
    if (!symbol) {
      return undefined;
    }

    const definitionLine = findFunctionDefinitionLineByName(sourceText, symbol.name);
    if (definitionLine !== null) {
      const docComment = readDefinitionDocComment(document.uri.fsPath, definitionLine);
      const signature = readDefinitionSignature(document.uri.fsPath, definitionLine);
      if (docComment || signature) {
        return new vscode.Hover(
          createMarkdownContent(formatHoverDocumentationMarkdown(docComment ?? "", { signature })),
          new vscode.Range(new vscode.Position(position.line, symbol.start), new vscode.Position(position.line, symbol.end)),
        );
      }
    }

    return undefined;
  }

  const markdownFromDocs = resolveHoverDocumentation(workspaceRoot, extensionInstallRoot, match.target, document.uri.toString());

  return new vscode.Hover(
    createMarkdownContent(markdownFromDocs ?? formatHoverMarkdown(match.target)),
    toRange(position.line, match.start, match.end),
  );
}

function getLineText(document: vscode.TextDocument, line: number): string | null {
  return document.lineAt(line)?.text ?? null;
}
//! This was useful once, I am keeping it in for now because my refactors made the codebase a mess.
function _hoverTargetFromSymbolName(symbolName: string): HoverTarget | null {
  if (BUILTIN_SYMBOL_NAME_PATTERN.test(symbolName)) {
    return {
      kind: "builtin",
      name: symbolName,
      summary: "Built-in SaC function.",
      callForm: `${symbolName}(...)`,
    };
  }

  if (IDENTIFIER_NAME_PATTERN.test(symbolName)) {
    return {
      kind: "stdlib",
      name: symbolName,
      summary: "SaC StdLib function.",
      callForm: `${symbolName}(...)`,
    };
  }

  return null;
}

function createMarkdownContent(value: string): vscode.MarkdownString {
  return new vscode.MarkdownString(value);
}
//! This was useful once, I am keeping it in for now because my refactors made the codebase a mess.
function _pickPreferredSignature(primary: string | null, fallback: string | null): string | null {
  if (!primary) {
    return fallback;
  }

  if (!fallback) {
    return primary;
  }

  if ((!primary.includes("|") && fallback.includes("|")) || (!primary.includes("\n") && fallback.includes("\n") && fallback.includes("|"))) {
    return fallback;
  }

  return primary;
}

function toRange(line: number, start: number, end: number): vscode.Range {
  return new vscode.Range(new vscode.Position(line, start), new vscode.Position(line, end));
}

export class SacHoverFallbackProvider implements vscode.HoverProvider {
  public provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
    return provideHoverFallback(document, position);
  }
}

export class HoverFallbackFeature implements FeatureLifecycle {
  private disposables: vscode.Disposable[] = [];

  public async activate(): Promise<void> {
    const enabled = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION).get<boolean>("features.fallback.enable", true);
    if (!enabled) {
      return;
    }

    const selector: vscode.DocumentSelector = [{ language: SAC_LANGUAGE_ID, scheme: SAC_URI_FILE_SCHEME }];
    this.disposables.push(vscode.languages.registerHoverProvider(selector, new SacHoverFallbackProvider()));
  }

  public async deactivate(): Promise<void> {
    this.disposables.forEach((entry) => entry.dispose());
    this.disposables = [];
  }
}