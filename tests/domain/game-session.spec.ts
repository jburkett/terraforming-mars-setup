import { isProxy, isReadonly } from 'vue'
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
it('US2 interim boundary: configuration is read-only after generation without discarding results', () => {
  const session = useGameSession({ source: () => 0 })
  session.continueToNextView()
  session.continueToNextView()
  expect(session.configurationEditable?.value).toBe(false)
  const previous = session.selections.value
  const config = session.configuration.value
  session.dispatch({ type: 'select-content', enabled: false })
  expect(session.configuration.value).toBe(config)
  expect(session.selections.value).toBe(previous)
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
