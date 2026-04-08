# `sel`
Selects a subarray (or element) at a given index.

### Signatures
```sac
<a>[i:ishp] sel(int[o] idx, <a>[o:oshp,i:ishp] arr)
| all(0 <= idx), all(idx < oshp)

<a>[d:shp] sel(int idx, <a>[n,d:shp] arr)
| 0 <= idx, idx < n
```

### Description
If `idx` covers all axes, `sel` yields an element (or scalar-shaped value). If `idx` is shorter than the array rank, `sel` yields a subarray.

### Parameters
- `idx`: Index vector (or scalar index overload).
- `arr`: Source array.

### Returns
- Selected value or subarray.

### Example
```sac
sel([1], [[10,11],[20,21]]) // [20, 21]
```

