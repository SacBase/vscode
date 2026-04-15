---
name: sac-style-guide
description: Enforce SaC code formatting and readability conventions.
---

# SaC Style Guide

Use this skill when editing `.sac` files.

- Use consistent indentation and brace style.
- Preserve readability around shapes, signatures, and type-rich declarations.
- Keep edits minimal and local, especially in overloaded function families.
- Explain style-motivated refactors in one sentence.

## Guard formatting example

Use this formatting for multi-line function guards, function signatures, sacDocs, and simple tensor comprehensions.

```sac
/**
 * A rank-polymorphic selection function that returns a sub-array.
 * It uses type patterns to match dimensionality and a vertical bar (|)
 * to enforce explicit domain constraints.
 * The first guard line starts with `| ` and subsequent lines start with `, `.
 * 
 * @param iv An index vector specifying which elements to select, must be non-negative and within bounds.
 * @param a The input array from which to select elements, must have compatible shape.
 * @return A new array containing the selected elements based on the index vector.
 */
int[m:ishp] mySel (int[n] iv, int[n:shp, m:ishp] a)
  | all (0 <= iv)   /* Guard: The index vector must be non-negative        */
  , all (iv < shp)  /* Guard: The index must be within the bounds of 'shp' */
{
  return { jv -> _sel_VxA_(++ (iv, jv), a) | jv < ishp };
}
```

Use multi-line style for with-loops and complex tensor comprehensions as well.

## Big with-loop example

```sac
int[m, n] checkerboard(int[m, n] a)
{
  return with {
           ( . <= [i, j] <= . ) : (a[i, j] + i + j) % 2;
         } : genarray([m, n], 0);
}
```

## Multi-section tensor comprehension example

```sac
int[m, n] edgeMask(int[m, n] a)
{
  return {
    [i, j] -> abs(a[i, j] - a[i, j - 1]) + abs(a[i, j] - a[i - 1, j]) | [14] <= [i, j] < [m - 1, n - 1];
    [i, j] -> 0                                                       | [i, j] < [m, n]
  };
}
```