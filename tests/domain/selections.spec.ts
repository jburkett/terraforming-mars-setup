import { expect, it, describe, vi } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
import {
  initialConfiguration,
  updateConfiguration,
} from '../../src/domain/configuration'
import {
  empty,
  seeded,
  generateMissingSelections,
  customizeSelections,
} from '../helpers/public-selection-api'
import type { Configuration } from '../../src/domain/types'

const configFor = (n: number) =>
  updateConfiguration(initialConfiguration(), {
    type: 'set-player-count',
    value: n,
  })
describe('US2 generation', () => {
  it.each([2, 3, 4, 5])(
    'generates bounded unique public choices for %i players',
    (n) => {
      const config = configFor(n)
      const result = generateMissingSelections(config, empty(), () => 0)
      expect(result.ok).toBe(true)
      if (!result.ok) return
      const s = result.selections
      expect(s.board).toBe('tharsis')
      expect(s.firstPlayer).toBe(1)
      expect(s.colonies).toHaveLength(n <= 3 ? 5 : n + 2)
      expect(new Set(s.colonies).size).toBe(s.colonies?.length)
      expect(s.milestones).toHaveLength(5)
      expect(s.awards).toHaveLength(5)
      for (const pool of [s.milestones, s.awards])
        expect(new Set(pool?.map((row) => row.objectiveId)).size).toBe(5)
    },
  )
  it('retains unchanged results/locks by identity and consumes no randomness on revisit', () => {
    const c = initialConfiguration()
    const previous = seeded(c)
    const rng = vi.fn(() => {
      throw new Error('unexpected draw')
    })
    const result = generateMissingSelections(c, previous, rng)
    expect(result).toEqual({ ok: true, selections: previous })
    if (result.ok) expect(result.selections).toBe(previous)
    expect(rng).not.toHaveBeenCalled()
  })
  it('fills only missing values and keeps inactive colonies eligible', () => {
    const c = initialConfiguration()
    const previous = seeded(c)
    const partial = { ...previous, firstPlayer: null }
    const result = generateMissingSelections(c, partial, () => 4)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.selections.firstPlayer).toBe(1)
      expect(result.selections.board).toBe(previous.board)
      expect(result.selections.colonies).toBe(previous.colonies)
      expect(result.selections.milestones).toBe(previous.milestones)
    }
    for (const id of ['titan', 'enceladus', 'miranda'] as const) {
      const retained = {
        ...previous,
        colonies: [
          id,
          ...catalogs.colonies
            .filter((c) => c.id !== id)
            .slice(0, 4)
            .map((c) => c.id),
        ],
      }
      expect(
        generateMissingSelections(c, retained, () => {
          throw new Error('draw')
        }),
      ).toEqual({ ok: true, selections: retained })
    }
  })
  it('uses only Tharsis/first player with base-only options and one-candidate board draws are no-ops', () => {
    const c = updateConfiguration(initialConfiguration(), {
      type: 'select-content',
      enabled: false,
    })
    const rng = vi.fn(() => 1)
    const result = generateMissingSelections(c, empty(), rng)
    expect(result).toEqual({
      ok: true,
      selections: { ...empty(), board: 'tharsis', firstPlayer: 2 },
    })
    expect(rng).toHaveBeenCalledTimes(1)
  })
  it('fails an undersized pool atomically without mutating state or enabling content', () => {
    const c: Configuration = {
      ...initialConfiguration(),
      expandedBoards: false,
      boardCandidates: ['tharsis'],
    }
    const previous = empty()
    const before = structuredClone(previous)
    const result = generateMissingSelections(c, previous, () => 0, {
      ...catalogs,
      colonies: catalogs.colonies.slice(0, 1),
    })
    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(result.conflict).toMatchObject({
        pool: 'colonies',
        requested: 5,
        available: 1,
      })
    expect(previous).toEqual(before)
    expect(c.enabledContent).toHaveLength(7)
  })
  it('fills objective holes without rerolling valid unlocked or locked rows', () => {
    const c = initialConfiguration()
    const previous = seeded(c)
    const milestones = previous.milestones!
    const partial = {
      ...previous,
      milestones: [
        {
          ...milestones[0],
          objectiveId: milestones[0].objectiveId!,
          locked: true,
        },
        { position: 1 as const, objectiveId: null, locked: false as const },
        milestones[2],
        milestones[3],
        milestones[4],
      ] as const,
    }
    const result = generateMissingSelections(c, partial, () => 0)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.selections.milestones?.[1].objectiveId).not.toBeNull()
      expect(result.selections.milestones?.[0]).toEqual(partial.milestones[0])
      expect(result.selections.milestones?.[2]).toBe(milestones[2])
    }
  })
})
describe('US2 public customization', () => {
  it('changes only a bounded first-player target and allows repeat rerolls', () => {
    const c = initialConfiguration()
    const previous = seeded(c)
    const result = customizeSelections(
      c,
      previous,
      { type: 'set-first-player', value: 2 },
      () => 0,
    )
    expect(result).toEqual({
      ok: true,
      selections: { ...previous, firstPlayer: 2 },
    })
    expect(
      customizeSelections(
        c,
        previous,
        { type: 'set-first-player', value: 3 },
        () => 0,
      ).ok,
    ).toBe(false)
    expect(
      customizeSelections(
        c,
        previous,
        { type: 'reroll-first-player' },
        () => 0,
      ),
    ).toEqual({ ok: true, selections: previous })
  })
  it('supports unique colony replacements and target-only rerolls without colony locks', () => {
    const c = initialConfiguration()
    const previous = seeded(c)
    const result = customizeSelections(
      c,
      previous,
      { type: 'set-colony', row: 0, id: 'titan' },
      () => 0,
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.selections.colonies?.[0]).toBe('titan')
      expect(new Set(result.selections.colonies).size).toBe(5)
      expect(result.selections.milestones).toBe(previous.milestones)
      expect(result.selections.firstPlayer).toBe(previous.firstPlayer)
    }
    expect(
      customizeSelections(
        c,
        previous,
        { type: 'set-colony', row: 0, id: previous.colonies![1]! },
        () => 0,
      ).ok,
    ).toBe(false)
    const reroll = customizeSelections(
      c,
      previous,
      { type: 'reroll-colonies' },
      () => 0,
    )
    expect(reroll.ok).toBe(true)
    if (reroll.ok) {
      expect(reroll.selections.colonies).toHaveLength(5)
      expect(reroll.selections.board).toBe(previous.board)
    }
  })
})
