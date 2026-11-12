import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import { updateConfiguration } from './configuration'
import type { ConfigurationAction } from './configuration'
import { calculateInvalidation } from './invalidation'
import type {
  Configuration,
  GameState,
  PendingEdit,
  PublicSelections,
} from './types'

export interface EditPreview extends PendingEdit {
  readonly previous: GameState
}

export function previewEdit(
  configuration: Configuration,
  selections: PublicSelections,
  action: ConfigurationAction,
  data: Catalogs = catalogs,
): EditPreview {
  const next = updateConfiguration(configuration, action)
  return {
    previous: { configuration, selections },
    configuration: next,
    ...calculateInvalidation(configuration, next, selections, data),
  }
}

/** Return one atomic replacement; never generate choices during an edit. */
export function commitEdit(
  preview: EditPreview,
  confirmed = false,
): GameState | null {
  if (preview.losses.length && !confirmed) return null
  return {
    configuration: preview.configuration,
    selections: preview.selections,
  }
}
export function cancelEdit(preview: EditPreview): GameState {
  return preview.previous
}
