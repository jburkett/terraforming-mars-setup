import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
const instructions = (page: Page) =>
  page.getByRole('region', { name: 'Physical setup instructions', exact: true })
const summary = (page: Page) =>
  page.getByRole('region', { name: 'Configuration summary', exact: true })
async function enter(page: Page) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
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
test('AC-16–25/38: all-on physical setup is visible, sourced, ordered and agrees with live summary', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByLabel('Player count').selectOption('4')
  await enter(page)
  const list = instructions(page).getByRole('list', {
    name: 'Setup instructions',
    exact: true,
  })
  await expect(list).toBeVisible()
  const steps = list.locator(':scope > li')
  expect(await steps.count()).toBeGreaterThan(12)
  const ids = await steps.evaluateAll((nodes) =>
    nodes.map((n) => n.getAttribute('data-su')),
  )
  expect([...new Set(ids)]).toEqual(
    Array.from(
      { length: 12 },
      (_, i) => `SU-${String(i + 1).padStart(2, '0')}`,
    ),
  )
  for (const row of await steps.all()) {
    await expect(row).toBeVisible()
    await expect(row.locator('[data-instruction-source]').first()).toBeVisible()
  }
  await expect(instructions(page)).toContainText('Coming and Distant')
  await expect(instructions(page)).toContainText('4 trade fleets')
  await expect(instructions(page)).toContainText('six Preludes')
  await expect(instructions(page)).toContainText(
    'separate facedown corporation and Prelude discard piles',
  )
  await expect(instructions(page)).toContainText('15 M€')
  await expect(instructions(page)).toContainText('Product decision')
  await expect(
    summary(page).locator('[data-summary-field="playerCount"]'),
  ).toHaveText('4')
  await expect(
    summary(page).locator('[data-summary-field="content"]'),
  ).toContainText('Prelude 2')
  await expect(
    summary(page).locator('[data-summary-field="researchDrafting"]'),
  ).toHaveText('On')
  await page
    .getByRole('button', { name: 'Customize first player', exact: true })
    .click()
  await page
    .getByLabel('First-player choice', { exact: true })
    .selectOption('3')
  await expect(
    summary(page).locator('[data-summary-field="firstPlayer"]'),
  ).toHaveText('3')
  await expect(
    instructions(page).locator('[data-instruction-id="su-01-1"]'),
  ).toContainText('First player: 3')
  const before = await summary(page).textContent()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  expect(await summary(page).textContent()).toBe(before)
  await expect(instructions(page).getByRole('checkbox')).toHaveCount(0)
  await expect(
    instructions(page).locator('input,select,button,details'),
  ).toHaveCount(0)
  await expect(summary(page).locator('input,select,button')).toHaveCount(0)
  await expect(page.getByRole('textbox')).toHaveCount(0)
  await expect(
    page.getByRole('button', {
      name: /draw.*(card|event)|next turn|solar phase|reset/i,
    }),
  ).toHaveCount(0)
  await expect(instructions(page)).not.toContainText(
    /WGT|longer Venus|Execute the Solar/,
  )
})
test('AC-17/21/22: base-only teaching shows ordinary and Beginner branches with no expansion instructions', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(instructions(page)).toContainText('nine oceans')
  await expect(instructions(page)).toContainText('production to 1')
  await expect(instructions(page)).toContainText(
    '42 M€ and ten free starting projects',
  )
  await expect(instructions(page)).toContainText('any two corporations')
  await expect(instructions(page)).toContainText(
    'ordinary corporations pay 3 M€',
  )
  await expect(
    instructions(page).locator(
      '[data-su="SU-03"], [data-su="SU-10"], [data-su="SU-11"]',
    ),
  ).toHaveCount(0)
  await expect(
    summary(page).locator('[data-summary-field="content"]'),
  ).toHaveText('Base game only')
  await expect(
    summary(page).locator('[data-summary-field="colonies"]'),
  ).toHaveText('Not enabled')
  await expect(
    summary(page).locator('[data-summary-field="extendedStart"]'),
  ).toHaveText('Off')
  await expect(summary(page)).not.toContainText(
    /WGT|World Government|longer Venus/,
  )
})
test('AC-18/36: Amazonis has eleven oceans and standard Venus with conditional map reminder', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Venus Next', { exact: true }).check()
  await chooseOnlyBoard(page, 'Amazonis Planitia')
  await enter(page)
  await expect(instructions(page)).toContainText('eleven oceans')
  await expect(instructions(page)).toContainText('13 extra city/greenery tiles')
  await expect(instructions(page)).toContainText(
    'standard Venus board with its marker at 0',
  )
  await expect(instructions(page)).toContainText(
    'delegate bonuses when Turmoil is disabled',
  )
  await expect(instructions(page)).not.toContainText('nine oceans')
  await expect(
    summary(page).locator('[data-summary-field="board"]'),
  ).toHaveText('Amazonis Planitia')
  await expect(summary(page)).toContainText(
    'Lobbyist is unattainable: requires Turmoil.',
  )
})

for (const [board, objective, missing] of [
  ['Utopia Planitia', 'Pioneer', 'Colonies'],
  ['Terra Cimmeria', 'Planetologist', 'Venus Next'],
] as const) {
  test(`AC-35: ${board} printed limitation also appears in summary`, async ({
    page,
  }) => {
    await page.goto('./')
    await page.getByRole('button', { name: 'Select none', exact: true }).click()
    await chooseOnlyBoard(page, board)
    await enter(page)
    await expect(summary(page)).toContainText(
      `${objective} is unattainable: requires ${missing}.`,
    )
    await expect(
      summary(page).locator('[data-summary-objective-id]'),
    ).toHaveCount(10)
    await expect(instructions(page)).toContainText(
      board === 'Utopia Planitia'
        ? 'no volcanic regions'
        : 'colony bonus without Colonies',
    )
  })
}
test('AC-21: Prelude ordinary deal has four free Preludes and both variants are recorded', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Prelude', { exact: true }).check()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByLabel('Extended Start', { exact: true }).uncheck()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(instructions(page)).toContainText('deal four Preludes')
  await expect(instructions(page)).toContainText('keep two at no purchase cost')
  await expect(
    summary(page).locator('[data-summary-field="extendedStart"]'),
  ).toHaveText('Off')
  await expect(
    summary(page).locator('[data-summary-field="researchDrafting"]'),
  ).toHaveText('On')
})
