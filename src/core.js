/**
 * Core subset-sum logic using a bitset represented as a BigInt.
 *
 * Why BigInt? JavaScript has no native fixed-width integer type, and a
 * Uint32Array-based bitset would need manual carry handling across words.
 * A BigInt gives us unbounded width and shift/OR operations that map directly
 * onto the classic bitset DP transition, at the cost of some speed for very
 * large targets. For the input sizes this library targets (targets up to a few
 * thousand), BigInt is both simpler and fast enough.
 *
 * The DP invariant: bit i of `reachable` is set iff some subset of the numbers
 * processed so far sums exactly to i. Initially only the empty subset (sum 0)
 * is reachable, so `reachable = 1n`.
 *
 * For each value v, every already-reachable sum s can be extended to s + v, so
 * the new reachable set is `reachable | (reachable << v)`. We mask to the
 * target width to keep the integer from growing without bound.
 *
 * @module core
 */

/**
 * Returns true when some subset of `numbers` sums exactly to `target`.
 *
 * Every element of `numbers` must be a positive integer. Zero and negative
 * values are rejected because the bitset transition `reachable << v` assumes
 * v >= 1; a zero would be a no-op and a negative shift is an error.
 *
 * The empty subset is a valid subset and sums to 0, so `target === 0` is true
 * for any input (including an empty array).
 *
 * @param {number[]} numbers - positive integers to choose from.
 * @param {number} target - non-negative integer sum to reach.
 * @returns {boolean} whether a subset sums to `target`.
 * @throws {TypeError} if an argument is not an integer or is out of range.
 */
export function subsetSum(numbers, target) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('numbers must be an array');
  }
  if (!Number.isInteger(target) || target < 0) {
    throw new TypeError('target must be a non-negative integer');
  }
  for (let i = 0; i < numbers.length; i++) {
    const v = numbers[i];
    if (!Number.isInteger(v) || v <= 0) {
      throw new TypeError(`numbers[${i}] must be a positive integer`);
    }
  }

  // Sum 0 is always reachable via the empty subset.
  if (target === 0) {
    return true;
  }

  // Any single element larger than the target cannot participate in a subset
  // that sums exactly to the target, so drop it before touching the bitset.
  // This keeps the shift width bounded by the target.
  const usable = numbers.filter((v) => v <= target);

  // mask has bits 0..target set; used to keep `reachable` from growing past
  // the target width. Without it, a large value near the target would shift
  // the integer to an enormous width on every iteration.
  const mask = (1n << BigInt(target + 1)) - 1n;
  const targetBit = BigInt(target);
  let reachable = 1n; // only sum 0 is reachable initially

  for (const v of usable) {
    reachable |= reachable << BigInt(v);
    reachable &= mask;
    if (((reachable >> targetBit) & 1n) === 1n) {
      return true;
    }
  }

  return ((reachable >> targetBit) & 1n) === 1n;
}
