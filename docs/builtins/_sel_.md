# `_sel_`
The primary primitive for array selection. It takes an index vector V and an array A.

>**Details:** If the length of the index vector is equal to the rank of the array, it returns a scalar. If the vector is shorter, it returns a subarray.

>**Safety:** Requires that `0 ≤ V < shape(A)` for all components

### Variants In `prf.def`
- `_sel_VxA_`
