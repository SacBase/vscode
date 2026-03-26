# SaC Language Support

SaC Language Support adds first-class editing support for SaC (Single Assignment C) in Visual Studio Code.

It provides:
- SaC language registration for `.sac` files
- Syntax highlighting and language configuration
- Compiler-backed diagnostics via `sac2c` (Problems panel + editor squiggles)

## Why Use This Extension?

- Faster feedback while writing SaC code
- Clear diagnostics integrated into the editor
- Flexible compiler execution (`local`, `wsl`, `docker`)

## Features

### 1. Syntax Highlighting

SaC keywords, operators, comments, and language constructs are highlighted out of the box.

![Syntax Highlighting](marketplace/syntax-highlighting.png)

### 2. Compiler Diagnostics in Editor

Diagnostics from `sac2c` are shown as VS Code Problems and inline squiggles.

![Diagnostics View](marketplace/diagnostics-problems.png)

### 3. Configurable Diagnostic Presentation

Choose how diagnostics are displayed:

- `expanded`
- `smart`
- `hybrid`

![Diagnostic Styles](marketplace/diagnostic-presentation.gif)

## Requirements

Syntax highlighting works without external tools.

For diagnostics, `sac2c` must be available through one of:

- `sac.compiler.path` (explicit executable path)
- bundled compiler in `vendor/sac2c/<channel>/<platform-target>/`
- system `sac2c` on `PATH`

Supported execution backends:

- `local`
- `wsl` (Windows host only)
- `docker`

## Extension Settings

Common settings:

- `sac.languageServer.enable`
- `sac.diagnostics.mode` (`onSave`, `onType`, `manual`)
- `sac.diagnostics.presentation` (`expanded`, `smart`, `hybrid`)
- `sac.diagnostics.includeRelatedInformation`
- `sac.diagnostics.includeStackInMessage`
- `sac.diagnostics.maxStackFrames`
- `sac.diagnostics.workspaceScan.enabled`
- `sac.compiler.channel` (`stable`, `develop`, `system`)
- `sac.compiler.path`
- `sac.compiler.executionBackend` (`local`, `wsl`, `docker`)
- `sac.compiler.extraArgs`

Default structured messaging args:

```text
-cti-no-color -cti-no-source -cti-no-hint -cti-no-explain -cti-message-length 0 -cti-primary-header-format "%s: " -cti-continuation-header-format "%.0s"
```

If your `sac2c` version uses different flags, override `sac.compiler.messaging.args`.

## Quick Start

1. Install the extension.
2. Open a `.sac` file.
3. Ensure diagnostics mode is enabled (for example `onSave`).
4. Configure compiler path/backend if needed.

## Examples

### Minimal SaC file

```sac
int main() {
    return 0;
}
```

### Trigger diagnostics

Create a small typing or semantic error in a `.sac` file and save to see diagnostics in the Problems panel.

## Windows Notes

If you are on Windows and do not have a native `sac2c` binary, recommended options are:

- Use VS Code Remote WSL and run backend `local` inside WSL
- Use backend `wsl`
- Use backend `docker`

## Documentation

- Diagnostics pipeline: `docs/diagnostics-pipeline.md`
- Editor-agnostic diagnostics notes: `docs/editor-agnostic-diagnostics.md`
- Support: `SUPPORT.md`
- Contributing: `CONTRIBUTING.md`

## Feedback

Issues and feature requests are welcome:

- https://github.com/SacBase/vscode/issues

