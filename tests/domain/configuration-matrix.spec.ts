import { afterAll, describe, expect, it } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
import { BOARD_IDS, EXPANSION_IDS } from '../../src/content/types'
import type { BoardId, ExpansionId } from '../../src/content/types'
import type {
  Configuration,
  PlayerCount,
  PublicSelections,
} from '../../src/domain/types'
import type { ConfigurationAction } from '../../src/domain/configuration'
import {
  generateMissingSelections,
  emptySelections,
} from '../../src/domain/selections'
import type { SelectionResult } from '../../src/domain/selections'
import { customizeSelections } from '../../src/domain/customization'
import { objectiveSets } from '../../src/domain/objectives'
import { projectInstructions } from '../../src/domain/instructions'
import { projectSummary } from '../../src/domain/summary'
import { previewEdit, commitEdit, cancelEdit } from '../../src/domain/edits'
import { previewReset, commitReset, cancelReset } from '../../src/domain/reset'

const counts = [2, 3, 4, 5] as const
// Enumerate valid content sets independently of production normalization (P2 implies P).
const contentSets = Array.from({ length: 128 }, (_, mask) =>
  EXPANSION_IDS.filter((_, bit) => (mask & (1 << bit)) !== 0),
).filter((ids) => !ids.includes('prelude2') || ids.includes('prelude'))
const catalogBefore = JSON.stringify(catalogs)
afterAll(() => expect(JSON.stringify(catalogs)).toBe(catalogBefore))
function source(seed: number) {
  let state = seed || 1,
    draws = 0
  return {
    next: () => {
      draws++
      state ^= state << 13
      state ^= state >>> 17
      state ^= state << 5
      return state >>> 0
    },
    get draws() {
      return draws
    },
  }
}
function config(
  n: PlayerCount,
  board: BoardId,
  enabledContent: readonly ExpansionId[],
  flags = 0,
): Configuration {
  const result: Configuration = {
    playerCount: n,
    expandedBoards: true,
    boardCandidates: [board],
    enabledContent,
    variants: {
      extendedStart: Boolean(flags & 1),
      researchDrafting: Boolean(flags & 2),
    },
  }
  Object.freeze(result.enabledContent)
  Object.freeze(result.boardCandidates)
  Object.freeze(result.variants)
  return Object.freeze(result)
}
function value(result: SelectionResult, context = ''): PublicSelections {
  expect(result.ok, context).toBe(true)
  if (!result.ok) throw new Error(`${context}: ${result.conflict.message}`)
  return result.selections
}
function freeze(selections: PublicSelections): PublicSelections {
  for (const kind of ['milestones', 'awards'] as const) {
    selections[kind]?.forEach((row) => Object.freeze(row))
    if (selections[kind]) Object.freeze(selections[kind])
  }
  if (selections.colonies) Object.freeze(selections.colonies)
  return Object.freeze(selections)
}
function publicInvariants(c: Configuration, s: PublicSelections) {
  expect(c.boardCandidates.some((id) => id === s.board)).toBe(true)
  expect(
    Number.isInteger(s.firstPlayer) &&
      s.firstPlayer! >= 1 &&
      s.firstPlayer! <= c.playerCount,
  ).toBe(true)
  const count = c.playerCount <= 3 ? 5 : c.playerCount + 2
  if (c.enabledContent.includes('colonies')) {
    expect(s.colonies).toHaveLength(count)
    expect(new Set(s.colonies).size).toBe(count)
    expect(
      s.colonies?.every((id) =>
        catalogs.colonies.some((tile) => tile.id === id),
      ),
    ).toBe(true)
  } else expect(s.colonies).toBeNull()
  const sets = objectiveSets(c, s)
  for (const kind of ['milestones', 'awards'] as const) {
    expect(sets[kind]).toHaveLength(c.enabledContent.includes('venus') ? 6 : 5)
    expect(new Set(sets[kind].map((entry) => entry.objective.id)).size).toBe(
      sets[kind].length,
    )
    if (c.enabledContent.includes('ma')) {
      expect(s[kind]).toHaveLength(5)
      // Independent oracle: every prerequisite and every map exclusion must hold.
      const pool = catalogs[kind].filter(
        (o) =>
          o.source === 'ma' &&
          o.requires.every((id) => c.enabledContent.includes(id)) &&
          !o.excludedBoards.some((id) => id === s.board),
      )
      expect(pool.length).toBeGreaterThanOrEqual(5)
      expect(
        s[kind]?.every(
          (row, index) =>
            row.position === index &&
            pool.some((o) => o.id === row.objectiveId),
        ),
      ).toBe(true)
    } else {
      expect(s[kind]).toBeNull()
      const board = catalogs.boards.find((b) => b.id === s.board)!
      expect(sets[kind].slice(0, 5).map((entry) => entry.objective.id)).toEqual(
        board[kind],
      )
      for (const entry of sets[kind].slice(0, 5))
        expect(entry.limitations).toEqual(
          entry.objective.requires.filter(
            (id) => !c.enabledContent.includes(id),
          ),
        )
    }
    expect(
      sets[kind].filter((entry) => entry.objective.source === 'venus'),
    ).toHaveLength(c.enabledContent.includes('venus') ? 1 : 0)
    for (const entry of sets[kind]) {
      const id = entry.objective.id
      const expected: Record<string, number> = {
        'printed:tharsis:milestone:terraformer': c.enabledContent.includes(
          'turmoil',
        )
          ? 26
          : 35,
        'ma:milestone:terraformer': 29,
        'printed:tharsis:milestone:builder': 8,
        'ma:milestone:builder': 7,
        'printed:elysium:milestone:tycoon': 15,
        'ma:milestone:tycoon': 10,
        'printed:amazonis-planitia:milestone:merchant': 3,
        'ma:milestone:merchant': 2,
      }
      if (id.endsWith(':generalist'))
        expect(entry.threshold?.value).toBe(
          c.enabledContent.includes('ce') ? 1 : 2,
        )
      if (id in expected) expect(entry.threshold?.value).toBe(expected[id])
    }
  }
}
function expectedInstructionIds(c: Configuration, board: BoardId): string[] {
  const on = (id: ExpansionId) => c.enabledContent.includes(id),
    extended = c.variants.extendedStart
  const variants: [string, boolean][] = [
    ['su-02-2', board !== 'amazonis-planitia'],
    ['su-02-3', board === 'amazonis-planitia'],
    ['su-03-1', on('turmoil')],
    ['su-04-1', on('venus')],
    ['su-04-2', on('colonies')],
    ['su-04-3', board === 'hellas' || board === 'utopia-planitia'],
    [
      'su-04-4',
      (board === 'amazonis-planitia' || board === 'vastitas-borealis') &&
        !on('turmoil'),
    ],
    ['su-04-5', board === 'terra-cimmeria' && !on('colonies')],
    ['su-05-1', on('ma')],
    ['su-05-2', !on('ma')],
    ['su-05-3', on('venus')],
    ['su-05-4', board === 'tharsis' && !on('ma') && on('turmoil')],
    ['su-06-2', on('ce')],
    ['su-06-3', !on('ce')],
    ['su-06-4', on('prelude')],
    ['su-06-5', on('prelude2')],
    ['su-07-1', on('ce')],
    ['su-07-2', !on('ce')],
    ['su-08-2', !extended],
    ['su-08-3', extended],
    ['su-08-4', on('prelude') && !extended],
    ['su-08-5', on('prelude') && extended],
    ['su-10-1', on('prelude2')],
    ['su-11-1', on('prelude')],
    ['su-11-2', on('prelude2')],
  ]
  return [
    'su-01-1',
    'su-02-1',
    'su-06-1',
    'su-07-3',
    'su-08-1',
    'su-09-1',
    'su-12-1',
    ...variants.filter(([, enabled]) => enabled).map(([id]) => id),
  ].sort()
}

