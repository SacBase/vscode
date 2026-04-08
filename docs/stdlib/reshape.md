# `reshape`
Creates a view of the same data with a new shape.

### Signature
```sac
<a>[d:shp] reshape(int[d] shp, <a>[*] arr)
| all(0 <= shp)
```

### Description
`reshape` changes the shape metadata while preserving element order. The total element count must be compatible with the target shape.

### Parameters
- `shp`: Target shape vector.
- `arr`: Source array.

### Returns
- Array with shape `shp`.

### Example
```sac
reshape([2, 3], [1, 2, 3, 4, 5, 6])
```
