# Hover Module

Token-based hover target model plus hover documentation helpers.

## Files

- `types.ts`: hover target contracts.
- `index.ts`: token lookup + default markdown formatter.
- `hoverDocLookup.ts`: docs lookup in workspace/vendor docs.
- `hoverDocFormatting.ts`: markdown polishing for docs payload.
- `hoverDocSectionParser.ts`: low-level markdown section parsing helpers.
- `hoverDocs.ts`: combined docs resolve/format facade.

Used by server hover-info providers and parser navigation fallbacks.