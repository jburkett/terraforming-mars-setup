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
import type { SelectionResult } from '../domain/selections'
import { customizeSelections } from '../domain/customization'
import type { CustomizationAction } from '../domain/customization'
import { previewBoardChange, commitBoardChange } from '../domain/board-change'
import type {
  BoardChangePreview,
  BoardChangeTarget,
} from '../domain/board-change'
import { objectiveSets, objectiveAlternatives } from '../domain/objectives'
import { projectInstructions } from '../domain/instructions'
import { projectSummary } from '../domain/summary'

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

  const pendingBoardState = shallowRef<BoardChangePreview | null>(null)
  function apply(result: SelectionResult): void {
    if (result.ok) {
      selectionState.value = result.selections
      conflictState.value = null
    } else conflictState.value = result.conflict
  }
  function customize(action: CustomizationAction): void {
    if (!selectionState.value.board || pendingBoardState.value) return
    apply(
      customizeSelections(
        configurationState.value,
        selectionState.value,
        action,
        source,
        data,
      ),
    )
  }
  function requestBoard(target: BoardChangeTarget): void {
    if (pendingBoardState.value) return
    const result = previewBoardChange(
      configurationState.value,
      selectionState.value,
      target,
      data,
    )
    if (!result.ok) {
      conflictState.value = result.conflict
      return
    }
    if (result.preview.needsConfirmation)
      pendingBoardState.value = result.preview
    else apply(commitBoardChange(result.preview, source))
  }
  function cancelBoardChange(): void {
    pendingBoardState.value = null
  }
  function confirmBoardChange(): void {
    if (!pendingBoardState.value) return
    apply(commitBoardChange(pendingBoardState.value, source, true))
    pendingBoardState.value = null
  }
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
    data,
    customize,
    requestBoard,
    cancelBoardChange,
    confirmBoardChange,
    pendingBoard: computed(() => pendingBoardState.value),
    objectives: computed(() =>
      objectiveSets(configurationState.value, selectionState.value, data),
    ),
    objectiveOptions: computed(() => ({
      milestone: Array.from({ length: 5 }, (_, row) =>
        objectiveAlternatives(
          'milestone',
          row,
          configurationState.value,
          selectionState.value,
          data,
        ),
      ),
      award: Array.from({ length: 5 }, (_, row) =>
        objectiveAlternatives(
          'award',
          row,
          configurationState.value,
          selectionState.value,
          data,
        ),
      ),
    })),
    instructions: computed(() =>
      projectInstructions(configurationState.value, selectionState.value, data),
    ),
    summary: computed(() =>
      projectSummary(configurationState.value, selectionState.value, data),
    ),
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
