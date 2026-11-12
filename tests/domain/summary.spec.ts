import { expect, it } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
import {
  initialConfiguration,
  updateConfiguration,
} from '../../src/domain/configuration'
import type { Configuration } from '../../src/domain/types'
import { seeded, rows } from '../helpers/public-selection-api'
import { projectSummary } from '../helpers/setup-api'

it('AC-25: reports committed N, first player, board, enabled content and both variants', () => {
  const c = {
    ...initialConfiguration(),
    playerCount: 4 as const,
    variants: { extendedStart: false, researchDrafting: true },
  }
  const s = { ...seeded(c), firstPlayer: 3 as const }
  const result = projectSummary(c, s)
  expect(result.playerCount).toBe(4)
  expect(result.firstPlayer).toBe(3)
  expect(result.board?.id).toBe(s.board)
  expect(result.content.map((e) => e.id)).toEqual(c.enabledContent)
  expect(result.variants).toEqual(c.variants)
  expect(result.colonies.map((tile) => tile.id)).toEqual(s.colonies)
})
it('AC-25: replacement identities/positions and fixed Venus versions agree with public choices', () => {
  const c = initialConfiguration(),
    s = seeded(c),
    result = projectSummary(c, s)
  expect(result.milestones.slice(0, 5).map((e) => e.objective.id)).toEqual(
    s.milestones?.map((r) => r.objectiveId),
  )
  expect(result.awards.slice(0, 5).map((e) => e.objective.id)).toEqual(
    s.awards?.map((r) => r.objectiveId),
  )
  expect(result.milestones).toHaveLength(6)
  expect(result.awards).toHaveLength(6)
  expect(result.milestones[5]?.objective.source).toBe('venus')
  expect(result.awards[5]?.objective.name).toBe('Venuphile')
})
it.each([
  ['utopia-planitia', 'Pioneer', 'colonies'],
  ['terra-cimmeria', 'Planetologist', 'venus'],
  ['amazonis-planitia', 'Lobbyist', 'turmoil'],
] as const)(
  'AC-35: %s retains printed %s and its disabled %s cause',
  (board, name, missing) => {
    const c: Configuration = {
      ...initialConfiguration(),
      enabledContent: [],
      expandedBoards: true,
      boardCandidates: [board],
    }
    const result = projectSummary(c, seeded(c))
    expect(result.milestones).toHaveLength(5)
    expect(result.awards).toHaveLength(5)
    expect(
      result.milestones.every((e) => e.objective.source === 'printed'),
    ).toBe(true)
    expect(
      result.milestones.find((e) => e.objective.name === name)?.limitations,
    ).toEqual([missing])
  },
)
it('AC-24/25: preserves source-specific printed and MA Terraformer thresholds', () => {
  const printed = updateConfiguration(initialConfiguration(), {
    type: 'set-content',
    id: 'ma',
    enabled: false,
  })
  expect(
    projectSummary(printed, seeded(printed)).milestones.find(
      (e) => e.objective.name === 'Terraformer',
    )?.threshold?.value,
  ).toBe(26)
  const c = initialConfiguration(),
    s = {
      ...seeded(c),
      milestones: rows([
        'ma:milestone:terraformer',
        'ma:milestone:builder',
        'ma:milestone:merchant',
        'ma:milestone:planner',
        'ma:milestone:tycoon',
      ]),
    }
  const result = projectSummary(c, s)
  expect(
    result.milestones.find((e) => e.objective.name === 'Terraformer')?.threshold
      ?.value,
  ).toBe(29)
  expect(
    result.milestones.find((e) => e.objective.name === 'Builder')?.threshold
      ?.value,
  ).toBe(7)
})
it('AC-25/D7: computes from supplied committed state rather than retaining an old summary', () => {
  const c = initialConfiguration(),
    s = seeded(c),
    old = projectSummary(c, s)
  const before = JSON.stringify({ c, s, catalogs })
  const next = projectSummary(c, { ...s, firstPlayer: 2 })
  expect(old.firstPlayer).toBe(1)
  expect(next.firstPlayer).toBe(2)
  expect(next.milestones).toEqual(old.milestones)
  expect(JSON.stringify({ c, s, catalogs })).toBe(before)
})
it('base-only summary omits disabled content, colonies and any WGT value', () => {
  const c = updateConfiguration(initialConfiguration(), {
    type: 'select-content',
    enabled: false,
  })
  const result = projectSummary(c, seeded(c))
  expect(result.board?.id).toBe('tharsis')
  expect(result.content).toEqual([])
  expect(result.colonies).toEqual([])
  expect(result.milestones).toHaveLength(5)
  expect(Object.keys(result.variants)).toEqual([
    'extendedStart',
    'researchDrafting',
  ])
  expect(JSON.stringify(result)).not.toMatch(/WGT|worldGovernment|longerVenus/i)
})
