# `take`
Takes a prefix or suffix along the leading axes.

### Signature
```sac
<a>[o:stop,i:ishp] take(int[o] sv, <a>[o:oshp,i:ishp] arr)
| all(abs(sv) <= oshp)
```

### Description
`take` keeps elements according to shape vector `sv`.
- Positive components take from the front.
- Negative components take from the back.
- Overtake is not allowed in this variant.

### Example
```sac
take([2], [10, 20, 30, 40])   // [10, 20]
take([-2], [10, 20, 30, 40])  // [30, 40]
```