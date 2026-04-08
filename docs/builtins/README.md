# Builtin Hover Docs

This folder contains hover documentation for compiler builtin functions.

Naming rules:
- Family docs use one file per builtin family, e.g. `_add_.md`.
- Variant names from `prf.def` (e.g. `_add_SxS_`, `_add_VxS_`) are listed inside the family doc.
- Hover resolves builtin docs by family first (`_add_SxS_` -> `_add_.md`) and falls back to exact file names.
- Content is rendered directly in hover markdown.

Shape-class legend used throughout builtin docs:
- `S` = scalar
- `V` = vector
- `A` = array
- In signatures like `SxV`, `x` separates argument shape classes.

Implementation note:
- The hover server appends the shape-class legend automatically for builtin docs.
- Keep family docs focused on operation semantics and variant lists.

Sources:
- `sac2c/src/libsac2c/scanparse/prf.def`
- `sac2c/src/libsac2c/tree/prf_info.mac`

Tip:
- Keep the first line a short title for fast scanning in hover.
