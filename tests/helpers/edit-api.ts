import type { Catalogs } from '../../src/content/types'
import type { ConfigurationAction } from '../../src/domain/configuration'
import type {
  Configuration,
  PendingEdit,
  PublicSelections,
} from '../../src/domain/types'
export interface GameState {
  readonly configuration: Configuration
  readonly selections: PublicSelections
}
export interface EditPreview extends PendingEdit {
  readonly previous: GameState
}
// Callable baselines demonstrate missing behavior without broken imports/tooling.
export const calculateInvalidation: (
  before: Configuration,
  after: Configuration,
  selections: PublicSelections,
  data?: Catalogs,
) => Pick<PendingEdit, 'selections' | 'losses'> = (
  _before,
  _after,
  selections,
) => ({ selections, losses: [] })
export const previewEdit: (
  configuration: Configuration,
  selections: PublicSelections,
  action: ConfigurationAction,
  data?: Catalogs,
) => EditPreview = (configuration, selections) => ({
  configuration,
  selections,
  losses: [],
  previous: { configuration, selections },
})
export const commitEdit: (
  preview: EditPreview,
  confirmed?: boolean,
) => GameState | null = (preview) => preview.previous
export const cancelEdit: (preview: EditPreview) => GameState = (preview) =>
  preview.previous
