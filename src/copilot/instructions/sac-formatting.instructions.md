---
name: SaC Formatting Conventions
description: Formatting rules for SaC source, including guard alignment and multiline guard layout.
applyTo: "**/*.sac"
---

# SaC formatting conventions

- Use 4 spaces for indentation.
- Keep function guards on new lines after the function signature.
- For first guard line, write exactly 4 spaces then `| ` before the guard expression.
- For subsequent guard lines, write 4 spaces then `, ` before each guard expression.

Use workspace `.sac-format` as shared defaults, but let VS Code `sac.format.*` settings win when both define same behavior.

Supported formatter controls:

- `sac.format.enable`
- `sac.format.onSave`
- `sac.format.indentSize`
- `sac.format.normalizeGuards`
- `sac.format.expandInlineWithLoops`
- `sac.format.expandInlineComprehensions`
- `sac.format.splitInlineGuards`
- `sac.format.assertions` (deprecated alias)

`.sac-format` keys:

- `IndentSize`
- `TabWidth`
- `NormalizeGuards`
- `ExpandInlineWithLoops`
- `ExpandInlineComprehensions`
- `SplitInlineGuards`
- `Assertions` (deprecated alias)

Example:

```sac
int safe_div(int a, int b)
    | b != 0
    , a >= 0
{
    return a / b;
}
```
