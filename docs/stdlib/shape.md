# `shape`
Returns an array's shape vector.

### Signature
```sac
int[d] shape(<a>[d:shp] arr)
```

### Description
The result contains one extent per axis. For a scalar, the shape is `[]`.

### Parameters
- `arr`: Input array.

### Returns
- An integer vector with the size of each axis.

### Example
```sac
shape([1, 2, 3])     // [3]
shape([[1,2],[3,4]]) // [2, 2]
```
