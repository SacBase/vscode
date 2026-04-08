# `_sel_VxA_`
An internal **compiler builtin** for array selection.

### Signature
```sac
element_type _sel_VxA_ (int[n] iv, element_type[n:shp] a)
| all (0 <= iv), all (iv < shp)
```

### Description
The low-level operation used to implement the standard library `sel` function. It requires that the index vector `iv` matches the dimensionality of `a` to return a scalar.

### Parameters
*   `iv`: A vector of indices.
*   `a`: An array of arbitrary element type.

### Returns
*   A scalar value at the specified index.
