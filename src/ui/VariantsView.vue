<script setup lang="ts">
import { computed } from 'vue'
import type { GameSession } from '../composables/useGameSession'
import type { Variants } from '../domain/types'

const props = defineProps<{ session: GameSession }>()
const variants = computed(() => props.session.configuration.value.variants)
const options = [
  { id: 'extendedStart', name: 'Extended Start' },
  { id: 'researchDrafting', name: 'Research drafting' },
] as const
function setVariant(id: keyof Variants, event: Event): void {
  if (event.target instanceof HTMLInputElement)
    props.session.dispatch({
      type: 'set-variant',
      id,
      enabled: event.target.checked,
    })
}
</script>

<template>
  <section aria-labelledby="variants-heading">
    <h2 id="variants-heading">Choose variants</h2>
    <p>These variants are available with any content selection.</p>
    <p v-if="!session.configurationEditable.value">
      Configuration is fixed for these selections. Return to setup to customize
      public choices.
    </p>
    <div class="bulk-actions" aria-label="Variant selection">
      <button
        type="button"
        :disabled="!session.configurationEditable.value"
        @click="session.dispatch({ type: 'select-variants', enabled: true })"
      >
        Select all
      </button>
      <button
        type="button"
        :disabled="!session.configurationEditable.value"
        @click="session.dispatch({ type: 'select-variants', enabled: false })"
      >
        Select none
      </button>
    </div>
    <fieldset :disabled="!session.configurationEditable.value">
      <legend>Variants</legend>
      <label v-for="option in options" :key="option.id" class="option">
        <input
          type="checkbox"
          :checked="variants[option.id]"
          @change="setVariant(option.id, $event)"
        />
        <span>{{ option.name }}</span>
      </label>
    </fieldset>
    <div class="navigation">
      <button type="button" @click="session.goBack">Back</button>
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
  justify-content: space-between;
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
.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.25rem;
  cursor: pointer;
}
.option input {
  width: 1.2rem;
  height: 1.2rem;
}
</style>
