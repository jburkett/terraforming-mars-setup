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
it('leaves results missing and consumes no randomness during US1 edits/navigation', () => {
  const random = vi.spyOn(Math, 'random')
  const session = useGameSession()
  session.dispatch({ type: 'select-content', enabled: false })
  session.continueToNextView()
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
