import { createApp, h } from 'vue'
import { initialConfiguration } from '../../src/domain/configuration'
import { projectInstructions } from '../../src/domain/instructions'
import { seeded } from '../helpers/public-selection-api'
import InstructionList from '../../src/ui/InstructionList.vue'
const config = initialConfiguration()
const instructions = projectInstructions(config, {
  ...seeded(config),
  firstPlayer: 2,
})
createApp({ setup: () => () => h(InstructionList, { instructions }) }).mount(
  '#fixture',
)
