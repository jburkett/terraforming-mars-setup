import { readFileSync } from 'node:fs'

export const evidence = readFileSync(
  new URL(
    '../../specs/001-guided-game-setup/rules-reference.md',
    import.meta.url,
  ),
  'utf8',
)
export const slug = (name: string) =>
  name
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '')
export const boardRows = evidence
  .split('\n')
  .filter((line) =>
    /^\| (Tharsis|Hellas|Elysium|Utopia Planitia|Terra Cimmeria|Amazonis Planitia|Vastitas Borealis) \|/.test(
      line,
    ),
  )
  .map((line) =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim()),
  )
export function maNames(kind: 'milestone' | 'award'): string[] {
  const line = evidence
    .split('\n')
    .find((value) => value.startsWith(`**35 ${kind} tiles:**`))!
  return line.split('**')[2]!.trim().replace(/\.$/, '').split('; ')
}
export function fixture() {
  const citation = [{ kind: 'rules', id: 'B', section: 'pp. 4–7' }]
  const objective = (
    name: string,
    kind: string,
    source: string,
    boardId: string | null = null,
  ) => ({
    id: `${source}:${boardId ? `${boardId}:` : ''}${kind}:${slug(name)}`,
    name,
    kind,
    source,
    boardId,
    requires: [] as string[],
    excludedBoards: [] as string[],
    threshold: {
      context: 'physical',
      value: null,
      unit: '',
      text: 'Use the source-specific physical objective.',
    },
    sources: structuredClone(citation),
  })
  const printed = boardRows.flatMap(([name, milestones, awards]) =>
    ['milestone', 'award'].flatMap((kind) =>
      (kind === 'milestone' ? milestones! : awards!)
        .split('; ')
        .map((title) => objective(title, kind, 'printed', slug(name!))),
    ),
  )
  const fixed = ['milestone', 'award'].map((kind) => ({
    ...objective(
      kind === 'milestone' ? 'Hoverlord' : 'Venuphile',
      kind,
      'venus',
    ),
    requires: ['venus'],
  }))
  const ma = ['milestone', 'award'].flatMap((kind) =>
    maNames(kind as 'milestone' | 'award').map((name) =>
      objective(name, kind, 'ma'),
    ),
  )
  const objectives = [...printed, ...fixed, ...ma]
  return {
    boards: boardRows.map(([name]) => ({
      id: slug(name!),
      name: name!,
      hasVolcanoes: !['Hellas', 'Utopia Planitia'].includes(name!),
      oceans: name === 'Amazonis Planitia' ? 11 : 9,
      extraCityGreeneryTiles: name === 'Amazonis Planitia' ? 13 : 0,
      standardProjectTile: name === 'Amazonis Planitia',
      milestones: printed
        .filter((o) => o.boardId === slug(name!) && o.kind === 'milestone')
        .map((o) => o.id),
      awards: printed
        .filter((o) => o.boardId === slug(name!) && o.kind === 'award')
        .map((o) => o.id),
      sources: structuredClone(citation),
    })),
    expansions: [
      'ce',
      'venus',
      'prelude',
      'prelude2',
      'colonies',
      'turmoil',
      'ma',
    ].map((id) => ({
      id,
      name: id,
      requires: id === 'prelude2' ? ['prelude'] : [],
      sources: structuredClone(citation),
    })),
    colonies:
      'Callisto Ceres Enceladus Europa Ganymede Io Luna Miranda Pluto Titan Triton'
        .split(' ')
        .map((name) => ({
          id: slug(name),
          name,
          marker: ['Titan', 'Enceladus', 'Miranda'].includes(name)
            ? 'inactive-picture'
            : 'second-position',
          sources: structuredClone(citation),
        })),
    milestones: objectives.filter((o) => o.kind === 'milestone'),
    awards: objectives.filter((o) => o.kind === 'award'),
    instructions: Array.from({ length: 12 }, (_, i) => ({
      id: `su-${i + 1}-fixture`,
      su: `SU-${String(i + 1).padStart(2, '0')}`,
      order: 1,
      context: 'always',
      text: 'Prepare the physical components.',
      quantities: {},
      sources: structuredClone(citation),
    })),
  }
}
