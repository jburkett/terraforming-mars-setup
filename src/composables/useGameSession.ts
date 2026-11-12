import { computed, shallowRef } from 'vue'
import {
  dependencyNotices,
  initialConfiguration,
  updateConfiguration,
} from '../domain/configuration'
import type { ConfigurationAction } from '../domain/configuration'
import type { PublicSelections, Session } from '../domain/types'

/** Create once in the application shell; child views share this owner via props. */
export function useGameSession() {
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
    configurationState.value = updateConfiguration(
      configurationState.value,
      action,
    )
  }
  function continueToNextView(): void {
    if (viewState.value === 'expansions') viewState.value = 'variants'
    else if (viewState.value === 'variants') viewState.value = 'setup'
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
    dispatch,
    continueToNextView,
    goBack,
  }
}
export type GameSession = ReturnType<typeof useGameSession>
