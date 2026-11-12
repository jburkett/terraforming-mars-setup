<script setup lang="ts">
import { computed, ref } from 'vue'
import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import {
  boardAlternatives,
  colonyAlternatives,
  firstPlayerAlternatives,
} from '../domain/customization'
import type { CustomizationAction } from '../domain/customization'
import type { BoardChangeTarget } from '../domain/board-change'
import type { Configuration, PublicSelections } from '../domain/types'
const props = defineProps<{
  configuration: Configuration
  selections: PublicSelections
  data?: Catalogs
}>()
const emit = defineEmits<{
  action: [action: CustomizationAction]
  board: [target: BoardChangeTarget]
}>()
const boardOpen = ref(false)
const firstOpen = ref(false)
const coloniesOpen = ref(false)
const data = computed(() => props.data ?? catalogs)
const boards = computed(() =>
  boardAlternatives(props.configuration, data.value),
)
const firstPlayers = computed(() =>
  firstPlayerAlternatives(props.configuration),
)
const boardName = computed(
  () =>
    data.value.boards.find((b) => b.id === props.selections.board)?.name ?? '',
)
const colonyName = (id: string) =>
  data.value.colonies.find((c) => c.id === id)?.name ?? id
function boardChoice(event: Event): void {
  if (!(event.target instanceof HTMLSelectElement)) return
  const board = boards.value.find(
    (b) => b.id === (event.target as HTMLSelectElement).value,
  )
  if (board) emit('board', { kind: 'manual', boardId: board.id })
  event.target.value = props.selections.board ?? ''
}
function firstChoice(event: Event): void {
  if (!(event.target instanceof HTMLSelectElement)) return
  emit('action', {
    type: 'set-first-player',
    value: Number(event.target.value),
  })
  event.target.value = String(props.selections.firstPlayer ?? '')
}
function colonyChoice(row: number, event: Event): void {
  if (!(event.target instanceof HTMLSelectElement)) return
  emit('action', { type: 'set-colony', row, id: event.target.value })
  event.target.value = props.selections.colonies?.[row] ?? ''
}
</script>
<template>
  <section aria-labelledby="public-selections-heading">
    <h3 id="public-selections-heading">Public selections</h3>
    <section class="selection-block" aria-label="Board selection">
      <div class="result-heading">
        <strong>Selected board</strong
        ><button type="button" @click="boardOpen = !boardOpen">
          {{ boardOpen ? 'Close' : 'Customize' }} board
        </button>
      </div>
      <p data-selection-value>{{ boardName }}</p>
      <div v-if="boardOpen" class="custom-controls">
        <label for="board-choice">Board choice</label
        ><select
          id="board-choice"
          :value="selections.board"
          @change="boardChoice"
        >
          <option v-for="board in boards" :key="board.id" :value="board.id">
            {{ board.name }}
          </option></select
        ><button type="button" @click="emit('board', { kind: 'reroll' })">
          Reroll board
        </button>
      </div>
    </section>
    <section class="selection-block" aria-label="First-player selection">
      <div class="result-heading">
        <strong>First player</strong
        ><button type="button" @click="firstOpen = !firstOpen">
          {{ firstOpen ? 'Close' : 'Customize' }} first player
        </button>
      </div>
      <p>
        <span data-first-player data-selection-value>{{
          selections.firstPlayer
        }}</span>
      </p>
      <div v-if="firstOpen" class="custom-controls">
        <label for="first-player-choice">First-player choice</label
        ><select
          id="first-player-choice"
          :value="selections.firstPlayer"
          @change="firstChoice"
        >
          <option v-for="number in firstPlayers" :key="number" :value="number">
            {{ number }}
          </option></select
        ><button
          type="button"
          @click="emit('action', { type: 'reroll-first-player' })"
        >
          Reroll first player
        </button>
      </div>
    </section>
    <section
      v-if="selections.colonies"
      class="selection-block"
      aria-label="Colony selection"
    >
      <div class="result-heading">
        <strong>Colonies</strong
        ><button type="button" @click="coloniesOpen = !coloniesOpen">
          {{ coloniesOpen ? 'Close' : 'Customize' }} colonies
        </button>
      </div>
      <ul aria-label="Selected colonies">
        <li
          v-for="(id, index) in selections.colonies"
          :key="index"
          :data-colony-id="id"
        >
          <span data-selection-value>{{ colonyName(id) }}</span>
        </li>
      </ul>
      <div v-if="coloniesOpen" class="custom-controls">
        <div v-for="(_, index) in selections.colonies" :key="index">
          <label :for="`colony-choice-${index}`">Colony {{ index + 1 }}</label
          ><select
            :id="`colony-choice-${index}`"
            :value="selections.colonies[index]"
            @change="colonyChoice(index, $event)"
          >
            <option
              v-for="colony in colonyAlternatives(
                configuration,
                selections,
                index,
                data,
              )"
              :key="colony.id"
              :value="colony.id"
            >
              {{ colony.name }}
            </option>
          </select>
        </div>
        <button
          type="button"
          @click="emit('action', { type: 'reroll-colonies' })"
        >
          Reroll colonies
        </button>
      </div>
    </section>
  </section>
</template>
<style scoped>
.selection-block {
  margin-top: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e3e9e5;
}
.result-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.custom-controls {
  display: grid;
  gap: 0.75rem;
  max-width: 24rem;
}
.custom-controls > button {
  justify-self: start;
  margin-top: 0.5rem;
}
label {
  display: block;
  margin-bottom: 0.35rem;
}
select {
  max-width: 100%;
  min-width: 0;
  width: 100%;
}
li {
  margin-block: 0.5rem;
}
</style>
