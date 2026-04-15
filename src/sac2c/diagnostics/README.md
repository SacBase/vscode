# Diagnostics Module

Diagnostics contracts/workflow for sac2c-backed validation.

## Files

- `types.ts`: normalized diagnostics interfaces used by config/workflow.
- `index.ts`: bridge exports to core diagnostics primitives.
- `workflow.ts`: orchestration for validate-on-save/type/workspace scan.

Parser/group/presentation primitives now live in `src/sac2c/diagnostics/core` and are re-exported from `index.ts`.
