# `drop`
Drops a prefix or suffix along the leading axes.

### Signature
```sac
<a>[o:shp_res,i:ishp] drop(int[o] sv, <a>[o:oshp,i:ishp] arr)
| all(abs(sv) <= oshp)
```

### Description
- Positive components drop from the front.
- Negative components drop from the back.
- Overdrop is not allowed in this variant.

### Example
```sac
drop([2], [10, 20, 30, 40])   // [30, 40]
drop([-1], [10, 20, 30, 40])  // [10, 20, 30]
```
