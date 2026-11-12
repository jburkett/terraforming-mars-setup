import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
type AuditWindow = Window & {
  __mvpDraws: () => number
  __mvpCatalog: () => { json: string; frozen: boolean }
}
const summary = (page: Page) =>
  page.getByRole('region', { name: 'Configuration summary', exact: true })
async function audit(page: Page) {
  await page.addInitScript(() => {
    let draws = 0
    const original = globalThis.crypto.getRandomValues.bind(globalThis.crypto)
    globalThis.crypto.getRandomValues = <T extends ArrayBufferView>(
      array: T,
    ): T => {
      draws++
      original(array)
      return array
    }
    Object.defineProperty(globalThis, '__mvpDraws', { value: () => draws })
  })
  await page.goto('./')
  await page.addScriptTag({
    type: 'module',
    url: new URL('tests/fixtures/catalog-audit.ts', page.url()).href,
  })
}
const draws = (page: Page) =>
  page.evaluate(() => (window as unknown as AuditWindow).__mvpDraws())
const catalog = (page: Page) =>
  page.evaluate(() => (window as unknown as AuditWindow).__mvpCatalog())
async function enter(page: Page) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
async function content(page: Page) {
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
}
async function alternative(field: Locator) {
  return field.evaluate((node) => {
    const select = node as HTMLSelectElement
    const option = [...select.options].find((o) => o.value !== select.value)!
    return { value: option.value, label: option.label.trim() }
  })
}
async function objectiveIds(page: Page, kind: 'milestone' | 'award') {
  return Promise.all(
    (await page.locator(`[data-objective-kind="${kind}"]`).all()).map((row) =>
      row.getAttribute('data-objective-id'),
    ),
  )
}
async function matchingSummary(page: Page) {
  await expect(
    summary(page).locator('[data-summary-field="firstPlayer"]'),
  ).toHaveText(await page.locator('[data-first-player]').innerText())
  await expect(
    summary(page).locator('[data-summary-field="board"]'),
  ).toHaveText(
    await page
      .getByRole('region', { name: 'Board selection', exact: true })
      .locator('[data-selection-value]')
      .innerText(),
  )
  const colonies = await page
    .getByRole('list', { name: 'Selected colonies', exact: true })
    .getByRole('listitem')
    .allTextContents()
  // Use the retrying locator assertion rather than the main-world bulk-text
  // query that reproducibly crashes Firefox in this rendered summary.
  await expect(
    summary(page).locator('[data-summary-field="colonies"] li'),
  ).toHaveText(colonies)
  const actual = await Promise.all(
    (await summary(page).locator('[data-summary-objective-id]').all()).map(
      (row) => row.getAttribute('data-summary-objective-id'),
    ),
  )
  expect(actual).toEqual([
    ...(await objectiveIds(page, 'milestone')),
    ...(await objectiveIds(page, 'award')),
  ])
}
async function scope(page: Page) {
  await expect(
    page.getByLabel(
      /WGT|World Government|longer Venus|private card|card name/i,
    ),
  ).toHaveCount(0)
  await expect(page.getByRole('textbox')).toHaveCount(0)
  await expect(
    page.locator('input[type="file"], [contenteditable="true"]'),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', {
      name: /draw.*(card|event)|shuffle.*deck|next turn|solar phase/i,
    }),
  ).toHaveCount(0)
  const instructions = page.getByRole('region', {
    name: 'Physical setup instructions',
    exact: true,
  })
  if (await instructions.count()) {
    await expect(
      instructions.locator('input,select,button,details'),
    ).toHaveCount(0)
    await expect(instructions).not.toContainText(
      /WGT|World Government|longer Venus/,
    )
    await expect(summary(page)).not.toContainText(
      /WGT|World Government|longer Venus/,
    )
  }
}

