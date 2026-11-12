import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
const summary = (page: Page) =>
  page.getByRole('region', { name: 'Configuration summary', exact: true })
const dialog = (page: Page) =>
  page.getByRole('dialog', { name: 'Change configuration?', exact: true })
const fields = (page: Page) =>
  page.locator('[data-selection-value]').allTextContents()
async function enter(page: Page) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
async function content(page: Page) {
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
}
async function allOn(page: Page, count = 2) {
  await page.goto('./')
  await page.getByLabel('Player count').selectOption(String(count))
  await page.getByLabel('Milestones & Awards', { exact: true }).check()
  await page.getByLabel('Colonies', { exact: true }).check()
  await page.getByLabel('Use expanded boards').uncheck()
  await enter(page)
}
async function chooseMilestone(
  page: Page,
  id: string,
  except: number[] = [],
): Promise<number> {
  for (let row = 1; row <= 5; row++) {
    const field = page.getByLabel(`Milestone ${row}`, { exact: true })
    if ((await field.inputValue()) === id) {
      await field.selectOption(id)
      return row
    }
  }
  for (let row = 1; row <= 5; row++) {
    if (except.includes(row)) continue
    const field = page.getByLabel(`Milestone ${row}`, { exact: true })
    if (await field.locator(`option[value="${id}"]`).count()) {
      await field.selectOption(id)
      return row
    }
  }
  throw new Error(`No eligible row for ${id}`)
}
async function ids(page: Page, kind: 'milestone' | 'award') {
  return Promise.all(
    (await page.locator(`[data-objective-kind="${kind}"]`).all()).map((row) =>
      row.getAttribute('data-objective-id'),
    ),
  )
}
async function chooseOnlyBoard(page: Page, chosen: string) {
  await page.getByLabel('Use expanded boards').check()
  for (const name of [
    'Original board (Tharsis)',
    'Hellas',
    'Elysium',
    'Utopia Planitia',
    'Terra Cimmeria',
    'Amazonis Planitia',
    'Vastitas Borealis',
  ])
    if (name !== chosen) await page.getByLabel(name, { exact: true }).uncheck()
}
test('AC-26: cancel keeps MA Pioneer/other locks; confirm clears only affected Colonies selections', async ({
  page,
}) => {
  await allOn(page)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  const pioneer = await chooseMilestone(page, 'ma:milestone:pioneer')
  const builder = await chooseMilestone(page, 'ma:milestone:builder', [pioneer])
  const before = await summary(page).textContent(),
    awards = await ids(page, 'award')
  const board = await summary(page)
    .locator('[data-summary-field="board"]')
    .textContent()
  const first = await summary(page)
    .locator('[data-summary-field="firstPlayer"]')
    .textContent()
  await content(page)
  await expect(page.getByLabel('Colonies', { exact: true })).toBeEnabled()
  await page.getByLabel('Colonies', { exact: true }).uncheck()
  await expect(dialog(page)).toContainText(/Pioneer.*locked/)
  await expect(dialog(page)).not.toContainText('Builder')
  await expect(page.getByLabel('Colonies', { exact: true })).toBeChecked()
  await page
    .getByRole('button', { name: 'Keep configuration', exact: true })
    .click()
  await expect(page.getByLabel('Colonies', { exact: true })).toBeChecked()
  await enter(page)
  expect(await summary(page).textContent()).toBe(before)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await expect(
    page.getByLabel(`Lock milestone ${pioneer}`, { exact: true }),
  ).toBeChecked()
  await expect(
    page.getByLabel(`Lock milestone ${builder}`, { exact: true }),
  ).toBeChecked()
  await content(page)
  await page.getByLabel('Colonies', { exact: true }).uncheck()
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
  await expect(page.getByLabel('Colonies', { exact: true })).not.toBeChecked()
  await enter(page)
  await expect(
    page.locator('[data-objective-id="ma:milestone:pioneer"]'),
  ).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await expect(
    page.getByLabel(`Milestone ${builder}`, { exact: true }),
  ).toHaveValue('ma:milestone:builder')
  await expect(
    page.getByLabel(`Lock milestone ${builder}`, { exact: true }),
  ).toBeChecked()
  expect(await ids(page, 'award')).toEqual(awards)
  await expect(
    summary(page).locator('[data-summary-field="board"]'),
  ).toHaveText(board ?? '')
  await expect(
    summary(page).locator('[data-summary-field="firstPlayer"]'),
  ).toHaveText(first ?? '')
  await expect(
    summary(page).locator('[data-summary-field="colonies"]'),
  ).toHaveText('Not enabled')
  await expect(page.locator('[data-instruction-id="su-04-2"]')).toHaveCount(0)
})
test('AC-34: printed Utopia Pioneer survives Colonies removal and limitation disappears on re-enable', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Colonies', { exact: true }).check()
  await chooseOnlyBoard(page, 'Utopia Planitia')
  await enter(page)
  const before = await ids(page, 'milestone')
  await content(page)
  await expect(page.getByLabel('Colonies', { exact: true })).toBeEnabled()
  await page.getByLabel('Colonies', { exact: true }).uncheck()
  await expect(dialog(page)).not.toContainText('Pioneer')
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
  await enter(page)
  expect(await ids(page, 'milestone')).toEqual(before)
  await expect(summary(page)).toContainText(
    'Pioneer is unattainable: requires Colonies.',
  )
  await content(page)
  await page.getByLabel('Colonies', { exact: true }).check()
  await expect(dialog(page)).toHaveCount(0)
  await enter(page)
  expect(await ids(page, 'milestone')).toEqual(before)
  await expect(summary(page)).not.toContainText('Pioneer is unattainable')
})
test('AC-27: N=4 to 5 confirms first-player/colony loss while preserving board and objective locks', async ({
  page,
}) => {
  await allOn(page, 4)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await page.getByLabel('Lock milestone 1', { exact: true }).check()
  const objectives = await ids(page, 'milestone'),
    awards = await ids(page, 'award')
  await content(page)
  await expect(page.getByLabel('Player count')).toBeEnabled()
  await page.getByLabel('Player count').selectOption('5')
  await expect(dialog(page)).toContainText('First player')
  await expect(dialog(page)).toContainText('Colonies')
  await expect(page.getByLabel('Player count')).toHaveValue('4')
  await page.keyboard.press('Escape')
  await expect(page.getByLabel('Player count')).toBeFocused()
  await expect(page.getByLabel('Player count')).toHaveValue('4')
  await page.getByLabel('Player count').selectOption('5')
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
  await expect(page.getByLabel('Player count')).toHaveValue('5')
  await enter(page)
  await expect(
    page.getByRole('list', { name: 'Selected colonies' }).getByRole('listitem'),
  ).toHaveCount(7)
  expect(await ids(page, 'milestone')).toEqual(objectives)
  expect(await ids(page, 'award')).toEqual(awards)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await expect(
    page.getByLabel('Lock milestone 1', { exact: true }),
  ).toBeChecked()
  await expect(
    summary(page).locator('[data-summary-field="playerCount"]'),
  ).toHaveText('5')
})
test('AC-28: excluding the chosen board previews affected locks and retains unrelated MA rows', async ({
  page,
}) => {
  await allOn(page)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  const geologist = await chooseMilestone(page, 'ma:milestone:geologist')
  const builder = await chooseMilestone(page, 'ma:milestone:builder', [
    geologist,
  ])
  await content(page)
  await expect(page.getByLabel('Use expanded boards')).toBeEnabled()
  await page.getByLabel('Use expanded boards').check()
  await expect(dialog(page)).toHaveCount(0)
  await page.getByLabel('Original board (Tharsis)', { exact: true }).uncheck()
  await expect(dialog(page)).toContainText(/Geologist.*locked/)
  await page
    .getByRole('button', { name: 'Keep configuration', exact: true })
    .click()
  await expect(
    page.getByLabel('Original board (Tharsis)', { exact: true }),
  ).toBeChecked()
  await page.getByLabel('Original board (Tharsis)', { exact: true }).uncheck()
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
  await chooseOnlyBoard(page, 'Hellas')
  await enter(page)
  await expect(
    summary(page).locator('[data-summary-field="board"]'),
  ).toHaveText('Hellas')
  await expect(
    page.locator('[data-objective-id="ma:milestone:geologist"]'),
  ).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await expect(
    page.getByLabel(`Milestone ${builder}`, { exact: true }),
  ).toHaveValue('ma:milestone:builder')
  await expect(
    page.getByLabel(`Lock milestone ${builder}`, { exact: true }),
  ).toBeChecked()
})
test('AC-29: variant and Prelude instruction-only edits preserve public results without confirmation', async ({
  page,
}) => {
  await allOn(page)
  const before = await fields(page)
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByLabel('Extended Start', { exact: true })).toBeEnabled()
  await page.getByLabel('Extended Start', { exact: true }).uncheck()
  await page.getByLabel('Research drafting', { exact: true }).uncheck()
  await expect(dialog(page)).toHaveCount(0)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  expect(await fields(page)).toEqual(before)
  await expect(page.locator('[data-instruction-id="su-08-4"]')).toContainText(
    'four Preludes',
  )
  await expect(
    summary(page).locator('[data-summary-field="extendedStart"]'),
  ).toHaveText('Off')
  await expect(
    summary(page).locator('[data-summary-field="researchDrafting"]'),
  ).toHaveText('Off')
  await content(page)
  await page.getByLabel('Prelude 2', { exact: true }).uncheck()
  await page.getByLabel('Prelude', { exact: true }).uncheck()
  await expect(dialog(page)).toHaveCount(0)
  await enter(page)
  expect(await fields(page)).toEqual(before)
  await expect(page.locator('[data-su="SU-11"]')).toHaveCount(0)
})
test('AC-30: Reset cancels exactly or restores defaults and generates new unlocked results on next entry', async ({
  page,
}) => {
  await allOn(page, 5)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await page.getByLabel('Lock milestone 1', { exact: true }).check()
  const before = await summary(page).textContent()
  await expect(
    page.getByRole('button', { name: 'Reset', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect(
    page.getByRole('dialog', { name: 'Reset game setup?', exact: true }),
  ).toBeVisible()
  expect(await summary(page).textContent()).toBe(before)
  await page
    .getByRole('button', { name: 'Keep current setup', exact: true })
    .click()
  expect(await summary(page).textContent()).toBe(before)
  await expect(
    page.getByLabel('Lock milestone 1', { exact: true }),
  ).toBeChecked()
  await expect(
    page.getByRole('button', { name: 'Reset', exact: true }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset setup', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Choose game content' }),
  ).toBeVisible()
  await expect(page.getByLabel('Player count')).toHaveValue('2')
  for (const name of [
    'Corporate Era',
    'Venus Next',
    'Prelude',
    'Prelude 2',
    'Colonies',
    'Turmoil',
    'Milestones & Awards',
    'Use expanded boards',
  ])
    await expect(page.getByLabel(name, { exact: true })).toBeChecked()
  await expect(
    page
      .getByRole('group', { name: 'Board candidates' })
      .getByRole('checkbox', { checked: true }),
  ).toHaveCount(7)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByLabel('Extended Start', { exact: true })).toBeChecked()
  await expect(
    page.getByLabel('Research drafting', { exact: true }),
  ).toBeChecked()
  await expect(page.getByLabel(/WGT|longer Venus/i)).toHaveCount(0)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(
    page.getByRole('list', { name: 'Selected colonies' }).getByRole('listitem'),
  ).toHaveCount(5)
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  for (let row = 1; row <= 5; row++)
    await expect(
      page.getByLabel(`Lock milestone ${row}`, { exact: true }),
    ).not.toBeChecked()
})
