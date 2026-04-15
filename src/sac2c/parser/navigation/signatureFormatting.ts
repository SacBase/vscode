import { NavigationSignatureEntry } from "$sac2c/parser/navigation/types";

/**
 * Formats signature from structured signature payload.
 * Returns null for low-confidence display strings.
 */
export function formatSignature(symbolName: string, signature: NavigationSignatureEntry | null): string | null {
  if (!signature) {
    return null;
  }

  const params = signature.signature.parameters
    .map((param) => `${param.typeShape?.typeRepr ?? "unknown"} ${param.name}`.trim())
    .join(", ");
  const returnTypes = signature.signature.returns
    .map((ret) => ret.typeRepr ?? "unknown")
    .join(", ");
  const returns = returnTypes.length > 0 ? `${returnTypes} ` : "";

  if (params.length > 0 || returnTypes.length > 0) {
    return `${returns}${symbolName}(${params})`;
  }

  const display = signature.signature.display.trim();
  if (display.length > 0) {
    const compact = display.replace(/\s+/g, " ").trim();
    const referencesSymbol = compact.includes(`${symbolName}(`) || compact.startsWith("(");
    const hasStatementMarkers = compact.includes(";")
      || /\breturn\b/i.test(compact)
      || /[{}|]/.test(compact);
    if (!referencesSymbol || hasStatementMarkers) {
      return null;
    }

    if (display.includes("\n")) {
      return null;
    }

    if (display.startsWith("(")) {
      return `${symbolName}${display}`;
    }

    return display;
  }

  return null;
}
