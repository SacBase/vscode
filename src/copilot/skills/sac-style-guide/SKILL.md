---
name: sac-style-guide
description: Enforce SaC code formatting and readability conventions.
---

# SaC Style Guide

Use this skill when editing `.sac` files.

- Use spaces, not tabs.
- Use 4-space indentation by default.
- Preserve original trailing newline count at EOF.
- Keep edits minimal and local, especially in overloaded function families.

## Formatter-parity rules

Follow these rules exactly to match formatter behavior.

1. Guard formatting

- Split multi-guard function signatures into guard lines.
- First guard line starts with `| `.
- Additional top-level guards start with `, ` on following lines.
- Do not split commas inside nested `()`, `[]`, `{}`.
- Keep logical continuations (`||`, `&&`) on same guard line when they continue a guard expression.

2. Comments

- Keep `//` comments intact; never reinterpret commented code as active code.
- Normalize comment prefix spacing to `// ` when comment body exists.

3. Tensor comprehensions

- Inline tensor comprehensions inside larger expressions should stay inline when already clear.
- For a top-level `return { ... };` tensor block:
  - One clause: use one-line form.
  - Multiple clauses: one clause per line, align `->` and `|` columns.

4. With-loop formatting

- Inline `return with { ... } : genarray(...);` may be expanded to multiline canonical form.
- Keep `} : genarray(...)` arm aligned with the `with` keyword column.

5. Doc comments

- Keep doc blocks aligned with one leading space before `*` lines and closing `*/` relative to declaration indentation.

## Guard formatting example

Use this formatting for multi-line function guards and nested expression continuations.

```sac
/**
 * Rank-polymorphic selection with explicit domain checks.
 *
 * @param iv Index vector.
 * @param a Input array.
 * @return Selected sub-array.
 */
int[m:ishp] mySel(int[n] iv, int[n:shp, m:ishp] a)
    | all(0 <= iv)
    , all(iv < shp)
    , ((n > m && ishp == []) || (ishp == shp))
{
    return { jv -> _sel_VxA_(++(iv, jv), a) | jv < ishp };
}
```

## Big with-loop example

```sac
int[m, n] checkerboard(int[m, n] a)
{
    return with {
             (. <= [i, j] <= .) : (a[i, j] + i + j) % 2;
           } : genarray([m, n], 0);
}
```

## Inline tensor comprehension in expression

```sac
int[d:shp] vsum2(int[n, d:shp] a)
{
    transposed_a = transpose(a);
    return d > 0 ? transpose({ iv -> sum(transposed_a[iv]) | iv < reverse(shp) }) : sum(a);
}
```

## Multi-section tensor comprehension example

```sac
int[m, n] edgeMask(int[m, n] a)
{
    return {
        [i, j] -> abs(a[i, j] - a[i, j - 1]) + abs(a[i, j] - a[i - 1, j]) | [1, 1] <= [i, j] < [m - 1, n - 1];
        [i, j] -> 0                                                          | [i, j] < [m, n]
    };
}
```

## `.sac-format` keys

When present, align behavior with these keys:

- `IndentSize`
- `TabWidth`
- `NormalizeGuards`
- `ExpandInlineWithLoops`
- `ExpandInlineComprehensions`
- `SplitInlineGuards`
- `Assertions` (deprecated alias)

VS Code `sac.format.*` settings override `.sac-format` values when both exist.
