import { computed, shallowRef } from 'vue'
import {
  dependencyNotices,
  initialConfiguration,
} from '../domain/configuration'
import type { ConfigurationAction } from '../domain/configuration'
import type { GameState, SelectionConflict, Session } from '../domain/types'
import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import { browserRandomUint32 } from '../random'
import type { Uint32Source } from '../domain/random'
import {
  emptySelections,
  generateMissingSelections,
} from '../domain/selections'
import { previewEdit, commitEdit } from '../domain/edits'
import type { EditPreview } from '../domain/edits'
import { previewReset, commitReset } from '../domain/reset'
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

type PendingChange =
  | { readonly kind: 'edit'; readonly preview: EditPreview }
  | { readonly kind: 'reset'; readonly preview: EditPreview }
  | { readonly kind: 'board'; readonly preview: BoardChangePreview }
export interface ConfirmationDetails {
  readonly title: string
  readonly message: string
  readonly losses: readonly string[]
  readonly cancelLabel: string
  readonly confirmLabel: string
}

/** Create once in the application shell; child views share this owner via props. */
export function useGameSession(
  options: { source?: Uint32Source; data?: Catalogs } = {},
) {
  const source = options.source ?? browserRandomUint32
  const data = options.data ?? catalogs
  const conflictState = shallowRef<SelectionConflict | null>(null)
  // One plain snapshot makes configuration/result replacement atomic for all consumers.
  const committedState = shallowRef<GameState>({
    configuration: initialConfiguration(),
    selections: emptySelections(),
  })
  const configurationState = computed(() => committedState.value.configuration)
  const selectionState = computed(() => committedState.value.selections)
  const viewState = shallowRef<Session['view']>('expansions')
  const pendingState = shallowRef<PendingChange | null>(null)

  function apply(result: SelectionResult): void {
    if (result.ok) {
      if (result.selections !== selectionState.value)
        committedState.value = {
          ...committedState.value,
          selections: result.selections,
        }
      conflictState.value = null
    } else conflictState.value = result.conflict
  }
  function customize(action: CustomizationAction): void {
    if (!selectionState.value.board || pendingState.value) return
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
    if (pendingState.value) return
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
      pendingState.value = { kind: 'board', preview: result.preview }
    else apply(commitBoardChange(result.preview, source))
  }
  function cancelPending(): void {
    // The committed snapshot was never changed; discard only the proposal.
    pendingState.value = null
  }
  function confirmPending(): void {
    const pending = pendingState.value
    if (!pending) return
    if (pending.kind === 'board')
      apply(commitBoardChange(pending.preview, source, true))
    else {
      const next =
        pending.kind === 'reset'
          ? commitReset(pending.preview, true)
          : commitEdit(pending.preview, true)
      if (next) {
        committedState.value = next
        conflictState.value = null
        if (pending.kind === 'reset') viewState.value = 'expansions'
      }
    }
    pendingState.value = null
  }
  // Retain the established direct-board API while sharing the pending transaction owner.
  function cancelBoardChange(): void {
    if (pendingState.value?.kind === 'board') cancelPending()
  }
  function confirmBoardChange(): void {
    if (pendingState.value?.kind === 'board') confirmPending()
  }
  function requestReset(): void {
    if (pendingState.value) return
    pendingState.value = {
      kind: 'reset',
      preview: previewReset(
        configurationState.value,
        selectionState.value,
        data,
      ),
    }
  }
  function dispatch(action: ConfigurationAction): void {
    if (pendingState.value) return
    const preview = previewEdit(
      configurationState.value,
      selectionState.value,
      action,
      data,
    )
    const next = commitEdit(preview)
    if (next) {
      committedState.value = next
      conflictState.value = null
    } else pendingState.value = { kind: 'edit', preview }
  }
  const confirmation = computed<ConfirmationDetails | null>(() => {
    const pending = pendingState.value
    if (!pending) return null
    if (pending.kind === 'board')
      return {
        title: 'Change board?',
        message: 'Changing the board may replace these objectives.',
        losses: pending.preview.losses,
        cancelLabel: 'Keep current board',
        confirmLabel: 'Change board',
      }
    if (pending.kind === 'reset')
      return {
        title: 'Reset game setup?',
        message:
          'Restore 2 players, all supported content, all seven boards and both variants. Clear generated choices and locks; next setup entry generates new choices.',
        losses: pending.preview.losses.map((loss) => loss.reason),
        cancelLabel: 'Keep current setup',
        confirmLabel: 'Reset setup',
      }
    return {
      title: 'Change configuration?',
      message:
        'Apply the new configuration and clear only these affected choices.',
      losses: pending.preview.losses.map((loss) => loss.reason),
      cancelLabel: 'Keep configuration',
      confirmLabel: 'Apply changes',
    }
  })
  function enterSetup(): void {
    if (pendingState.value) return
    apply(
      generateMissingSelections(
        configurationState.value,
        selectionState.value,
        source,
        data,
      ),
    )
    viewState.value = 'setup'
  }
  function returnToConfiguration(): void {
    if (pendingState.value) return
    viewState.value = 'expansions'
  }
  function continueToNextView(): void {
    if (pendingState.value) return
    if (viewState.value === 'expansions') viewState.value = 'variants'
    else if (viewState.value === 'variants') enterSetup()
  }
  function goBack(): void {
    if (pendingState.value) return
    if (viewState.value === 'setup') viewState.value = 'variants'
    else if (viewState.value === 'variants') viewState.value = 'expansions'
  }

  return {
    data,
    customize,
    requestBoard,
    cancelBoardChange,
    confirmBoardChange,
    confirmation,
    requestReset,
    confirmPending,
    cancelPending,
    pendingBoard: computed(() =>
      pendingState.value?.kind === 'board' ? pendingState.value.preview : null,
    ),
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
    configurationEditable: computed(() => pendingState.value === null),
    conflict: computed(() => conflictState.value),
    enterSetup,
    returnToConfiguration,
    dispatch,
    continueToNextView,
    goBack,
  }
}
export type GameSession = ReturnType<typeof useGameSession>
