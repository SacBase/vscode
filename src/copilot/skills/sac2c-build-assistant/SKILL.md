---
name: sac2c-build-assistant
description: Compile and diagnose SaC files by calling the local sac2c MCP tools.
---

# SaC Build Assistant

Use this skill when you need fast compiler feedback for SaC source files.

## Workflow

1. Call the `sac2c_version` tool first to verify the compiler is available.
2. Call `sac2c_run` with the target file path.
3. If errors are reported, rerun with extra flags only when needed (for example include paths or debug flags).
4. Keep arguments minimal and avoid unrelated optimization flags while diagnosing parser/type errors.

## Guidelines

- Prefer workspace-relative file paths.
- Keep `args` focused and explicit.
- If the compiler is missing, report exact setup guidance instead of guessing.
