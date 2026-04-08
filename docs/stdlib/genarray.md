# `genarray`
Generates an array filled with a given value.

### Signature
```sac
<a>[o:oshp,i:ishp] genarray(int[o] oshp, <a>[i:ishp] val)
| all(0 <= oshp)
```

### Description
Creates an array of outer shape `oshp` and fills every outer cell with `val`.

### Parameters
- `oshp`: Outer shape of the result.
- `val`: Value replicated into each outer cell.

### Returns
- A new array with shape `oshp` concatenated with `shape(val)`.

### Example
```sac
genarray([3], 0) // [0, 0, 0]
```
