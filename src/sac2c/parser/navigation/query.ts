import { selectBestOverloadSymbol } from "$sac2c/parser/navigation/overloadInference";
import {
  buildFileMap,
  findBinding,
  findSymbol,
  findTargetToken,
  findTokenById,
  normalizeComparePath,
} from "$sac2c/parser/navigation/pathResolution";
import { formatSignature } from "$sac2c/parser/navigation/signatureFormatting";
import type { NavigationDefinitionHit, NavigationHoverHit, NavigationIndex } from "$sac2c/parser/navigation/types";

/**
 * Resolves goto-definition target from navjson index for cursor position.
 */
export function resolveDefinitionFromIndex(
  index: NavigationIndex,
  workspaceRoot: string,
  sourceFilePath: string,
  line: number,
  character: number,
  sourceText?: string,
): NavigationDefinitionHit[] {
  const fileMap = buildFileMap(index, workspaceRoot);
  const normalizedSourcePath = normalizeComparePath(sourceFilePath);
  const target = findTargetToken(index, fileMap, normalizedSourcePath, line, character);
  if (!target) {
    return [];
  }

  const binding = findBinding(index, target.id);
  const selected = findSymbol(index, binding?.selectedSymbolId ?? target.enclosingSymbolId);
  if (!selected) {
    return [];
  }

  const resolvedSymbol = selectBestOverloadSymbol(index, sourceText, target, selected);

  const definitionToken = findTokenById(index, resolvedSymbol.definitionTokenId);
  if (!definitionToken) {
    return [];
  }

  const definitionPath = fileMap.get(definitionToken.fileId);
  if (!definitionPath) {
    return [];
  }

  return [
    {
      path: definitionPath,
      range: definitionToken.range,
    },
  ];
}

/**
 * Resolves hover markdown from navjson symbol/binding/signature data.
 */
export function resolveHoverFromIndex(
  index: NavigationIndex,
  workspaceRoot: string,
  sourceFilePath: string,
  line: number,
  character: number,
  sourceText?: string,
): NavigationHoverHit | null {
  const fileMap = buildFileMap(index, workspaceRoot);
  const normalizedSourcePath = normalizeComparePath(sourceFilePath);
  const target = findTargetToken(index, fileMap, normalizedSourcePath, line, character);
  if (!target) {
    return null;
  }

  const binding = findBinding(index, target.id);
  const selected = findSymbol(index, binding?.selectedSymbolId ?? target.enclosingSymbolId);
  if (!selected) {
    return null;
  }

  const resolvedSymbol = selectBestOverloadSymbol(index, sourceText, target, selected);

  const signatureId = resolvedSymbol.signatureIds?.[0];
  const signature = signatureId ? (index.signatures?.find((entry) => entry.id === signatureId) ?? null) : null;

  const signatureMarkdown = formatSignature(resolvedSymbol.name, signature);
  const definitionToken = findTokenById(index, resolvedSymbol.definitionTokenId);
  if (!definitionToken) {
    return null;
  }

  const definitionPath = fileMap.get(definitionToken.fileId);
  if (!definitionPath) {
    return null;
  }

  const markdownParts: string[] = [`Kind: \`${resolvedSymbol.kind}\``];

  if (binding?.reason) {
    markdownParts.push("", `Resolution: ${binding.reason}`);
  }

  return {
    markdown: markdownParts.join("\n"),
    signature: signatureMarkdown,
    symbolName: resolvedSymbol.name,
    symbolKind: resolvedSymbol.kind,
    symbolProvenance: resolvedSymbol.provenance,
    resolutionReason: binding?.reason ?? null,
    range: target.range,
    definitionPath,
    definitionLine: definitionToken.range.start.line,
  };
}
