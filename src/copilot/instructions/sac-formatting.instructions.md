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

Example:

```sac
int safe_div(int a, int b)
    | b != 0
    , a >= 0
{
    return a / b;
}
```
