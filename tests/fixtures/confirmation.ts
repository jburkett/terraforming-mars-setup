import { createApp, h } from 'vue'
import { useGameSession } from '../../src/composables/useGameSession'
import ConfirmationDialog from '../../src/ui/ConfirmationDialog.vue'
const mode = new URLSearchParams(location.search).get('mode')
const session = useGameSession({ source: () => 0 })
if (mode === 'board')
  session.dispatch({ type: 'set-content', id: 'ma', enabled: false })
session.enterSetup()
if (mode !== 'board') {
  const existing =
    session.selections.value.milestones?.findIndex(
      (row) => row.objectiveId === 'ma:milestone:pioneer',
    ) ?? -1
  session.customize({
    type: 'set-objective',
    kind: 'milestone',
    row: existing >= 0 ? existing : 0,
    id: 'ma:milestone:pioneer',
  })
}
function preview(event: Event) {
  if (event.currentTarget instanceof HTMLElement) event.currentTarget.focus()
  if (mode === 'board')
    session.requestBoard({ kind: 'manual', boardId: 'hellas' })
  else if (mode === 'reset') session.requestReset()
  else session.dispatch({ type: 'set-content', id: 'colonies', enabled: false })
}
createApp({
  setup: () => () =>
    h('div', [
      h('button', { type: 'button', onClick: preview }, 'Preview change'),
      h(
        'output',
        { 'aria-label': 'Committed board' },
        session.selections.value.board ?? 'none',
      ),
      h(
        'output',
        { 'aria-label': 'Committed colonies' },
        session.selections.value.colonies?.join(', ') ?? 'none',
      ),
      h(
        'output',
        { 'aria-label': 'Pioneer locked' },
        String(
          session.selections.value.milestones?.some(
            (row) => row.objectiveId === 'ma:milestone:pioneer' && row.locked,
          ) ?? false,
        ),
      ),
      h('output', { 'aria-label': 'Committed view' }, session.view.value),
      h(ConfirmationDialog, {
        confirmation: session.confirmation.value,
        onConfirm: session.confirmPending,
        onCancel: session.cancelPending,
      }),
    ]),
}).mount('#fixture')
