# Change Log

All notable changes to the "sac-language-support" extension will be documented in this file.

## [0.0.1]: [release date]

### Language + Editor Support

- Added SaC language registration for `.sac` files.
- Added language configuration for editor behaviors (comments/brackets/word boundaries).
- Added SaC TextMate grammar + injection support for SaC-aware highlighting inside C scopes.
- Added built-in SaC snippets.
- Added SaC file icon contribution and icon theme mapping.
- Added multiple bundled SaC color themes (`Default`, `Warm`, `Cool`, `Vibrant`).

### Language Server (LSP)

- Added SaC language server activation and lifecycle wiring from the extension host.
- Added diagnostics publication to Problems panel + inline squiggles.
- Added hover provider for:
	- builtins + stdlib docs from `docs/builtins` and `docs/stdlib`
	- compiler-index-backed symbols when available
	- source-defined function docs/signatures fallback
- Added go-to-definition provider using compiler navigation index with source/stdlib fallbacks.
- Added safe server error handling (`runSafely`) so failures are logged instead of crashing server process.

### Diagnostics Pipeline

- Added diagnostics execution modes: `onSave`, `onType` (debounced), `manual`.
- Added diagnostics presentation modes: `expanded`, `smart`, `hybrid`.
- Added best-effort parser/grouping pipeline for `sac2c` output.
- Added related information + stack/context rendering controls:
	- `sac.diagnostics.includeRelatedInformation`
	- `sac.diagnostics.includeStackInMessage`
	- `sac.diagnostics.maxStackFrames`
- Added workspace-wide diagnostics scan controls:
	- `sac.diagnostics.workspaceScan.enabled`
	- `sac.diagnostics.workspaceScan.onInitialize`
	- `sac.diagnostics.workspaceScan.onConfigurationChange`
	- `sac.diagnostics.workspaceScan.excludeDirectories`

**Compiler prerequisite (current fork status):**

- Error-column diagnostics improvements rely on sac2c branch: <https://gitlab.sac-home.org/LuckyLuuk/sac2c/-/tree/luukk/error-end-column>
- Related upstream MR draft: <https://gitlab.sac-home.org/sac-group/sac2c/-/merge_requests/633>

### Compiler Resolution + Execution

- Added compiler resolution strategy with channels: `system`, `stable`, `develop`.
- Added explicit compiler path override via `sac.compiler.path`.
- Added fallback behavior to system compiler when bundled channel binary is missing.
- Added backend execution modes:
	- `local`
	- `wsl` (Windows host)
	- `docker`
- Added configurable extra compiler args and deterministic messaging args:
	- `sac.compiler.extraArgs`
	- `sac.compiler.messaging.enabled`
	- `sac.compiler.messaging.args`

### Navigation + Hover Docs Infrastructure

- Added markdown documentation lookup + formatting pipeline for hover content.
- Added heading/section parsing helpers for richer hover rendering.
- Added builtin family doc resolution (for example `_add_SxS_` -> `_add_.md`).
- Added hover/definition runtime tracing controls via `sac.compiler.trace` and debug logging hooks.

**Compiler prerequisite (current fork status):**

- Hover/navigation output-phase support currently depends on fork branch: <https://gitlab.sac-home.org/LuckyLuuk/sac2c/-/commits/luukk/vscode-extension-output-phase>

### Repository + Packaging Foundations

- Added diagnostics architecture docs (`docs/diagnostics-pipeline.md`, `docs/editor-agnostic-diagnostics.md`).
- Added extension packaging optimization:
	- esbuild bundle pipeline for extension + server outputs
	- prepublish bundle hook before `vsce package`
	- lean `.vscodeignore` rules for smaller VSIX artifacts
- Added initial GitHub workflow foundation for nightly/stable VSIX release automation.