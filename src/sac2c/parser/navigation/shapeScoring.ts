import type { NavigationIndex, NavigationSignatureEntry, NavigationSymbol } from "$sac2c/parser/navigation/types";

export type ValueShape = "scalar" | "array" | "unknown";

function shapeFromTypeRepr(typeRepr: string | undefined): ValueShape {
  if (!typeRepr) {
    return "unknown";
  }

  const normalized = typeRepr.toLowerCase();
  if (normalized.includes("[") || normalized.includes("array") || normalized.includes("vector") || normalized.includes("shape")) {
    return "array";
  }

  return "scalar";
}

function getSignatureEntry(index: NavigationIndex, symbol: NavigationSymbol): NavigationSignatureEntry | null {
  const signatureId = symbol.signatureIds?.[0];
  if (!signatureId) {
    return null;
  }

  return index.signatures?.find((entry) => entry.id === signatureId) ?? null;
}

export function getCandidateParameterShapes(index: NavigationIndex, symbol: NavigationSymbol): ValueShape[] {
  const signature = getSignatureEntry(index, symbol);
  if (!signature) {
    return [];
  }

  return signature.signature.parameters.map((parameter) => shapeFromTypeRepr(parameter.typeShape?.typeRepr));
}

export function getCandidateReturnShape(index: NavigationIndex, symbol: NavigationSymbol): ValueShape {
  const signature = getSignatureEntry(index, symbol);
  if (!signature) {
    return "unknown";
  }

  const shapes = signature.signature.returns.map((returnType) => shapeFromTypeRepr(returnType.typeRepr));
  if (shapes.includes("array")) {
    return "array";
  }

  if (shapes.includes("scalar")) {
    return "scalar";
  }

  return "unknown";
}

/**
 * Scores how well actual argument shapes fit expected parameter shapes.
 * Returns null when candidate is incompatible.
 */
export function scoreShapeCompatibility(expected: ValueShape[], actual: ValueShape[]): number | null {
  if (expected.length !== actual.length) {
    return null;
  }

  let score = 0;
  for (let positionIndex = 0; positionIndex < expected.length; positionIndex += 1) {
    const expectedShape = expected[positionIndex];
    const actualShape = actual[positionIndex];

    if (expectedShape !== "unknown" && actualShape !== "unknown" && expectedShape !== actualShape) {
      return null;
    }

    if (expectedShape !== "unknown" && actualShape !== "unknown" && expectedShape === actualShape) {
      score += 2;
    } else if (expectedShape !== "unknown" || actualShape !== "unknown") {
      score += 1;
    }
  }

  return score;
}
