import test from 'node:test';
import assert from 'node:assert/strict';

import { subsetSum } from '../src/index.js';

test('empty array with target 0 is true (empty subset)', () => {
  assert.equal(subsetSum([], 0), true);
});

test('empty array with positive target is false', () => {
  assert.equal(subsetSum([], 5), false);
});

test('single element equal to target', () => {
  assert.equal(subsetSum([7], 7), true);
});

test('single element not equal to target', () => {
  assert.equal(subsetSum([7], 8), false);
});

test('classic small case that requires two elements', () => {
  assert.equal(subsetSum([3, 34, 4, 12, 5, 2], 9), true);
});

test('classic small case with no solution', () => {
  assert.equal(subsetSum([3, 34, 4, 12, 5, 2], 30), false);
});

test('elements larger than target are ignored, not errors', () => {
  assert.equal(subsetSum([100, 200, 3], 3), true);
  assert.equal(subsetSum([100, 200, 3], 5), false);
});

test('duplicate values can be used together', () => {
  assert.equal(subsetSum([2, 2, 2], 6), true);
  assert.equal(subsetSum([2, 2, 2], 5), false);
});

test('target 0 is always reachable even with positive numbers', () => {
  assert.equal(subsetSum([5, 10, 15], 0), true);
});

test('all elements together reach the target', () => {
  assert.equal(subsetSum([1, 2, 3, 4], 10), true);
});

test('target just above the total sum is false', () => {
  assert.equal(subsetSum([1, 2, 3, 4], 11), false);
});

test('larger deterministic case', () => {
  const numbers = [];
  for (let i = 1; i <= 50; i++) numbers.push(i);
  // 1..50 sums to 1275; 500 is reachable (e.g. 1..31 sums to 496, plus 4).
  assert.equal(subsetSum(numbers, 500), true);
  // 1276 exceeds the total, so it cannot be reached.
  assert.equal(subsetSum(numbers, 1276), false);
});

test('rejects non-array numbers', () => {
  assert.throws(() => subsetSum('123', 3), TypeError);
  assert.throws(() => subsetSum(null, 3), TypeError);
});

test('rejects non-integer or negative target', () => {
  assert.throws(() => subsetSum([1, 2], 1.5), TypeError);
  assert.throws(() => subsetSum([1, 2], -1), TypeError);
});

test('rejects non-positive or non-integer elements', () => {
  assert.throws(() => subsetSum([1, 0], 1), TypeError);
  assert.throws(() => subsetSum([1, -2], 1), TypeError);
  assert.throws(() => subsetSum([1, 2.5], 1), TypeError);
});
