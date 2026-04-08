# `drop_apl`
APL variant of `drop` with overdrop behavior.

### Signature
```sac
<a>[o:shp_res,i:ishp] drop_apl(int[o] sv, <a>[o:oshp,i:ishp] arr)
```

### Description
When more elements are dropped than available, result extents clamp at zero.
