# `where`
Element-wise conditional selection.

### Common Signatures
```sac
<a>[d:shp] where(bool[d:shp] p, <a>[d:shp] a, <a>[d:shp] b)
<a>[d:shp] where(bool[d:shp] p, <a>[d:shp] a, <a> b)
<a>[d:shp] where(bool[d:shp] p, <a> a, <a>[d:shp] b)
<a>[d:shp] where(bool[d:shp] p, <a> a, <a> b)
```

### Description
For each position, selects from the first or second branch according to mask `p`.

### Parameters
- `p`: Boolean mask.
- `a`: Value used where mask is `true`.
- `b`: Value used where mask is `false`.

### Returns
- Result array with the same shape as `p`.

### Example
```sac
where([true, false, true], [10, 20, 30], 0) // [10, 0, 30]
```

