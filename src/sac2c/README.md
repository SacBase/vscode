# sac2c Domain Modules

This folder contains compiler-domain logic used by extension/server layers.

## Modules

- `diagnostics/`: compiler output parsing/grouping/presentation contracts plus workflow wiring.
- `hover/`: token-level hover target detection/types.
- `parser/navigation/`: navjson parser, symbol resolution, stdlib lookup, source-doc extraction.
- `runtime/`: compiler invocation/runtime helpers shared by diagnostics/navigation.

## Contract docs

- Navigation schema: `src/sac2c/parser/navigation/sac2c-navigation.schema.json`
- Design notes: `docs/private/navigation-schema-design.md`
