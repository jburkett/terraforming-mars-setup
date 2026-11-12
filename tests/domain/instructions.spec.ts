import { describe, expect, it } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
import type { BoardId, ExpansionId } from '../../src/content/types'
import type { Configuration } from '../../src/domain/types'
import {
  initialConfiguration,
  updateConfiguration,
} from '../../src/domain/configuration'
import { seeded } from '../helpers/public-selection-api'
import {
  applicableInstructions,
  projectInstructions,
} from '../helpers/setup-api'

function config(
  content: readonly ExpansionId[],
  board: BoardId = 'tharsis',
  extendedStart = false,
): Configuration {
  return {
    ...initialConfiguration(),
    enabledContent: content,
    expandedBoards: true,
    boardCandidates: [board],
    variants: { extendedStart, researchDrafting: false },
  }
}
function projected(c: Configuration) {
  return projectInstructions(c, seeded(c))
}
function text(c: Configuration) {
  return projected(c)
    .map((i) => i.text)
    .join('\n')
}
function step(c: Configuration, id: string) {
  return projected(c).find((i) => i.id === id)
}

describe('instruction context', () => {
  it('base game omits off-expansion contexts and uses CE-off/ordinary/printed variants', () => {
    const c = config([])
    const ids = applicableInstructions(c, seeded(c)).map((i) => i.id)
    expect(ids).toContain('su-07-2')
    expect(ids).toContain('su-08-2')
    expect(ids).toContain('su-05-2')
    for (const id of [
      'su-03-1',
      'su-04-1',
      'su-04-2',
      'su-06-4',
      'su-10-1',
      'su-11-1',
      'su-08-4',
      'su-08-5',
    ])
      expect(ids).not.toContain(id)
  })
  it('all content selects expansion contexts and extended six-Prelude deal', () => {
    const c = initialConfiguration()
    const ids = applicableInstructions(c, seeded(c)).map((i) => i.id)
    for (const id of [
      'su-03-1',
      'su-04-1',
      'su-04-2',
      'su-05-1',
      'su-05-3',
      'su-06-5',
      'su-07-1',
      'su-08-3',
      'su-08-5',
      'su-10-1',
      'su-11-2',
    ])
      expect(ids).toContain(id)
    expect(ids).not.toContain('su-05-4')
    expect(ids).not.toContain('su-08-4')
  })
  it.each(['hellas', 'utopia-planitia'] as const)(
    'no-volcano reminders apply on %s without forcing expansions',
    (board) => {
      const c = config([], board)
      expect(
        applicableInstructions(c, seeded(c)).some(
          (i) => i.context === 'map-without-volcanoes',
        ),
      ).toBe(true)
    },
  )
  it.each(['amazonis-planitia', 'vastitas-borealis'] as const)(
    'conditional delegate reminder applies on %s only without Turmoil',
    (board) => {
      const off = config([], board),
        on = config(['turmoil'], board)
      expect(
        applicableInstructions(off, seeded(off)).some(
          (i) => i.context === 'outer-maps-without-turmoil',
        ),
      ).toBe(true)
      expect(
        applicableInstructions(on, seeded(on)).some(
          (i) => i.context === 'outer-maps-without-turmoil',
        ),
      ).toBe(false)
    },
  )
  it('Cimmeria reminder and standard-map supply depend on the actual selected board', () => {
    const c = config([], 'terra-cimmeria')
    const ids = applicableInstructions(c, seeded(c)).map((i) => i.id)
    expect(ids).toContain('su-04-5')
    expect(ids).toContain('su-02-2')
    expect(ids).not.toContain('su-02-3')
  })
  it.each([2, 3, 4, 5] as const)(
    'quantities include %i fleets and per-player delegates',
    (playerCount) => {
      const c = { ...initialConfiguration(), playerCount }
      const result = applicableInstructions(c, seeded(c))
      expect(
        result.find((i) => i.context === 'colonies')?.quantities.fleets,
      ).toBe(playerCount)
      expect(
        result.find((i) => i.context === 'turmoil')?.quantities.lobbyDelegates,
      ).toBe(playerCount)
      expect(
        result.find((i) => i.context === 'turmoil')?.quantities
          .reserveDelegates,
      ).toBe(playerCount * 6)
    },
  )
})

