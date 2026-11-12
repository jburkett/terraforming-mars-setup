import { BOARD_IDS, EXPANSION_IDS } from '../content/types'
import type { BoardId, ExpansionId } from '../content/types'
import type { BoardPool, Configuration, PlayerCount, Variants } from './types'

export type ConfigurationAction =
  | { readonly type: 'set-player-count'; readonly value: number }
  | {
      readonly type: 'set-content'
      readonly id: ExpansionId
      readonly enabled: boolean
    }
  | { readonly type: 'set-expanded-boards'; readonly enabled: boolean }
  | {
      readonly type: 'set-board'
      readonly id: BoardId
      readonly enabled: boolean
    }
  | { readonly type: 'select-content'; readonly enabled: boolean }
  | {
      readonly type: 'set-variant'
      readonly id: keyof Variants
      readonly enabled: boolean
    }
  | { readonly type: 'select-variants'; readonly enabled: boolean }

function playerCount(value: number): PlayerCount {
  if (value !== 2 && value !== 3 && value !== 4 && value !== 5)
    throw new RangeError('Player count must be an integer from 2 to 5.')
  return value
}

function boardPool(
  enabled: boolean,
  candidates: readonly BoardId[],
): BoardPool {
  if (candidates.some((id) => !BOARD_IDS.includes(id)))
    throw new RangeError('Unknown board.')
  const [first, ...rest] = BOARD_IDS.filter((id) => candidates.includes(id))
  // Removing the last candidate restores off/Tharsis fallback.
  if (!enabled || !first)
    return { expandedBoards: false, boardCandidates: ['tharsis'] }
  return { expandedBoards: true, boardCandidates: [first, ...rest] }
}

export function normalizeConfiguration(config: Configuration): Configuration {
  if (config.enabledContent.some((id) => !EXPANSION_IDS.includes(id)))
    throw new RangeError('Unknown content option.')
  const enabled = new Set(config.enabledContent)
  if (enabled.has('prelude2')) enabled.add('prelude')
  return {
    playerCount: playerCount(config.playerCount),
    enabledContent: EXPANSION_IDS.filter((id) => enabled.has(id)),
    ...boardPool(config.expandedBoards, config.boardCandidates),
    variants: {
      extendedStart: config.variants.extendedStart,
      researchDrafting: config.variants.researchDrafting,
    },
  }
}

export function initialConfiguration(): Configuration {
  return normalizeConfiguration({
    playerCount: 2,
    enabledContent: [...EXPANSION_IDS],
    expandedBoards: true,
    boardCandidates: [...BOARD_IDS],
    variants: { extendedStart: true, researchDrafting: true },
  })
}

export function updateConfiguration(
  config: Configuration,
  action: ConfigurationAction,
): Configuration {
  switch (action.type) {
    case 'set-player-count':
      return normalizeConfiguration({
        ...config,
        playerCount: playerCount(action.value),
      })
    case 'set-content': {
      if (!EXPANSION_IDS.includes(action.id))
        throw new RangeError('Unknown content option.')
      const enabledContent = config.enabledContent.filter(
        (id) => id !== action.id,
      )
      if (action.enabled) enabledContent.push(action.id)
      return normalizeConfiguration({ ...config, enabledContent })
    }
    case 'select-content':
      // One atomic bulk edit: disabling P2 and Prelude together must leave both off.
      return normalizeConfiguration({
        ...config,
        enabledContent: action.enabled ? [...EXPANSION_IDS] : [],
        ...boardPool(action.enabled, action.enabled ? BOARD_IDS : []),
      })
    case 'set-expanded-boards':
      return action.enabled === config.expandedBoards
        ? config
        : normalizeConfiguration({
            ...config,
            ...boardPool(action.enabled, BOARD_IDS),
          })
    case 'set-board': {
      if (!BOARD_IDS.includes(action.id)) throw new RangeError('Unknown board.')
      if (!config.expandedBoards) return config
      const candidates = config.boardCandidates.filter((id) => id !== action.id)
      if (action.enabled) candidates.push(action.id)
      return normalizeConfiguration({
        ...config,
        ...boardPool(true, candidates),
      })
    }
    case 'set-variant':
      if (action.id !== 'extendedStart' && action.id !== 'researchDrafting')
        throw new RangeError('Unknown variant.')
      return normalizeConfiguration({
        ...config,
        variants: { ...config.variants, [action.id]: action.enabled },
      })
    case 'select-variants':
      return normalizeConfiguration({
        ...config,
        variants: {
          extendedStart: action.enabled,
          researchDrafting: action.enabled,
        },
      })
  }
}

export function dependencyNotices(config: Configuration): readonly string[] {
  return config.enabledContent.includes('prelude2')
    ? ['Prelude 2 requires Prelude; Prelude is kept enabled.']
    : []
}
