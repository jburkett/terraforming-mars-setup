import { describe, expect, it } from 'vitest'
import { BOARD_IDS, EXPANSION_IDS } from '../../src/content/types'

import {
  initialConfiguration,
  updateConfiguration,
  dependencyNotices,
} from '../../src/domain/configuration'

describe('US1 configuration: AC-01–06, D1/D2 and scope', () => {
  it('starts with two players, all seven content options/boards and both supported variants on', () => {
    const config = initialConfiguration()
    expect(config.playerCount).toBe(2)
    expect(config.enabledContent).toEqual(EXPANSION_IDS)
    expect(config.expandedBoards).toBe(true)
    expect(config.boardCandidates).toEqual(BOARD_IDS)
    expect(config.variants).toEqual({
      extendedStart: true,
      researchDrafting: true,
    })
    expect(Object.keys(config).sort()).toEqual([
      'boardCandidates',
      'enabledContent',
      'expandedBoards',
      'playerCount',
      'variants',
    ])
  })
  it('bulk-none atomically disables P2/Prelude, restores inactive Tharsis, and preserves N/variants', () => {
    const before = updateConfiguration(initialConfiguration(), {
      type: 'set-player-count',
      value: 5,
    })
    const after = updateConfiguration(before, {
      type: 'select-content',
      enabled: false,
    })
    expect(after.playerCount).toBe(5)
    expect(after.enabledContent).toEqual([])
    expect(after.expandedBoards).toBe(false)
    expect(after.boardCandidates).toEqual(['tharsis'])
    expect(after.variants).toEqual(before.variants)
    expect(dependencyNotices(after)).toEqual([])
  })
  it('bulk-all restores every board/content option without changing N or variant choices', () => {
    let config = updateConfiguration(initialConfiguration(), {
      type: 'select-content',
      enabled: false,
    })
    config = updateConfiguration(config, { type: 'set-player-count', value: 3 })
    config = updateConfiguration(config, {
      type: 'select-variants',
      enabled: false,
    })
    const after = updateConfiguration(config, {
      type: 'select-content',
      enabled: true,
    })
    expect(after.enabledContent).toEqual(EXPANSION_IDS)
    expect(after.boardCandidates).toEqual(BOARD_IDS)
    expect(after.expandedBoards).toBe(true)
    expect(after.playerCount).toBe(3)
    expect(after.variants).toEqual({
      extendedStart: false,
      researchDrafting: false,
    })
  })
  it('enables required Prelude and keeps it on while P2 is on, with a visible reason', () => {
    const off = updateConfiguration(initialConfiguration(), {
      type: 'select-content',
      enabled: false,
    })
    const on = updateConfiguration(off, {
      type: 'set-content',
      id: 'prelude2',
      enabled: true,
    })
    expect(on.enabledContent).toEqual(['prelude', 'prelude2'])
    expect(dependencyNotices(on).join(' ')).toMatch(
      /Prelude 2 requires Prelude/,
    )
    expect(
      updateConfiguration(on, {
        type: 'set-content',
        id: 'prelude',
        enabled: false,
      }).enabledContent,
    ).toEqual(['prelude', 'prelude2'])
    const p2off = updateConfiguration(on, {
      type: 'set-content',
      id: 'prelude2',
      enabled: false,
    })
    expect(
      updateConfiguration(p2off, {
        type: 'set-content',
        id: 'prelude',
        enabled: false,
      }).enabledContent,
    ).toEqual([])
  })
  it('variants remain independent of expansions and page-local bulk changes', () => {
    const off = updateConfiguration(initialConfiguration(), {
      type: 'select-content',
      enabled: false,
    })
    const variantsOff = updateConfiguration(off, {
      type: 'select-variants',
      enabled: false,
    })
    expect(variantsOff.variants).toEqual({
      extendedStart: false,
      researchDrafting: false,
    })
    const extended = updateConfiguration(variantsOff, {
      type: 'set-variant',
      id: 'extendedStart',
      enabled: true,
    })
    const drafting = updateConfiguration(extended, {
      type: 'set-variant',
      id: 'researchDrafting',
      enabled: true,
    })
    expect(drafting.variants).toEqual({
      extendedStart: true,
      researchDrafting: true,
    })
    expect(drafting.enabledContent).toEqual([])
    expect(drafting.boardCandidates).toEqual(['tharsis'])
  })
  it('permits excluding Tharsis, then removing the last candidate restores off/Tharsis fallback', () => {
    let config = updateConfiguration(initialConfiguration(), {
      type: 'set-board',
      id: 'tharsis',
      enabled: false,
    })
    expect(config.boardCandidates).toEqual(
      BOARD_IDS.filter((id) => id !== 'tharsis'),
    )
    expect(config.expandedBoards).toBe(true)
    for (const id of BOARD_IDS.filter((id) => id !== 'tharsis'))
      config = updateConfiguration(config, {
        type: 'set-board',
        id,
        enabled: false,
      })
    expect(config.expandedBoards).toBe(false)
    expect(config.boardCandidates).toEqual(['tharsis'])
    expect(
      updateConfiguration(config, {
        type: 'set-board',
        id: 'hellas',
        enabled: true,
      }),
    ).toEqual(config)
    expect(
      updateConfiguration(config, {
        type: 'set-expanded-boards',
        enabled: true,
      }).boardCandidates,
    ).toEqual(BOARD_IDS)
  })
  it('expanded-boards off clears candidates to Tharsis without changing unrelated choices', () => {
    const config = initialConfiguration()
    const off = updateConfiguration(config, {
      type: 'set-expanded-boards',
      enabled: false,
    })
    expect(off.boardCandidates).toEqual(['tharsis'])
    expect(off.expandedBoards).toBe(false)
    expect(off.enabledContent).toEqual(config.enabledContent)
    expect(off.variants).toEqual(config.variants)
  })
  it.each([2, 3, 4, 5])('accepts player count %i', (value) =>
    expect(
      updateConfiguration(initialConfiguration(), {
        type: 'set-player-count',
        value,
      }).playerCount,
    ).toBe(value),
  )
  it.each([1, 6, 2.5, NaN, Infinity])(
    'rejects out-of-range/noninteger player count %s',
    (value) =>
      expect(() =>
        updateConfiguration(initialConfiguration(), {
          type: 'set-player-count',
          value,
        }),
      ).toThrow(RangeError),
  )
  it('never mutates previous configurations or static catalogs', () => {
    const config = initialConfiguration()
    const before = structuredClone(config)
    updateConfiguration(config, {
      type: 'set-content',
      id: 'colonies',
      enabled: false,
    })
    expect(config).toEqual(before)
    expect(BOARD_IDS).toHaveLength(7)
    expect(EXPANSION_IDS).toHaveLength(7)
  })
})
