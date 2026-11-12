import { expect, it, vi } from 'vitest'
import { randomInteger, sample } from '../../src/domain/random'
import { browserRandomUint32 } from '../../src/random'
const sequence = (...values: number[]) => {
  let i = 0
  return vi.fn(() => {
    const value = values[i++]
    if (value === undefined) throw new Error('unexpected draw')
    return value
  })
}
it('maps equal accepted residue classes without modulo bias and rejects the incomplete tail', () => {
  for (let n = 0; n < 12; n++) expect(randomInteger(3, () => n)).toBe(n % 3)
  const source = sequence(0xffff_ffff, 5)
  expect(randomInteger(3, source)).toBe(2)
  expect(source).toHaveBeenCalledTimes(2)
})
it('handles the entire uint32 range and one candidate without unnecessary draws', () => {
  expect(randomInteger(2 ** 32, () => 0xffff_ffff)).toBe(0xffff_ffff)
  const source = sequence()
  expect(randomInteger(1, source)).toBe(0)
  expect(sample(['only'], 1, source)).toEqual({ ok: true, values: ['only'] })
  expect(source).not.toHaveBeenCalled()
})
it.each([0, -1, 1.5, NaN, Infinity, 2 ** 32 + 1])(
  'rejects invalid bound %s',
  (bound) => expect(() => randomInteger(bound, () => 0)).toThrow(RangeError),
)
it.each([-1, 1.5, NaN, Infinity, 2 ** 32])(
  'rejects invalid source word %s',
  (word) => expect(() => randomInteger(3, () => word)).toThrow(RangeError),
)
it('samples uniformly without replacement using a copy and can repeat previous draw results', () => {
  const pool = Object.freeze(['a', 'b', 'c'])
  const result = sample(pool, 3, sequence(0, 0))
  expect(result).toEqual({ ok: true, values: ['a', 'b', 'c'] })
  expect(pool).toEqual(['a', 'b', 'c'])
  expect(sample(pool, 1, sequence(1))).toEqual(sample(pool, 1, sequence(1)))
})
it('can produce every ordered pair with equally many bounded outcomes', () => {
  const outcomes = new Set<string>()
  for (let first = 0; first < 3; first++)
    for (let second = 0; second < 2; second++) {
      const result = sample(['a', 'b', 'c'], 2, sequence(first, second))
      if (result.ok) outcomes.add(result.values.join(''))
    }
  expect(outcomes.size).toBe(6)
})
it('reports an insufficient pool before consuming randomness or changing inputs', () => {
  const source = sequence()
  const pool = Object.freeze(['available'])
  expect(sample(pool, 2, source)).toEqual({
    ok: false,
    reason: 'insufficient-pool',
  })
  expect(sample(pool, 0, source)).toEqual({ ok: true, values: [] })
  expect(source).not.toHaveBeenCalled()
  expect(pool).toEqual(['available'])
})
it('rejects duplicate candidates and invalid counts instead of inventing entries', () => {
  expect(() => sample(['a', 'a'], 2, () => 0)).toThrow(RangeError)
  for (const count of [-1, 0.5, NaN])
    expect(() => sample(['a'], count, () => 0)).toThrow(RangeError)
})
it('uses browser cryptographic words, not a remote source or Math.random', () => {
  const getRandomValues = vi.fn((array: Uint32Array) => {
    array[0] = 123
    return array
  })
  vi.stubGlobal('crypto', { getRandomValues })
  expect(browserRandomUint32()).toBe(123)
  expect(getRandomValues).toHaveBeenCalledOnce()
})
