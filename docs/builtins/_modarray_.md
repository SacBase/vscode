# `_modarray_`
The primitive for **Single Assignment** modification. It returns a "new" array identical to the input array, except for the element/subarray at the specified index vector.

>**Optimization:** If the reference count of the input array is 1, the compiler transforms this into an **in-place update** in the generated C code, avoiding unnecessary copying.

### Variants In `prf.def`
- `_modarray_AxVxS_`
