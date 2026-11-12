import type {
  Configuration,
  GameState,
  PublicSelections,
} from '../../src/domain/types'
import type { EditPreview } from '../../src/domain/edits'
export { calculateInvalidation } from '../../src/domain/invalidation'
export { previewEdit, commitEdit, cancelEdit } from '../../src/domain/edits'
// Callable Reset baselines remain intentionally red until T055.
export const previewReset: (
  configuration: Configuration,
  selections: PublicSelections,
) => EditPreview = (configuration, selections) => ({
  configuration,
  selections,
  losses: [],
  previous: { configuration, selections },
})
export const commitReset: (
  preview: EditPreview,
  confirmed?: boolean,
) => GameState | null = (preview) => preview.previous
export const cancelReset: (preview: EditPreview) => GameState = (preview) =>
  preview.previous
