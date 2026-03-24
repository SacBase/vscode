# SaC Diagnostics Pipeline

This document describes how the language server turns `sac2c` output into VS Code diagnostics.

## Why We Use A Best-Effort Pipeline

The current compiler output is useful but not fully structured for editor diagnostics.

- Some entries do not include precise column data for the most relevant symbol.
- Scope/call relationships are implied by output ordering instead of explicit IDs.
- Context lines such as `-- in Array::sel(...)` are helpful for traceability, but they are not self-explanatory as standalone errors.

Because of these limitations, the extension uses a best-effort approach that combines parsing, grouping, and range heuristics.

## Data Flow

1. Parse
- File: `src/core/diagnostics/parse.ts`
- Converts one-line `sac2c` output into normalized entries (`file`, `line`, `column`, `severity`, `message`).
- Drops summary noise like `Compilation failed ...`.

2. Group
- File: `src/core/diagnostics/group.ts`
- Groups entries into root-cause chains.
- First non-context entry is the primary cause.
- Following `-- in ...` entries are context frames.

3. Present
- File: `src/core/diagnostics/present.ts`
- Applies rendering mode:
  - `expanded`: emit all local entries.
  - `smart`: emit one actionable local diagnostic per chain.
  - `hybrid`: smart output plus extra local context entries.

4. Range Selection
- File: `src/server/diagnostics/range.ts`
- Chooses squiggle range with token/symbol heuristics.
- Falls back to statement-level ranges when compiler columns are too weak.

5. Related Information
- File: `src/server/diagnostics/relatedInfo.ts`
- Adds origin and frame references to hover/Problems details when enabled.

## Presentation Settings

The extension exposes settings under the `sac.diagnostics.*` namespace:

- `sac.diagnostics.presentation`
- `sac.diagnostics.includeRelatedInformation`
- `sac.diagnostics.includeStackInMessage`
- `sac.diagnostics.maxStackFrames`

## Trade-Offs

- `smart` mode improves signal-to-noise and squiggle relevance.
- `expanded` mode preserves near-raw compiler visibility for debugging parser behavior.
- `hybrid` mode keeps the actionable anchor while still showing local call-chain context.

## Future Improvements

If `sac2c` eventually exposes structured diagnostic groups and precise machine-readable source spans, this pipeline can be simplified and made more exact.

The adapter split and JSON contract are described in `docs/editor-agnostic-diagnostics.md`.
