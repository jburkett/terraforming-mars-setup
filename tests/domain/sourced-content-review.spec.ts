import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
const reference = readFileSync(
  new URL(
    '../../specs/001-guided-game-setup/rules-reference.md',
    import.meta.url,
  ),
  'utf8',
)
const rows = reference
  .split('\n')
  .filter((line) => line.startsWith('|'))
  .map((line) =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim()),
  )
it('matches every printed map set to the approved sourced inventory', () => {
  expect(catalogs.boards).toHaveLength(7)
  for (const board of catalogs.boards) {
    const row = rows.find((cells) => cells[0] === board.name)
    expect(row, board.name).toBeDefined()
    for (const [column, kind] of [
      [1, 'milestones'],
      [2, 'awards'],
    ] as const) {
      const expected = row![column]!.split(';').map((name) => name.trim())
      const actual = board[kind].map(
        (id) => catalogs[kind].find((o) => o.id === id)?.name,
      )
      expect(actual).toHaveLength(5)
      expect(new Set(actual)).toEqual(new Set(expected))
    }
    expect(board.oceans).toBe(board.id === 'amazonis-planitia' ? 11 : 9)
    expect(board.extraCityGreeneryTiles).toBe(
      board.id === 'amazonis-planitia' ? 13 : 0,
    )
    expect(board.hasVolcanoes).toBe(
      !['hellas', 'utopia-planitia'].includes(board.id),
    )
  }
})
it('matches MA 35/35 and all 11 public colony names and inactive markers to the source packet', () => {
  for (const [noun, kind] of [
    ['milestone', 'milestones'],
    ['award', 'awards'],
  ] as const) {
    const line = reference.match(
      new RegExp(`\\*\\*35 ${noun} tiles:\\*\\* ([^\\n]+)`),
    )?.[1]
    expect(line).toBeDefined()
    const expected = line!
      .replace(/\.$/, '')
      .split(';')
      .map((name) => name.trim())
    const actual = catalogs[kind]
      .filter((o) => o.source === 'ma')
      .map((o) => o.name)
    expect(actual).toHaveLength(35)
    expect(new Set(actual)).toEqual(new Set(expected))
  }
  const colonyNames = reference
    .match(/The 11 official candidates are (.+?)\./)?.[1]
    ?.split(',')
    .map((name) => name.trim())
  expect(catalogs.colonies).toHaveLength(11)
  expect(new Set(catalogs.colonies.map((tile) => tile.name))).toEqual(
    new Set(colonyNames),
  )
  expect(
    catalogs.colonies
      .filter((tile) => tile.marker === 'inactive-picture')
      .map((tile) => tile.name)
      .sort(),
  ).toEqual(['Enceladus', 'Miranda', 'Titan'])
})
it('retains the approved SU quantities and physical branch distinctions', () => {
  const expected: Record<string, Record<string, number>> = {
    'su-02-1': { generation: 1, oxygen: 0, temperature: -30, tr: 20 },
    'su-02-2': { oceans: 9 },
    'su-02-3': { oceans: 11, extraCityGreeneryTiles: 13 },
    'su-03-1': { lobbyDelegatesPerPlayer: 1, reserveDelegatesPerPlayer: 6 },
    'su-04-1': { venus: 0 },
    'su-04-2': { fleetsPerPlayer: 1, ordinaryMarkerPosition: 2 },
    'su-05-1': { milestones: 5, awards: 5 },
    'su-05-2': { milestones: 5, awards: 5 },
    'su-05-4': { printedTharsisTerraformer: 26, maTerraformer: 29 },
    'su-07-1': { production: 0 },
    'su-07-2': { production: 1 },
    'su-07-3': { beginnerCredits: 42, beginnerFreeProjects: 10 },
    'su-08-1': { projectsPerOrdinaryPlayer: 10 },
    'su-08-2': { corporations: 2 },
    'su-08-3': { corporations: 3 },
    'su-08-4': { preludes: 4, keep: 2 },
    'su-08-5': { preludes: 6, keep: 2 },
    'su-09-1': { projectCost: 3 },
    'su-11-1': { resolvePreludes: 2 },
    'su-11-2': { unplayablePreludeCredits: 15 },
  }
  for (const [id, quantities] of Object.entries(expected))
    expect(
      catalogs.instructions.find((step) => step.id === id)?.quantities,
      id,
    ).toEqual(quantities)
  expect(catalogs.instructions).toHaveLength(32)
  expect(new Set(catalogs.instructions.map((step) => step.su)).size).toBe(12)
})
it('registers every rules citation and distinguishes approved product decisions', () => {
  const registered = new Set(
    rows.filter((row) => row[1]?.includes('https://')).map((row) => row[0]),
  )
  for (const record of [
    ...catalogs.boards,
    ...catalogs.expansions,
    ...catalogs.colonies,
    ...catalogs.milestones,
    ...catalogs.awards,
    ...catalogs.instructions,
  ])
    for (const source of record.sources) {
      expect(source.section.trim().length).toBeGreaterThan(0)
      if (source.kind === 'rules')
        expect(registered.has(source.id), source.id).toBe(true)
      else expect(source.id).toBe('SPEC')
    }
  for (const [id, decision] of [
    ['su-05-2', 'R1'],
    ['su-04-1', 'R2'],
    ['su-06-1', 'R3'],
  ]) {
    expect(
      catalogs.instructions
        .find((step) => step.id === id)
        ?.sources.some(
          (source) =>
            source.kind === 'product' &&
            source.id === 'SPEC' &&
            source.section.includes(decision!),
        ),
      decision,
    ).toBe(true)
  }
})