it('enumerates exactly 96 supported content sets and 10,752 map/player/content/variant combinations', () => {
  expect(contentSets).toHaveLength(96)
  expect(counts.length * BOARD_IDS.length * contentSets.length * 4).toBe(10752)
})
for (const n of counts)
  for (const board of BOARD_IDS) {
    describe(`N=${n}, ${board}`, () => {
      it('SC-001/002/003/005: every valid content/variant combination has valid sourced guidance, results and summary', () => {
        for (const [mask, content] of contentSets.entries())
          for (let flags = 0; flags < 4; flags++) {
            const c = config(n, board, content, flags),
              rng = source(1 + n * 10000 + mask * 13 + flags)
            const s = freeze(
              value(
                generateMissingSelections(c, emptySelections(), rng.next),
                `${n}/${board}/${mask}/${flags}`,
              ),
            )
            publicInvariants(c, s)
            const draws = rng.draws
            expect(value(generateMissingSelections(c, s, rng.next))).toBe(s)
            const instructions = projectInstructions(c, s)
            expect(instructions.map((step) => step.id).sort()).toEqual(
              expectedInstructionIds(c, board),
            )
            const order = instructions.map(
              (step) => Number(step.su.slice(3)) * 100 + step.order,
            )
            expect(order).toEqual([...order].sort((a, b) => a - b))
            expect(
              instructions.every(
                (step) =>
                  step.sources.length > 0 &&
                  step.sources.every((ref) => ref.section.length > 0),
              ),
            ).toBe(true)
            expect(
              instructions.find((step) => step.quantities.oceans !== undefined)
                ?.quantities.oceans,
            ).toBe(board === 'amazonis-planitia' ? 11 : 9)
            expect(
              instructions.find(
                (step) => step.quantities.production !== undefined,
              )?.quantities.production,
            ).toBe(content.includes('ce') ? 0 : 1)
            const summary = projectSummary(c, s)
            expect(summary.playerCount).toBe(n)
            expect(summary.firstPlayer).toBe(s.firstPlayer)
            expect(summary.board?.id).toBe(board)
            expect(summary.content.map((e) => e.id)).toEqual(content)
            expect(summary.variants).toEqual(c.variants)
            expect(summary.colonies.map((tile) => tile.id)).toEqual(
              s.colonies ?? [],
            )
            expect(summary.milestones).toEqual(objectiveSets(c, s).milestones)
            expect(summary.awards).toEqual(objectiveSets(c, s).awards)
            expect(rng.draws).toBe(draws)
            if (content.includes('ma')) {
              const kind = flags % 2 ? 'award' : 'milestone',
                key = kind === 'award' ? 'awards' : 'milestones'
              let locked = s
              for (const row of [0, 2, 4])
                locked = value(
                  customizeSelections(
                    c,
                    locked,
                    { type: 'set-lock', kind, row, locked: true },
                    rng.next,
                  ),
                )
              const rerolled = value(
                customizeSelections(
                  c,
                  locked,
                  { type: 'reroll-objectives', kind },
                  rng.next,
                ),
              )
              for (const row of [0, 2, 4])
                expect(rerolled[key]?.[row]).toBe(locked[key]?.[row])
              expect(rerolled[kind === 'award' ? 'milestones' : 'awards']).toBe(
                locked[kind === 'award' ? 'milestones' : 'awards'],
              )
              publicInvariants(c, rerolled)
            }
          }
      }, 30000)
      it('SC-004: content, N, variants and board-pool boundary edits cancel exactly and retain unaffected rows/locks', () => {
        for (const [mask, content] of contentSets.entries()) {
          const c = config(n, board, content),
            rng = source(n * 1000 + mask + 1)
          let s = value(
            generateMissingSelections(c, emptySelections(), rng.next),
          )
          if (content.includes('ma'))
            for (const kind of ['milestone', 'award'] as const)
              for (const row of [0, 2, 4])
                s = value(
                  customizeSelections(
                    c,
                    s,
                    { type: 'set-lock', kind, row, locked: true },
                    rng.next,
                  ),
                )
          freeze(s)
          const actions: ConfigurationAction[] = [
            ...EXPANSION_IDS.map((id) => ({
              type: 'set-content' as const,
              id,
              enabled: !content.includes(id),
            })),
            { type: 'set-player-count', value: n === 5 ? 2 : n + 1 },
            { type: 'set-variant', id: 'extendedStart', enabled: true },
            { type: 'set-variant', id: 'researchDrafting', enabled: true },
            { type: 'set-board', id: board, enabled: false },
          ]
          for (const action of actions) {
            const draws = rng.draws,
              preview = previewEdit(c, s, action)
            expect(cancelEdit(preview).configuration).toBe(c)
            expect(cancelEdit(preview).selections).toBe(s)
            expect(rng.draws).toBe(draws)
            expect(commitEdit(preview) === null).toBe(preview.losses.length > 0)
            const committed = commitEdit(preview, true)!
            if (action.type === 'set-variant')
              expect(committed.selections).toBe(s)
            if (committed.configuration.playerCount === n)
              expect(committed.selections.firstPlayer).toBe(s.firstPlayer)
            else expect(committed.selections.firstPlayer).toBeNull()
            if (
              committed.configuration.playerCount === n &&
              committed.configuration.enabledContent.includes('colonies')
            )
              expect(committed.selections.colonies).toBe(s.colonies)
            for (const key of ['milestones', 'awards'] as const)
              for (const old of s[key] ?? []) {
                const next = committed.selections[key]?.[old.position]
                if (next?.objectiveId === old.objectiveId)
                  expect(next).toBe(old)
                else {
                  expect(
                    preview.losses.some((loss) =>
                      loss.objectiveIds.includes(old.objectiveId!),
                    ),
                  ).toBe(true)
                  if (old.locked)
                    expect(
                      preview.losses.some((loss) =>
                        loss.lockedIds.includes(old.objectiveId),
                      ),
                    ).toBe(true)
                }
              }
            const filled = value(
              generateMissingSelections(
                committed.configuration,
                committed.selections,
                rng.next,
              ),
            )
            publicInvariants(committed.configuration, filled)
            for (const key of ['milestones', 'awards'] as const)
              for (const retained of committed.selections[key] ?? [])
                if (retained.objectiveId)
                  expect(filled[key]?.[retained.position]).toBe(retained)
          }
        }
      }, 30000)
    })
  }
