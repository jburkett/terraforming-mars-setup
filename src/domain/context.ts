import type {
  BoardId,
  ExpansionId,
  ObjectiveDefinition,
} from '../content/types'
export interface RuleContext {
  readonly boardId: BoardId
  readonly enabledContent: readonly ExpansionId[]
}
export interface ResolvedThreshold {
  readonly value: number
  readonly unit: string
  readonly text: string
}
export interface ObjectiveContext {
  readonly objective: ObjectiveDefinition
  readonly threshold: ResolvedThreshold | null
  readonly limitations: readonly ExpansionId[]
}

export function missingPrerequisites(
  required: readonly ExpansionId[],
  enabled: readonly ExpansionId[],
): readonly ExpansionId[] {
  return [...new Set(required)].filter((id) => !enabled.includes(id))
}

export function isEligibleObjective(
  objective: ObjectiveDefinition,
  context: RuleContext,
): boolean {
  // R1 deliberately keeps every printed identity, even when unattainable.
  if (objective.source === 'printed') return true
  return (
    !objective.excludedBoards.includes(context.boardId) &&
    missingPrerequisites(objective.requires, context.enabledContent).length ===
      0
  )
}

export function objectiveContext(
  objective: ObjectiveDefinition,
  context: RuleContext,
): ObjectiveContext {
  const definition = objective.threshold
  let threshold: ResolvedThreshold | null = null
  if (definition.context !== 'physical' && definition.value !== null) {
    let value = definition.value
    if (definition.context === 'generalist-production')
      value = context.enabledContent.includes('ce') ? 1 : 2
    if (
      definition.context === 'tharsis-terraformer' &&
      objective.source === 'printed' &&
      objective.boardId === 'tharsis' &&
      context.enabledContent.includes('turmoil')
    )
      value = 26
    threshold = {
      value,
      unit: definition.unit,
      text: `${objective.name}: ${value} ${definition.unit}.`,
    }
  }
  return {
    objective,
    threshold,
    limitations:
      objective.source === 'printed'
        ? missingPrerequisites(objective.requires, context.enabledContent)
        : [],
  }
}

export function fixedVenusObjectives(
  objectives: readonly ObjectiveDefinition[],
  context: RuleContext,
): readonly ObjectiveDefinition[] {
  return context.enabledContent.includes('venus')
    ? objectives.filter((o) => o.source === 'venus')
    : []
}
