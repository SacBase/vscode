import { ASSIGNMENT_PATTERN, IDENTIFIER_CHARS } from "$constants/regex";
import { extractCallExpressionSource } from "$sac2c/parser/navigation/callExpression";
import {
  getCandidateParameterShapes,
  getCandidateReturnShape,
  scoreShapeCompatibility,
  type ValueShape,
} from "$sac2c/parser/navigation/shapeScoring";
import type { NavigationIndex, NavigationSymbol, NavigationToken } from "$sac2c/parser/navigation/types";
import { splitTopLevel } from "$util/textSplit";

function inferExpressionShape(
  expressionText: string,
  sourceText: string,
  index: NavigationIndex,
  variableShapes: Map<string, ValueShape>,
  depth: number,
): ValueShape {
  const text = expressionText.trim();
  if (text.length === 0) {
    return "unknown";
  }

  if (text.startsWith("[") && text.endsWith("]")) {
    return "array";
  }

  if (/^(?:-?\d+(?:\.\d+)?|true|false)$/i.test(text)) {
    return "scalar";
  }

  const wrapped = text.match(/^\((.*)\)$/s);
  if (wrapped) {
    return inferExpressionShape(wrapped[1], sourceText, index, variableShapes, depth + 1);
  }

  const callMatch = text.match(new RegExp(`^(${IDENTIFIER_CHARS})\\s*\\((.*)\\)$`, "s"));
  if (callMatch && depth < 6) {
    return inferCallReturnShape(callMatch[1], callMatch[2], sourceText, index, variableShapes, depth + 1);
  }

  if (new RegExp(`^${IDENTIFIER_CHARS}$`).test(text)) {
    return variableShapes.get(text) ?? "unknown";
  }

  return "unknown";
}

function inferCallReturnShape(
  functionName: string,
  argumentText: string,
  sourceText: string,
  index: NavigationIndex,
  variableShapes: Map<string, ValueShape>,
  depth: number,
): ValueShape {
  const candidates = index.symbols.filter((symbol) => symbol.kind === "function" && symbol.name === functionName);
  if (candidates.length === 0) {
    return "unknown";
  }

  const argumentShapes = splitTopLevel(argumentText, ",").map((expression) =>
    inferExpressionShape(expression, sourceText, index, variableShapes, depth + 1),
  );

  let bestShape: ValueShape = "unknown";
  let bestScore = -1;

  for (const candidate of candidates) {
    const parameterShapes = getCandidateParameterShapes(index, candidate);
    const score = scoreShapeCompatibility(parameterShapes, argumentShapes);
    if (score === null || score < bestScore) {
      continue;
    }

    bestScore = score;
    bestShape = getCandidateReturnShape(index, candidate);
  }

  return bestShape;
}

function buildVariableShapeMap(sourceText: string, index: NavigationIndex): Map<string, ValueShape> {
  const variableShapes = new Map<string, ValueShape>();
  const lines = sourceText.split(/\r?\n/);

  for (let iteration = 0; iteration < 3; iteration += 1) {
    for (const lineText of lines) {
      const assignmentMatch = lineText.match(ASSIGNMENT_PATTERN);
      if (!assignmentMatch) {
        continue;
      }

      const inferredShape = inferExpressionShape(assignmentMatch[2], sourceText, index, variableShapes, 0);
      if (inferredShape !== "unknown") {
        variableShapes.set(assignmentMatch[1], inferredShape);
      }
    }
  }

  return variableShapes;
}

function isLikelyDefinitionHeader(sourceText: string, line: number, symbolName: string): boolean {
  const lines = sourceText.split(/\r?\n/);
  const lineText = lines[line]?.trim() ?? "";
  if (!lineText.includes(symbolName) || !lineText.includes("(")) {
    return false;
  }

  const nextNonEmptyLine = lines.slice(line + 1).find((nextLine) => nextLine.trim().length > 0);
  return nextNonEmptyLine?.trim() === "{";
}

/**
 * Chooses best overload candidate by comparing inferred argument shapes with signature parameter shapes.
 */
export function selectBestOverloadSymbol(
  index: NavigationIndex,
  sourceText: string | undefined,
  target: NavigationToken,
  selected: NavigationSymbol,
): NavigationSymbol {
  if (!sourceText || selected.kind !== "function" || isLikelyDefinitionHeader(sourceText, target.range.start.line, selected.name)) {
    return selected;
  }

  const callArgumentText = extractCallExpressionSource(sourceText, target.range.start.line, target.range.end.character);
  if (callArgumentText === null) {
    return selected;
  }

  const variableShapes = buildVariableShapeMap(sourceText, index);
  const candidates = index.symbols.filter((symbol) => symbol.kind === "function" && symbol.name === selected.name);
  if (candidates.length <= 1) {
    return selected;
  }

  let bestSymbol = selected;
  let bestScore = -1;

  for (const candidate of candidates) {
    const parameterShapes = getCandidateParameterShapes(index, candidate);
    const argumentShapes = splitTopLevel(callArgumentText, ",").map((expression) =>
      inferExpressionShape(expression, sourceText, index, variableShapes, 0),
    );

    const score = scoreShapeCompatibility(parameterShapes, argumentShapes);
    if (score === null || score < bestScore) {
      continue;
    }

    bestScore = score;
    bestSymbol = candidate;
  }

  return bestSymbol;
}
