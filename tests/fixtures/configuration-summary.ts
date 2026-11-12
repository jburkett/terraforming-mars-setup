import { createApp, h } from 'vue'
import { initialConfiguration } from '../../src/domain/configuration'
import type { Configuration } from '../../src/domain/types'
import { projectSummary } from '../../src/domain/summary'
import { seeded, rows } from '../helpers/public-selection-api'
import ConfigurationSummary from '../../src/ui/ConfigurationSummary.vue'
const ma = new URLSearchParams(location.search).get('mode') === 'ma'
const config: Configuration = ma
  ? initialConfiguration()
  : {
      ...initialConfiguration(),
      playerCount: 3,
      enabledContent: [],
      expandedBoards: true,
      boardCandidates: ['utopia-planitia'],
      variants: { extendedStart: false, researchDrafting: true },
    }
const selections = { ...seeded(config), firstPlayer: 2 as const }
if (ma)
  selections.milestones = rows([
    'ma:milestone:terraformer',
    'ma:milestone:builder',
    'ma:milestone:merchant',
    'ma:milestone:planner',
    'ma:milestone:tycoon',
  ])
const summary = projectSummary(config, selections)
createApp({ setup: () => () => h(ConfigurationSummary, { summary }) }).mount(
  '#fixture',
)
