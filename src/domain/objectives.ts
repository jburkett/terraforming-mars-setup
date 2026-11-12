import { catalogs } from '../content/catalogs'
import type { Catalogs, ObjectiveDefinition } from '../content/types'
import {
  fixedVenusObjectives,
  isEligibleObjective,
  objectiveContext,
} from './context'
import type { ObjectiveContext } from './context'
import type { Configuration, PublicSelections } from './types'

export type ObjectiveKind = 'milestone' | 'award'
export type ObjectiveKey = 'milestones' | 'awards'
export const objectiveKey = (kind: ObjectiveKind): ObjectiveKey =>
  kind === 'milestone' ? 'milestones' : 'awards'
export interface ObjectiveSets {
  readonly milestones: readonly ObjectiveContext[]
  readonly awards: readonly ObjectiveContext[]
}

/** Project source-specific identities/thresholds/notices; never draw or mutate. */
export function objectiveSets(
  config: Configuration,
  selections: PublicSelections,
  data: Catalogs = catalogs,
): ObjectiveSets {
  const board = data.boards.find((b) => b.id === selections.board)
  if (!board) return { milestones: [], awards: [] }
  const context = { boardId: board.id, enabledContent: config.enabledContent }
  const fixed = fixedVenusObjectives(
    [...data.milestones, ...data.awards],
    context,
  )
  const project = (key: ObjectiveKey): readonly ObjectiveContext[] => {
    const ids = config.enabledContent.includes('ma')
      ? (selections[key] ?? []).flatMap((row) =>
          row.objectiveId === null ? [] : [row.objectiveId],
        )
      : board[key]
    const selected = ids.flatMap((id) => {
      const objective = data[key].find((o) => o.id === id)
      return objective ? [objectiveContext(objective, context)] : []
    })
    return [
      ...selected,
      ...fixed
        .filter((o) => objectiveKey(o.kind) === key)
        .map((o) => objectiveContext(o, context)),
    ]
  }
  return { milestones: project('milestones'), awards: project('awards') }
}

export function objectiveAlternatives(
  kind: ObjectiveKind,
  row: number,
  config: Configuration,
  selections: PublicSelections,
  data: Catalogs = catalogs,
): readonly ObjectiveDefinition[] {
  if (
    !config.enabledContent.includes('ma') ||
    !selections.board ||
    !Number.isInteger(row) ||
    row < 0 ||
    row > 4
  )
    return []
  const key = objectiveKey(kind)
  const other = (selections[key] ?? [])
    .filter((_, index) => index !== row)
    .flatMap((entry) => (entry.objectiveId === null ? [] : [entry.objectiveId]))
  const context = {
    boardId: selections.board,
    enabledContent: config.enabledContent,
  }
  return data[key].filter(
    (o) =>
      o.source === 'ma' &&
      isEligibleObjective(o, context) &&
      !other.includes(o.id),
  )
}
