import { describe, expect, it } from 'vitest'
import { parseCatalogs } from '../../src/content/validation'
import { fixture } from '../helpers/catalog-fixture'

describe('catalog contract', () => {
  it('accepts a complete well-shaped catalog without changing its input', () => {
    const input = fixture()
    const before = structuredClone(input)
    expect(parseCatalogs(input)).toEqual(input)
    expect(input).toEqual(before)
  })
  it.each([
    [
      'wrong field type',
      (f: ReturnType<typeof fixture>) => {
        Reflect.set(f.boards[0]!, 'oceans', 'nine')
      },
    ],
    [
      'duplicate ID',
      (f: ReturnType<typeof fixture>) => {
        f.colonies[1]!.id = f.colonies[0]!.id
      },
    ],
    [
      'dangling reference',
      (f: ReturnType<typeof fixture>) => {
        f.boards[0]!.milestones[0] = 'missing'
      },
    ],
    [
      'unknown context',
      (f: ReturnType<typeof fixture>) => {
        f.instructions[0]!.context = 'eval-this'
      },
    ],
    [
      'source-qualified identity',
      (f: ReturnType<typeof fixture>) => {
        f.milestones[0]!.id = 'Terraformer'
      },
    ],
    [
      'missing citation',
      (f: ReturnType<typeof fixture>) => {
        f.awards[0]!.sources = []
      },
    ],
    [
      'executable extra property',
      (f: ReturnType<typeof fixture>) => {
        Reflect.set(f.instructions[0]!, 'condition', 'config.venus === true')
      },
    ],
  ])('rejects %s with a file/record diagnostic', (_, mutate) => {
    const input = fixture()
    mutate(input)
    expect(() => parseCatalogs(input)).toThrow(/\.json\[/)
  })
})

// Independent source evidence, not expected values copied from the JSON under test.
import { catalogs } from '../../src/content/catalogs'
import { boardRows, maNames, slug } from '../helpers/catalog-fixture'
import { readFileSync } from 'node:fs'

describe('approved sourced inventory', () => {
  it('contains exactly the seven named boards and their complete printed sets', () => {
    expect(catalogs.boards.map((b) => b.name)).toEqual(
      boardRows.map((row) => row[0]),
    )
    for (const [name, milestoneNames, awardNames] of boardRows) {
      const board = catalogs.boards.find((b) => b.id === slug(name!))!
      for (const kind of ['milestone', 'award'] as const) {
        const pool =
          kind === 'milestone' ? catalogs.milestones : catalogs.awards
        const ids = kind === 'milestone' ? board.milestones : board.awards
        expect(ids.map((id) => pool.find((o) => o.id === id)?.name)).toEqual(
          (kind === 'milestone' ? milestoneNames! : awardNames!).split('; '),
        )
      }
    }
  })
  it('has exactly the official MA and colony inventories, not an abbreviated list', () => {
    expect(
      catalogs.milestones.filter((o) => o.source === 'ma').map((o) => o.name),
    ).toEqual(maNames('milestone'))
    expect(
      catalogs.awards.filter((o) => o.source === 'ma').map((o) => o.name),
    ).toEqual(maNames('award'))
    expect(catalogs.colonies.map((c) => c.name)).toEqual(
      'Callisto Ceres Enceladus Europa Ganymede Io Luna Miranda Pluto Titan Triton'.split(
        ' ',
      ),
    )
    expect(
      catalogs.colonies
        .filter((c) => c.marker === 'inactive-picture')
        .map((c) => c.name)
        .sort(),
    ).toEqual(['Enceladus', 'Miranda', 'Titan'])
    expect(catalogs.expansions.map((e) => e.id)).toEqual([
      'ce',
      'venus',
      'prelude',
      'prelude2',
      'colonies',
      'turmoil',
      'ma',
    ])
    expect(
      catalogs.expansions.find((e) => e.id === 'prelude2')?.requires,
    ).toEqual(['prelude'])
  })
  it('keeps distinct identities, thresholds, fixed Venus pair and valid citations', () => {
    const values = new Map(
      catalogs.milestones.map((o) => [o.id, o.threshold.value]),
    )
    expect(values.get('printed:tharsis:milestone:builder')).toBe(8)
    expect(values.get('ma:milestone:builder')).toBe(7)
    expect(values.get('printed:elysium:milestone:tycoon')).toBe(15)
    expect(values.get('ma:milestone:tycoon')).toBe(10)
    expect(values.get('printed:amazonis-planitia:milestone:merchant')).toBe(3)
    expect(values.get('ma:milestone:merchant')).toBe(2)
    expect(
      catalogs.milestones
        .filter((o) => o.source === 'venus')
        .map((o) => o.name),
    ).toEqual(['Hoverlord'])
    expect(
      catalogs.awards.filter((o) => o.source === 'venus').map((o) => o.name),
    ).toEqual(['Venuphile'])
    expect(() => parseCatalogs(catalogs)).not.toThrow()
  })
  it('provides ordered sourced SU coverage and physical exceptions without executable data', () => {
    expect([...new Set(catalogs.instructions.map((i) => i.su))]).toEqual(
      Array.from(
        { length: 12 },
        (_, i) => `SU-${String(i + 1).padStart(2, '0')}`,
      ),
    )
    const text = catalogs.instructions.map((i) => i.text).join(' ')
    for (const phrase of [
      'Greens',
      'Coming',
      'Distant',
      '42 M€',
      '3 M€',
      '15 M€',
      'eleven oceans',
      'separate facedown',
      'physical',
    ])
      expect(text).toContain(phrase)
    expect(
      catalogs.instructions
        .filter((i) => i.su === 'SU-06')
        .some((i) => i.context === 'prelude2'),
    ).toBe(true)
    expect(
      catalogs.instructions.some((i) =>
        i.sources.some((s) => s.kind === 'product' && s.section.includes('R1')),
      ),
    ).toBe(true)
    expect(catalogs.instructions.every((i) => i.sources.length > 0)).toBe(true)
  })
  it('freezes every nested catalog value and has no Vue/domain execution in data modules', () => {
    const frozen = (value: unknown): boolean =>
      value === null ||
      typeof value !== 'object' ||
      (Object.isFrozen(value) && Object.values(value).every(frozen))
    expect(frozen(catalogs)).toBe(true)
    expect(
      readFileSync(
        new URL('../../src/content/catalogs.ts', import.meta.url),
        'utf8',
      ),
    ).not.toMatch(/from ['"]vue/)
  })
})
