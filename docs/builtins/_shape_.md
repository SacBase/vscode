# `_shape_`
Returns the shape vector of an array.

- Scalar shape is `[]`.
- Vector shape is `[n]`.
- Matrix shape is `[rows, cols]`.

## Shape Type Hierarchy

### AKS: Arrays of Known Shape
Most specific array types. Every axis length is known.

Examples:
- `int[2]`
- `int[5,4]`
- `int[3,3,2]`

### AKD: Arrays of Known Dimensionality
Rank is known, but exact axis lengths are unknown.

Examples:
- `int[.]`
- `int[.,.]`
- `int[.,.,.]`

### AUD: Arrays of Unknown Dimensionality
Least specific array types.

Examples:
- `int[+]` (any non-scalar integer array)
- `int[*]` (scalar or array, any rank)

## Examples

1D array (vector):
```sac
v = [1, 2, 3]
_shape_A_(v)   // [3]
```

2D array (matrix):
```sac
m = [[1, 2, 3], [4, 5, 6]]
_shape_A_(m)   // [2, 3]
```

3D array:
```sac
t3 = reshape([2,2,2], [1,2,3,4,5,6,7,8])
_shape_A_(t3)  // [2, 2, 2]
```

4D array:
```sac
t4 = reshape([2,2,2,2], [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])
_shape_A_(t4)  // [2, 2, 2, 2]
```

Complex 4D example:
```sac
x = reshape([3,2,2,4], [1,2,3, ..., 48])
_shape_A_(x)   // [3, 2, 2, 4]
```

Scalar example:
```sac
s = 42
_shape_S_(s)   // []
```

## Notes
- `_shape_A_` returns the full shape vector, not only rank.
- Rank can be derived from shape, for example:

```sac
dim(_shape_A_(m))  // 2
```

### Variants In `prf.def`
- `_shape_A_`
- `_shape_S_`
