import { createApp, h } from 'vue'
import { catalogs } from '../../src/content/catalogs'
import { useGameSession } from '../../src/composables/useGameSession'
import ExpansionsView from '../../src/ui/ExpansionsView.vue'
import VariantsView from '../../src/ui/VariantsView.vue'
import SetupView from '../../src/ui/SetupView.vue'

// A deliberately insufficient catalog is isolated to this browser-test fixture.
const session = useGameSession({
  source: () => 0,
  data: { ...catalogs, colonies: catalogs.colonies.slice(0, 1) },
})
session.enterSetup()
createApp({
  setup: () => () =>
    h(
      session.view.value === 'expansions'
        ? ExpansionsView
        : session.view.value === 'variants'
          ? VariantsView
          : SetupView,
      { session },
    ),
}).mount('#fixture')
