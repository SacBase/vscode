# SaC Color Themes Documentation

This document provides a comprehensive overview of all token scopes and their default colors across SaC themes.

## Token Scopes Reference

| Scope | Description | Code Example | Default Color (Balanced) |
|-------|-------------|--------------|--------------------------|
| `storage.type.sac` | Type declarations and array types | `int`, `float` | `#569CD6` |
| `comment` | Comments in code | `// This is a comment` | `#57A64A` |
| `string` | String literals | `"Hello, World!"` | `#CE9178` |
| `constant.numeric` | Numeric literals | `42`, `3.14` | `#B5CEA8` |
| `constant.language` | Language constants | `true`, `false` | `#B5CEA8` |
| `keyword` | General keywords | `if`, `while`, `for` | `#D8A0DF` |
| `storage` | Storage modifiers | `static`, `extern` | `#D8A0DF` |
| `entity.name.function` | Function declarations | `int foo() { }` | `#DCDCAA` |
| `support.function` | Builtin/standard functions | `print`, `read` | `#DCDCAA` |
| `entity.name.function.sac` | SaC-specific functions (bold) | `_expand_` | `#DCDCAA` **bold** |
| `support.function.call.sac` | Function calls in SaC | `foo()` | `#DCDCAA` |
| `support.function.builtin.sac` | SaC builtin functions (bold) | `_shape_A_`, `_add_SxS_` | `#D880B8` **bold** |
| `support.function.stdlib.sac` | SaC StdLib functions (bold) | `shape`, `reshape` | `#D8A878` **bold** |
| `entity.name.type` | Type names | `struct`, `class` | `#569CD6` |
| `support.type` | Supported types | `int`, `float` | `#569CD6` |
| `keyword.control.sac` | Control flow statements (bold) | `if`, `else`, `return` | `#D8A0DF` **bold** |
| `keyword.control.module.sac` | Module keywords (bold) | `module`, `export` | `#D8A0DF` **bold** |
| `keyword.control.import.sac` | Import/use keyword (bold) | `use`, `import` | `#B388C0` **bold** |
| `keyword.control.import.all.sac` | Import all keyword (bold) | `all` | `#C79AD4` **bold** |
| `keyword.control.import.except.sac` | Import except keyword (bold) | `except` | `#DEC3E6` **bold** |
| `entity.name.module.sac` | Module names | `Array`, `MyModule` | `#8FB2D4` |
| `keyword.operator.withloop.sac` | With-loop constructs | `with`, `genarray` | `#D8A0DF` |
| `constant.language.selection.sac` | Selection expressions (bold) | `[0]`, `[:]` | `#DCDCAA` **bold** |
| `keyword.control.directive.pragma.sac` | Pragma directives (italic) | `#pragma` | `#9A9A9A` *italic* |
| `storage.type.pattern.sac` | Pattern matching types | `case`, `of` | `#569CD6` |
| `variable.parameter.rank.sac` | Rank specifiers | `[*]`, `[+]` | `#DADADA` |
| `variable.parameter.shape.sac` | Shape parameters | `[x, y]` | `#FFFFFF` |
| `keyword.operator.shape.separator.sac` | Shape separators | `,` in shapes | `#9A9A9A` |
| `keyword.operator.guard.sac` | Guard expressions (bold) | `where` | `#D8A0DF` **bold** |
| `punctuation.section.brackets` | Bracket punctuation | `[`, `]` | `#DADADA` |
| `punctuation.separator.comma` | Comma separators | `,` | `#DADADA` |

## Available Themes

### Balanced (Default)
A cohesive theme inspired by VS Code's Dark+ theme, designed for dark mode with excellent contrast and consistency with C-style syntax highlighting. All SaC-specific elements have distinct, soft colors for clear visual distinction.

- **Colors**: Magenta keywords, blue types, golden functions, green comments, light green numbers
- **Distinct SaC elements**: Soft magenta builtin functions, soft orange StdLib functions, white shape parameters
- **Best for**: General-purpose coding with professional C theme aesthetic and clear SaC element distinction

### Warm
All warm tones - reds, oranges, and yellows. Creates a cozy atmosphere but all elements blend together in the warm spectrum.

- **Colors**: Warm oranges, yellows, and reds across all scopes
- **Best for**: Users who prefer warm color palettes

### Cool
All cool tones - blues, cyans, and purples. Creates a professional appearance with cool spectrum colors.

- **Colors**: Blues, cyans, and purples across all scopes
- **Best for**: Users who prefer cool color palettes

### Vibrant
High-contrast, saturated colors for maximum visibility and distinction between token types.

- **Colors**: Highly saturated primary colors
- **Best for**: Users who want maximum visual distinction between token types
