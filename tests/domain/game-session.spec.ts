import { isProxy, isReadonly, watch } from 'vue'
import { expect, it, vi } from 'vitest'
import { catalogs } from '../../src/content/catalogs'

import { useGameSession } from '../../src/composables/useGameSession'

it('keeps one live configuration across both view consumers and setup navigation', () => {
  const session = useGameSession()
  const expansions = session
  const variants = session
  expansions.dispatch({ type: 'set-player-count', value: 4 })
  expansions.continueToNextView()
  expect(variants.view.value).toBe('variants')
  variants.dispatch({
    type: 'set-variant',
    id: 'extendedStart',
    enabled: false,
  })
  variants.goBack()
  expect(expansions.view.value).toBe('expansions')
  expect(expansions.configuration.value.playerCount).toBe(4)
  expect(expansions.configuration.value.variants.extendedStart).toBe(false)
  expansions.continueToNextView()
  variants.continueToNextView()
  expect(session.view.value).toBe('setup')
  session.continueToNextView()
  expect(session.view.value).toBe('setup')
  session.goBack()
  session.goBack()
  session.goBack()
  expect(session.view.value).toBe('expansions')
})
it('uses plain domain values/read-only reactive projections without changing catalogs', () => {
  const session = useGameSession()
  expect(isReadonly(session.configuration)).toBe(true)
  expect(isProxy(session.configuration.value)).toBe(false)
  const before = JSON.stringify(catalogs)
  session.dispatch({ type: 'select-content', enabled: false })
  expect(session.configuration.value.enabledContent).toEqual([])
  session.dispatch({ type: 'set-content', id: 'prelude2', enabled: true })
  expect(session.notices.value.join(' ')).toMatch(/Prelude 2 requires Prelude/)
  expect(JSON.stringify(catalogs)).toBe(before)
})
it('leaves results missing and consumes no randomness before entering setup', () => {
  const random = vi.spyOn(Math, 'random')
  const session = useGameSession()
  session.dispatch({ type: 'select-content', enabled: false })
  session.continueToNextView()
  session.goBack()
  expect(session.selections.value).toEqual({
    board: null,
    firstPlayer: null,
    colonies: null,
    milestones: null,
    awards: null,
  })
  expect(random).not.toHaveBeenCalled()
})
it('creates independent new sessions and variant bulk actions never enable expansions', () => {
  const first = useGameSession()
  const second = useGameSession()
  first.dispatch({ type: 'select-content', enabled: false })
  first.dispatch({ type: 'select-variants', enabled: false })
  first.dispatch({ type: 'select-variants', enabled: true })
  expect(first.configuration.value.enabledContent).toEqual([])
  expect(second.configuration.value.enabledContent).toHaveLength(7)
})

