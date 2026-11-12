<script setup lang="ts">
import { computed, ref } from 'vue'
import { catalogs } from '../content/catalogs'
import type { Five, ObjectiveDefinition } from '../content/types'
import type { ObjectiveContext } from '../domain/context'
import type { ObjectiveKind } from '../domain/objectives'
import type { CustomizationAction } from '../domain/customization'
import type { ObjectiveRow } from '../domain/types'
const props = defineProps<{
  kind: ObjectiveKind
  entries: readonly ObjectiveContext[]
  rows: Five<ObjectiveRow> | null
  alternatives: readonly (readonly ObjectiveDefinition[])[]
  replacement: boolean
}>()
const emit = defineEmits<{ action: [action: CustomizationAction] }>()
const customizing = ref(false)
const title = computed(() =>
  props.kind === 'milestone' ? 'Milestones' : 'Awards',
)
const singular = computed(() =>
  props.kind === 'milestone' ? 'Milestone' : 'Award',
)
const editable = computed(() =>
  props.entries.filter((e) => e.objective.source === 'ma'),
)
const fixed = computed(() =>
  props.entries.filter((e) => e.objective.source === 'venus'),
)
const label = (entry: ObjectiveContext) =>
  entry.threshold?.text ?? entry.objective.name
const missing = (entry: ObjectiveContext) =>
  entry.limitations
    .map((id) => catalogs.expansions.find((e) => e.id === id)?.name ?? id)
    .join(', ')
function choose(row: number, event: Event): void {
  if (!(event.target instanceof HTMLSelectElement)) return
  emit('action', {
    type: 'set-objective',
    kind: props.kind,
    row,
    id: event.target.value,
  })
  event.target.value = props.rows?.[row]?.objectiveId ?? ''
}
function lock(row: number, event: Event): void {
  if (event.target instanceof HTMLInputElement)
    emit('action', {
      type: 'set-lock',
      kind: props.kind,
      row,
      locked: event.target.checked,
    })
}
</script>
<template>
  <section :aria-label="title" class="objectives">
    <div class="section-title">
      <h3>{{ title }}</h3>
      <button
        v-if="replacement"
        type="button"
        @click="customizing = !customizing"
      >
        {{ customizing ? 'Close' : 'Customize' }} {{ title.toLowerCase() }}
      </button>
    </div>
    <template v-if="replacement">
      <table :aria-label="title">
        <thead>
          <tr>
            <th scope="col">{{ singular }}</th>
            <th scope="col">Lock</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, index) in editable"
            :key="index"
            :data-objective-kind="kind"
            :data-objective-id="entry.objective.id"
          >
            <td>
              <span v-if="!customizing" data-selection-value>{{
                label(entry)
              }}</span><template v-else
                ><select
                  :aria-label="`${singular} ${index + 1}`"
                  :value="rows?.[index]?.objectiveId"
                  @change="choose(index, $event)"
                >
                  <option
                    v-for="option in alternatives[index]"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.name }}
                  </option></select
                ><small v-if="entry.threshold">{{
                  entry.threshold.text
                }}</small></template
              >
            </td>
            <td>
              <input
                v-if="customizing"
                type="checkbox"
                :aria-label="`Lock ${kind} ${index + 1}`"
                :checked="rows?.[index]?.locked ?? false"
                @change="lock(index, $event)"
              /><span v-else>{{
                rows?.[index]?.locked ? 'Locked' : 'Unlocked'
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p
        v-for="entry in fixed"
        :key="entry.objective.id"
        :data-objective-kind="kind"
        :data-objective-id="entry.objective.id"
      >
        <span data-selection-value>{{ label(entry) }}</span>
        <small>(Venus Next · fixed)</small>
      </p>
      <button
        v-if="customizing"
        type="button"
        class="reroll"
        @click="emit('action', { type: 'reroll-objectives', kind })"
      >
        Reroll {{ title.toLowerCase() }}
      </button>
    </template>
    <ul v-else :aria-label="title">
      <li
        v-for="entry in entries"
        :key="entry.objective.id"
        :data-objective-kind="kind"
        :data-objective-id="entry.objective.id"
      >
        <span data-selection-value>{{ label(entry) }}</span>
        <p v-if="entry.limitations.length" class="limitation">
          {{ entry.objective.name }} is unattainable: requires
          {{ missing(entry) }}.
        </p>
      </li>
    </ul>
  </section>
</template>
<style scoped>
.objectives {
  margin-top: 2rem;
}
.section-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
h3 {
  margin: 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
  border: 0;
  padding: 0.6rem 0.25rem;
  text-align: left;
  vertical-align: middle;
}
th:last-child,
td:last-child {
  width: 5rem;
  text-align: center;
}
select {
  width: 100%;
  min-width: 0;
}
small {
  display: block;
  color: #52675d;
  margin-top: 0.35rem;
}
input {
  width: 1.2rem;
  height: 1.2rem;
}
li {
  margin-block: 0.75rem;
}
.limitation {
  color: #91421f;
  margin: 0.25rem 0 0;
}
.reroll {
  margin-top: 1rem;
}
</style>
