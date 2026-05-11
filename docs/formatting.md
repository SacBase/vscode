# SaC Formatting

SaC formatting is client-side and works without a language server.

## Config sources

Formatter settings come from two places:

1. VS Code settings under `sac.format.*`
2. Workspace-local `.sac-format` files

Precedence is:

1. VS Code settings win over `.sac-format`
2. `.sac-format` wins over built-in defaults

That lets a workspace ship shared formatting defaults while each user keeps personal overrides.

## Generating `.sac-format`

Use the command **"SaC: Generate Default .sac-format File"** to scaffold a `.sac-format` in your workspace root.

VS Code provides syntax highlighting and hover tooltips for `.sac-format` keys, making configuration easy.

## Supported VS Code settings

- `sac.format.enable`
- `sac.format.onSave`
- `sac.format.indentSize`
- `sac.format.normalizeGuards`
- `sac.format.expandInlineWithLoops`
- `sac.format.expandInlineComprehensions`
- `sac.format.splitInlineGuards`
- `sac.format.assertions` (deprecated alias)

## Supported `.sac-format` keys

Keys are case-insensitive.

- `IndentSize`
- `TabWidth`
- `NormalizeGuards`
- `ExpandInlineWithLoops`
- `ExpandInlineComprehensions`
- `SplitInlineGuards`

## Example

```text
IndentSize: 4
NormalizeGuards: true
ExpandInlineWithLoops: true
ExpandInlineComprehensions: true
SplitInlineGuards: true
```

## Notes

- `.sac-format` is read from nearest file in current workspace tree.
- Format-on-save uses same resolved config as manual formatting.
- `SplitInlineGuards: false` keeps inline function guards inline instead of splitting them into multiline form.