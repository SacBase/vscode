# `_aplmod_`
Implements APL-style modulo, which is defined as `a - b * floor(a / b)`. This differs from the standard C-style modulo in that it always returns a non-negative result, even if `a` is negative.

### Variants In `prf.def`
- `_aplmod_SxS_`
- `_aplmod_SxV_`
- `_aplmod_VxS_`
- `_aplmod_VxV_`
