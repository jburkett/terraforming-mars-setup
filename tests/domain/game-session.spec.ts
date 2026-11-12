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
