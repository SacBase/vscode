# `tile`
Extracts a tile (slice block) with explicit shape and start index.

### Signature
```sac
<a>[d:shp,i:ishp] tile(int[d] shp, int[d] idx, <a>[d:oshp,i:ishp] arr)
| all(shp >= 0), all(idx >= 0), all(shp + idx <= oshp)
```

### Description
Returns the tile of shape `shp` starting at `idx`.
