# `modarray`
Returns an array with one selected cell replaced.

### Signatures
```sac
<a>[o:oshp,i:ishp] modarray(<a>[o:oshp,i:ishp] arr, int[o] idx, <a>[i:ishp] val)
| all(0 <= idx), all(idx < oshp)

<a>[d:shp] modarray(<a>[d:shp] arr, int[d] idx, <a> val)
| all(0 <= idx), all(idx < shp)

<a>[n,i:ishp] modarray(<a>[n,i:ishp] arr, int idx, <a>[i:ishp] val)
| 0 <= idx, idx < n
```

### Description
Semantically pure update: a modified array is returned. The compiler may optimize this to in-place updates when safe.

### Parameters
- `arr`: Source array.
- `idx`: Position to replace.
- `val`: Replacement value.

### Returns
- Array equal to `arr` except at `idx`.

### Example
```sac
modarray([10, 20, 30], [1], 99) // [10, 99, 30]
```
