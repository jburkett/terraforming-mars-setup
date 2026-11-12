import type {
  BoardId,
  ColonyId,
  ExpansionId,
  Five,
  NonEmpty,
  ObjectiveDefinition,
  InstructionDefinition,
} from '../content/types'

/** Integer 2–5; initial/reset value 2. Defaults/actions are implemented in US1. */
export type PlayerCount = 2 | 3 | 4 | 5
export type FirstPlayer = 1 | PlayerCount
/** Extended Start and research drafting only, initially on; neither requires an expansion. */
export interface Variants {
  readonly extendedStart: boolean
  readonly researchDrafting: boolean
}
export type BoardPool =
  | {
      readonly expandedBoards: true
      readonly boardCandidates: NonEmpty<BoardId>
    }
  | {
      readonly expandedBoards: false
      readonly boardCandidates: readonly ['tharsis']
    }
export type Configuration = BoardPool & {
  readonly playerCount: PlayerCount
  readonly enabledContent: readonly ExpansionId[]
  readonly variants: Variants
}
/** Five rows per kind when generated; empty rows cannot be locked. */
export type ObjectiveRow = { readonly position: 0 | 1 | 2 | 3 | 4 } & (
  | { readonly objectiveId: null; readonly locked: false }
  | { readonly objectiveId: string; readonly locked: boolean }
)
export interface PublicSelections {
  readonly board: BoardId | null
  readonly firstPlayer: FirstPlayer | null
  readonly colonies: readonly ColonyId[] | null
  readonly milestones: Five<ObjectiveRow> | null
  readonly awards: Five<ObjectiveRow> | null
}
export interface LossDescription {
  readonly field: keyof PublicSelections
  readonly objectiveIds: readonly string[]
  readonly lockedIds: readonly string[]
  readonly reason: string
}
export interface PendingEdit {
  readonly configuration: Configuration
  readonly selections: PublicSelections
  readonly losses: readonly LossDescription[]
}
export interface Session {
  readonly configuration: Configuration
  readonly selections: PublicSelections
  readonly view: 'expansions' | 'variants' | 'setup'
  readonly pendingEdit: PendingEdit | null
  readonly customization:
    'board' | 'firstPlayer' | 'colonies' | 'milestones' | 'awards' | null
}
export interface SelectionConflict {
  readonly pool: 'board' | 'colonies' | 'milestones' | 'awards'
  readonly requested: number
  readonly available: number
  readonly message: string
}
export interface SetupProjection {
  readonly instructions: readonly InstructionDefinition[]
  readonly objectives: readonly ObjectiveDefinition[]
  readonly limitations: readonly {
    objectiveId: string
    missing: readonly ExpansionId[]
  }[]
}
