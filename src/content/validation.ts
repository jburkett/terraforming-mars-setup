import {
  BOARD_IDS,
  EXPANSION_IDS,
  COLONY_IDS,
  SOURCE_IDS,
  SU_IDS,
  INSTRUCTION_CONTEXTS,
  THRESHOLD_CONTEXTS,
  CATALOG_FILES,
} from './types.ts'
import type {
  BoardDefinition,
  ExpansionDefinition,
  ColonyDefinition,
  ObjectiveDefinition,
  InstructionDefinition,
  SourceReference,
  ThresholdDefinition,
  Catalogs,
} from './types.ts'

type Check = (value: unknown, path: string, errors: string[]) => void
const issue = (errors: string[], path: string, message: string) => {
  errors.push(`${path}: ${message}`)
}
const text: Check = (v, p, e) => {
  if (typeof v !== 'string' || !v.trim())
    issue(e, p, 'expected nonempty string')
}
const string: Check = (v, p, e) => {
  if (typeof v !== 'string') issue(e, p, 'expected string')
}
const boolean: Check = (v, p, e) => {
  if (typeof v !== 'boolean') issue(e, p, 'expected boolean')
}
const number: Check = (v, p, e) => {
  if (typeof v !== 'number' || !Number.isFinite(v))
    issue(e, p, 'expected finite number')
}
const integer: Check = (v, p, e) => {
  number(v, p, e)
  if (!Number.isSafeInteger(v) || Number(v) < 1)
    issue(e, p, 'expected positive safe integer')
}
const choice =
  (values: readonly unknown[]): Check =>
  (v, p, e) => {
    if (!values.includes(v)) issue(e, p, `expected one of ${values.join(', ')}`)
  }
const nullable =
  (check: Check): Check =>
  (v, p, e) => {
    if (v !== null) check(v, p, e)
  }
const array =
  (check: Check, min = 0, length?: number): Check =>
  (v, p, e) => {
    if (!Array.isArray(v)) {
      issue(e, p, 'expected array')
      return
    }
    if (v.length < min || (length !== undefined && v.length !== length))
      issue(e, p, `expected ${length ?? `at least ${min}`} entries`)
    v.forEach((item: unknown, i) => check(item, `${p}[${i}]`, e))
  }
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
const object =
  (shape: Record<string, Check>): Check =>
  (v, p, e) => {
    if (!isRecord(v)) {
      issue(e, p, 'expected object')
      return
    }
    for (const key of Object.keys(v))
      if (!Object.hasOwn(shape, key))
        issue(
          e,
          `${p}.${key}`,
          'unknown field; executable JSON is not supported',
        )
    for (const [key, check] of Object.entries(shape))
      check(v[key], `${p}.${key}`, e)
  }
const quantities: Check = (v, p, e) => {
  if (!isRecord(v)) {
    issue(e, p, 'expected numeric parameters')
    return
  }
  for (const [key, value] of Object.entries(v)) number(value, `${p}.${key}`, e)
}
const sources = array(
  object({
    kind: choice(['rules', 'product']),
    id: choice(SOURCE_IDS),
    section: text,
  } satisfies Record<keyof SourceReference, Check>),
  1,
)
const threshold = object({
  context: choice(THRESHOLD_CONTEXTS),
  value: nullable(number),
  unit: string,
  text,
} satisfies Record<keyof ThresholdDefinition, Check>)
const objective = object({
  id: text,
  name: text,
  kind: choice(['milestone', 'award']),
  source: choice(['printed', 'ma', 'venus']),
  boardId: nullable(choice(BOARD_IDS)),
  requires: array(choice(EXPANSION_IDS)),
  excludedBoards: array(choice(BOARD_IDS)),
  threshold,
  sources,
} satisfies Record<keyof ObjectiveDefinition, Check>)
const checks = {
  boards: array(
    object({
      id: choice(BOARD_IDS),
      name: text,
      hasVolcanoes: boolean,
      oceans: choice([9, 11]),
      extraCityGreeneryTiles: choice([0, 13]),
      standardProjectTile: boolean,
      milestones: array(text, 5, 5),
      awards: array(text, 5, 5),
      sources,
    } satisfies Record<keyof BoardDefinition, Check>),
    7,
    7,
  ),
  expansions: array(
    object({
      id: choice(EXPANSION_IDS),
      name: text,
      requires: array(choice(EXPANSION_IDS)),
      sources,
    } satisfies Record<keyof ExpansionDefinition, Check>),
    7,
    7,
  ),
  colonies: array(
    object({
      id: choice(COLONY_IDS),
      name: text,
      marker: choice(['inactive-picture', 'second-position']),
      sources,
    } satisfies Record<keyof ColonyDefinition, Check>),
    11,
    11,
  ),
  milestones: array(objective, 71, 71),
  awards: array(objective, 71, 71),
  instructions: array(
    object({
      id: text,
      su: choice(SU_IDS),
      order: integer,
      context: choice(INSTRUCTION_CONTEXTS),
      text,
      quantities,
      sources,
    } satisfies Record<keyof InstructionDefinition, Check>),
    12,
  ),
} satisfies Record<keyof Catalogs, Check>

