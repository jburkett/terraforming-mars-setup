<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { GameSession } from '../composables/useGameSession'
import PublicSelections from './PublicSelections.vue'
import ObjectiveTable from './ObjectiveTable.vue'
const props = defineProps<{ session: GameSession }>()
const dialog = ref<HTMLDialogElement | null>(null)
watch(
  () => props.session.pendingBoard.value,
  async (pending) => {
    await nextTick()
    if (pending) dialog.value?.showModal()
    else dialog.value?.close()
  },
)
</script>

<template>
  <section aria-labelledby="setup-heading">
    <h2 id="setup-heading">Game setup</h2>
    <template v-if="session.selections.value.board">
      <PublicSelections
        :configuration="session.configuration.value"
        :selections="session.selections.value"
        :data="session.data"
        @action="session.customize"
        @board="session.requestBoard"
      />
      <ObjectiveTable
        v-for="kind in ['milestone', 'award'] as const"
        :key="kind"
        :kind="kind"
        :entries="
          kind === 'milestone'
            ? session.objectives.value.milestones
            : session.objectives.value.awards
        "
        :rows="
          kind === 'milestone'
            ? session.selections.value.milestones
            : session.selections.value.awards
        "
        :alternatives="session.objectiveOptions.value[kind]"
        :replacement="session.configuration.value.enabledContent.includes('ma')"
        @action="session.customize"
      />
    </template>
    <dialog
      ref="dialog"
      aria-labelledby="board-confirm-heading"
      @cancel.prevent="session.cancelBoardChange"
    >
      <h3 id="board-confirm-heading">Change board?</h3>
      <p>Changing the board may replace these objectives:</p>
      <ul>
        <li v-for="loss in session.pendingBoard.value?.losses" :key="loss">
          {{ loss }}
        </li>
      </ul>
      <button type="button" @click="session.cancelBoardChange">
        Keep current board
      </button>
      <button type="button" @click="session.confirmBoardChange">
        Change board
      </button>
    </dialog>
    <button type="button" @click="session.goBack">Back</button>
  </section>
</template>

<style scoped>
dialog {
  max-width: min(90vw, 34rem);
  border: 1px solid #aabdb3;
  border-radius: 0.75rem;
  padding: 1.5rem;
  color: inherit;
}
dialog::backdrop {
  background: #203c3266;
}
dialog button {
  margin: 0.5rem;
}
</style>
