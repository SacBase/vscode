# SaC Language Support for VS Code

[![VS Code Engine](https://img.shields.io/badge/VS%20Code-%5E1.110.0-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/Runtime-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub Repo stars](https://img.shields.io/github/stars/LuckyLuuk12/sac-language-support?style=social)](https://github.com/LuckyLuuk12/sac-language-support/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/LuckyLuuk12/sac-language-support)](https://github.com/LuckyLuuk12/sac-language-support/issues)

<table>
	<tr>
		<td width="140" valign="middle">
			<a href="https://github.com/LuckyLuuk12">
				<img src="https://github.com/LuckyLuuk12.png?size=120" alt="Luuk Kablan" width="120" height="120" />
			</a>
		</td>
		<td valign="middle">
			<a href="https://github.com/LuckyLuuk12">
				<img src="https://img.shields.io/badge/Maintainer-Luuk%20Kablan-0d1117?style=for-the-badge&logo=github&logoColor=white" alt="Maintainer Luuk Kablan" width="360" />
			</a>
			<br />
			<a href="https://github.com/LuckyLuuk12">
				<img src="https://img.shields.io/badge/GitHub-%40LuckyLuuk12-24292f?style=for-the-badge&logo=github" alt="GitHub LuckyLuuk12" width="360" />
			</a>
			<br />
			<a href="https://github.com/SacBase/vscode">
				<img src="https://img.shields.io/badge/SacBase%2Fvscode-Admin-238636?style=for-the-badge&logo=github" alt="SacBase vscode admin" width="360" />
			</a>
		</td>
	</tr>
</table>

VS Code language support for SaC (Single Assignment C), including a minimal language server for compiler-backed diagnostics.

This extension now includes:

- SaC language registration (`.sac` files)
- SaC syntax highlighting and language configuration
- Compiler-backed diagnostics via `sac2c` (Problems panel + red squiggles)

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

For syntax highlighting only, no external tool is required.

For diagnostics, `sac2c` is required via one of:

- `sac.compiler.path` (explicit executable path)
- bundled compiler in `vendor/sac2c/<channel>/<platform-target>/`
- system `sac2c` on `PATH`

Execution backends:

- `local`: run `sac2c` directly on the host where the extension runs
- `wsl`: run via `wsl.exe` (Windows host only)
- `docker`: run via `docker run` with bind mount

The extension does not auto-install or auto-start WSL/Docker.

## Extension Settings

Main settings:

- `sac.languageServer.enable`
- `sac.diagnostics.mode` (`onSave`, `onType`, `manual`)
- `sac.compiler.channel` (`stable`, `develop`, `system`)
- `sac.compiler.path`
- `sac.compiler.executionBackend` (`local`, `wsl`, `docker`)
- `sac.compiler.wsl.distribution`
- `sac.compiler.docker.image`
- `sac.compiler.docker.runArgs`
- `sac.compiler.messaging.enabled`
- `sac.compiler.messaging.args`
- `sac.compiler.extraArgs`
- `sac.compiler.fallbackToSystem`

Default structured messaging args are:

```text
-cti-no-color -cti-no-source -cti-no-hint -cti-no-explain -cti-message-length 0 -cti-primary-header-format "%s: " -cti-continuation-header-format "%.0s"
```

If your `sac2c` version uses a different syntax, override `sac.compiler.messaging.args`.

## Windows Notes

`sac2c` is typically Linux/macOS-first. For Windows users, recommended options are:

- Use VS Code Remote WSL and run this extension inside WSL with backend `local`
- Use backend `wsl` and configure `sac.compiler.wsl.distribution`
- Use backend `docker` and set `sac.compiler.docker.image`

If none are available, keep syntax highlighting enabled and diagnostics disabled.

