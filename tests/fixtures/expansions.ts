import { createApp } from 'vue'
import { useGameSession } from '../../src/composables/useGameSession'
import ExpansionsView from '../../src/ui/ExpansionsView.vue'

createApp(ExpansionsView, { session: useGameSession() }).mount('#fixture')
