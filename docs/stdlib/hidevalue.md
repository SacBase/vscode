# `hideValue`
Hides value information to limit compile-time specialization.

### Common Signatures
```sac
<a>[d:shp] hideValue(<a>[d:shp] arr)
<a>[d:shp] hideValue(<a>[d:shp] arr, int i)
```

### Description
Used mainly in benchmarking and kernel-call patterns where static values should be obscured.
