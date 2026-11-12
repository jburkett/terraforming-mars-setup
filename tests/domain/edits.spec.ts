import { describe, expect, it, vi } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
import {
  initialConfiguration,
  updateConfiguration,
} from '../../src/domain/configuration'
import type { Configuration, PublicSelections } from '../../src/domain/types'
import { objectiveSets } from '../../src/domain/objectives'
import { projectInstructions } from '../../src/domain/instructions'
import { generateMissingSelections } from '../../src/domain/selections'
import { seeded, rows } from '../helpers/public-selection-api'
import {
  calculateInvalidation,
  previewEdit,
  commitEdit,
  cancelEdit,
} from '../helpers/edit-api'
function pioneer(config: Configuration): PublicSelections {
  return {
    ...seeded(config),
    milestones: rows(
      [
        'ma:milestone:pioneer',
        'ma:milestone:builder',
        'ma:milestone:terraformer',
        'ma:milestone:planner',
        'ma:milestone:tycoon',
      ],
      [0, 1],
    ),
  }
}

describe('affected state', () => {
  it('AC-26: removing Colonies clears its results and only MA Pioneer, preserving unrelated locks and positions', () => {
    const c = initialConfiguration(),
      s = pioneer(c),
      before = JSON.stringify({ c, s, catalogs })
    const next = updateConfiguration(c, {
      type: 'set-content',
      id: 'colonies',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s)
    expect(result.selections.colonies).toBeNull()
    expect(result.selections.milestones?.[0]).toEqual({
      position: 0,
      objectiveId: null,
      locked: false,
    })
    expect(result.selections.milestones?.[1]).toBe(s.milestones?.[1])
    expect(result.selections.awards).toBe(s.awards)
    expect(result.selections.board).toBe(s.board)
    expect(result.selections.firstPlayer).toBe(s.firstPlayer)
    expect(
      result.losses.find((l) => l.field === 'milestones')?.lockedIds,
    ).toEqual(['ma:milestone:pioneer'])
    expect(result.losses.map((l) => l.reason).join(' ')).toMatch(
      /Pioneer.*locked/,
    )
    expect(JSON.stringify({ c, s, catalogs })).toBe(before)
  })
  it.each([2, 4] as const)(
    'N=%i changes clear first player and colonies even when the old result/count remains valid',
    (playerCount) => {
      const c = { ...initialConfiguration(), playerCount },
        s = seeded(c)
      const next = updateConfiguration(c, {
        type: 'set-player-count',
        value: playerCount === 2 ? 3 : 5,
      })
      const result = calculateInvalidation(c, next, s)
      expect(result.selections.firstPlayer).toBeNull()
      expect(result.selections.colonies).toBeNull()
      expect(result.selections.board).toBe(s.board)
      expect(result.selections.milestones).toBe(s.milestones)
      expect(result.selections.awards).toBe(s.awards)
      expect(result.losses.map((l) => l.field)).toEqual([
        'firstPlayer',
        'colonies',
      ])
      const regenerated = generateMissingSelections(
        next,
        result.selections,
        () => 0,
      )
      expect(regenerated.ok).toBe(true)
      if (regenerated.ok)
        expect(regenerated.selections.colonies).toHaveLength(
          playerCount === 2 ? 5 : 7,
        )
    },
  )
  it('N changes do not invent a colony loss when Colonies is off', () => {
    const c = updateConfiguration(initialConfiguration(), {
        type: 'select-content',
        enabled: false,
      }),
      s = seeded(c)
    const result = calculateInvalidation(
      c,
      updateConfiguration(c, { type: 'set-player-count', value: 5 }),
      s,
    )
    expect(result.selections.firstPlayer).toBeNull()
    expect(result.losses.map((l) => l.field)).toEqual(['firstPlayer'])
  })
  it('AC-34: printed Utopia retains every identity and updates Pioneer limitation instead of clearing it', () => {
    const c: Configuration = {
        ...initialConfiguration(),
        enabledContent: ['colonies'],
        expandedBoards: true,
        boardCandidates: ['utopia-planitia'],
      },
      s = seeded(c)
    const next = updateConfiguration(c, {
      type: 'set-content',
      id: 'colonies',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s)
    expect(result.selections.colonies).toBeNull()
    expect(result.losses.map((l) => l.field)).toEqual(['colonies'])
    expect(
      objectiveSets(next, result.selections).milestones.map(
        (e) => e.objective.id,
      ),
    ).toEqual(objectiveSets(c, s).milestones.map((e) => e.objective.id))
    expect(
      objectiveSets(next, result.selections).milestones.find(
        (e) => e.objective.name === 'Pioneer',
      )?.limitations,
    ).toEqual(['colonies'])
    const enabled = calculateInvalidation(next, c, result.selections)
    expect(enabled.losses).toEqual([])
    expect(
      objectiveSets(c, enabled.selections).milestones.find(
        (e) => e.objective.name === 'Pioneer',
      )?.limitations,
    ).toEqual([])
  })
  it('excluding the selected board clears it and only potentially ineligible MA rows, before any future draw', () => {
    const c = initialConfiguration(),
      s = {
        ...seeded(c),
        milestones: rows(
          [
            'ma:milestone:geologist',
            'ma:milestone:builder',
            'ma:milestone:terraformer',
            'ma:milestone:planner',
            'ma:milestone:tycoon',
          ],
          [0, 1],
        ),
      }
    const next: Configuration = {
      ...c,
      expandedBoards: true,
      boardCandidates: ['hellas', 'elysium'],
    }
    const result = calculateInvalidation(c, next, s)
    expect(result.selections.board).toBeNull()
    expect(result.selections.milestones?.[0]).toEqual({
      position: 0,
      objectiveId: null,
      locked: false,
    })
    expect(result.selections.milestones?.[1]).toBe(s.milestones[1])
    expect(result.selections.colonies).toBe(s.colonies)
    expect(result.selections.firstPlayer).toBe(s.firstPlayer)
    expect(
      result.losses.find((l) => l.field === 'milestones')?.lockedIds,
    ).toContain('ma:milestone:geologist')
  })
  it('changing board candidates while keeping the selected board retains all existing selections', () => {
    const c = initialConfiguration(),
      s = seeded(c)
    const next = updateConfiguration(c, {
      type: 'set-board',
      id: 'hellas',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s)
    expect(result.selections).toBe(s)
    expect(result.losses).toEqual([])
  })
  it('turning expanded boards off clears an excluded board and previews its printed sets', () => {
    const c: Configuration = {
        ...initialConfiguration(),
        enabledContent: [],
        expandedBoards: true,
        boardCandidates: ['hellas', 'elysium'],
      },
      s = seeded(c)
    const next = updateConfiguration(c, {
      type: 'set-expanded-boards',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s)
    expect(result.selections.board).toBeNull()
    expect(result.losses.map((l) => l.field)).toEqual([
      'board',
      'milestones',
      'awards',
    ])
    expect(
      result.losses.find((l) => l.field === 'milestones')?.objectiveIds,
    ).toEqual(catalogs.boards.find((b) => b.id === 'hellas')?.milestones)
    expect(result.selections.firstPlayer).toBe(s.firstPlayer)
  })
  it('Venus removal clears only dependent MA identities and the fixed pair; all other results survive', () => {
    const c = initialConfiguration(),
      s = {
        ...seeded(c),
        milestones: rows(
          [
            'ma:milestone:planetologist',
            'ma:milestone:builder',
            'ma:milestone:terraformer',
            'ma:milestone:planner',
            'ma:milestone:tycoon',
          ],
          [0, 1],
        ),
      }
    const next = updateConfiguration(c, {
      type: 'set-content',
      id: 'venus',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s)
    expect(result.selections.milestones?.[0].objectiveId).toBeNull()
    expect(result.selections.milestones?.[1]).toBe(s.milestones[1])
    expect(result.selections.awards).toBe(s.awards)
    expect(result.losses.flatMap((l) => l.objectiveIds)).toContain(
      'venus:milestone:hoverlord',
    )
    expect(
      objectiveSets(next, result.selections).awards.some(
        (e) => e.objective.source === 'venus',
      ),
    ).toBe(false)
  })
  it('Turmoil removal clears dependent MA locks but printed Terraformer changes only its overlay', () => {
    const c = initialConfiguration(),
      s = {
        ...seeded(c),
        milestones: rows(
          [
            'ma:milestone:lobbyist',
            'ma:milestone:builder',
            'ma:milestone:terraformer',
            'ma:milestone:planner',
            'ma:milestone:tycoon',
          ],
          [0, 1],
        ),
        awards: rows(
          [
            'ma:award:politician',
            'ma:award:banker',
            'ma:award:scientist',
            'ma:award:landlord',
            'ma:award:thermalist',
          ],
          [0],
        ),
      }
    const next = updateConfiguration(c, {
      type: 'set-content',
      id: 'turmoil',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s)
    expect(result.selections.milestones?.[0].objectiveId).toBeNull()
    expect(result.selections.awards?.[0]).toEqual({
      position: 0,
      objectiveId: null,
      locked: false,
    })
    expect(result.selections.milestones?.[1]).toBe(s.milestones[1])
    const printed = updateConfiguration(c, {
        type: 'set-content',
        id: 'ma',
        enabled: false,
      }),
      ps = seeded(printed)
    const noTurmoil = updateConfiguration(printed, {
      type: 'set-content',
      id: 'turmoil',
      enabled: false,
    })
    const pr = calculateInvalidation(printed, noTurmoil, ps)
    expect(pr.selections).toBe(ps)
    expect(pr.losses).toEqual([])
    expect(
      objectiveSets(noTurmoil, pr.selections).milestones.find(
        (e) => e.objective.name === 'Terraformer',
      )?.threshold?.value,
    ).toBe(35)
  })
  it('MA source changes clear replacement state and confirm before replacing printed or locked sets', () => {
    const c = initialConfiguration(),
      s = pioneer(c),
      off = updateConfiguration(c, {
        type: 'set-content',
        id: 'ma',
        enabled: false,
      })
    const result = calculateInvalidation(c, off, s)
    expect(result.selections.milestones).toBeNull()
    expect(result.selections.awards).toBeNull()
    expect(result.selections.colonies).toBe(s.colonies)
    expect(
      result.losses.find((l) => l.field === 'milestones')?.lockedIds,
    ).toContain('ma:milestone:pioneer')
    const printed = seeded(off),
      on = calculateInvalidation(off, c, printed)
    expect(on.selections).toBe(printed)
    expect(on.losses.map((l) => l.field)).toEqual(['milestones', 'awards'])
    expect(on.losses.flatMap((l) => l.objectiveIds)).toContain(
      'printed:tharsis:milestone:terraformer',
    )
  })
  it('CE changes only instructions/thresholds when existing identities remain eligible', () => {
    const c = initialConfiguration(),
      s = {
        ...seeded(c),
        milestones: rows(
          [
            'ma:milestone:generalist',
            'ma:milestone:builder',
            'ma:milestone:terraformer',
            'ma:milestone:planner',
            'ma:milestone:tycoon',
          ],
          [0, 1],
        ),
      }
    const next = updateConfiguration(c, {
      type: 'set-content',
      id: 'ce',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s)
    expect(result.selections).toBe(s)
    expect(result.losses).toEqual([])
    expect(
      objectiveSets(next, result.selections).milestones.find(
        (e) => e.objective.name === 'Generalist',
      )?.threshold?.value,
    ).toBe(2)
  })
  it.each([
    'prelude',
    'prelude2',
    'extendedStart',
    'researchDrafting',
  ] as const)(
    '%s instruction-only edits preserve every public selection and lock',
    (id) => {
      const c = initialConfiguration(),
        s = pioneer(c)
      const next =
        id === 'prelude' || id === 'prelude2'
          ? updateConfiguration(c, { type: 'set-content', id, enabled: false })
          : updateConfiguration(c, { type: 'set-variant', id, enabled: false })
      const result = calculateInvalidation(c, next, s)
      expect(result.selections).toBe(s)
      expect(result.losses).toEqual([])
    },
  )
  it('enforces all prerequisites rather than accepting an objective with only one enabled dependency', () => {
    const c = initialConfiguration(),
      s = pioneer(c)
    const data = {
      ...catalogs,
      milestones: catalogs.milestones.map((o) =>
        o.id === 'ma:milestone:planner'
          ? { ...o, requires: ['colonies', 'venus'] as const }
          : o,
      ),
    }
    const next = updateConfiguration(c, {
      type: 'set-content',
      id: 'venus',
      enabled: false,
    })
    const result = calculateInvalidation(c, next, s, data)
    expect(result.selections.milestones?.[3].objectiveId).toBeNull()
    expect(result.selections.milestones?.[1]).toBe(s.milestones?.[1])
  })
})

describe('atomic edits', () => {
  it('normalizes a pending edit while keeping old choices and locks until consent; cancellation draws nothing', () => {
    const c = initialConfiguration(),
      s = pioneer(c),
      random = vi.spyOn(Math, 'random')
    const before = JSON.stringify({ c, s, catalogs })
    const preview = previewEdit(c, s, {
      type: 'set-content',
      id: 'colonies',
      enabled: false,
    })
    expect(preview.configuration.enabledContent).not.toContain('colonies')
    expect(preview.selections.milestones?.[0].objectiveId).toBeNull()
    expect(preview.previous.selections.milestones?.[0].locked).toBe(true)
    expect(preview.losses.length).toBeGreaterThan(0)
    expect(commitEdit(preview)).toBeNull()
    expect(cancelEdit(preview)).toBe(preview.previous)
    expect(cancelEdit(preview)).toEqual({ configuration: c, selections: s })
    expect(JSON.stringify({ c, s, catalogs })).toBe(before)
    expect(random).not.toHaveBeenCalled()
  })
  it('confirmation commits configuration and affected selections together, filling only missing results next entry', () => {
    const c = initialConfiguration(),
      s = pioneer(c),
      preview = previewEdit(c, s, { type: 'set-player-count', value: 5 })
    const committed = commitEdit(preview, true)
    expect(committed?.configuration.playerCount).toBe(5)
    expect(committed?.selections.firstPlayer).toBeNull()
    expect(committed?.selections.colonies).toBeNull()
    if (!committed) return
    const filled = generateMissingSelections(
      committed.configuration,
      committed.selections,
      () => 0,
    )
    expect(filled.ok).toBe(true)
    if (filled.ok) {
      expect(filled.selections.colonies).toHaveLength(7)
      expect(filled.selections.milestones).toBe(s.milestones)
      expect(filled.selections.board).toBe(s.board)
    }
  })
  it('non-loss changes commit immediately and describe the new physical setup without changing public results', () => {
    const c = initialConfiguration(),
      s = pioneer(c),
      preview = previewEdit(c, s, {
        type: 'set-variant',
        id: 'extendedStart',
        enabled: false,
      })
    expect(preview.losses).toEqual([])
    const committed = commitEdit(preview)
    expect(committed?.selections).toBe(s)
    expect(committed?.configuration.variants.extendedStart).toBe(false)
    if (committed)
      expect(
        projectInstructions(committed.configuration, committed.selections).some(
          (i) => i.id === 'su-08-4',
        ),
      ).toBe(true)
  })
  it('preserves P2/Prelude dependency normalization and atomic bulk disable semantics after generation', () => {
    const c = initialConfiguration(),
      s = seeded(c)
    const rejected = previewEdit(c, s, {
      type: 'set-content',
      id: 'prelude',
      enabled: false,
    })
    expect(rejected.configuration.enabledContent).toContain('prelude')
    expect(rejected.losses).toEqual([])
    const none = previewEdit(c, s, { type: 'select-content', enabled: false })
    expect(none.configuration.enabledContent).toEqual([])
    expect(commitEdit(none)).toBeNull()
    expect(commitEdit(none, true)?.selections.milestones).toBeNull()
    expect(commitEdit(none, true)?.selections.colonies).toBeNull()
  })
})
