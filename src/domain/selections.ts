import { catalogs } from '../content/catalogs'
import type { Catalogs, Five } from '../content/types'
import { isEligibleObjective } from './context'
import { randomInteger, sample } from './random'
import type { Uint32Source } from './random'
import type {
  Configuration,
  FirstPlayer,
  ObjectiveRow,
  PublicSelections,
  SelectionConflict,
} from './types'

export type SelectionResult =
  | { readonly ok: true; readonly selections: PublicSelections }
  | { readonly ok: false; readonly conflict: SelectionConflict }
export function emptySelections(): PublicSelections {
  return {
    board: null,
    firstPlayer: null,
    colonies: null,
    milestones: null,
    awards: null,
  }
}
export function selectionFailure(
  pool: SelectionConflict['pool'],
  requested: number,
  available: number,
  message = `Not enough eligible ${pool}: need ${requested}, available ${available}.`,
): SelectionResult {
  return { ok: false, conflict: { pool, requested, available, message } }
}
export function fiveRows(values: readonly ObjectiveRow[]): Five<ObjectiveRow> {
  if (values.length !== 5)
    throw new RangeError('Exactly five objective rows are required.')
  return [values[0]!, values[1]!, values[2]!, values[3]!, values[4]!]
}
export function colonyCount(config: Configuration): number {
  return config.playerCount <= 3 ? 5 : config.playerCount + 2
}

/** Fill missing values only. Failures never expose partially generated state. */
export function generateMissingSelections(
  config: Configuration,
  previous: PublicSelections,
  source: Uint32Source,
  data: Catalogs = catalogs,
): SelectionResult {
  const boards = config.boardCandidates.filter((id) =>
    data.boards.some((board) => board.id === id),
  )
  if (!boards.length) return selectionFailure('board', 1, 0)
  if (previous.board && !boards.includes(previous.board))
    return selectionFailure(
      'board',
      1,
      boards.length,
      'The retained board is outside the configured pool.',
    )
  const board = previous.board ?? boards[randomInteger(boards.length, source)]!
  const context = { boardId: board, enabledContent: config.enabledContent }
  const hasColonies = config.enabledContent.includes('colonies')
  const hasMA = config.enabledContent.includes('ma')
  const count = colonyCount(config)
  if (hasColonies && data.colonies.length < count)
    return selectionFailure('colonies', count, data.colonies.length)
  if (
    hasColonies &&
    previous.colonies &&
    (previous.colonies.length !== count ||
      new Set(previous.colonies).size !== count ||
      previous.colonies.some((id) => !data.colonies.some((c) => c.id === id)))
  )
    return selectionFailure(
      'colonies',
      count,
      previous.colonies.length,
      'Retained colonies do not match the configuration; no selections were changed.',
    )
  if (!hasColonies && previous.colonies !== null)
    return selectionFailure(
      'colonies',
      0,
      previous.colonies.length,
      'Colonies are disabled but retained colony choices exist.',
    )
  if (
    previous.firstPlayer !== null &&
    (!Number.isInteger(previous.firstPlayer) ||
      previous.firstPlayer < 1 ||
      previous.firstPlayer > config.playerCount)
  )
    return selectionFailure(
      'firstPlayer',
      1,
      config.playerCount,
      'First player must be an integer in 1…N.',
    )
  const pools = {
    milestones: data.milestones
      .filter((o) => o.source === 'ma' && isEligibleObjective(o, context))
      .map((o) => o.id),
    awards: data.awards
      .filter((o) => o.source === 'ma' && isEligibleObjective(o, context))
      .map((o) => o.id),
  }
  for (const key of ['milestones', 'awards'] as const) {
    const rows = previous[key]
    if (!hasMA) {
      if (rows !== null)
        return selectionFailure(
          key,
          0,
          rows.length,
          'Retained replacement rows cannot be silently discarded when MA is disabled.',
        )
      continue
    }
    if (pools[key].length < 5)
      return selectionFailure(key, 5, pools[key].length)
    if (rows) {
      const ids = rows.flatMap((row) =>
        row.objectiveId === null ? [] : [row.objectiveId],
      )
      if (
        rows.length !== 5 ||
        new Set(ids).size !== ids.length ||
        rows.some(
          (row, index) =>
            row.position !== index ||
            (row.objectiveId === null
              ? row.locked
              : !pools[key].includes(row.objectiveId)),
        )
      )
        return selectionFailure(
          key,
          5,
          ids.length,
          'Retained objective rows are invalid; no choices or locks were cleared.',
        )
    }
  }
  const firstPlayer =
    previous.firstPlayer ??
    ((randomInteger(config.playerCount, source) + 1) as FirstPlayer)
  let colonies = previous.colonies
  if (hasColonies && colonies === null) {
    const draw = sample(
      data.colonies.map((c) => c.id),
      count,
      source,
    )
    if (!draw.ok)
      return selectionFailure('colonies', count, data.colonies.length)
    colonies = draw.values
  }
  const fill = (key: 'milestones' | 'awards'): Five<ObjectiveRow> | null => {
    if (!hasMA) return null
    const old =
      previous[key] ??
      fiveRows(
        [0, 1, 2, 3, 4].map((position) => ({
          position: position as ObjectiveRow['position'],
          objectiveId: null,
          locked: false,
        })),
      )
    const retained = old.flatMap((row) =>
      row.objectiveId === null ? [] : [row.objectiveId],
    )
    const missing = 5 - retained.length
    if (!missing) return old
    const available = pools[key].filter((id) => !retained.includes(id))
    const draw = sample(available, missing, source)
    if (!draw.ok) throw new Error('Preflight and objective sampling disagree.')
    let next = 0
    return fiveRows(
      old.map((row) =>
        row.objectiveId === null
          ? {
              position: row.position,
              objectiveId: draw.values[next++]!,
              locked: false,
            }
          : row,
      ),
    )
  }
  const milestones = fill('milestones')
  const awards = fill('awards')
  if (
    board === previous.board &&
    firstPlayer === previous.firstPlayer &&
    colonies === previous.colonies &&
    milestones === previous.milestones &&
    awards === previous.awards
  )
    return { ok: true, selections: previous }
  return {
    ok: true,
    selections: { board, firstPlayer, colonies, milestones, awards },
  }
}
