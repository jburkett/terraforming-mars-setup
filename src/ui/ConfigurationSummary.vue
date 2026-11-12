<script setup lang="ts">
import { computed } from 'vue'
import { catalogs } from '../content/catalogs'
import type { Catalogs } from '../content/types'
import type { ObjectiveContext } from '../domain/context'
import type { ConfigurationSummary } from '../domain/summary'
const props = defineProps<{ summary: ConfigurationSummary; data?: Catalogs }>()
const data = computed(() => props.data ?? catalogs)
const missing = (entry: ObjectiveContext) =>
  entry.limitations
    .map((id) => data.value.expansions.find((e) => e.id === id)?.name ?? id)
    .join(', ')
function source(entry: ObjectiveContext): string {
  switch (entry.objective.source) {
    case 'printed':
      return `Printed · ${props.summary.board?.name ?? ''}`
    case 'ma':
      return 'Milestones & Awards · replacement'
    case 'venus':
      return 'Venus Next · fixed'
  }
}
</script>

<template>
  <section aria-labelledby="summary-heading" class="configuration-summary">
    <h3 id="summary-heading">Configuration summary</h3>
    <dl>
      <div>
        <dt>Players</dt>
        <dd data-summary-field="playerCount">{{ summary.playerCount }}</dd>
      </div>
      <div>
        <dt>First-player number</dt>
        <dd data-summary-field="firstPlayer">
          {{ summary.firstPlayer ?? 'Not generated' }}
        </dd>
      </div>
      <div>
        <dt>Board</dt>
        <dd data-summary-field="board">
          {{ summary.board?.name ?? 'Not generated' }}
        </dd>
      </div>
      <div>
        <dt>Enabled content</dt>
        <dd data-summary-field="content">
          <ul v-if="summary.content.length">
            <li v-for="entry in summary.content" :key="entry.id">
              {{ entry.name }}
            </li>
          </ul>
          <template v-else>Base game only</template>
        </dd>
      </div>
      <div>
        <dt>Extended Start</dt>
        <dd data-summary-field="extendedStart">
          {{ summary.variants.extendedStart ? 'On' : 'Off' }}
        </dd>
      </div>
      <div>
        <dt>Research drafting</dt>
        <dd data-summary-field="researchDrafting">
          {{ summary.variants.researchDrafting ? 'On' : 'Off' }}
        </dd>
      </div>
      <div>
        <dt>Colony tiles</dt>
        <dd data-summary-field="colonies">
          <ul v-if="summary.colonies.length">
            <li v-for="tile in summary.colonies" :key="tile.id">
              {{ tile.name }}
            </li>
          </ul>
          <template v-else>Not enabled</template>
        </dd>
      </div>
    </dl>
    <div class="objective-summary">
      <div v-for="kind in ['milestones', 'awards'] as const" :key="kind">
        <h4>{{ kind === 'milestones' ? 'Milestones' : 'Awards' }}</h4>
        <ul>
          <li
            v-for="entry in summary[kind]"
            :key="entry.objective.id"
            :data-summary-objective-id="entry.objective.id"
          >
            {{ entry.threshold?.text ?? entry.objective.name }}
            <small>{{ source(entry) }}</small>
            <p v-if="entry.limitations.length" class="limitation">
              {{ entry.objective.name }} is unattainable: requires
              {{ missing(entry) }}.
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.configuration-summary {
  margin-block: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dde4dd;
}
dl {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1.5rem;
}
dt {
  font-weight: 650;
  margin-bottom: 0.35rem;
}
dd {
  margin: 0;
}
ul {
  padding-left: 1.25rem;
  margin-top: 0;
}
li {
  line-height: 1.6;
}
.objective-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1.5rem;
}
.objective-summary li {
  margin-bottom: 0.75rem;
}
small {
  display: block;
  color: #52675d;
}
.limitation {
  color: #91421f;
  margin: 0.25rem 0 0;
}
</style>
