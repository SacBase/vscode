# Navigation Parser Module

Compiler navigation contract implementation for go-to-definition and hover.

## Files

- `parser.ts`: extracts/parses navjson payload from compiler stdout.
- `types.ts`: navjson TypeScript contract types.
- `query.ts`: definition/hover resolution entrypoints.
- `pathResolution.ts`: file/token/symbol lookup helpers.
- `shapeInference.ts` + `shapeScoring.ts`: overload selection heuristics.
- `sourceDocs.ts`: source-level doc/signature extraction fallback.
- `stdlib.ts`: StdLib fallback definition lookup.

## Contract artifacts

- JSON schema: `sac2c-navigation.schema.json`
- Design notes: `docs/private/navigation-schema-design.md`