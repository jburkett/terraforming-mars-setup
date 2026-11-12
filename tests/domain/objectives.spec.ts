import { describe, expect, it, vi } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
import {
  initialConfiguration,
  updateConfiguration,
} from '../../src/domain/configuration'
import {
  rows,
  seeded,
  objectiveSets,
  objectiveAlternatives,
  customizeSelections,
} from '../helpers/public-selection-api'
import type { BoardId } from '../../src/content/types'

const printed = (board: BoardId) => ({
  ...updateConfiguration(initialConfiguration(), {
    type: 'select-content',
    enabled: false,
  }),
  expandedBoards: true as const,
  boardCandidates: [board] as const,
})
describe('US2 objective projection', () => {
  it('keeps five MA rows separate from the fixed Venus additions', () => {
    const c = initialConfiguration()
    const s = seeded(c)
    const projected = objectiveSets(c, s)
    expect(projected.milestones).toHaveLength(6)
    expect(projected.awards).toHaveLength(6)
    expect(projected.milestones.at(-1)?.objective.name).toBe('Hoverlord')
    expect(projected.awards.at(-1)?.objective.name).toBe('Venuphile')
    const off = updateConfiguration(c, {
      type: 'set-content',
      id: 'venus',
      enabled: false,
    })
    expect(objectiveSets(off, seeded(off)).milestones).toHaveLength(5)
  })
  it.each([
    ['utopia-planitia', 'Pioneer', 'colonies'],
    ['terra-cimmeria', 'Planetologist', 'venus'],
    ['amazonis-planitia', 'Lobbyist', 'turmoil'],
  ] as const)(
    'retains complete printed %s sets and names each disabled expansion',
    (board, name, missing) => {
      const c = printed(board)
      const s = seeded(c)
      const projected = objectiveSets(c, s)
      expect(projected.milestones).toHaveLength(5)
      expect(projected.awards).toHaveLength(5)
      expect(
        projected.milestones.find((o) => o.objective.name === name)
          ?.limitations,
      ).toEqual([missing])
      expect(
        projected.milestones.every((o) => o.objective.source === 'printed'),
      ).toBe(true)
      const enabled = updateConfiguration(c, {
        type: 'set-content',
        id: missing,
        enabled: true,
      })
      expect(
        objectiveSets(enabled, s).milestones.find(
          (o) => o.objective.name === name,
        )?.limitations,
      ).toEqual([])
      expect(
        objectiveSets(enabled, s)
          .milestones.filter((o) => o.objective.source === 'printed')
          .map((o) => o.objective.id),
      ).toEqual(projected.milestones.map((o) => o.objective.id))
      expect(objectiveAlternatives('milestone', 0, c, s)).toEqual([])
    },
  )
  it.each([
    ['tharsis', 'Builder', 8],
    ['elysium', 'Tycoon', 15],
    ['amazonis-planitia', 'Merchant', 3],
  ] as const)('uses printed %s %s threshold %i', (board, name, value) => {
    const c = printed(board)
    expect(
      objectiveSets(c, seeded(c)).milestones.find(
        (o) => o.objective.name === name,
      )?.threshold?.value,
    ).toBe(value)
  })
  it('uses MA thresholds and applies the Turmoil overlay only to printed Tharsis', () => {
    const c = initialConfiguration()
    const s = {
      ...seeded(c),
      milestones: rows([
        'ma:milestone:builder',
        'ma:milestone:tycoon',
        'ma:milestone:merchant',
        'ma:milestone:terraformer',
        'ma:milestone:generalist',
      ]),
    }
    expect(
      objectiveSets(c, s)
        .milestones.slice(0, 5)
        .map((o) => o.threshold?.value),
    ).toEqual([7, 10, 2, 29, 1])
    const ceOff = updateConfiguration(c, {
      type: 'set-content',
      id: 'ce',
      enabled: false,
    })
    expect(objectiveSets(ceOff, s).milestones[4]?.threshold?.value).toBe(2)
    const tharsis = updateConfiguration(printed('tharsis'), {
      type: 'set-content',
      id: 'turmoil',
      enabled: true,
    })
    expect(
      objectiveSets(tharsis, seeded(tharsis)).milestones[0]?.threshold?.value,
    ).toBe(26)
  })
  it('filters every other row symmetrically, respects prerequisites and never sorts rows', () => {
    const c = printed('hellas')
    const ma = updateConfiguration(c, {
      type: 'set-content',
      id: 'ma',
      enabled: true,
    })
    const s = seeded(ma)
    const values = s.milestones!.map((r) => r.objectiveId)
    for (let row = 0; row < 5; row++) {
      const alternatives = objectiveAlternatives('milestone', row, ma, s).map(
        (o) => o.id,
      )
      expect(alternatives).toContain(values[row])
      for (let other = 0; other < 5; other++)
        if (other !== row) expect(alternatives).not.toContain(values[other])
      for (const unavailable of [
        'geologist',
        'lobbyist',
        'pioneer',
        'planetologist',
      ])
        expect(alternatives).not.toContain('ma:milestone:' + unavailable)
    }
    expect(s.milestones!.map((r) => r.objectiveId)).toEqual(values)
    expect(
      objectiveAlternatives('award', 0, ma, s).map((o) => o.name),
    ).toContain('Constructor')
  })
})
describe('US2 objective customization', () => {
  it('manual row-three choice locks in place and immediately updates every other row', () => {
    const c = initialConfiguration()
    const previous = seeded(c)
    const result = customizeSelections(
      c,
      previous,
      {
        type: 'set-objective',
        kind: 'milestone',
        row: 2,
        id: 'ma:milestone:terraformer',
      },
      () => 0,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.selections.milestones?.[2]).toEqual({
      position: 2,
      objectiveId: 'ma:milestone:terraformer',
      locked: true,
    })
    expect(result.selections.milestones?.[0]).toBe(previous.milestones?.[0])
    expect(result.selections.awards).toBe(previous.awards)
    for (const row of [0, 1, 3, 4])
      expect(
        objectiveAlternatives('milestone', row, c, result.selections).map(
          (o) => o.id,
        ),
      ).not.toContain('ma:milestone:terraformer')
    expect(
      objectiveAlternatives('milestone', 0, c, result.selections).map(
        (o) => o.id,
      ),
    ).toContain(previous.milestones![2].objectiveId)
  })
  it.each(['milestone', 'award'] as const)(
    'rerolls only unlocked %s rows and all-locked reroll is a no-op',
    (kind) => {
      const c = initialConfiguration()
      const key = kind === 'milestone' ? 'milestones' : 'awards'
      const previous = seeded(c)
      const selected = previous[key]!.map((r) => r.objectiveId!)
      const locked = { ...previous, [key]: rows(selected, [0, 3]) }
      const draw = vi.fn(() => 7)
      const result = customizeSelections(
        c,
        locked,
        { type: 'reroll-objectives', kind },
        draw,
      )
      expect(draw).toHaveBeenCalledTimes(3)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.selections[key]?.[0]).toBe(locked[key]![0])
        expect(result.selections[key]?.[3]).toBe(locked[key]![3])
        expect(
          new Set(result.selections[key]?.map((r) => r.objectiveId)).size,
        ).toBe(5)
      }
      const all = { ...previous, [key]: rows(selected, [0, 1, 2, 3, 4]) }
      const rng = vi.fn(() => {
        throw new Error('draw')
      })
      expect(
        customizeSelections(c, all, { type: 'reroll-objectives', kind }, rng),
      ).toEqual({ ok: true, selections: all })
      expect(rng).not.toHaveBeenCalled()
    },
  )
  it('rejects duplicate, ineligible and fixed/printed replacement choices without mutation', () => {
    const c = initialConfiguration()
    const previous = seeded(c)
    const before = structuredClone(previous)
    for (const id of [
      previous.milestones![0].objectiveId!,
      'venus:milestone:hoverlord',
      'printed:tharsis:milestone:builder',
    ])
      expect(
        customizeSelections(
          c,
          previous,
          { type: 'set-objective', kind: 'milestone', row: 2, id },
          () => 0,
        ).ok,
      ).toBe(false)
    expect(previous).toEqual(before)
    expect(catalogs.milestones).toHaveLength(71)
  })
})
