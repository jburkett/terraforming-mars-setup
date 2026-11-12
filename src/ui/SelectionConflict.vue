<script setup lang="ts">
import type { SelectionConflict } from '../domain/types'
defineProps<{ conflict: SelectionConflict }>()
const emit = defineEmits<{ return: [] }>()
</script>

<template>
  <section
    class="selection-conflict"
    role="alert"
    aria-label="Selection conflict"
  >
    <h3>Unable to complete public selections</h3>
    <p>{{ conflict.message }}</p>
    <p>
      No choices or locks were discarded. Review the game configuration before
      trying again.
    </p>
    <button type="button" @click="emit('return')">
      Return to configuration
    </button>
  </section>
</template>

<style scoped>
.selection-conflict {
  border: 1px solid #b97b52;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-block: 1rem;
  background: #fff8ef;
}
</style>
