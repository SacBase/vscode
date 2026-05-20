# sac2c Module: Typed Compiler Invocation & Output

Invoke sac2c compiler + parse raw output. Core module - no LSP/IDE deps.

## Structure

```
sac2c/
├── invoke/          # Run compiler
│   ├── types.ts    # CompilerOptions, SacInvocation, CompilerResolution
│   ├── compiler.ts # runSac2c(), createInvocation(), buildCompilerArgs()
│   ├── resolver.ts # resolveSac2cPath()
│   ├── options.ts  # Messaging flags, validators
│   └── index.ts    # Barrel
│
├── interpret/       # Parse compiler output
│   └── index.ts    # CompilerDiagnostic, SymbolInfo, ParsedCompilerOutput types
│
└── index.ts        # invoke + interpret exports
```

## sac2c responsibility

- ✅ Run compiler (local/wsl/docker)
- ✅ Type compiler options
- ✅ Parse raw compiler output (diagnostics, -symbols JSON)

## LSP's responsibility

Feature-specific interpretation (hover, nav, definition lookup) → `lsp-server/`

## API

```typescript
import { runSac2c, createInvocation, type CompilerOptions, type CompilerDiagnostic } from "$sac2c";

const result = await runSac2c("sac2c", ["-symbols", "file.sac"], ".");
```

