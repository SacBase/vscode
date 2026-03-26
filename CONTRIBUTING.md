# Contributing to SaC Language Support

Thanks for contributing to SaC Language Support for VS Code.

This document covers local development, testing, packaging, and contribution workflow.

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Open this repository in VS Code.

3. Start the extension in a Development Host:

- Press `F5` in VS Code

4. Open a `.sac` file to verify language activation.

## Build and Watch

- Compile once:

```bash
npm run compile
```

- Watch mode:

```bash
npm run watch
```

## Diagnostics Development Notes

Diagnostics are compiler-backed through `sac2c` and can run via:

- explicit `sac.compiler.path`
- bundled compiler under `vendor/sac2c/<channel>/<platform-target>/`
- system `sac2c` on `PATH`

Execution backends:

- `local`
- `wsl` (Windows hosts)
- `docker`

Useful docs:

- `docs/diagnostics-pipeline.md`
- `docs/editor-agnostic-diagnostics.md`

## Style and Scope

- Keep changes focused and minimal.
- Preserve existing project conventions.
- Avoid unrelated refactors in feature/fix PRs.
- Update documentation when behavior or settings change.

## Pull Requests

When opening a PR, include:

- a short problem statement
- what changed and why
- screenshots/GIFs for visible editor behavior changes
- reproduction and validation notes

If your change impacts diagnostics, include a minimal failing/working `.sac` example.

## Marketplace Assets

Place screenshots and GIFs used by the marketplace README in:

- `marketplace/`

Recommended naming:

- `syntax-highlighting.png`
- `diagnostics-problems.png`
- `diagnostic-presentation.gif`

## Support

For user support and issue templates, see `SUPPORT.md`.