it('all 127 nonempty board pools are respected in both source modes for all player counts', () => {
  for (const n of counts)
    for (let mask = 1; mask < 128; mask++)
      for (const ma of [false, true]) {
        const [first, ...rest] = BOARD_IDS.filter((_, bit) =>
          Boolean(mask & (1 << bit)),
        )
        const c: Configuration = {
          ...config(n, first!, ma ? EXPANSION_IDS : []),
          expandedBoards: true,
          boardCandidates: [first!, ...rest],
        }
        publicInvariants(
          c,
          value(
            generateMissingSelections(
              c,
              emptySelections(),
              source(mask + n).next,
            ),
          ),
        )
      }
}, 30000)
it('Reset and all-locked rerolls preserve cancellation/lock boundaries across maps, counts and both source modes', () => {
  for (const n of counts)
    for (const board of BOARD_IDS)
      for (const ma of [false, true]) {
        const c = config(n, board, ma ? EXPANSION_IDS : []),
          rng = source(n + 1)
        let s = value(generateMissingSelections(c, emptySelections(), rng.next))
        if (ma)
          for (const kind of ['milestone', 'award'] as const) {
            for (let row = 0; row < 5; row++)
              s = value(
                customizeSelections(
                  c,
                  s,
                  { type: 'set-lock', kind, row, locked: true },
                  rng.next,
                ),
              )
            const draws = rng.draws
            expect(
              value(
                customizeSelections(
                  c,
                  s,
                  { type: 'reroll-objectives', kind },
                  rng.next,
                ),
              ),
            ).toBe(s)
            expect(rng.draws).toBe(draws)
          }
        const draws = rng.draws,
          reset = previewReset(c, freeze(s))
        expect(cancelReset(reset).selections).toBe(s)
        expect(cancelReset(reset).configuration).toBe(c)
        expect(commitReset(reset)).toBeNull()
        const next = commitReset(reset, true)!
        expect(next.configuration.playerCount).toBe(2)
        expect(next.configuration.boardCandidates).toEqual(BOARD_IDS)
        expect(Object.values(next.selections).every((v) => v === null)).toBe(
          true,
        )
        expect(rng.draws).toBe(draws)
        const fresh = value(
          generateMissingSelections(
            next.configuration,
            next.selections,
            rng.next,
          ),
        )
        expect(fresh.milestones?.every((row) => !row.locked)).toBe(true)
        publicInvariants(next.configuration, fresh)
      }
})
