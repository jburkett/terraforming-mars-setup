import { catalogs } from '../content/catalogs'
import type { BoardId, Catalogs } from '../content/types'
import type {
  Configuration,
  PublicSelections,
  SelectionConflict,
} from './types'
import type { Uint32Source } from './random'
import { randomInteger } from './random'
import { isEligibleObjective } from './context'
import {
  fiveRows,
  generateMissingSelections,
  selectionFailure,
} from './selections'
import type { ObjectiveRow } from './types'
import type { SelectionResult } from './selections'
export type BoardChangeTarget =
  | { readonly kind: 'manual'; readonly boardId: BoardId }
  | { readonly kind: 'reroll' }
export interface BoardChangePreview {
  readonly config: Configuration
  readonly previous: PublicSelections
  readonly target: BoardChangeTarget
  readonly data: Catalogs
  readonly losses: readonly string[]
  readonly needsConfirmation: boolean
}
export type BoardPreviewResult =
  | { readonly ok: true; readonly preview: BoardChangePreview }
  | { readonly ok: false; readonly conflict: SelectionConflict }
export function previewBoardChange(
  config: Configuration,
  previous: PublicSelections,
  target: BoardChangeTarget,
  data: Catalogs = catalogs,
): BoardPreviewResult {
  const possible =
    target.kind === 'manual' ? [target.boardId] : [...config.boardCandidates]
  if (
    !previous.board ||
    possible.some(
      (id) =>
        !config.boardCandidates.some((candidate) => candidate === id) ||
        !data.boards.some((b) => b.id === id),
    )
  )
    return {
      ok: false,
      conflict: {
        pool: 'board',
        requested: 1,
        available: config.boardCandidates.length,
        message: 'Choose a board from the configured pool.',
      },
    }
  const losses = new Set<string>()
  if (!config.enabledContent.includes('ma')) {
    if (possible.some((id) => id !== previous.board))
      losses.add('the printed milestones and awards')
  } else {
    for (const key of ['milestones', 'awards'] as const)
      for (const row of previous[key] ?? []) {
        const objective = data[key].find((o) => o.id === row.objectiveId)
        if (
          objective &&
          possible.some(
            (boardId) =>
              !isEligibleObjective(objective, {
                boardId,
                enabledContent: config.enabledContent,
              }),
          )
        )
          losses.add(`${objective.name}${row.locked ? ' (locked)' : ''}`)
      }
  }
  return {
    ok: true,
    preview: {
      config,
      previous,
      target,
      data,
      losses: [...losses],
      needsConfirmation: losses.size > 0,
    },
  }
}

export function commitBoardChange(
  preview: BoardChangePreview,
  source: Uint32Source,
  confirmed = false,
): SelectionResult {
  if (preview.needsConfirmation && !confirmed)
    return selectionFailure(
      'board',
      1,
      preview.config.boardCandidates.length,
      'Confirm the affected objective choices before changing the board.',
    )
  const { config, previous, target, data } = preview
  const board =
    target.kind === 'manual'
      ? target.boardId
      : config.boardCandidates[
          randomInteger(config.boardCandidates.length, source)
        ]!
  if (board === previous.board) return { ok: true, selections: previous }
  const context = { boardId: board, enabledContent: config.enabledContent }
  const next = { ...previous, board }
  if (config.enabledContent.includes('ma'))
    for (const key of ['milestones', 'awards'] as const) {
      const old = previous[key]
      if (!old) continue
      const reconciled = old.map((row): ObjectiveRow => {
        const objective = data[key].find((o) => o.id === row.objectiveId)
        return objective && isEligibleObjective(objective, context)
          ? row
          : { position: row.position, objectiveId: null, locked: false }
      })
      if (reconciled.some((row, index) => row !== old[index]))
        next[key] = fiveRows(reconciled)
    }
  return generateMissingSelections(config, next, source, data)
}
