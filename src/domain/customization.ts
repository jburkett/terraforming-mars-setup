import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import { objectiveAlternatives, objectiveKey } from './objectives'
import type { ObjectiveKind } from './objectives'
import {
  fiveRows,
  generateMissingSelections,
  selectionFailure,
} from './selections'
import type { SelectionResult } from './selections'
import type { Uint32Source } from './random'
import type {
  Configuration,
  FirstPlayer,
  ObjectiveRow,
  PublicSelections,
} from './types'

export type CustomizationAction =
  | { readonly type: 'set-first-player'; readonly value: number }
  | { readonly type: 'reroll-first-player' }
  | { readonly type: 'set-colony'; readonly row: number; readonly id: string }
  | { readonly type: 'reroll-colonies' }
  | {
      readonly type: 'set-objective'
      readonly kind: ObjectiveKind
      readonly row: number
      readonly id: string
    }
  | {
      readonly type: 'set-lock'
      readonly kind: ObjectiveKind
      readonly row: number
      readonly locked: boolean
    }
  | { readonly type: 'reroll-objectives'; readonly kind: ObjectiveKind }

export function customizeSelections(
  config: Configuration,
  previous: PublicSelections,
  action: CustomizationAction,
  source: Uint32Source,
  data: Catalogs = catalogs,
): SelectionResult {
  switch (action.type) {
    case 'set-first-player':
      if (
        !Number.isInteger(action.value) ||
        action.value < 1 ||
        action.value > config.playerCount
      )
        return selectionFailure(
          'firstPlayer',
          1,
          config.playerCount,
          'Choose a first-player number in 1…N.',
        )
      return {
        ok: true,
        selections: { ...previous, firstPlayer: action.value as FirstPlayer },
      }
    case 'reroll-first-player':
      return generateMissingSelections(
        config,
        { ...previous, firstPlayer: null },
        source,
        data,
      )
    case 'set-colony': {
      const colonies = previous.colonies
      const colony = data.colonies.find((c) => c.id === action.id)
      if (
        !config.enabledContent.includes('colonies') ||
        !colonies ||
        !Number.isInteger(action.row) ||
        action.row < 0 ||
        action.row >= colonies.length ||
        !colony ||
        colonies.some((id, row) => row !== action.row && id === action.id)
      )
        return selectionFailure(
          'colonies',
          colonies?.length ?? 0,
          data.colonies.length,
          'Choose a distinct eligible colony for this row.',
        )
      return {
        ok: true,
        selections: {
          ...previous,
          colonies: colonies.map((id, row) =>
            row === action.row ? colony.id : id,
          ),
        },
      }
    }
    case 'reroll-colonies':
      return config.enabledContent.includes('colonies')
        ? generateMissingSelections(
            config,
            { ...previous, colonies: null },
            source,
            data,
          )
        : { ok: true, selections: previous }
    case 'set-objective':
    case 'set-lock': {
      const key = objectiveKey(action.kind)
      const rows = previous[key]
      const row = rows?.[action.row]
      if (
        !config.enabledContent.includes('ma') ||
        !row ||
        !Number.isInteger(action.row) ||
        row.objectiveId === null
      )
        return selectionFailure(
          key,
          5,
          0,
          'Select a generated replacement-objective row.',
        )
      let next: ObjectiveRow
      if (action.type === 'set-lock')
        next = {
          position: row.position,
          objectiveId: row.objectiveId,
          locked: action.locked,
        }
      else {
        if (
          !objectiveAlternatives(
            action.kind,
            action.row,
            config,
            previous,
            data,
          ).some((o) => o.id === action.id)
        )
          return selectionFailure(
            key,
            5,
            0,
            'Choose an eligible objective not selected in another row.',
          )
        next = { position: row.position, objectiveId: action.id, locked: true }
      }
      return {
        ok: true,
        selections: {
          ...previous,
          [key]: fiveRows(
            rows.map((old, index) => (index === action.row ? next : old)),
          ),
        },
      }
    }
    case 'reroll-objectives': {
      const key = objectiveKey(action.kind)
      const rows = previous[key]
      if (!config.enabledContent.includes('ma') || !rows)
        return selectionFailure(
          key,
          5,
          0,
          'Replacement objectives are not enabled.',
        )
      if (rows.every((row) => row.locked))
        return { ok: true, selections: previous }
      const cleared = fiveRows(
        rows.map((row): ObjectiveRow =>
          row.locked
            ? row
            : { position: row.position, objectiveId: null, locked: false },
        ),
      )
      return generateMissingSelections(
        config,
        { ...previous, [key]: cleared },
        source,
        data,
      )
    }
  }
}
