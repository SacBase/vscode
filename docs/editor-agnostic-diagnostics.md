# Editor-Agnostic Diagnostics Architecture

This project now separates compiler-diagnostics logic into a reusable core module.

## Goals

- Keep diagnostics parsing and grouping independent from VS Code APIs.
- Provide a stable JSON contract for adapters used by other editors.
- Keep editor-specific code thin and focused on protocol adaptation.

## Module Split

1. Generic core
- Path: `src/core/diagnostics/`
- No imports from VS Code or LSP libraries.
- Responsibilities:
  - parse `sac2c` output into normalized diagnostics
  - group primary errors with context frames
  - render diagnostics in `expanded`, `smart`, or `hybrid` mode
  - export canonical JSON and SARIF

2. VS Code/LSP adapter layer
- Path: `src/server/diagnostics/`
- Responsibilities:
  - map core severities to LSP severities
  - convert core diagnostics to LSP diagnostics and relatedInformation
  - apply squiggle-range heuristics for VS Code visualization

3. Server orchestration
- Path: `src/server/server.ts`
- Responsibilities:
  - invoke `sac2c`
  - fetch workspace settings
  - run parse/group/present pipeline
  - publish diagnostics via LSP

## JSON Contract

Canonical report format:

- `schemaVersion`: `sac.diagnostics/v1`
- `tool`: `sac2c`
- `diagnostics`: rendered diagnostics with anchor, message, related entries

This report is designed to be adapter-friendly. A fork or another editor plugin can parse this JSON and map it to its own diagnostics APIs.

## SARIF Support

The core module can convert the canonical report to SARIF 2.1.0, which is useful for tools that already understand SARIF.

## Why We Still Use Best-Effort Heuristics

`sac2c` output is already useful, but it does not always provide enough structured data for perfect source mapping.

- Columns can be missing or point to broad locations.
- Grouping between root causes and context frames is implied by output order.
- Context lines like `-- in Array::sel(...)` are useful clues, not complete explanations.

Because of this, smart diagnostics use best-effort grouping and range heuristics while preserving traceability in related information.
