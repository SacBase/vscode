# `print`
Prints values to standard output.

### Common Signatures
```sac
void print(<a> val)
void print(<a>[d:shp] arr)
void print(string fmt, <a>[d:shp] arr)
```

### Description
`print` is overloaded across scalar and array types in StdLib I/O modules. Array variants are generated in `ArrayIO.xsac`; scalar variants are provided in `ScalarIO.xsac` and other specialized modules.

### Parameters
- `val`/`arr`: Value or array to print.
- `fmt`: Optional format string for formatted output.

### Returns
- `void`

### Example
```sac
print([1, 2, 3])
print("%6.2f", [1.0, 2.5, 3.75])
```

