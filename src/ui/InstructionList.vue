<script setup lang="ts">
import type { InstructionDefinition } from '../content/types'
defineProps<{ instructions: readonly InstructionDefinition[] }>()
</script>

<template>
  <section aria-labelledby="instructions-heading" class="physical-instructions">
    <h3 id="instructions-heading">Physical setup instructions</h3>
    <ol aria-label="Setup instructions">
      <li
        v-for="step in instructions"
        :key="step.id"
        :data-su="step.su"
        :data-instruction-id="step.id"
      >
        <p>
          <strong class="su">{{ step.su }}</strong> {{ step.text }}
        </p>
        <ul class="sources" :aria-label="`Sources for ${step.id}`">
          <li
            v-for="(source, index) in step.sources"
            :key="index"
            data-instruction-source
          >
            {{ source.kind === 'rules' ? 'Rules' : 'Product decision' }} ·
            {{ source.id }} · {{ source.section }}
          </li>
        </ul>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.physical-instructions {
  margin-top: 2.5rem;
}
ol {
  padding-left: 1.6rem;
}
ol > li {
  padding-left: 0.5rem;
  margin-block: 1.5rem;
}
p {
  line-height: 1.7;
  margin-bottom: 0.5rem;
}
.su {
  display: inline-block;
  font-size: 0.8rem;
  color: #315f50;
  margin-right: 0.5rem;
}
.sources {
  list-style: none;
  padding: 0;
  color: #52675d;
  font-size: 0.8rem;
}
.sources li {
  line-height: 1.5;
  margin-top: 0.25rem;
}
</style>
