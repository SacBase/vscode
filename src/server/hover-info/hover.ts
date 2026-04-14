import { fileURLToPath } from "url";

import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Hover,
  MarkupContent,
  MarkupKind,
  Position,
  Range,
} from "vscode-languageserver/node";

import { formatHoverMarkdown, lookupHoverTarget } from "$sac2c/hover";
import { HoverTarget } from "$sac2c/hover/types";
import {
  extractDefinitionSignatureFromText,
  findFunctionCallAtPosition,
  findFunctionDefinitionAtPosition,
  findFunctionDefinitionLineByName,
  readDefinitionDocComment,
  readDefinitionSignature,
} from "$sac2c/parser/navigation/sourceDocs";
import { BUILTIN_SYMBOL_NAME_PATTERN, IDENTIFIER_NAME_PATTERN } from "../../constants/regex";
import { queryCompilerHover } from "../navigation/compilerAdapter";
import { CompilerNavigationRuntimeConfig } from "../navigation/types";
import { formatHoverDocumentationMarkdown, resolveHoverDocumentation } from "./hoverDocs";

const HOVER_DEBUG_ENABLED = process.env.SAC_NAV_DEBUG === "1";

function logHoverDebug(message: string, payload?: Record<string, unknown>): void {
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

function createLineRange(line: number, start: number, end: number): Range {
  return {
    start: { line, character: start },
    end: { line, character: end },
  };
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

  // Prefer source signature when it carries richer assertion formatting.
  if ((!primary.includes("|") && fallback.includes("|"))
    || (!primary.includes("\n") && fallback.includes("\n") && fallback.includes("|"))) {
    return fallback;
  }

  return primary;
}

/**
 * Produces hover response.
 *
 * Strategy:
 * 1) Try compiler-backed navjson hover for exact semantic hit.
 * 2) Fall back to static StdLib/builtin docs matcher.
 */
export async function provideHover(
  document: TextDocument,
  position: Position,
  workspaceRoot: string,
  extensionInstallRoot: string,
  runtime: CompilerNavigationRuntimeConfig,
): Promise<Hover | null> {
  logHoverDebug("hover-request", {
    uri: document.uri,
    line: position.line,
    character: position.character,
    runtimeExecutable: runtime.executable,
  });

  const compilerHover = await queryCompilerHover({
    document,
    position,
    workspaceRoot,
    runtime,
  });
  if (compilerHover) {
    logHoverDebug("hover-compiler-hit", {
      definitionPath: compilerHover.definitionPath,
      definitionLine: compilerHover.definitionLine,
    });

    const lineText = getLineText(document, position.line) ?? "";
    const lexedMatch = lookupHoverTarget(lineText, position.character);
    const compilerTarget = hoverTargetFromCompilerSymbol(compilerHover.symbolName, compilerHover.symbolProvenance);

    const docComment = readDefinitionDocComment(compilerHover.definitionPath, compilerHover.definitionLine);
    const sourceSignature = readDefinitionSignature(compilerHover.definitionPath, compilerHover.definitionLine);
    const preferredSignature = pickPreferredSignature(compilerHover.signature, sourceSignature);
    let docsMarkdown: string | null = null;
    const docsTargets: HoverTarget[] = [];
    if (lexedMatch) {
      docsTargets.push(lexedMatch.target);
    }
    if (compilerTarget) {
      docsTargets.push(compilerTarget);
    }
    if (compilerHover.symbolProvenance !== "user") {
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

    const preferStaticDocs = compilerHover.symbolProvenance !== "user";
    const docBody = preferStaticDocs ? (docsMarkdown ?? docComment) : (docComment ?? docsMarkdown);
    const metadata = [
      `Kind: \`${compilerHover.symbolKind}\``,
      compilerHover.resolutionReason ? `Resolution: ${compilerHover.resolutionReason}` : "",
    ]
      .filter((line) => line.length > 0)
      .join("\n\n");
    const markdown = formatHoverDocumentationMarkdown(
      docBody ? `${docBody.trimEnd()}\n\n${metadata}` : metadata,
      { signature: preferredSignature },
    );

    const hasUsefulDocs = Boolean(docBody?.trim());
    const hasUsefulSignature = Boolean(preferredSignature?.trim());
    if (!hasUsefulDocs && !hasUsefulSignature) {
      logHoverDebug("hover-compiler-low-confidence-fallback", {
        symbolName: compilerHover.symbolName,
        symbolKind: compilerHover.symbolKind,
      });
    } else {
      return {
        contents: createMarkdownContent(markdown),
        range: compilerHover.range,
      };
    }
  }

  logHoverDebug("hover-compiler-miss");

  const sourceText = document.getText();
  const sourceDefinition = findFunctionDefinitionAtPosition(sourceText, position.line, position.character);
  if (sourceDefinition && document.uri.startsWith("file://")) {
    logHoverDebug("hover-source-definition-hit", {
      name: sourceDefinition.name,
      definitionLine: sourceDefinition.definitionLine,
    });

    const docComment = readDefinitionDocComment(fileURLToPath(document.uri), sourceDefinition.definitionLine);
    const signature = extractDefinitionSignatureFromText(sourceText, sourceDefinition.definitionLine);
    if (docComment) {
      logHoverDebug("hover-source-doc-hit", { length: docComment.length });
    } else {
      logHoverDebug("hover-source-doc-miss");
    }

    if (!docComment && !signature) {
      return null;
    }

    return {
      contents: createMarkdownContent(formatHoverDocumentationMarkdown(docComment ?? "", { signature })),
      range: createLineRange(position.line, sourceDefinition.startCharacter, sourceDefinition.endCharacter),
    };
  }

  if (document.uri.startsWith("file://")) {
    const sourceCall = findFunctionCallAtPosition(sourceText, position.line, position.character);
    if (sourceCall) {
      const definitionLine = findFunctionDefinitionLineByName(sourceText, sourceCall.name);
      if (definitionLine !== null) {
        const filePath = fileURLToPath(document.uri);
        const docComment = readDefinitionDocComment(filePath, definitionLine);
        const signature = readDefinitionSignature(filePath, definitionLine);
        if (!docComment && !signature) {
          return null;
        }
        logHoverDebug("hover-source-call-hit", {
          name: sourceCall.name,
          definitionLine,
          hasDocComment: Boolean(docComment),
        });

        return {
          contents: createMarkdownContent(formatHoverDocumentationMarkdown(docComment ?? "", { signature })),
          range: createLineRange(position.line, sourceCall.startCharacter, sourceCall.endCharacter),
        };
      }
    }
  }

  const lineText = getLineText(document, position.line);
  if (lineText === null) {
    logHoverDebug("hover-no-line-text");
    return null;
  }

  const match = lookupHoverTarget(lineText, position.character);
  if (!match) {
    logHoverDebug("hover-no-stdlib-builtin-match");
    return null;
  }

  const markdownFromDocs = resolveHoverDocumentation(
    workspaceRoot,
    extensionInstallRoot,
    match.target,
    document.uri,
  );

  logHoverDebug("hover-stdlib-builtin-hit", {
    target: match.target.name,
    kind: match.target.kind,
    hasDocs: Boolean(markdownFromDocs),
  });

  return {
    contents: createMarkdownContent(markdownFromDocs ?? formatHoverMarkdown(match.target)),
    range: createLineRange(position.line, match.start, match.end),
  };
}
