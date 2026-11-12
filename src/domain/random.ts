/** Source of independent uniformly distributed uint32 words, injected by the caller. */
export type Uint32Source = () => number
const RANGE = 2 ** 32

export function randomInteger(bound: number, source: Uint32Source): number {
  if (!Number.isSafeInteger(bound) || bound < 1 || bound > RANGE)
    throw new RangeError('bound must be an integer in 1…2^32')
  if (bound === 1) return 0
  // Drop the incomplete residue class: modulo alone would bias small pools.
  const limit = RANGE - (RANGE % bound)
  for (;;) {
    const word = source()
    if (!Number.isInteger(word) || word < 0 || word >= RANGE)
      throw new RangeError('source must return a uint32 word')
    if (word < limit) return word % bound
  }
}

export type SampleResult<T> =
  | { readonly ok: true; readonly values: readonly T[] }
  | { readonly ok: false; readonly reason: 'insufficient-pool' }

export function sample<T extends string | number>(
  pool: readonly T[],
  count: number,
  source: Uint32Source,
): SampleResult<T> {
  if (!Number.isSafeInteger(count) || count < 0)
    throw new RangeError('count must be a nonnegative safe integer')
  if (new Set(pool).size !== pool.length)
    throw new RangeError('pool must contain unique candidates')
  if (pool.length < count) return { ok: false, reason: 'insufficient-pool' }
  const remaining = [...pool]
  // Partial Fisher–Yates: every ordered sample of this size has equal probability.
  for (let index = 0; index < count; index++) {
    const selected = index + randomInteger(remaining.length - index, source)
    const value = remaining[index]!
    remaining[index] = remaining[selected]!
    remaining[selected] = value
  }
  return { ok: true, values: Object.freeze(remaining.slice(0, count)) }
}
