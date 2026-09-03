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

* Press `F5` in VS Code

4. Open a `.sac` file to verify language activation.

## Build and Watch

* Compile once:

```bash
npm run compile
```

* Watch mode:

```bash
npm run watch
```

## Diagnostics Development Notes

Diagnostics are compiler-backed through `sac2c` and can run via:

* explicit `sac.compiler.path`
* bundled compiler under `vendor/sac2c/<channel>/<platform-target>/`
* system `sac2c` on `PATH`

Execution backends:

* `local`
* `wsl` (Windows hosts)
* `docker`

Useful docs:

* `docs/diagnostics-pipeline.md`
* `docs/editor-agnostic-diagnostics.md`

## Style and Scope

* Keep changes focused and minimal.
* Preserve existing project conventions.
* Avoid unrelated refactors in feature/fix PRs.
* Update documentation when behavior or settings change.

## Pull Requests

When opening a PR, include:

* a short problem statement
* what changed and why
* screenshots/GIFs for visible editor behavior changes
* reproduction and validation notes

If your change impacts diagnostics, include a minimal failing/working `.sac` example.

## Publishing

GitHub Actions automatically builds VSIX packages for pushes to `main` and publishes them as nightly builds.

Stable releases are created by pushing a tag containing `release` or `publish` (case-insensitive) that points to a commit on `main`.

### Stable GitHub Release

To create a stable VSIX release:

1. Make sure the desired release commit is on `main`.

2. Create and push a tag containing `release` or `publish`, for example:

```bash
git tag release-0.1.8
git push origin release-0.1.8
```

3. GitHub Actions will validate the tag and build the extension from the tagged commit.

4. The resulting VSIX will be added to the **Stable Releases** GitHub release as:

```text
sac-language-support-<version>.vsix
```

5. Download the stable VSIX from the **Stable Releases** GitHub release.

### Publishing to the Visual Studio Code Marketplace

Marketplace publishing is currently a **manual process**.

After creating a stable GitHub release:

1. Download the stable `.vsix` from the **Stable Releases** GitHub release.

2. Open the [Single Assignment C publisher dashboard](https://marketplace.visualstudio.com/manage/publishers/singleassignmentc).

3. Press the **`+ New extension`** button/dropdown.

4. Select **`Visual Studio Code`**.

5. Upload the stable `.vsix` downloaded from the GitHub **Stable Releases** release.

Do not upload nightly/beta VSIX files to the Marketplace. Nightly builds are intended for testing and are available through the GitHub **Nightly Builds** release.

## Marketplace Assets

Place screenshots and GIFs used by the marketplace README in:

- `marketplace/`

Recommended naming:

- `syntax-highlighting.png`
- `diagnostics-problems.png`
- `diagnostic-presentation.gif`

## Support

For user support and issue templates, see `SUPPORT.md`.
