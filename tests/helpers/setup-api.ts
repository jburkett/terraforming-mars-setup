import type { Catalogs } from '../../src/content/types'
import type { Configuration, PublicSelections } from '../../src/domain/types'
// Callable empty baselines establish missing behavior without import/tool failures.
import { applicableInstructions } from '../../src/domain/instruction-context'
export { applicableInstructions }
export { projectInstructions } from '../../src/domain/instructions'

import type {
  BoardDefinition,
  ColonyDefinition,
  ExpansionDefinition,
} from '../../src/content/types'
import type { ObjectiveContext } from '../../src/domain/context'
import type { Variants } from '../../src/domain/types'
export interface ConfigurationSummary {
  readonly playerCount: number
  readonly firstPlayer: number | null
  readonly board: BoardDefinition | null
  readonly content: readonly ExpansionDefinition[]
  readonly variants: Variants
  readonly colonies: readonly ColonyDefinition[]
  readonly milestones: readonly ObjectiveContext[]
  readonly awards: readonly ObjectiveContext[]
}
export const projectSummary: (
  config: Configuration,
  selections: PublicSelections,
  data?: Catalogs,
) => ConfigurationSummary = () => ({
  playerCount: 0,
  firstPlayer: null,
  board: null,
  content: [],
  variants: { extendedStart: false, researchDrafting: false },
  colonies: [],
  milestones: [],
  awards: [],
})
