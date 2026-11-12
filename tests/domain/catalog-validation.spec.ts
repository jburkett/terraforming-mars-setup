import { expect, it } from 'vitest'
import { parseCatalogs } from '../../src/content/validation'
import { fixture } from '../helpers/catalog-fixture'

it.each([
  ['missing board', (f: ReturnType<typeof fixture>) => f.boards.pop()],
  ['missing colony', (f: ReturnType<typeof fixture>) => f.colonies.pop()],
  [
    'missing MA milestone',
    (f: ReturnType<typeof fixture>) => f.milestones.pop(),
  ],
  ['missing SU', (f: ReturnType<typeof fixture>) => f.instructions.pop()],
  [
    'wrong objective kind',
    (f: ReturnType<typeof fixture>) => {
      f.boards[0]!.milestones[0] = f.boards[0]!.awards[0]!
    },
  ],
  [
    'wrong objective owner',
    (f: ReturnType<typeof fixture>) => {
      f.boards[0]!.milestones[0] = f.boards[1]!.milestones[0]!
    },
  ],
  [
    'unknown prerequisite',
    (f: ReturnType<typeof fixture>) => {
      f.expansions[0]!.requires = ['fan']
    },
  ],
  [
    'unrecognized threshold context',
    (f: ReturnType<typeof fixture>) => {
      f.milestones[0]!.threshold.context = 'script'
    },
  ],
  [
    'out of order SU',
    (f: ReturnType<typeof fixture>) => f.instructions.reverse(),
  ],
])('rejects %s before any catalogs are consumed', (_, mutate) => {
  const input = fixture()
  mutate(input)
  expect(() => parseCatalogs(input)).toThrow(/\.json/)
})
it('rejects non-object input with a diagnostic rather than crashing', () => {
  expect(() => parseCatalogs(null)).toThrow(/catalogs/)
})
