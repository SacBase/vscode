import { HoverMatch, HoverTarget } from "./types";
// This is an initial set of StdLib wrappers. Prefer maintaining full details via docs markdown files.
const STDLIB_FUNCTION_NAMES = [
  "shape",
  "reshape",
  "sel",
  "take",
  "drop",
  "cat",
  "dim",
  "size",
  "all",
  "min",
  "max",
  "print",
  "transpose",
  "zero",
  "toi",
  "tof",
  "toc",
  "tob",
  "tos",
  "toui",
  "toul",
  "toull",
  "toub",
  "tous",
  "genarray",
  "modarray",
  "fold",
  "foldfix",
  "propagate",
] as const;

const STDLIB_TARGETS = new Map<string, HoverTarget>(
  STDLIB_FUNCTION_NAMES.map((name) => [name, createHoverTarget(name, "stdlib")]),
);

const BUILTIN_FUNCTION_PATTERN = /(^|[^A-Za-z0-9_])(_[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*_)(?=\s*\()/g;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createHoverTarget(name: string, kind: HoverTarget["kind"]): HoverTarget {
  if (kind === "builtin") {
    return {
      kind,
      name,
      summary: "Built-in SaC function.",
      callForm: `${name}(...)`,
    };
  }

  return {
    kind,
    name,
    summary: "SaC StdLib function.",
    callForm: `${name}(...)`,
  };
}

function isColumnInsideMatch(column: number, start: number, end: number): boolean {
  return column >= start && column < end;
}

function lookupStdlib(lineText: string, column: number): HoverMatch | null {
  for (const name of STDLIB_FUNCTION_NAMES) {
    const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b(?=\\s*\\()`, "g");
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(lineText)) !== null) {
      const start = match.index;
      const end = start + name.length;
      if (!isColumnInsideMatch(column, start, end)) {
        continue;
      }

      const target = STDLIB_TARGETS.get(name);
      if (!target) {
        return null;
      }

      return { target, start, end };
    }
  }

  return null;
}

function lookupBuiltin(lineText: string, column: number): HoverMatch | null {
  let match: RegExpExecArray | null;
  while ((match = BUILTIN_FUNCTION_PATTERN.exec(lineText)) !== null) {
    const token = match[2];
    const start = match.index + match[1].length;
    const end = start + token.length;
    if (!isColumnInsideMatch(column, start, end)) {
      continue;
    }

    return {
      target: createHoverTarget(token, "builtin"),
      start,
      end,
    };
  }

  return null;
}

/**
 * Finds hover information for a token on a single source line.
 */
export function lookupHoverTarget(lineText: string, column: number): HoverMatch | null {
  const stdlib = lookupStdlib(lineText, column);
  if (stdlib) {
    return stdlib;
  }

  return lookupBuiltin(lineText, column);
}

/**
 * Formats a hover target as markdown content.
 */
export function formatHoverMarkdown(target: HoverTarget): string {
  return [
    `### \`${target.name}\``,
    "",
    target.summary,
    "",
    `Call form: \`${target.callForm}\``,
  ].join("\n");
}
