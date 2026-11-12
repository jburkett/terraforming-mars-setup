import { expect, it, vi } from 'vitest'
import { BOARD_IDS, EXPANSION_IDS } from '../../src/content/types'
import { initialConfiguration } from '../../src/domain/configuration'
import type { Configuration } from '../../src/domain/types'
import { generateMissingSelections } from '../../src/domain/selections'
import { seeded, rows } from '../helpers/public-selection-api'
import { previewReset, commitReset, cancelReset } from '../helpers/edit-api'
const configuration: Configuration = {
  ...initialConfiguration(),
  playerCount: 5,
  enabledContent: ['colonies', 'ma'],
  expandedBoards: true,
  boardCandidates: ['elysium'],
  variants: { extendedStart: false, researchDrafting: false },
}
const selections = {
  ...seeded(configuration),
  firstPlayer: 5 as const,
  milestones: rows(
    [
      'ma:milestone:pioneer',
      'ma:milestone:builder',
      'ma:milestone:terraformer',
      'ma:milestone:planner',
      'ma:milestone:tycoon',
    ],
    [0, 1],
  ),
}
it('AC-30: previews Reset without changing state or drawing; explicit confirmation is always required', () => {
  const random = vi.spyOn(Math, 'random'),
    before = JSON.stringify({ configuration, selections })
  const preview = previewReset(configuration, selections)
  expect(
    preview.losses.find((loss) => loss.field === 'milestones')?.lockedIds,
  ).toContain('ma:milestone:pioneer')
  expect(preview.configuration.playerCount).toBe(2)
  expect(preview.selections.board).toBeNull()
  expect(commitReset(preview)).toBeNull()
  expect(cancelReset(preview)).toBe(preview.previous)
  expect(cancelReset(preview)).toEqual({ configuration, selections })
  expect(JSON.stringify({ configuration, selections })).toBe(before)
  expect(random).not.toHaveBeenCalled()
})
it('AC-30/D1: confirmed Reset restores all defaults and removes every generated result and lock', () => {
  const result = commitReset(previewReset(configuration, selections), true)
  expect(result?.configuration.playerCount).toBe(2)
  expect(result?.configuration.enabledContent).toEqual(EXPANSION_IDS)
  expect(result?.configuration.boardCandidates).toEqual(BOARD_IDS)
  expect(result?.configuration.expandedBoards).toBe(true)
  expect(result?.configuration.variants).toEqual({
    extendedStart: true,
    researchDrafting: true,
  })
  expect(result?.selections).toEqual({
    board: null,
    firstPlayer: null,
    colonies: null,
    milestones: null,
    awards: null,
  })
  expect(JSON.stringify(result)).not.toMatch(/WGT|worldGovernment|longerVenus/i)
})
it('next setup entry generates anew after Reset rather than retaining the old results/locks', () => {
  const reset = commitReset(previewReset(configuration, selections), true)
  expect(reset?.selections.firstPlayer).toBeNull()
  if (!reset) return
  const source = vi.fn(() => 0)
  expect(source).not.toHaveBeenCalled()
  const generated = generateMissingSelections(
    reset.configuration,
    reset.selections,
    source,
  )
  expect(generated.ok).toBe(true)
  expect(source).toHaveBeenCalled()
  if (generated.ok) {
    expect(generated.selections.colonies).toHaveLength(5)
    expect(generated.selections.milestones?.every((row) => !row.locked)).toBe(
      true,
    )
    expect(generated.selections.firstPlayer).toBe(1)
  }
})
it('Reset also requires consent in a pristine session', () => {
  const c = initialConfiguration(),
    s = {
      board: null,
      firstPlayer: null,
      colonies: null,
      milestones: null,
      awards: null,
    }
  expect(commitReset(previewReset(c, s))).toBeNull()
  expect(cancelReset(previewReset(c, s))).toEqual({
    configuration: c,
    selections: s,
  })
})