export class CatalogValidationError extends Error {
  readonly diagnostics: readonly string[]
  constructor(diagnostics: readonly string[]) {
    super(diagnostics.join('\n'))
    this.name = 'CatalogValidationError'
    this.diagnostics = diagnostics
  }
}

export function parseCatalogs(input: unknown): Catalogs {
  const errors: string[] = []
  if (!isRecord(input))
    throw new CatalogValidationError(['catalogs: expected object'])
  for (const key of Object.keys(input))
    if (!CATALOG_FILES.includes(key as keyof Catalogs))
      issue(errors, 'catalogs', `unknown catalog ${key}`)
  for (const key of CATALOG_FILES)
    checks[key](input[key], `${key}.json`, errors)
  if (errors.length) throw new CatalogValidationError(errors)
  // All fields have been checked above; semantic checks below use the validated shape.
  const data = input as unknown as Catalogs
  const unique = (values: readonly string[], path: string) => {
    if (new Set(values).size !== values.length)
      issue(errors, path, 'duplicate ID/reference')
  }
  for (const key of CATALOG_FILES) {
    unique(
      data[key].map((r) => r.id),
      `${key}.json[IDs]`,
    )
    data[key].forEach((r, i) => {
      r.sources.forEach((s) => {
        if ((s.kind === 'product') !== (s.id === 'SPEC'))
          issue(
            errors,
            `${key}.json[${i}].sources`,
            'product decisions require SPEC; rule citations require a rules source',
          )
      })
    })
  }
  for (const [key, kind] of [
    ['milestones', 'milestone'],
    ['awards', 'award'],
  ] as const) {
    for (const source of ['ma', 'printed', 'venus']) {
      const expected = source === 'venus' ? 1 : 35
      if (data[key].filter((o) => o.source === source).length !== expected)
        issue(
          errors,
          `${key}.json[inventory]`,
          `expected ${expected} ${source} entries`,
        )
    }
    data[key].forEach((o, i) => {
      const path = `${key}.json[${i}]`
      const slug = o.name
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replace(/-$/, '')
      if (
        o.id !==
          `${o.source}:${o.boardId ? `${o.boardId}:` : ''}${kind}:${slug}` ||
        o.kind !== kind
      )
        issue(errors, path, 'identity must qualify source, board and kind')
      if ((o.source === 'printed') !== (o.boardId !== null))
        issue(errors, path, 'only printed objectives have a board owner')
      unique(o.requires, `${path}.requires`)
      unique(o.excludedBoards, `${path}.excludedBoards`)
      if ((o.threshold.context === 'physical') !== (o.threshold.value === null))
        issue(
          errors,
          `${path}.threshold`,
          'physical thresholds defer to source; numeric contexts need a value',
        )
      if (o.threshold.value !== null && o.threshold.value < 0)
        issue(errors, `${path}.threshold`, 'threshold cannot be negative')
    })
  }
  data.boards.forEach((b, i) => {
    for (const [key, kind] of [
      ['milestones', 'milestone'],
      ['awards', 'award'],
    ] as const) {
      unique(b[key], `boards.json[${i}].${key}`)
      for (const id of b[key])
        if (
          !data[key].some(
            (o) =>
              o.id === id &&
              o.kind === kind &&
              o.source === 'printed' &&
              o.boardId === b.id,
          )
        )
          issue(
            errors,
            `boards.json[${i}].${key}`,
            `invalid ${b.id} printed reference ${id}`,
          )
    }
    if (
      b.oceans !== (b.id === 'amazonis-planitia' ? 11 : 9) ||
      b.extraCityGreeneryTiles !== (b.id === 'amazonis-planitia' ? 13 : 0) ||
      b.standardProjectTile !== (b.id === 'amazonis-planitia')
    )
      issue(errors, `boards.json[${i}]`, 'map supply mismatch')
  })
  for (const e of data.expansions) {
    unique(e.requires, `expansions.json[${e.id}].requires`)
    const visit = (id: string, path: readonly string[]) => {
      if (path.includes(id)) {
        issue(errors, `expansions.json[${e.id}]`, 'cyclic prerequisite')
        return
      }
      data.expansions
        .find((x) => x.id === id)
        ?.requires.forEach((required) => visit(required, [...path, id]))
    }
    visit(e.id, [])
  }
  for (const su of SU_IDS)
    if (!data.instructions.some((r) => r.su === su))
      issue(errors, 'instructions.json[coverage]', `missing ${su}`)
  let previous = 0
  data.instructions.forEach((r, i) => {
    const rank = SU_IDS.indexOf(r.su) * 1000 + r.order
    if (r.order >= 1000 || rank <= previous)
      issue(
        errors,
        `instructions.json[${i}]`,
        'SU/order must be strictly increasing',
      )
    previous = rank
  })
  if (errors.length) throw new CatalogValidationError(errors)
  return data
}
