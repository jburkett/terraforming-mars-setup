export const BOARD_IDS = [
  'tharsis',
  'hellas',
  'elysium',
  'utopia-planitia',
  'terra-cimmeria',
  'amazonis-planitia',
  'vastitas-borealis',
] as const
export const EXPANSION_IDS = [
  'ce',
  'venus',
  'prelude',
  'prelude2',
  'colonies',
  'turmoil',
  'ma',
] as const
export const COLONY_IDS = [
  'callisto',
  'ceres',
  'enceladus',
  'europa',
  'ganymede',
  'io',
  'luna',
  'miranda',
  'pluto',
  'titan',
  'triton',
] as const
export const SOURCE_IDS = [
  'B',
  'P',
  'P2',
  'V',
  'C',
  'T',
  'HE',
  'UC',
  'AV',
  'MA',
  'K',
  'SPEC',
] as const
export const SU_IDS = [
  'SU-01',
  'SU-02',
  'SU-03',
  'SU-04',
  'SU-05',
  'SU-06',
  'SU-07',
  'SU-08',
  'SU-09',
  'SU-10',
  'SU-11',
  'SU-12',
] as const
export const INSTRUCTION_CONTEXTS = [
  'always',
  'standard-map',
  'amazonis',
  'turmoil',
  'venus',
  'colonies',
  'ma-on',
  'ma-off',
  'ce-on',
  'ce-off',
  'prelude',
  'prelude2',
  'printed-tharsis-turmoil',
  'prelude-normal-start',
  'prelude-extended-start',
  'extended-start-on',
  'extended-start-off',
  'map-without-volcanoes',
  'outer-maps-without-turmoil',
  'cimmeria-without-colonies',
] as const
export const THRESHOLD_CONTEXTS = [
  'physical',
  'fixed',
  'generalist-production',
  'tharsis-terraformer',
] as const
export type BoardId = (typeof BOARD_IDS)[number]
export type ExpansionId = (typeof EXPANSION_IDS)[number]
export type ColonyId = (typeof COLONY_IDS)[number]
export type SuId = (typeof SU_IDS)[number]
export type Five<T> = readonly [T, T, T, T, T]
export type NonEmpty<T> = readonly [T, ...T[]]
export interface SourceReference {
  readonly kind: 'rules' | 'product'
  readonly id: (typeof SOURCE_IDS)[number]
  readonly section: string
}
interface Sourced {
  readonly sources: NonEmpty<SourceReference>
}
export interface BoardDefinition extends Sourced {
  readonly id: BoardId
  readonly name: string
  readonly hasVolcanoes: boolean
  readonly oceans: 9 | 11
  readonly extraCityGreeneryTiles: 0 | 13
  readonly standardProjectTile: boolean
  readonly milestones: Five<string>
  readonly awards: Five<string>
}
export interface ExpansionDefinition extends Sourced {
  readonly id: ExpansionId
  readonly name: string
  readonly requires: readonly ExpansionId[]
}
export interface ColonyDefinition extends Sourced {
  readonly id: ColonyId
  readonly name: string
  readonly marker: 'inactive-picture' | 'second-position'
}
export interface ThresholdDefinition {
  readonly context: (typeof THRESHOLD_CONTEXTS)[number]
  readonly value: number | null
  readonly unit: string
  readonly text: string
}
export interface ObjectiveDefinition extends Sourced {
  readonly id: string
  readonly name: string
  readonly kind: 'milestone' | 'award'
  readonly source: 'printed' | 'ma' | 'venus'
  readonly boardId: BoardId | null
  readonly requires: readonly ExpansionId[]
  readonly excludedBoards: readonly BoardId[]
  readonly threshold: ThresholdDefinition
}
export interface InstructionDefinition extends Sourced {
  readonly id: string
  readonly su: SuId
  readonly order: number
  readonly context: (typeof INSTRUCTION_CONTEXTS)[number]
  readonly text: string
  readonly quantities: Readonly<Record<string, number>>
}
export interface Catalogs {
  readonly boards: readonly BoardDefinition[]
  readonly expansions: readonly ExpansionDefinition[]
  readonly colonies: readonly ColonyDefinition[]
  readonly milestones: readonly ObjectiveDefinition[]
  readonly awards: readonly ObjectiveDefinition[]
  readonly instructions: readonly InstructionDefinition[]
}
export const CATALOG_FILES = [
  'boards',
  'expansions',
  'colonies',
  'milestones',
  'awards',
  'instructions',
] as const
