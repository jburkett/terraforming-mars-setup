import type { Catalogs, InstructionDefinition } from '../../src/content/types'
import type { Configuration, PublicSelections } from '../../src/domain/types'
// Callable empty baselines establish missing behavior without import/tool failures.
export const applicableInstructions: (
  config: Configuration,
  selections: PublicSelections,
  data?: Catalogs,
) => readonly InstructionDefinition[] = () => []
export const projectInstructions: typeof applicableInstructions = () => []
