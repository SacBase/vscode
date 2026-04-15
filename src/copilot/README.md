# Copilot Customization Layout

This folder contains Copilot-focused assets for SaC.

## Structure

- `plugin/` Claude-compatible agent plugin scaffold for distribution.
- `plugin/servers/sac2c-mcp.ts` TypeScript source for MCP server logic.
- `plugin/servers/sac2c-mcp.js` generated Node-runnable MCP entrypoint.
- `plugin/skills/` domain-specific skills for formatting, overloading, and diagnostics.

## Why this structure

VS Code agent plugin APIs are still in preview and evolving. Keeping everything under
`src/copilot/` avoids spreading experimental files across the repository and makes
future migration easy.

## Extension boundary

- Files under `src/copilot/` do not automatically become VS Code extension runtime features.
- They are Copilot customization artifacts (instructions, skills, agents, MCP definitions).
- The extension runtime remains controlled by `src/extension.ts` and the language server modules.

Extension-contributed AI features are declared in `package.json` through
`chatParticipants`, `chatInstructions`, `chatPromptFiles`, and `chatSkills`.

## Plugin usage

The plugin manifest is at `src/copilot/plugin/.claude-plugin/plugin.json`.
Using Claude format provides `${CLAUDE_PLUGIN_ROOT}` path substitution for server
and script references, which is useful when the plugin is installed outside a
workspace.

## Why the MCP entry is JavaScript

Plugin runtimes execute the declared command directly, so the runtime entrypoint
must be JavaScript. The source of truth remains TypeScript and is compiled to
`sac2c-mcp.js` via `npm run build:copilot:mcp`.
