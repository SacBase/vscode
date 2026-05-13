
import { type TextDocument } from "vscode-languageserver-textdocument";
import { type Hover, type MarkupContent, MarkupKind, type Position } from "vscode-languageserver/node";

import { BUILTIN_SYMBOL_NAME_PATTERN, IDENTIFIER_NAME_PATTERN } from "$constants/regex";
import { formatHoverDocumentationMarkdown, resolveHoverDocumentation } from "$lsp-server/hover-info/hoverDocs";
import { queryBackendHover } from "$lsp-server/navigation/backend";
import type { CompilerNavigationRuntimeConfig, HoverDebugLogger } from "$lsp-server/navigation/types";
import { lookupHoverTarget } from "$sac2c/parser/hover-info";
import type { HoverTarget } from "$sac2c/parser/hover-info/types";
import {
  readDefinitionDocComment,
  readDefinitionSignature
} from "$sac2c/parser/navigation/sourceDocs";

const HOVER_DEBUG_ENABLED = process.env.SAC_NAV_DEBUG === "1";

function logHoverDebug(message: string, payload?: Record<string, unknown>, debugLog?: HoverDebugLogger): void {
  if (debugLog) {
    debugLog(message, payload);
    return;
  }

  if (!HOVER_DEBUG_ENABLED) {
    return;
  }

  const serialized = payload ? ` ${JSON.stringify(payload)}` : "";
  process.stderr.write(`[sac-hover] ${message}${serialized}\n`);
}

function getLineText(document: TextDocument, line: number): string | null {
  const lines = document.getText().split(/\r?\n/);
  return lines[line] ?? null;
}

function hoverTargetFromCompilerSymbol(symbolName: string, symbolProvenance: string): HoverTarget | null {
  if (symbolProvenance === "builtin") {
    return {
      kind: "builtin",
      name: symbolName,
      summary: "Built-in SaC function.",
      callForm: `${symbolName}(...)`,
    };
  }

  if (symbolProvenance === "stdlib") {
    return {
      kind: "stdlib",
      name: symbolName,
      summary: "SaC StdLib function.",
      callForm: `${symbolName}(...)`,
    };
  }

  return null;
}

function hoverTargetFromSymbolName(symbolName: string): HoverTarget | null {
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

function createMarkdownContent(value: string): MarkupContent {
  return {
    kind: MarkupKind.Markdown,
    value,
  };
}

function pickPreferredSignature(primary: string | null, fallback: string | null): string | null {
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

export async function provideHover(
  document: TextDocument,
  position: Position,
  workspaceRoot: string,
  extensionInstallRoot: string,
  navigationBackend: "navjson" | "symbols",
  runtime: CompilerNavigationRuntimeConfig,
  debugLog?: HoverDebugLogger,
): Promise<Hover | null> {
  logHoverDebug(
    "hover-request",
    {
      uri: document.uri,
      line: position.line,
      character: position.character,
      runtimeExecutable: runtime.executable,
    },
    debugLog,
  );

  const compilerHover = await queryBackendHover(
    {
      backend: navigationBackend,
      document,
      position,
      workspaceRoot,
      runtime,
    },
    debugLog,
  );
  if (compilerHover) {
    logHoverDebug(
      "hover-compiler-hit",
      {
        definitionPath: compilerHover.definitionPath,
        definitionLine: compilerHover.definitionLine,
      },
      debugLog,
    );

    const lineText = getLineText(document, position.line) ?? "";
    const lexedMatch = lookupHoverTarget(lineText, position.character);
    const compilerTarget = hoverTargetFromCompilerSymbol(compilerHover.symbolName, compilerHover.symbolProvenance);

    const docComment = readDefinitionDocComment(compilerHover.definitionPath, compilerHover.definitionLine);
    const sourceSignature = readDefinitionSignature(compilerHover.definitionPath, compilerHover.definitionLine);
    const preferredSignature = pickPreferredSignature(compilerHover.signature, sourceSignature);
    const isUserSymbol = compilerHover.symbolProvenance === "user";
    let docsMarkdown: string | null = null;
    const docsTargets: HoverTarget[] = [];

    if (!isUserSymbol && lexedMatch) {
      docsTargets.push(lexedMatch.target);
    }
    if (compilerTarget) {
      docsTargets.push(compilerTarget);
    }
    if (!isUserSymbol) {
      const symbolNameTarget = hoverTargetFromSymbolName(compilerHover.symbolName);
      if (symbolNameTarget) {
        docsTargets.push(symbolNameTarget);
      }
    }

    for (const docsTarget of docsTargets) {
      docsMarkdown = resolveHoverDocumentation(workspaceRoot, extensionInstallRoot, docsTarget, document.uri);
      if (docsMarkdown) {
        break;
      }
    }

    const preferStaticDocs = !isUserSymbol;
    const docBody = preferStaticDocs ? (docsMarkdown ?? docComment) : (docComment ?? docsMarkdown);
    const metadata = [
      `Kind: \`${compilerHover.symbolKind}\``,
      compilerHover.resolutionReason ? `Resolution: ${compilerHover.resolutionReason}` : "",
    ]
      .filter((line) => line.length > 0)
      .join("\n\n");
    const markdown = formatHoverDocumentationMarkdown(docBody ? `${docBody.trimEnd()}\n\n${metadata}` : metadata, {
      signature: preferredSignature,
    });

    const hasUsefulDocs = Boolean(docBody?.trim());
    const hasUsefulSignature = Boolean(preferredSignature?.trim());

    if (isUserSymbol) {
      return {
        contents: createMarkdownContent(markdown),
        range: compilerHover.range,
      };
    }

    if (!hasUsefulDocs && !hasUsefulSignature) {
      logHoverDebug(
        "hover-compiler-low-confidence-fallback",
        {
          symbolName: compilerHover.symbolName,
          symbolKind: compilerHover.symbolKind,
        },
        debugLog,
      );
      // Compiler provided low-confidence result. Do not perform
      // extension/server-side fallback here. Let client decide
      // whether to run local fallback providers after it receives
      // a "sac/compiler/failed" notification from server.
      return null;
    } else {
      return {
        contents: createMarkdownContent(markdown),
        range: compilerHover.range,
      };
    }
  }
  // No hover info from compiler. Do not attempt to synthesize fallback
  // here; return null so server can notify client and client may choose
  // to run local fallback providers if desired.
  logHoverDebug("hover-compiler-miss", undefined, debugLog);
  return null;
}