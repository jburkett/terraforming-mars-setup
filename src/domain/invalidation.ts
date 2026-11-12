import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import { isEligibleObjective } from './context'
import { fiveRows } from './selections'
import type {
  Configuration,
  LossDescription,
  ObjectiveRow,
  PendingEdit,
  PublicSelections,
} from './types'

/** Calculate losses without mutation or draws; consent belongs to the edit transition. */
export function calculateInvalidation(
  before: Configuration,
  after: Configuration,
  previous: PublicSelections,
  data: Catalogs = catalogs,
): Pick<PendingEdit, 'selections' | 'losses'> {
  let selections = previous
  const losses: LossDescription[] = []
  const countChanged = before.playerCount !== after.playerCount
  function clear(
    field: 'firstPlayer' | 'colonies' | 'board',
    reason: string,
  ): void {
    if (previous[field] === null) return
    selections = { ...selections, [field]: null }
    losses.push({ field, objectiveIds: [], lockedIds: [], reason })
  }
  function objectiveLoss(
    field: 'milestones' | 'awards',
    objectiveIds: readonly string[],
    rows: readonly ObjectiveRow[],
    reason: string,
  ): void {
    if (!objectiveIds.length) return
    const lockedIds = rows
      .filter((row) => row.locked && objectiveIds.includes(row.objectiveId))
      .map((row) => row.objectiveId!)
    const names = objectiveIds.map(
      (id) =>
        `${data[field].find((o) => o.id === id)?.name ?? id}${lockedIds.includes(id) ? ' (locked)' : ''}`,
    )
    losses.push({
      field,
      objectiveIds,
      lockedIds,
      reason: `${field === 'milestones' ? 'Milestones' : 'Awards'}: ${names.join(', ')}. ${reason}`,
    })
  }
  if (countChanged)
    clear(
      'firstPlayer',
      `First player ${previous.firstPlayer}: clear this result because the player count changes.`,
    )
  if (countChanged || !after.enabledContent.includes('colonies')) {
    const names = (previous.colonies ?? []).map(
      (id) => data.colonies.find((c) => c.id === id)?.name ?? id,
    )
    clear(
      'colonies',
      `Colonies: ${names.join(', ')}. Clear this set because ${countChanged ? 'the player count changes' : 'Colonies is disabled'}.`,
    )
  }
  const excluded =
    previous.board !== null &&
    !after.boardCandidates.some((id) => id === previous.board)
  if (excluded)
    clear(
      'board',
      `Board: ${data.boards.find((b) => b.id === previous.board)?.name ?? previous.board}. Clear this result because it is excluded from the new board pool.`,
    )
  const hadMA = before.enabledContent.includes('ma'),
    hasMA = after.enabledContent.includes('ma')
  const possibleBoards = selections.board
    ? [selections.board]
    : after.boardCandidates
  for (const field of ['milestones', 'awards'] as const) {
    const rows = previous[field]
    if (!hasMA) {
      if (rows) {
        const removed = rows.flatMap((row) =>
          row.objectiveId === null ? [] : [row.objectiveId],
        )
        objectiveLoss(
          field,
          removed,
          rows,
          'Replace the MA selections with the printed board set.',
        )
        selections = { ...selections, [field]: null }
      }
    } else if (rows) {
      const affected = rows.filter((row) => {
        if (!row.objectiveId) return false
        const objective = data[field].find((o) => o.id === row.objectiveId)
        return (
          !objective ||
          possibleBoards.some(
            (boardId) =>
              !isEligibleObjective(objective, {
                boardId,
                enabledContent: after.enabledContent,
              }),
          )
        )
      })
      if (affected.length) {
        const removed = affected.flatMap((row) =>
          row.objectiveId === null ? [] : [row.objectiveId],
        )
        objectiveLoss(
          field,
          removed,
          rows,
          excluded
            ? 'These choices may be ineligible on a board in the remaining pool.'
            : 'These choices are ineligible with the new content.',
        )
        selections = {
          ...selections,
          [field]: fiveRows(
            rows.map((row): ObjectiveRow =>
              affected.includes(row)
                ? { position: row.position, objectiveId: null, locked: false }
                : row,
            ),
          ),
        }
      }
    }
    if (previous.board && !hadMA && (hasMA || excluded)) {
      const board = data.boards.find((b) => b.id === previous.board)
      const ids = board?.[field] ?? []
      objectiveLoss(
        field,
        ids,
        [],
        `Replace the printed ${field} on ${board?.name ?? previous.board}.`,
      )
    }
    if (
      previous.board &&
      before.enabledContent.includes('venus') &&
      !after.enabledContent.includes('venus')
    )
      objectiveLoss(
        field,
        data[field].filter((o) => o.source === 'venus').map((o) => o.id),
        [],
        'Remove the fixed Venus addition because Venus Next is disabled.',
      )
  }
  return { selections, losses }
}
