<script setup lang="ts">
import { computed } from 'vue'
import { useGameSession } from './composables/useGameSession'
import ExpansionsView from './ui/ExpansionsView.vue'
import VariantsView from './ui/VariantsView.vue'
import SetupView from './ui/SetupView.vue'

const session = useGameSession()
const view = computed(() => session.view.value)
const steps = [
  { id: 'expansions', name: 'Content' },
  { id: 'variants', name: 'Variants' },
  { id: 'setup', name: 'Setup' },
] as const
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <p class="eyebrow">Terraforming Mars</p>
      <h1>Prepare your game</h1>
      <p class="intro">Your table. Your game.</p>
    </header>
    <ol class="steps" aria-label="Setup steps">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        :aria-current="view === step.id ? 'step' : undefined"
      >
        <span class="step-number" aria-hidden="true">{{ index + 1 }}</span>
        {{ step.name }}
      </li>
    </ol>
    <main class="configuration-card">
      <ExpansionsView v-if="view === 'expansions'" :session="session" />
      <VariantsView v-else-if="view === 'variants'" :session="session" />
      <SetupView v-else :session="session" />
    </main>
  </div>
</template>

<style>
:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #203c32;
  background: #f5f3ed;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
button,
select,
input {
  font: inherit;
}
button,
select {
  min-height: 2.75rem;
  border: 1px solid #aabdb3;
  border-radius: 0.5rem;
  background: #fff;
  color: #203c32;
  padding: 0.6rem 1rem;
}
button {
  font-weight: 600;
  cursor: pointer;
}
button:hover {
  background: #eef3ef;
}
button.primary {
  background: #a84930;
  color: #fff;
  border-color: #a84930;
}
button.primary:hover {
  background: #8b3925;
}
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid #315f50;
  outline-offset: 3px;
}
input {
  accent-color: #315f50;
}
h1,
h2 {
  letter-spacing: -0.025em;
}
h1 {
  margin: 0.5rem 0;
  font-size: clamp(2rem, 5vw, 3rem);
}
h2 {
  margin-top: 0;
  font-size: 1.5rem;
}
p {
  line-height: 1.6;
}
.app-shell {
  max-width: 60rem;
  padding: 2.5rem 1.25rem;
  margin: auto;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.8rem;
  font-weight: 700;
  color: #597468;
  margin: 0;
}
.intro {
  color: #5b6f65;
  margin: 0;
}
.steps {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 2rem 0;
}
.steps li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64786d;
}
.step-number {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border: 1px solid #aabdb3;
  border-radius: 50%;
  font-size: 0.85rem;
}
.steps li[aria-current='step'] {
  color: #203c32;
  font-weight: 700;
}
.steps li[aria-current='step'] .step-number {
  background: #315f50;
  color: white;
  border-color: #315f50;
}
.configuration-card {
  background: #fff;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border: 1px solid #dde4dd;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 2rem #203c3208;
}
@media (max-width: 30rem) {
  .app-shell {
    padding: 1.5rem 0.75rem;
  }
  .steps {
    gap: 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
