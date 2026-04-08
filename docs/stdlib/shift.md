# `shift`
Shifts array elements with boundary fill.

### Common Signatures
```sac
<a>[o:oshp,n,i:ishp] shift(int o, int count, <a> boundary, <a>[o:oshp,n,i:ishp] arr)
<a>[o:oshp,i:ishp] shift(int[o] counts, <a> boundary, <a>[o:oshp,i:ishp] arr)
<a>[o:oshp,i:ishp] shift(int[o] counts, <a>[o:oshp,i:ishp] arr)
```

### Description
Unlike `rotate`, `shift` does not wrap. Newly exposed positions are filled with `boundary` (or type zero in the 2-argument form).
