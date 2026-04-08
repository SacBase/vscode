# `mask`
Mask-based selection with vector-focused overloads.

### Common Signatures
```sac
<a>[n] mask(bool[n] p, <a>[n] a, <a>[n] b)
<a>[n] mask(bool[n] p, <a>[n] a, <a> b)
<a>[n] mask(bool[n] p, <a> a, <a>[n] b)
<a>[n] mask(bool[n] p, <a> a, <a> b)
<a>[n] mask(bool p, <a>[n] a, <a>[n] b)
```

### Description
Semantically similar to `where`, but implemented differently and intended for scalar/vector style use cases.
