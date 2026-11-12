<script setup lang="ts">
import { computed } from 'vue'
import { catalogs } from '../content/catalogs'
import type { BoardId, ExpansionId } from '../content/types'
import type { GameSession } from '../composables/useGameSession'

const props = defineProps<{ session: GameSession }>()
const config = computed(() => props.session.configuration.value)
const notices = computed(() => props.session.notices.value)

function setPlayerCount(event: Event): void {
  if (event.target instanceof HTMLSelectElement)
    props.session.dispatch({
      type: 'set-player-count',
      value: Number(event.target.value),
    })
}
function setContent(id: ExpansionId, event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return
  props.session.dispatch({
    type: 'set-content',
    id,
    enabled: event.target.checked,
  })
  // Reflect the committed domain result, including a rejected dependency change.
  event.target.checked = config.value.enabledContent.includes(id)
}
function setBoard(id: BoardId, event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return
  props.session.dispatch({
    type: 'set-board',
    id,
    enabled: event.target.checked,
  })
  event.target.checked = config.value.boardCandidates.some(
    (candidate) => candidate === id,
  )
}
function setExpandedBoards(event: Event): void {
  if (event.target instanceof HTMLInputElement)
    props.session.dispatch({
      type: 'set-expanded-boards',
      enabled: event.target.checked,
    })
}
</script>

<template>
  <section aria-labelledby="content-heading">
    <h2 id="content-heading">Choose game content</h2>
    <p>Choose the players, expansions and boards for your table.</p>
    <div class="bulk-actions" aria-label="Content selection">
      <button
        type="button"
        @click="session.dispatch({ type: 'select-content', enabled: true })"
      >
        Select all
      </button>
      <button
        type="button"
        @click="session.dispatch({ type: 'select-content', enabled: false })"
      >
        Select none
      </button>
    </div>

    <label class="player-count" for="player-count">
      Player count
      <select
        id="player-count"
        :value="config.playerCount"
        @change="setPlayerCount"
      >
        <option v-for="count in [2, 3, 4, 5]" :key="count" :value="count">
          {{ count }}
        </option>
      </select>
    </label>

    <fieldset>
      <legend>Expansions</legend>
      <div class="option-grid">
        <label
          v-for="expansion in catalogs.expansions"
          :key="expansion.id"
          class="option"
        >
          <input
            type="checkbox"
            :checked="config.enabledContent.includes(expansion.id)"
            :aria-describedby="
              ['prelude', 'prelude2'].includes(expansion.id) && notices.length
                ? 'prelude-dependency'
                : undefined
            "
            @change="setContent(expansion.id, $event)"
          />
          <span>{{ expansion.name }}</span>
        </label>
      </div>
      <p
        v-if="notices.length"
        id="prelude-dependency"
        class="notice"
        role="status"
      >
        {{ notices.join(' ') }}
      </p>
    </fieldset>

    <label class="option expanded-toggle">
      <input
        type="checkbox"
        :checked="config.expandedBoards"
        @change="setExpandedBoards"
      />
      <span>Use expanded boards</span>
    </label>
    <fieldset :disabled="!config.expandedBoards">
      <legend>Board candidates</legend>
      <div class="option-grid">
        <label v-for="board in catalogs.boards" :key="board.id" class="option">
          <input
            type="checkbox"
            :checked="
              config.boardCandidates.some((candidate) => candidate === board.id)
            "
            @change="setBoard(board.id, $event)"
          />
          <span>{{
            board.id === 'tharsis' ? 'Original board (Tharsis)' : board.name
          }}</span>
        </label>
      </div>
    </fieldset>
    <div class="navigation">
      <button class="primary" type="button" @click="session.continueToNextView">
        Continue
      </button>
    </div>
  </section>
</template>

<style scoped>
.bulk-actions,
.navigation {
  display: flex;
  gap: 0.75rem;
  margin-block: 1.5rem;
}
.navigation {
  justify-content: flex-end;
}
.player-count {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block: 1.5rem;
  font-weight: 600;
}
fieldset {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid #c8d4d0;
  border-radius: 0.75rem;
}
legend {
  padding: 0 0.5rem;
  font-weight: 650;
}
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 0.5rem;
}
.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  cursor: pointer;
}
.option input {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}
fieldset:disabled {
  color: #66736e;
  background: #f2f5f3;
}
fieldset:disabled .option {
  cursor: default;
}
.notice {
  margin-bottom: 0;
  color: #34594d;
}
</style>
