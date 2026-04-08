# StdLib Hover Docs

This folder contains hover markdown for SaC StdLib symbols.

Scope in this pass:
- StdLib functions declared via `BUILT_IN(...)` in the local `Stdlib` source tree.
- Closely related StdLib wrappers that are part of the same API surface (for example `fprint`, `toc`).

Primary source files used:
- `Stdlib/include/arraybasics.mac`
- `Stdlib/include/arraytransform.mac`
- `Stdlib/include/templates.mac`
- `Stdlib/src/structures/ArrayBasics.xsac`
- `Stdlib/src/structures/ArrayTransform.xsac`
- `Stdlib/src/structures/ArrayTransformApl.xsac`
- `Stdlib/src/structures/ScalarArith.xsac`
- `Stdlib/src/auxiliary/Hiding.xsac`
- `Stdlib/src/structures/Char.sac`
- `Stdlib/src/stdio/ArrayIO.xsac`
- `Stdlib/src/structures/ComplexBasics.sac`

Naming rules:
- One markdown file per hover symbol.
- File name is the symbol name in lowercase where applicable, for example `shape.md`.
- Content is rendered directly by the hover provider.
