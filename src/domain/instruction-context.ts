import { catalogs } from '../content/catalogs'
import type {
  BoardDefinition,
  Catalogs,
  InstructionDefinition,
} from '../content/types'
import type { Configuration, PublicSelections } from './types'

function applies(
  context: InstructionDefinition['context'],
  config: Configuration,
  board: BoardDefinition,
): boolean {
  const enabled = (id: Configuration['enabledContent'][number]) =>
    config.enabledContent.includes(id)
  switch (context) {
    case 'always':
      return true
    case 'standard-map':
      return board.oceans === 9
    case 'amazonis':
      return board.id === 'amazonis-planitia'
    case 'turmoil':
      return enabled('turmoil')
    case 'venus':
      return enabled('venus')
    case 'colonies':
      return enabled('colonies')
    case 'ma-on':
      return enabled('ma')
    case 'ma-off':
      return !enabled('ma')
    case 'ce-on':
      return enabled('ce')
    case 'ce-off':
      return !enabled('ce')
    case 'prelude':
      return enabled('prelude')
    case 'prelude2':
      return enabled('prelude2')
    case 'printed-tharsis-turmoil':
      return board.id === 'tharsis' && !enabled('ma') && enabled('turmoil')
    case 'prelude-normal-start':
      return enabled('prelude') && !config.variants.extendedStart
    case 'prelude-extended-start':
      return enabled('prelude') && config.variants.extendedStart
    case 'extended-start-on':
      return config.variants.extendedStart
    case 'extended-start-off':
      return !config.variants.extendedStart
    case 'map-without-volcanoes':
      return !board.hasVolcanoes
    case 'outer-maps-without-turmoil':
      return (
        ['amazonis-planitia', 'vastitas-borealis'].includes(board.id) &&
        !enabled('turmoil')
      )
    case 'cimmeria-without-colonies':
      return board.id === 'terra-cimmeria' && !enabled('colonies')
  }
}

/** Explicit interpretation of known catalog contexts; no JSON expressions execute. */
export function applicableInstructions(
  config: Configuration,
  selections: PublicSelections,
  data: Catalogs = catalogs,
): readonly InstructionDefinition[] {
  const board = data.boards.find((b) => b.id === selections.board)
  if (!board) return []
  return data.instructions
    .filter((step) => applies(step.context, config, board))
    .map((step) => {
      const quantities = { ...step.quantities }
      if (step.context === 'colonies')
        quantities.fleets = config.playerCount * quantities.fleetsPerPlayer!
      if (step.context === 'turmoil') {
        quantities.lobbyDelegates =
          config.playerCount * quantities.lobbyDelegatesPerPlayer!
        quantities.reserveDelegates =
          config.playerCount * quantities.reserveDelegatesPerPlayer!
      }
      return { ...step, quantities }
    })
}
