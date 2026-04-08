# `tile_apl`
APL variant of `tile` with overtile support.

### Signature
```sac
<a>[d:shp,i:ishp] tile_apl(int[d] shp, int[d] idx, <a>[d:oshp,i:ishp] arr)
| all(shp >= 0)
```

### Description
Out-of-bounds portions are padded with type zero values.