describe('ordered physical instructions', () => {
  it('covers SU-01–12 in dependency order, even with shuffled input, and preserves evidence', () => {
    const c = initialConfiguration(),
      s = seeded(c)
    const result = projectInstructions(c, s, {
      ...catalogs,
      instructions: [...catalogs.instructions].reverse(),
    })
    expect([...new Set(result.map((i) => i.su))]).toEqual(
      Array.from(
        { length: 12 },
        (_, i) => `SU-${String(i + 1).padStart(2, '0')}`,
      ),
    )
    expect(
      result.every(
        (i) =>
          i.sources.length > 0 &&
          i.sources.every((source) => source.section.length > 0),
      ),
    ).toBe(true)
    expect(
      result
        .find((i) => i.id === 'su-05-1')
        ?.sources.some((s) => s.kind === 'product'),
    ).toBe(true)
    expect(result.findIndex((i) => i.id === 'su-06-5')).toBeLessThan(
      result.findIndex((i) => i.id === 'su-09-1'),
    )
    expect(result.findIndex((i) => i.su === 'SU-09')).toBeLessThan(
      result.findIndex((i) => i.su === 'SU-11'),
    )
  })
  it('identifies selected map/first player and physical decks for selected content', () => {
    const c = initialConfiguration(),
      s = { ...seeded(c), firstPlayer: 2 as const }
    const result = projectInstructions(c, s)
    expect(result.find((i) => i.su === 'SU-01')?.text).toMatch(/Tharsis.*2/)
    expect(result.find((i) => i.id === 'su-06-1')?.text).toMatch(/Prelude 2/)
    expect(text(c)).toMatch(/physically shuffle/)
  })
  it('base setup has nine oceans, initial tracks, ordinary corporations and the distinct Beginner branch', () => {
    const c = config([])
    expect(text(c)).toMatch(/nine oceans/)
    expect(text(c)).toMatch(
      /generation 1, oxygen 0%, temperature −30°C.*TR to 20/,
    )
    expect(step(c, 'su-07-2')?.quantities.production).toBe(1)
    expect(text(c)).toMatch(/exclude Corporate Era-marked/)
    expect(text(c)).toMatch(/Ordinary non-CE corporations remain available/)
    expect(text(c)).toMatch(/42 M€ and ten free starting projects/)
    expect(text(c)).toMatch(/ordinary corporations pay 3 M€/)
    expect(text(c)).not.toMatch(/Prepare a separate physical Prelude deck/)
  })
  it('CE includes marked cards and production zero before effects', () => {
    const c = config(['ce'])
    expect(step(c, 'su-07-1')?.quantities.production).toBe(0)
    expect(text(c)).toMatch(/Include Corporate Era-marked/)
    expect(text(c)).not.toMatch(/Set initial production to 1/)
  })
  it('Amazonis supplies eleven oceans and 13 extra tiles while Venus remains standard', () => {
    const c = config(['venus'], 'amazonis-planitia')
    expect(step(c, 'su-02-3')?.quantities).toEqual({
      oceans: 11,
      extraCityGreeneryTiles: 13,
    })
    expect(text(c)).toMatch(/Standard Project tile/)
    expect(text(c)).toMatch(/standard Venus board with its marker at 0/)
    expect(text(c)).not.toMatch(/nine oceans|longer Venus|WGT/)
  })
  it('selected colony markers include inactive pictures and ordinary second positions', () => {
    const c = config(['colonies']),
      s = {
        ...seeded(c),
        colonies: ['titan', 'enceladus', 'miranda', 'ceres', 'pluto'] as const,
      }
    const result = projectInstructions(c, s).find((i) => i.id === 'su-04-2')
    expect(result?.text).toMatch(/Titan:.*picture/)
    expect(result?.text).toMatch(/Enceladus:.*picture/)
    expect(result?.text).toMatch(/Miranda:.*picture/)
    expect(result?.text).toMatch(/Ceres:.*second position/)
    expect(result?.text).toMatch(/Pluto:.*second position/)
    expect(result?.text).toMatch(/qualifying resource-collecting card/)
  })
  it('Turmoil prepares physical events and delegates without executing gameplay', () => {
    const c = config(['turmoil']),
      t = step(c, 'su-03-1')?.text ?? ''
    for (const phrase of [
      'one of seven delegates',
      'six in reserve',
      'neutral chairman',
      'Coming and Distant',
      'same-party second delegate',
      'No Current event',
      'Greens policy',
    ])
      expect(t).toContain(phrase)
    expect(t).toMatch(/physically shuffle/)
  })
  it.each([false, true])(
    'Prelude deal follows Extended Start=%s without source quotas or opening draft',
    (extended) => {
      const c = config(['prelude'], 'tharsis', extended)
      const deal = step(c, extended ? 'su-08-5' : 'su-08-4')
      expect(deal?.quantities).toEqual({ preludes: extended ? 6 : 4, keep: 2 })
      expect(
        step(c, extended ? 'su-08-3' : 'su-08-2')?.quantities.corporations,
      ).toBe(extended ? 3 : 2)
      expect(text(c)).toMatch(/no purchase cost/)
      expect(text(c)).toMatch(/does not introduce an initial-hand draft/)
      expect(text(c)).toMatch(/no expansion-source corporation quotas/)
    },
  )
  it('Extended Start without Prelude changes only corporation deal; drafting never changes opening quantities', () => {
    const c = config([], 'tharsis', true)
    expect(step(c, 'su-08-3')?.quantities.corporations).toBe(3)
    expect(projected(c).some((i) => i.context.startsWith('prelude'))).toBe(
      false,
    )
    const drafting = updateConfiguration(c, {
      type: 'set-variant',
      id: 'researchDrafting',
      enabled: true,
    })
    expect(projected(drafting)).toEqual(projected(c))
  })
  it('P2 prepares separate discards before use and purchases before Prelude resolution/refund', () => {
    const c = initialConfiguration()
    expect(step(c, 'su-06-5')?.text).toMatch(
      /Before any discards.*separate facedown corporation and Prelude discard piles/,
    )
    expect(step(c, 'su-10-1')?.text).toMatch(/already prepared in SU-06/)
    expect(step(c, 'su-11-1')?.text).toMatch(
      /After all starting purchases.*player order before the first action phase/,
    )
    expect(step(c, 'su-11-2')?.quantities.unplayablePreludeCredits).toBe(15)
    expect(step(c, 'su-11-2')?.text).toMatch(/revealed and discarded for 15 M€/)
  })
  it('printed Tharsis/Turmoil overlay applies only with MA off and Venus additions stay fixed', () => {
    const c = config(['turmoil', 'venus'])
    expect(step(c, 'su-05-4')?.quantities.printedTharsisTerraformer).toBe(26)
    expect(text(c)).toMatch(/fixed Hoverlord milestone and Venuphile award/)
    expect(step(initialConfiguration(), 'su-05-4')).toBeUndefined()
  })
  it('is a pure projection: repeated reads preserve source state/catalogs and no selection exists before a board', () => {
    const c = initialConfiguration(),
      s = seeded(c),
      before = JSON.stringify({ c, s, catalogs })
    expect(projected(c).length).toBeGreaterThan(0)
    expect(projectInstructions(c, { ...s, board: null })).toEqual([])
    expect(JSON.stringify({ c, s, catalogs })).toBe(before)
    expect(projectInstructions(c, s)).toEqual(projectInstructions(c, s))
  })
})
