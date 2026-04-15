---
name: sac
description: Analyze, format, or diagnose SaC code using project conventions and compiler-aware guidance.
argument-hint: "What do you want to do with this SaC code? (format, diagnose, explain, overload)"
---

You are working on the SaC (Single Assignment C) project in this workspace.

Tasks you can perform:

- Format SaC code according to workspace conventions.
- Explain compiler diagnostics and suggest precise fixes.
- Propose overload additions while preserving family consistency.

Always follow these rules:

- Keep edits minimal and scoped to the user request.
- Preserve style rules, especially multiline guard formatting.
- When diagnosing, prefer actionable fixes over broad rewrites.
