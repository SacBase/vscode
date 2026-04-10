# `shape`
Returns an array's shape vector.

### Signature
```sac
int[d] shape(<a>[d:shp] arr)
```

### Description
The result contains one extent per axis.

- For a scalar, the shape is `[]`.
- For a vector with `n` elements, the shape is `[n]`.
- For a matrix with `r` rows and `c` columns, the shape is `[r, c]`.

SaC shape typing terminology:

- AKS (known shape): concrete extents, for example `int[2]`, `int[5,4]`.
- AKD (known dimensionality): known rank, unknown extents, for example `int[.]`, `int[.,.]`.
- AUD (unknown dimensionality): unspecific rank, for example `int[+]` and `int[*]`.

### Parameters
- `arr`: Input array.

### Returns
- An integer vector with the size of each axis.

### Example
```sac
shape([1, 2, 3])     // [3]
shape([[1,2],[3,4]]) // [2, 2]
```

```sac
t3 = reshape([2,2,2], [1,2,3,4,5,6,7,8])
shape(t3) // [2, 2, 2]
```

```sac
s = 42
shape(s) // []
```

### Notes
- `shape` returns the full shape vector, not rank.
- Rank can be derived from shape, for example `dim(shape(arr))`.
