import { catalogs } from '../content/catalogs'
import type { Catalogs, InstructionDefinition } from '../content/types'
import { applicableInstructions } from './instruction-context'
import type { Configuration, PublicSelections } from './types'

/** Physical guidance derives from committed public results; no cards or draws. */
export function projectInstructions(
  config: Configuration,
  selections: PublicSelections,
  data: Catalogs = catalogs,
): readonly InstructionDefinition[] {
  const board = data.boards.find((b) => b.id === selections.board)
  if (!board) return []
  return [...applicableInstructions(config, selections, data)]
    .sort((a, b) => a.su.localeCompare(b.su) || a.order - b.order)
    .map((step) => {
      let text = step.text
      if (step.su === 'SU-01') {
        text += ` Board: ${board.name}.`
        if (selections.firstPlayer !== null)
          text += ` First player: ${selections.firstPlayer}.`
      }
      if (step.context === 'colonies') {
        text += ` For ${config.playerCount} players, prepare ${step.quantities.fleets} trade fleets.`
        for (const id of selections.colonies ?? []) {
          const colony = data.colonies.find((c) => c.id === id)
          if (colony)
            text += ` ${colony.name}: ${colony.marker === 'inactive-picture' ? 'start on the picture, inactive until a qualifying resource-collecting card is in play' : 'start at the highlighted second position'}.`
        }
      }
      if (step.context === 'turmoil')
        text += ` For ${config.playerCount} players, prepare ${step.quantities.lobbyDelegates} player delegates in the Lobby and ${step.quantities.reserveDelegates} in reserve in total.`
      if (step.id === 'su-06-1') {
        const names = config.enabledContent.flatMap((id) => {
          const expansion = data.expansions.find((e) => e.id === id)
          return expansion ? [expansion.name] : []
        })
        text += names.length
          ? ` Selected content: ${names.join(', ')}. Add cards only where the selected content and printed rules require them.`
          : ' Use the base-game decks only.'
      }
      return { ...step, text }
    })
}
