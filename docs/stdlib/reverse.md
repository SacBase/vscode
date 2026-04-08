# `reverse`
Reverses an array along an axis.

### Common Signatures
```sac
<a>[n,d:shp] reverse(<a>[n,d:shp] arr)
<a>[axis:oshp,n,i:ishp] reverse(int axis, <a>[axis:oshp,n,i:ishp] arr)
```

### Description
- 1-argument form reverses the leading axis.
- 2-argument form reverses the specified axis.
