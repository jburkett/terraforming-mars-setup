import { catalogs } from '../../src/content/catalogs'
import { isEligibleObjective } from '../../src/domain/context'
import type {
  Catalogs,
  ObjectiveDefinition,
  Five,
} from '../../src/content/types'
import type {
  Configuration,
  PublicSelections,
  SelectionConflict,
  ObjectiveRow,
} from '../../src/domain/types'
import type { Uint32Source } from '../../src/domain/random'
import type { ObjectiveContext } from '../../src/domain/context'

export type Result =
  | { ok: true; selections: PublicSelections }
  | { ok: false; conflict: SelectionConflict }
export type Action =
  | { type: 'set-first-player'; value: number }
  | { type: 'reroll-first-player' }
  | { type: 'set-colony'; row: number; id: string }
  | { type: 'reroll-colonies' }
  | {
      type: 'set-objective'
      kind: 'milestone' | 'award'
      row: number
      id: string
    }
  | {
      type: 'set-lock'
      kind: 'milestone' | 'award'
      row: number
      locked: boolean
    }
  | { type: 'reroll-objectives'; kind: 'milestone' | 'award' }
export interface ObjectiveSets {
  milestones: readonly ObjectiveContext[]
  awards: readonly ObjectiveContext[]
}
export const empty = (): PublicSelections => ({
  board: null,
  firstPlayer: null,
  colonies: null,
  milestones: null,
  awards: null,
})
export function rows(
  ids: readonly string[],
  locked: readonly number[] = [],
): Five<ObjectiveRow> {
  const row = (position: 0 | 1 | 2 | 3 | 4): ObjectiveRow => ({
    position,
    objectiveId: ids[position]!,
    locked: locked.includes(position),
  })
  return [row(0), row(1), row(2), row(3), row(4)]
}
export function seeded(config: Configuration): PublicSelections {
  const board = config.boardCandidates[0]
  const context = { boardId: board, enabledContent: config.enabledContent }
  const ids = (pool: readonly ObjectiveDefinition[]) =>
    pool
      .filter((o) => o.source === 'ma' && isEligibleObjective(o, context))
      .slice(0, 5)
      .map((o) => o.id)
  return {
    board,
    firstPlayer: 1,
    colonies: config.enabledContent.includes('colonies')
      ? catalogs.colonies
          .slice(0, config.playerCount <= 3 ? 5 : config.playerCount + 2)
          .map((c) => c.id)
      : null,
    milestones: config.enabledContent.includes('ma')
      ? rows(ids(catalogs.milestones))
      : null,
    awards: config.enabledContent.includes('ma')
      ? rows(ids(catalogs.awards))
      : null,
  }
}
// Intentional red-test seams return no generated values or changes. Once each
// implementation exists the helper calls it; no import/tooling failures are used.
const generation = import.meta.glob<{
  generateMissingSelections: (
    c: Configuration,
    s: PublicSelections,
    r: Uint32Source,
    d?: Catalogs,
  ) => Result
}>('../../src/domain/selections.ts', { eager: true })
export const generateMissingSelections =
  Object.values(generation)[0]?.generateMissingSelections ??
  ((_c: Configuration, selections: PublicSelections): Result => ({
    ok: true,
    selections,
  }))
const customization = import.meta.glob<{
  customizeSelections: (
    c: Configuration,
    s: PublicSelections,
    a: Action,
    r: Uint32Source,
    d?: Catalogs,
  ) => Result
}>('../../src/domain/customization.ts', { eager: true })
export const customizeSelections =
  Object.values(customization)[0]?.customizeSelections ??
  ((_c: Configuration, selections: PublicSelections): Result => ({
    ok: true,
    selections,
  }))
const projection = import.meta.glob<{
  objectiveSets: (
    c: Configuration,
    s: PublicSelections,
    d?: Catalogs,
  ) => ObjectiveSets
  objectiveAlternatives: (
    k: 'milestone' | 'award',
    row: number,
    c: Configuration,
    s: PublicSelections,
    d?: Catalogs,
  ) => readonly ObjectiveDefinition[]
}>('../../src/domain/objectives.ts', { eager: true })
export const objectiveSets =
  Object.values(projection)[0]?.objectiveSets ??
  (() => ({ milestones: [], awards: [] }))
export const objectiveAlternatives =
  Object.values(projection)[0]?.objectiveAlternatives ?? (() => [])