test('SC-003/005: remounts preserve configuration, results and locks without RNG draws or catalog mutation', async ({
  page,
  context,
}) => {
  await audit(page)
  const beforeCatalog = await catalog(page)
  expect(beforeCatalog.frozen).toBe(true)
  await page.getByLabel('Player count').selectOption('5')
  await page.getByLabel('Use expanded boards').uncheck()
  const beforeSetup = await draws(page)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  expect(await draws(page)).toBe(beforeSetup)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  expect(await draws(page)).toBeGreaterThan(beforeSetup)
  await page
    .getByRole('button', { name: 'Customize first player', exact: true })
    .click()
  await page
    .getByLabel('First-player choice', { exact: true })
    .selectOption('5')
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  const field = page.getByLabel('Milestone 3', { exact: true }),
    chosen = await alternative(field)
  const generatedDraws = await draws(page)
  await field.selectOption(chosen.value)
  await expect(
    page.getByLabel('Lock milestone 3', { exact: true }),
  ).toBeChecked()
  const before = await summary(page).textContent(),
    milestones = await objectiveIds(page, 'milestone')
  for (let visit = 0; visit < 2; visit++) {
    await content(page)
    await expect(page.getByLabel('Player count')).toHaveValue('5')
    await expect(page.getByLabel('Use expanded boards')).not.toBeChecked()
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await expect(
      page.getByLabel('Extended Start', { exact: true }),
    ).not.toBeChecked()
    await expect(
      page.getByLabel('Research drafting', { exact: true }),
    ).not.toBeChecked()
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    expect(await summary(page).textContent()).toBe(before)
    expect(await objectiveIds(page, 'milestone')).toEqual(milestones)
    await page
      .getByRole('button', { name: 'Customize milestones', exact: true })
      .click()
    await expect(page.getByLabel('Milestone 3', { exact: true })).toHaveValue(
      chosen.value,
    )
    await expect(
      page.getByLabel('Lock milestone 3', { exact: true }),
    ).toBeChecked()
  }
  expect(await draws(page)).toBe(generatedDraws)
  expect(await catalog(page)).toEqual(beforeCatalog)
  expect(
    await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    })),
  ).toEqual({ local: [], session: [] })
  expect(await context.cookies()).toEqual([])
  await scope(page)
})
test('AC-21/37–39: reload starts defaults and does not recover the previous in-memory game', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByLabel('Player count').selectOption('5')
  await enter(page)
  await page
    .getByRole('button', { name: 'Customize first player', exact: true })
    .click()
  await page
    .getByLabel('First-player choice', { exact: true })
    .selectOption('5')
  await page
    .getByRole('button', { name: 'Customize awards', exact: true })
    .click()
  await page.getByLabel('Lock award 1', { exact: true }).check()
  await page.reload()
  await expect(page.getByLabel('Player count')).toHaveValue('2')
  await expect(
    page
      .getByRole('group', { name: 'Board candidates', exact: true })
      .getByRole('checkbox', { checked: true }),
  ).toHaveCount(7)
  await scope(page)
  await enter(page)
  await expect(
    page.getByRole('list', { name: 'Selected colonies' }).getByRole('listitem'),
  ).toHaveCount(5)
  expect(
    Number(await page.locator('[data-first-player]').innerText()),
  ).toBeLessThanOrEqual(2)
  await page
    .getByRole('button', { name: 'Customize awards', exact: true })
    .click()
  await expect(
    page.getByLabel('Lock award 1', { exact: true }),
  ).not.toBeChecked()
  await expect(
    summary(page).locator('[data-summary-field="extendedStart"]'),
  ).toHaveText('On')
  await expect(
    summary(page).locator('[data-summary-field="researchDrafting"]'),
  ).toHaveText('On')
  await scope(page)
})
test('AC-36–39: select-all, Venus off/on and Reset never offer excluded components or digital card/gameplay actions', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await scope(page)
  await page.getByRole('button', { name: 'Select all', exact: true }).click()
  await scope(page)
  await enter(page)
  await scope(page)
  await content(page)
  await page.getByLabel('Venus Next', { exact: true }).click()
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
  await enter(page)
  await expect(page.locator('[data-objective-kind="milestone"]')).toHaveCount(5)
  await expect(page.locator('[data-objective-kind="award"]')).toHaveCount(5)
  await expect(page.locator('[data-instruction-id="su-04-1"]')).toHaveCount(0)
  await scope(page)
  await content(page)
  await page.getByLabel('Venus Next', { exact: true }).check()
  await enter(page)
  await expect(page.locator('[data-objective-kind="milestone"]')).toHaveCount(6)
  await expect(page.locator('[data-objective-kind="award"]')).toHaveCount(6)
  await expect(page.locator('[data-instruction-id="su-04-1"]')).toContainText(
    'standard Venus board',
  )
  await scope(page)
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset setup', exact: true }).click()
  await scope(page)
  await enter(page)
  await scope(page)
})
test('AC-25/SC-005: summary follows manual choices, target rerolls and a direct board change without a separate saved copy', async ({
  page,
}) => {
  await audit(page)
  const beforeCatalog = await catalog(page)
  await enter(page)
  await matchingSummary(page)
  await page
    .getByRole('button', { name: 'Customize first player', exact: true })
    .click()
  await page
    .getByLabel('First-player choice', { exact: true })
    .selectOption('2')
  await matchingSummary(page)
  await page
    .getByRole('button', { name: 'Reroll first player', exact: true })
    .click()
  await matchingSummary(page)
  await page
    .getByRole('button', { name: 'Customize colonies', exact: true })
    .click()
  const colony = page.getByLabel('Colony 1', { exact: true })
  await colony.selectOption((await alternative(colony)).value)
  await matchingSummary(page)
  await page
    .getByRole('button', { name: 'Reroll colonies', exact: true })
    .click()
  await matchingSummary(page)
  for (const kind of ['milestone', 'award'] as const) {
    await page
      .getByRole('button', { name: `Customize ${kind}s`, exact: true })
      .click()
    const field = page.getByLabel(
      `${kind === 'milestone' ? 'Milestone' : 'Award'} 3`,
      { exact: true },
    )
    const selected = await alternative(field)
    await field.selectOption(selected.value)
    await page
      .getByRole('button', { name: `Reroll ${kind}s`, exact: true })
      .click()
    await expect(field).toHaveValue(selected.value)
    await matchingSummary(page)
  }
  await page
    .getByRole('button', { name: 'Customize board', exact: true })
    .click()
  const board = page.getByLabel('Board choice', { exact: true }),
    target = await alternative(board)
  await board.selectOption(target.value)
  const dialog = page.getByRole('dialog', {
    name: 'Change board?',
    exact: true,
  })
  await expect
    .poll(
      async () =>
        (await dialog.isVisible()) ||
        (await summary(page)
          .locator('[data-summary-field="board"]')
          .innerText()) === target.label,
    )
    .toBe(true)
  if (await dialog.isVisible())
    await page
      .getByRole('button', { name: 'Change board', exact: true })
      .click()
  await expect(
    summary(page).locator('[data-summary-field="board"]'),
  ).toHaveText(target.label)
  await matchingSummary(page)
  expect(await catalog(page)).toEqual(beforeCatalog)
  await scope(page)
})
