<script setup lang="ts">
import type { GameSession } from '../composables/useGameSession'
import PublicSelections from './PublicSelections.vue'
import ObjectiveTable from './ObjectiveTable.vue'
import SelectionConflict from './SelectionConflict.vue'
import InstructionList from './InstructionList.vue'
import ConfigurationSummary from './ConfigurationSummary.vue'
defineProps<{ session: GameSession }>()
</script>

<template>
  <section aria-labelledby="setup-heading">
    <h2 id="setup-heading" tabindex="-1">Game setup</h2>
    <SelectionConflict
      v-if="session.conflict.value"
      :conflict="session.conflict.value"
      @return="session.returnToConfiguration"
    />
    <template v-if="session.selections.value.board && !session.conflict.value">
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
      <InstructionList :instructions="session.instructions.value" />
      <ConfigurationSummary
        :summary="session.summary.value"
        :data="session.data"
      />
    </template>
    <button data-dialog-focus-fallback type="button" @click="session.goBack">
      Back
    </button>
  </section>
</template>
