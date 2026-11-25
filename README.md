# ts-subset-sum-dynamic

Determines whether a subset of given positive integers sums to a target using a bitset-based dynamic programming approach.

```js
import { subsetSum } from './src/index.js';

subsetSum([3, 34, 4, 12, 5, 2], 9);   // true  (4 + 5)
subsetSum([3, 34, 4, 12, 5, 2], 30);  // false
subsetSum([], 0);                     // true  (the empty subset)
```

## Why this exists

The textbook subset-sum DP allocates a boolean array of length `target + 1` and
updates it once per input value, which is O(n * target) time and O(target) space.
The bitset version packs one bit per reachable sum into a single integer and
replaces the inner loop with a shift and an OR. In JavaScript the widest native
integer is a BigInt, so this library uses a BigInt as the bitset: the transition
`reachable |= reachable << v` is the whole inner loop.

The trade-off is explicit. A BigInt is not a fixed-width word, so every shift and
OR allocates a new BigInt proportional to the target width. For targets in the
thousands this is comfortably fast and the code stays short; for targets in the
millions a hand-rolled `Uint32Array` bitset with word carries would win. This
library targets the small-to-moderate targets where clarity matters more than
the last constant factor.

## API

### `subsetSum(numbers, target)`

- `numbers`: array of positive integers (each `>= 1`).
- `target`: non-negative integer.
- Returns `true` if some subset of `numbers` sums exactly to `target`, else `false`.

Throws `TypeError` if `numbers` is not an array, if `target` is not a
non-negative integer, or if any element is not a positive integer. Zero and
negative elements are rejected because the bitset transition assumes a strictly
positive shift.

## The awkward edge

`target === 0` is always `true`, even for an empty input, because the empty
subset is a valid subset and sums to zero. If your problem forbids the empty
subset, check `numbers.length > 0` yourself before calling. Elements larger than
the target are silently ignored rather than treated as errors; they can never
appear in a subset that sums to the target, so dropping them keeps the bitset
width bounded.