it('US2: setup entry generates once and unchanged revisits consume no further randomness', () => {
  const source = vi.fn(() => 0)
  const session = useGameSession({ source })
  session.continueToNextView()
  session.continueToNextView()
  expect(session.selections.value.board).toBe('tharsis')
  expect(session.selections.value.firstPlayer).toBe(1)
  expect(source).toHaveBeenCalled()
  const previous = session.selections.value
  const calls = source.mock.calls.length
  session.goBack()
  session.continueToNextView()
  expect(session.selections.value).toBe(previous)
  expect(source).toHaveBeenCalledTimes(calls)
})
it('US2: a failed generation commits nothing and permits correcting configuration', () => {
  const session = useGameSession({
    source: () => 0,
    data: { ...catalogs, colonies: catalogs.colonies.slice(0, 1) },
  })
  session.continueToNextView()
  session.continueToNextView()
  expect(session.conflict?.value?.pool).toBe('colonies')
  expect(session.selections.value.board).toBeNull()
  expect(session.configurationEditable?.value).toBe(true)
  session.returnToConfiguration()
  session.dispatch({ type: 'select-content', enabled: false })
  session.continueToNextView()
  session.continueToNextView()
  expect(session.conflict.value).toBeNull()
  expect(session.selections.value.board).toBe('tharsis')
})
it('US4: loss previews keep configuration/results committed; cancellation and blocked actions draw nothing', () => {
  const source = vi.fn(() => 0),
    session = useGameSession({ source })
  session.enterSetup()
  expect(session.configurationEditable.value).toBe(true)
  const config = session.configuration.value,
    selections = session.selections.value,
    calls = source.mock.calls.length
  session.dispatch({ type: 'select-content', enabled: false })
  expect(session.confirmation.value?.title).toBe('Change configuration?')
  expect(session.configurationEditable.value).toBe(false)
  expect(session.configuration.value).toBe(config)
  expect(session.selections.value).toBe(selections)
  session.customize({ type: 'reroll-first-player' })
  session.requestBoard({ kind: 'manual', boardId: 'hellas' })
  session.requestReset()
  session.goBack()
  session.enterSetup()
  expect(session.view.value).toBe('setup')
  expect(session.confirmation.value?.title).toBe('Change configuration?')
  expect(session.selections.value).toBe(selections)
  session.cancelPending()
  expect(session.confirmation.value).toBeNull()
  expect(session.configurationEditable.value).toBe(true)
  expect(session.configuration.value).toBe(config)
  expect(source).toHaveBeenCalledTimes(calls)
})
it('US4: confirmation replaces the committed pair atomically; next entry fills only missing selections', () => {
  const source = vi.fn(() => 0),
    session = useGameSession({ source })
  session.dispatch({ type: 'set-player-count', value: 4 })
  session.enterSetup()
  session.customize({
    type: 'set-lock',
    kind: 'milestone',
    row: 0,
    locked: true,
  })
  const old = session.selections.value,
    calls = source.mock.calls.length
  const observed: unknown[] = []
  const stop = watch(
    session.configuration,
    (configuration) =>
      observed.push({
        n: configuration.playerCount,
        first: session.selections.value.firstPlayer,
        colonies: session.selections.value.colonies,
      }),
    { flush: 'sync' },
  )
  session.dispatch({ type: 'set-player-count', value: 5 })
  expect(session.confirmation.value).toBeTruthy()
  expect(observed).toEqual([])
  session.confirmPending()
  expect(observed).toEqual([{ n: 5, first: null, colonies: null }])
  expect(session.selections.value.milestones).toBe(old.milestones)
  expect(session.selections.value.board).toBe(old.board)
  expect(source).toHaveBeenCalledTimes(calls)
  session.enterSetup()
  expect(session.selections.value.colonies).toHaveLength(7)
  expect(session.selections.value.milestones).toBe(old.milestones)
  expect(session.summary.value.playerCount).toBe(5)
  expect(
    session.instructions.value.find((i) => i.context === 'colonies')?.quantities
      .fleets,
  ).toBe(5)
  stop()
})
it('US4: Reset stays pending until consent, then clears state without generation and returns to configuration', () => {
  const source = vi.fn(() => 0),
    session = useGameSession({ source })
  session.dispatch({ type: 'set-player-count', value: 5 })
  session.enterSetup()
  const old = session.selections.value,
    config = session.configuration.value,
    calls = source.mock.calls.length
  session.requestReset()
  expect(session.confirmation.value?.title).toBe('Reset game setup?')
  expect(session.selections.value).toBe(old)
  session.cancelPending()
  expect(session.selections.value).toBe(old)
  expect(session.configuration.value).toBe(config)
  session.requestReset()
  session.confirmPending()
  expect(session.configuration.value.playerCount).toBe(2)
  expect(session.view.value).toBe('expansions')
  expect(session.selections.value).toEqual({
    board: null,
    firstPlayer: null,
    colonies: null,
    milestones: null,
    awards: null,
  })
  expect(session.instructions.value).toEqual([])
  expect(session.summary.value.board).toBeNull()
  expect(source).toHaveBeenCalledTimes(calls)
  session.enterSetup()
  expect(source.mock.calls.length).toBeGreaterThan(calls)
  expect(session.selections.value.colonies).toHaveLength(5)
})
it('US4: non-loss edits immediately update instructions and summary while preserving public state', () => {
  const source = vi.fn(() => 0),
    session = useGameSession({ source })
  session.enterSetup()
  const previous = session.selections.value,
    calls = source.mock.calls.length
  session.dispatch({ type: 'set-variant', id: 'extendedStart', enabled: false })
  expect(session.summary.value.variants.extendedStart).toBe(false)
  expect(session.confirmation.value).toBeNull()
  expect(session.instructions.value.some((i) => i.id === 'su-08-4')).toBe(true)
  session.dispatch({ type: 'set-content', id: 'ce', enabled: false })
  expect(session.instructions.value.some((i) => i.id === 'su-07-2')).toBe(true)
  expect(session.selections.value).toBe(previous)
  expect(source).toHaveBeenCalledTimes(calls)
})

