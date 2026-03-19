# SaC Language Support for VS Code

VS Code language support for SaC (Single Assignment C).

This extension is currently focused on a solid first milestone:

- SaC language registration (`.sac` files)
- Syntax highlighting for SaC-specific constructs
- Basic editor behavior (comments, brackets, auto-closing pairs)

The next milestone is compiler-backed diagnostics (inline errors and warnings from `sac2c`).

## Current Progress

### Implemented

- Language ID: `sac`
- File association: `.sac`
- TextMate grammar in `syntaxes/sac.tmLanguage.json`
- SaC-aware highlighting for:
	- module/import/use keywords
	- with-loop operators (`with`, `genarray`, `modarray`, `fold`, `foldfix`, `propagate`)
	- selected pragmas (`#pragma header`, `#pragma ctype`, etc.)
	- selected primitive patterns
- Language configuration in `language-configuration.json`:
	- line and block comments
	- bracket matching
	- auto-closing and surrounding pairs

### In Progress / Planned

- Inline diagnostics from `sac2c` (Problems panel + squiggles)
- Better error parsing for file, line, column and message severity
- Hover help and completions for common SaC constructs

## Installation (Development)

This repository is currently set up as a development extension project.

1. Install dependencies:

```bash
npm install
```

2. Open this folder in VS Code.

3. Run the extension in a Development Host window:

- Press `F5` in VS Code.

4. Open any `.sac` file and verify syntax highlighting is active.

## Requirements

For currently implemented features (syntax + editor behavior), no external tool is required.

For upcoming diagnostics features, an operational `sac2c` installation on your `PATH` will be required.

## Extension Settings

No custom extension settings are contributed yet.

Settings will be added together with diagnostics support, likely including:

- path to `sac2c`
- diagnostics trigger mode (`onSave` / `onType`)
- extra compiler flags used for diagnostics

## Known Issues

- Diagnostics are not implemented yet; syntax errors are not shown inline.
- Grammar coverage is good for core syntax but still incomplete for the full SaC language surface.
- No snippets, hover docs, symbol navigation, or formatting support yet.

## Roadmap

Short-term:

- Add `sac2c` diagnostics integration without modifying compiler sources
- Surface errors and warnings as VS Code diagnostics
- Improve syntax grammar coverage using real-world SaC code from Stdlib and exercises

Mid-term:

- Hover/type hints
- Basic completions for keywords/pragmas/common patterns
- Go to definition for local symbols

Long-term:

- Full LSP-based SaC tooling
- Workspace-aware module resolution and richer semantic analysis

## Release Notes

### 0.0.1

- Initial public extension scaffold
- SaC language registration and `.sac` file association
- First version of SaC syntax highlighting
- Basic language configuration (comments, brackets, pairs)
