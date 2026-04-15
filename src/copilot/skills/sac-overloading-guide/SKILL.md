---
name: sac-overloading-guide
description: Add or adjust SaC overloads while preserving semantic consistency.
---

# SaC Overloading Guide

Use this skill for overloaded operators/functions in SaC.

## Process

1. Identify the overload family and existing type/shape matrix.
2. Add the narrowest overload that solves the target case.
3. Keep naming and behavior aligned with sibling overloads.
4. Note ambiguous conversion risks and guard where needed.

## Output requirements

- Mention which overload family changed.
- Describe compatibility impact.
- Provide one short usage example when API shape changed.