it('US2: customization updates shared results and canceled board previews draw nothing', () => {
  const source = vi.fn(() => 0)
  const session = useGameSession({ source })
  session.dispatch({ type: 'select-content', enabled: false })
  session.dispatch({ type: 'set-expanded-boards', enabled: true })
  session.enterSetup()
  session.customize({ type: 'set-first-player', value: 2 })
  expect(session.selections.value.firstPlayer).toBe(2)
  const before = session.selections.value
  const calls = source.mock.calls.length
  session.requestBoard({ kind: 'manual', boardId: 'hellas' })
  expect(session.pendingBoard.value).toBeTruthy()
  session.cancelBoardChange()
  expect(session.selections.value).toBe(before)
  expect(source).toHaveBeenCalledTimes(calls)
  session.requestBoard({ kind: 'manual', boardId: 'hellas' })
  session.confirmBoardChange()
  expect(session.selections.value.board).toBe('hellas')
  expect(session.selections.value.firstPlayer).toBe(2)
})

it('US3: instructions and summary are read-only projections of the shared committed session without draws', () => {
  const source = vi.fn(() => 0)
  const session = useGameSession({ source })

  expect(session.instructions.value).toEqual([])
  session.enterSetup()
  const calls = source.mock.calls.length
  const colonies = session.selections.value.colonies
  const before = JSON.stringify(catalogs)
  expect(isReadonly(session.instructions)).toBe(true)
  expect(isReadonly(session.summary)).toBe(true)
  expect(session.instructions.value.length).toBeGreaterThan(12)
  for (let i = 0; i < 5; i++) {
    expect(session.summary.value.board?.id).toBe('tharsis')
    expect(session.summary.value.firstPlayer).toBe(1)
  }
  session.customize({ type: 'set-first-player', value: 2 })
  expect(session.summary.value.firstPlayer).toBe(2)
  expect(
    session.instructions.value.find((i) => i.su === 'SU-01')?.text,
  ).toContain('First player: 2')
  session.requestBoard({ kind: 'manual', boardId: 'amazonis-planitia' })
  if (session.pendingBoard.value) session.confirmBoardChange()
  expect(session.summary.value.board?.id).toBe('amazonis-planitia')
  expect(
    session.instructions.value.find((i) => i.id === 'su-02-3')?.quantities
      .oceans,
  ).toBe(11)
  expect(session.selections.value.colonies).toBe(colonies)
  session.goBack()
  session.continueToNextView()
  expect(session.summary.value.firstPlayer).toBe(2)
  expect(source).toHaveBeenCalledTimes(calls)
  expect(JSON.stringify(catalogs)).toBe(before)
})
it('US3: failed public generation exposes no physical instruction list or fabricated summary board', () => {
  const session = useGameSession({
    source: () => 0,
    data: { ...catalogs, colonies: catalogs.colonies.slice(0, 1) },
  })
  session.enterSetup()

  expect(session.instructions.value).toEqual([])
  expect(session.summary.value.board).toBeNull()
})
