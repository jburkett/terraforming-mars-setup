import { computed, shallowRef } from 'vue'
import {
  dependencyNotices,
  initialConfiguration,
  updateConfiguration,
} from '../domain/configuration'
import type { ConfigurationAction } from '../domain/configuration'
import type {
  PublicSelections,
  SelectionConflict,
  Session,
} from '../domain/types'
import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import { browserRandomUint32 } from '../random'
import type { Uint32Source } from '../domain/random'
import { generateMissingSelections } from '../domain/selections'

/** Create once in the application shell; child views share this owner via props. */
export function useGameSession(
  options: { source?: Uint32Source; data?: Catalogs } = {},
) {
  const source = options.source ?? browserRandomUint32
  const data = options.data ?? catalogs
  const conflictState = shallowRef<SelectionConflict | null>(null)
  // A shallow ref keeps domain inputs plain. All updates are explicit immutable actions.
  const configurationState = shallowRef(initialConfiguration())
  const viewState = shallowRef<Session['view']>('expansions')
  const selectionState = shallowRef<PublicSelections>({
    board: null,
    firstPlayer: null,
    colonies: null,
    milestones: null,
    awards: null,
  })

  function dispatch(action: ConfigurationAction): void {
    // US4 owns post-generation configuration invalidation and loss confirmation.
    if (selectionState.value.board !== null) return
    conflictState.value = null
    configurationState.value = updateConfiguration(
      configurationState.value,
      action,
    )
  }
  function enterSetup(): void {
    const result = generateMissingSelections(
      configurationState.value,
      selectionState.value,
      source,
      data,
    )
    if (result.ok) {
      selectionState.value = result.selections
      conflictState.value = null
    } else conflictState.value = result.conflict
    viewState.value = 'setup'
  }
  function returnToConfiguration(): void {
    viewState.value = 'expansions'
  }
  function continueToNextView(): void {
    if (viewState.value === 'expansions') viewState.value = 'variants'
    else if (viewState.value === 'variants') enterSetup()
  }
  function goBack(): void {
    if (viewState.value === 'setup') viewState.value = 'variants'
    else if (viewState.value === 'variants') viewState.value = 'expansions'
  }

  return {
    configuration: computed(() => configurationState.value),
    view: computed(() => viewState.value),
    notices: computed(() => dependencyNotices(configurationState.value)),
    selections: computed(() => selectionState.value),
    configurationEditable: computed(() => selectionState.value.board === null),
    conflict: computed(() => conflictState.value),
    enterSetup,
    returnToConfiguration,
    dispatch,
    continueToNextView,
    goBack,
  }
}
export type GameSession = ReturnType<typeof useGameSession>
