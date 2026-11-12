import { catalogs } from '../../src/content/catalogs'
import { isEligibleObjective } from '../../src/domain/context'
import type { ObjectiveDefinition, Five } from '../../src/content/types'
import type {
  Configuration,
  PublicSelections,
  ObjectiveRow,
} from '../../src/domain/types'

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
export { generateMissingSelections } from '../../src/domain/selections'
export { customizeSelections } from '../../src/domain/customization'
export {
  objectiveSets,
  objectiveAlternatives,
} from '../../src/domain/objectives'
