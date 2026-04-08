# `dim`
Returns an array's dimensionality (rank).

### Signature
```sac
int dim(<a>[d:shp] arr)
```

### Description
`dim` returns the number of axes of `arr`. For a scalar, the rank is `0`.

### Parameters
- `arr`: Input array.

### Returns
- The rank as an `int`.

### Example
```sac
dim([1, 2, 3])    // 1
dim([[1,2],[3,4]]) // 2
```
