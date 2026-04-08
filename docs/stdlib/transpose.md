# `transpose`
Reverses axis order of an array.

### Signature
```sac
<a>[d:shp_t] transpose(<a>[d:shp] arr)
| all(reverse(shp) == shp_t)
```

### Description
`transpose` maps index `iv` to `reverse(iv)`.
