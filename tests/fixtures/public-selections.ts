import { createApp, h, shallowRef } from 'vue'
import {
  initialConfiguration,
  updateConfiguration,
} from '../../src/domain/configuration'
import {
  emptySelections,
  generateMissingSelections,
} from '../../src/domain/selections'
import { customizeSelections } from '../../src/domain/customization'
import type { CustomizationAction } from '../../src/domain/customization'
import {
  previewBoardChange,
  commitBoardChange,
} from '../../src/domain/board-change'
import type { BoardChangeTarget } from '../../src/domain/board-change'
import PublicSelections from '../../src/ui/PublicSelections.vue'
const config = updateConfiguration(initialConfiguration(), {
  type: 'set-expanded-boards',
  enabled: false,
})
const generated = generateMissingSelections(config, emptySelections(), () => 0)
if (!generated.ok) throw new Error(generated.conflict.message)
const selected = shallowRef(generated.selections)
function action(value: CustomizationAction) {
  const next = customizeSelections(config, selected.value, value, () => 0)
  if (next.ok) selected.value = next.selections
}
function board(target: BoardChangeTarget) {
  const preview = previewBoardChange(config, selected.value, target)
  if (preview.ok && !preview.preview.needsConfirmation) {
    const next = commitBoardChange(preview.preview, () => 0)
    if (next.ok) selected.value = next.selections
  }
}
createApp({
  setup: () => () =>
    h(PublicSelections, {
      configuration: config,
      selections: selected.value,
      onAction: action,
      onBoard: board,
    }),
}).mount('#fixture')
