import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import { initialConfiguration } from './configuration'
import type { EditPreview } from './edits'
import { objectiveSets } from './objectives'
import { emptySelections } from './selections'
import type {
  Configuration,
  GameState,
  LossDescription,
  PublicSelections,
} from './types'

export function previewReset(
  configuration: Configuration,
  selections: PublicSelections,
  data: Catalogs = catalogs,
): EditPreview {
  const losses: LossDescription[] = []
  if (selections.board)
    losses.push({
      field: 'board',
      objectiveIds: [],
      lockedIds: [],
      reason: `Board: ${data.boards.find((b) => b.id === selections.board)?.name ?? selections.board}. Clear the chosen board.`,
    })
  if (selections.firstPlayer !== null)
    losses.push({
      field: 'firstPlayer',
      objectiveIds: [],
      lockedIds: [],
      reason: `First player: ${selections.firstPlayer}. Clear this result.`,
    })
  if (selections.colonies)
    losses.push({
      field: 'colonies',
      objectiveIds: [],
      lockedIds: [],
      reason: `Colonies: ${selections.colonies.map((id) => data.colonies.find((c) => c.id === id)?.name ?? id).join(', ')}. Clear this set.`,
    })
  const projected = objectiveSets(configuration, selections, data)
  for (const field of ['milestones', 'awards'] as const) {
    const rows = selections[field] ?? []
    const objectiveIds = [
      ...new Set([
        ...rows.flatMap((row) =>
          row.objectiveId === null ? [] : [row.objectiveId],
        ),
        ...projected[field].map((e) => e.objective.id),
      ]),
    ]
    if (!objectiveIds.length) continue
    const lockedIds = rows.flatMap((row) =>
      row.locked ? [row.objectiveId] : [],
    )
    const names = objectiveIds.map(
      (id) =>
        `${data[field].find((o) => o.id === id)?.name ?? id}${lockedIds.includes(id) ? ' (locked)' : ''}`,
    )
    losses.push({
      field,
      objectiveIds,
      lockedIds,
      reason: `${field === 'milestones' ? 'Milestones' : 'Awards'}: ${names.join(', ')}. Clear all choices and locks.`,
    })
  }
  return {
    previous: { configuration, selections },
    configuration: initialConfiguration(),
    selections: emptySelections(),
    losses,
  }
}
export function commitReset(
  preview: EditPreview,
  confirmed = false,
): GameState | null {
  return confirmed
    ? { configuration: preview.configuration, selections: preview.selections }
    : null
}
export function cancelReset(preview: EditPreview): GameState {
  return preview.previous
}
