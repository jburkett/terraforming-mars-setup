import { createApp, h } from 'vue'
import { useGameSession } from '../../src/composables/useGameSession'
import VariantsView from '../../src/ui/VariantsView.vue'

const session = useGameSession()
session.dispatch({ type: 'select-content', enabled: false })
session.continueToNextView()
createApp({
  setup: () => () =>
    h('div', [
      h(VariantsView, { session }),
      h('output', { 'aria-label': 'Fixture view' }, session.view.value),
      h(
        'output',
        { 'aria-label': 'Fixture content' },
        session.configuration.value.enabledContent.join(',') || 'none',
      ),
    ]),
}).mount('#fixture')
