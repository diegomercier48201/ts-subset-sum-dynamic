/**
 * Public entry point for ts-subset-sum-dynamic.
 *
 * Re-exports the single core function so consumers can import from the
 * package root without knowing the internal file layout.
 *
 * @module index
 */
export { subsetSum } from './core.js';
