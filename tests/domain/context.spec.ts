import { describe, expect, it } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
import {
  fixedVenusObjectives,
  isEligibleObjective,
  missingPrerequisites,
  objectiveContext,
} from '../../src/domain/context'
import type { RuleContext } from '../../src/domain/context'
import type { ExpansionId } from '../../src/content/types'
const context = (
  enabledContent: readonly ExpansionId[] = [],
  boardId: RuleContext['boardId'] = 'tharsis',
): RuleContext => ({ enabledContent, boardId })
const get = (id: string) =>
  [...catalogs.milestones, ...catalogs.awards].find((o) => o.id === id)!

it('requires every prerequisite and reports all disabled prerequisites', () => {
  expect(missingPrerequisites(['venus', 'colonies'], ['venus'])).toEqual([
    'colonies',
  ])
  expect(missingPrerequisites(['venus', 'colonies'], [])).toEqual([
    'venus',
    'colonies',
  ])
  expect(
    missingPrerequisites(['venus', 'colonies'], ['colonies', 'venus']),
  ).toEqual([])
})
it.each([
  ['ma:milestone:lobbyist', 'turmoil'],
  ['ma:award:politician', 'turmoil'],
  ['ma:milestone:pioneer', 'colonies'],
  ['ma:milestone:planetologist', 'venus'],
] as const)('filters %s without enabling %s', (id, expansion) => {
  const c = context()
  expect(isEligibleObjective(get(id), c)).toBe(false)
  expect(isEligibleObjective(get(id), context([expansion]))).toBe(true)
  expect(c.enabledContent).toEqual([])
})
it('excludes MA Geologist only on nonvolcanic maps and retains Constructor without Colonies', () => {
  expect(
    isEligibleObjective(get('ma:milestone:geologist'), context([], 'hellas')),
  ).toBe(false)
  expect(
    isEligibleObjective(
      get('ma:milestone:geologist'),
      context([], 'utopia-planitia'),
    ),
  ).toBe(false)
  expect(
    isEligibleObjective(get('ma:milestone:geologist'), context([], 'elysium')),
  ).toBe(true)
  expect(isEligibleObjective(get('ma:award:constructor'), context())).toBe(true)
})
it.each([
  ['printed:utopia-planitia:milestone:pioneer', 'colonies'],
  ['printed:terra-cimmeria:milestone:planetologist', 'venus'],
  ['printed:amazonis-planitia:milestone:lobbyist', 'turmoil'],
] as const)(
  'retains %s under R1 with a removable disabled-expansion notice',
  (id, missing) => {
    const objective = get(id)
    expect(isEligibleObjective(objective, context())).toBe(true)
    expect(objectiveContext(objective, context()).limitations).toEqual([
      missing,
    ])
    expect(objectiveContext(objective, context([missing])).limitations).toEqual(
      [],
    )
    expect(objectiveContext(objective, context()).objective).toBe(objective)
  },
)
it('reports every disabled prerequisite on a retained printed identity', () => {
  const objective = {
    ...get('printed:utopia-planitia:milestone:pioneer'),
    requires: ['colonies', 'venus'] as const,
  }
  expect(objectiveContext(objective, context()).limitations).toEqual([
    'colonies',
    'venus',
  ])
})
describe('source-specific contextual thresholds', () => {
  it.each([
    ['printed:tharsis:milestone:builder', 8],
    ['ma:milestone:builder', 7],
    ['printed:elysium:milestone:tycoon', 15],
    ['ma:milestone:tycoon', 10],
    ['printed:amazonis-planitia:milestone:merchant', 3],
    ['ma:milestone:merchant', 2],
  ])('keeps %s at %d', (id, expected) =>
    expect(objectiveContext(get(String(id)), context()).threshold?.value).toBe(
      expected,
    ),
  )
  it('applies Turmoil only to printed Tharsis Terraformer', () => {
    expect(
      objectiveContext(get('printed:tharsis:milestone:terraformer'), context())
        .threshold?.value,
    ).toBe(35)
    expect(
      objectiveContext(
        get('printed:tharsis:milestone:terraformer'),
        context(['turmoil']),
      ).threshold?.value,
    ).toBe(26)
    expect(
      objectiveContext(get('ma:milestone:terraformer'), context(['turmoil']))
        .threshold?.value,
    ).toBe(29)
  })
  it.each(['printed:elysium:milestone:generalist', 'ma:milestone:generalist'])(
    'adjusts %s for CE without changing identity',
    (id) => {
      expect(objectiveContext(get(id), context(['ce'])).threshold?.value).toBe(
        1,
      )
      expect(objectiveContext(get(id), context()).threshold?.value).toBe(2)
      expect(objectiveContext(get(id), context()).objective.id).toBe(id)
    },
  )
})
it('returns fixed Venus additions only when enabled, outside MA pools', () => {
  const objectives = [...catalogs.milestones, ...catalogs.awards]
  expect(fixedVenusObjectives(objectives, context())).toEqual([])
  expect(
    fixedVenusObjectives(objectives, context(['venus'])).map((o) => o.name),
  ).toEqual(['Hoverlord', 'Venuphile'])
  expect(
    fixedVenusObjectives(objectives, context(['venus', 'ma'])).map(
      (o) => o.source,
    ),
  ).toEqual(['venus', 'venus'])
})
