import { createApp, h, shallowRef } from 'vue'
import { initialConfiguration } from '../../src/domain/configuration'
import {
  emptySelections,
  generateMissingSelections,
} from '../../src/domain/selections'
import {
  objectiveAlternatives,
  objectiveSets,
} from '../../src/domain/objectives'
import { customizeSelections } from '../../src/domain/customization'
import type { CustomizationAction } from '../../src/domain/customization'
import ObjectiveTable from '../../src/ui/ObjectiveTable.vue'
const config = initialConfiguration()
const generated = generateMissingSelections(config, emptySelections(), () => 0)
if (!generated.ok) throw new Error(generated.conflict.message)
const selected = shallowRef(generated.selections)
function action(value: CustomizationAction) {
  const next = customizeSelections(config, selected.value, value, () => 0)
  if (next.ok) selected.value = next.selections
}
createApp({
  setup: () => () =>
    h(ObjectiveTable, {
      kind: 'milestone',
      replacement: true,
      entries: objectiveSets(config, selected.value).milestones,
      rows: selected.value.milestones,
      alternatives: [0, 1, 2, 3, 4].map((row) =>
        objectiveAlternatives('milestone', row, config, selected.value),
      ),
      onAction: action,
    }),
}).mount('#fixture')
