import { catalogs } from '../content/catalogs'
import type {
  BoardDefinition,
  Catalogs,
  ColonyDefinition,
  ExpansionDefinition,
} from '../content/types'
import type { ObjectiveContext } from './context'
import { objectiveSets } from './objectives'
import type {
  Configuration,
  FirstPlayer,
  PlayerCount,
  PublicSelections,
  Variants,
} from './types'

export interface ConfigurationSummary {
  readonly playerCount: PlayerCount
  readonly firstPlayer: FirstPlayer | null
  readonly board: BoardDefinition | null
  readonly content: readonly ExpansionDefinition[]
  readonly variants: Variants
  readonly colonies: readonly ColonyDefinition[]
  readonly milestones: readonly ObjectiveContext[]
  readonly awards: readonly ObjectiveContext[]
}

/** A read-only display projection, never separately stored or edited. */
export function projectSummary(
  config: Configuration,
  selections: PublicSelections,
  data: Catalogs = catalogs,
): ConfigurationSummary {
  return {
    playerCount: config.playerCount,
    firstPlayer: selections.firstPlayer,
    board: data.boards.find((b) => b.id === selections.board) ?? null,
    content: config.enabledContent.flatMap((id) =>
      data.expansions.filter((e) => e.id === id),
    ),
    variants: config.variants,
    colonies: config.enabledContent.includes('colonies')
      ? (selections.colonies ?? []).flatMap((id) =>
          data.colonies.filter((c) => c.id === id),
        )
      : [],
    ...objectiveSets(config, selections, data),
  }
}
