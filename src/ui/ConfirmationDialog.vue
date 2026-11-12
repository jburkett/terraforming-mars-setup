<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { ConfirmationDetails } from '../composables/useGameSession'
const props = defineProps<{ confirmation: ConfirmationDetails | null }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
let origin: HTMLElement | null = null
watch(
  () => props.confirmation,
  async (confirmation) => {
    await nextTick()
    if (confirmation) {
      if (!dialog.value?.open) {
        origin =
          globalThis.document.activeElement instanceof HTMLElement
            ? globalThis.document.activeElement
            : null
        dialog.value?.showModal()
      }
    } else {
      dialog.value?.close()
      if (origin) {
        const target =
          origin.isConnected && !origin.matches(':disabled')
            ? origin
            : globalThis.document.querySelector<HTMLElement>(
                '[data-dialog-focus-fallback]',
              )
        target?.focus()
      }
      origin = null
    }
  },
  { immediate: true },
)
</script>

<template>
  <dialog
    ref="dialog"
    aria-labelledby="confirmation-heading"
    aria-describedby="confirmation-message"
    @cancel.prevent="emit('cancel')"
  >
    <template v-if="confirmation">
      <h3 id="confirmation-heading">{{ confirmation.title }}</h3>
      <p id="confirmation-message">{{ confirmation.message }}</p>
      <ul>
        <li v-for="(loss, index) in confirmation.losses" :key="index">
          {{ loss }}
        </li>
      </ul>
      <p>
        Instructions describe the newly selected setup. Physical actions are not
        undone.
      </p>
      <div class="actions">
        <button type="button" autofocus @click="emit('cancel')">
          {{ confirmation.cancelLabel }}
        </button>
        <button type="button" @click="emit('confirm')">
          {{ confirmation.confirmLabel }}
        </button>
      </div>
    </template>
  </dialog>
</template>

<style scoped>
dialog {
  max-width: min(90vw, 36rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  border: 1px solid #aabdb3;
  border-radius: 0.75rem;
  padding: 1.5rem;
  color: inherit;
}
dialog::backdrop {
  background: #203c3266;
}
p,
li {
  line-height: 1.6;
}
li {
  margin-block: 0.5rem;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
