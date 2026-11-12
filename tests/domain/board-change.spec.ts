import { expect, it, vi } from 'vitest'
import {
  initialConfiguration,
  updateConfiguration,
} from '../../src/domain/configuration'
import {
  previewBoardChange,
  commitBoardChange,
} from '../../src/domain/board-change'
import { rows, seeded } from '../helpers/public-selection-api'
import { objectiveSets } from '../../src/domain/objectives'

it('previews printed-set loss without mutation and requires consent before commit', () => {
  const config = updateConfiguration(initialConfiguration(), {
    type: 'set-content',
    id: 'ma',
    enabled: false,
  })
  const previous = seeded(config)
  const before = structuredClone(previous)
  const result = previewBoardChange(config, previous, {
    kind: 'manual',
    boardId: 'elysium',
  })
  expect(result.ok).toBe(true)
  if (!result.ok) return
  expect(result.preview.needsConfirmation).toBe(true)
  expect(result.preview.losses.join(' ')).toMatch(/printed/)
  expect(previous).toEqual(before)
  const rng = vi.fn(() => {
    throw new Error('draw')
  })
  expect(commitBoardChange(result.preview, rng).ok).toBe(false)
  expect(rng).not.toHaveBeenCalled()
  const committed = commitBoardChange(result.preview, rng, true)
  expect(committed.ok).toBe(true)
  if (committed.ok) {
    expect(committed.selections.board).toBe('elysium')
    expect(committed.selections.firstPlayer).toBe(previous.firstPlayer)
    expect(committed.selections.colonies).toBe(previous.colonies)
    expect(
      objectiveSets(config, committed.selections).milestones.find(
        (o) => o.objective.name === 'Tycoon',
      )?.threshold?.value,
    ).toBe(15)
  }
})
it('clears only board-ineligible MA rows after consent, preserving eligible locks/positions', () => {
  const config = initialConfiguration()
  const previous = {
    ...seeded(config),
    milestones: rows(
      [
        'ma:milestone:geologist',
        'ma:milestone:builder',
        'ma:milestone:merchant',
        'ma:milestone:planner',
        'ma:milestone:tycoon',
      ],
      [0, 1],
    ),
  }
  const result = previewBoardChange(config, previous, {
    kind: 'manual',
    boardId: 'hellas',
  })
  expect(result.ok).toBe(true)
  if (!result.ok) return
  expect(result.preview.needsConfirmation).toBe(true)
  expect(result.preview.losses.join(' ')).toContain('Geologist')
  const committed = commitBoardChange(result.preview, () => 0, true)
  expect(committed.ok).toBe(true)
  if (!committed.ok) return
  expect(committed.selections.milestones?.[0].objectiveId).not.toBe(
    'ma:milestone:geologist',
  )
  expect(committed.selections.milestones?.[0].locked).toBe(false)
  expect(committed.selections.milestones?.[1]).toBe(previous.milestones[1])
  expect(committed.selections.awards).toBe(previous.awards)
})
it('retains all eligible MA rows and needs no confirmation for a non-loss board change', () => {
  const c = initialConfiguration()
  const s = seeded(c)
  const result = previewBoardChange(c, s, {
    kind: 'manual',
    boardId: 'elysium',
  })
  expect(result.ok).toBe(true)
  if (!result.ok) return
  expect(result.preview.needsConfirmation).toBe(false)
  const committed = commitBoardChange(result.preview, () => {
    throw new Error('draw')
  })
  expect(committed.ok).toBe(true)
  if (committed.ok) {
    expect(committed.selections.board).toBe('elysium')
    expect(committed.selections.milestones).toBe(s.milestones)
  }
})
it('rejects unchecked boards and treats one-candidate rerolls as no-ops', () => {
  const c = updateConfiguration(initialConfiguration(), {
    type: 'set-expanded-boards',
    enabled: false,
  })
  const s = seeded(c)
  expect(
    previewBoardChange(c, s, { kind: 'manual', boardId: 'hellas' }).ok,
  ).toBe(false)
  const result = previewBoardChange(c, s, { kind: 'reroll' })
  expect(result.ok).toBe(true)
  if (!result.ok) return
  const rng = vi.fn(() => {
    throw new Error('draw')
  })
  expect(commitBoardChange(result.preview, rng)).toEqual({
    ok: true,
    selections: s,
  })
  expect(rng).not.toHaveBeenCalled()
})
it('reroll preview consumes no randomness and warns about possible printed losses before sampling', () => {
  const c = updateConfiguration(initialConfiguration(), {
    type: 'set-content',
    id: 'ma',
    enabled: false,
  })
  const s = seeded(c)
  const result = previewBoardChange(c, s, { kind: 'reroll' })
  expect(result.ok).toBe(true)
  if (!result.ok) return
  expect(result.preview.needsConfirmation).toBe(true)
  const rng = vi.fn(() => 1)
  expect(commitBoardChange(result.preview, rng).ok).toBe(false)
  expect(rng).not.toHaveBeenCalled()
  const committed = commitBoardChange(result.preview, rng, true)
  expect(committed.ok).toBe(true)
  if (committed.ok) expect(committed.selections.board).toBe('hellas')
})
