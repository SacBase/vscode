# Bundled sac2c layout

This folder is only a packaging convention for this extension.
It does not automatically download or install `sac2c` for users.

This extension can resolve bundled compiler binaries using the directory pattern below:

- `vendor/sac2c/stable/<platform-target>/sac2c`
- `vendor/sac2c/develop/<platform-target>/sac2c`

On Windows, use `sac2c.exe`.

Supported `<platform-target>` values:

- `linux-x64`
- `linux-arm64`
- `darwin-x64`
- `darwin-arm64`
- `win32-x64`
- `win32-arm64`

Examples:

- `vendor/sac2c/stable/linux-x64/sac2c`
- `vendor/sac2c/develop/darwin-arm64/sac2c`
- `vendor/sac2c/stable/win32-x64/sac2c.exe`

Resolution priority:

1. `sac.compiler.path` when explicitly configured.
2. Bundled compiler for selected `sac.compiler.channel` (`stable` or `develop`).
3. System `sac2c` from `PATH` when `sac.compiler.fallbackToSystem = true`.
4. Show a warning and publish no diagnostics.

Backend selection:

- `sac.compiler.executionBackend = local` uses local process execution.
- `sac.compiler.executionBackend = wsl` uses `wsl.exe` (Windows host only).
- `sac.compiler.executionBackend = docker` uses `docker run`.
