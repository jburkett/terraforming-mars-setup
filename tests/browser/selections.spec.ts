import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
const enterSetup = async (page: Page) => {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
const values = (page: Page) =>
  page.locator('[data-selection-value]').allTextContents()
async function alternative(select: Locator) {
  return select.evaluate((node) => {
    const field = node as HTMLSelectElement
    return [...field.options].find((o) => o.value !== field.value)!.value
  })
}
test('AC-07–09: first entry generates public results and unchanged revisits preserve them', async ({
  page,
}) => {
  await page.goto('./')
  await enterSetup(page)
  await expect(page.getByText('Selected board', { exact: true })).toBeVisible()
  await expect(page.getByText('First player', { exact: true })).toBeVisible()
  await expect(
    page.getByRole('list', { name: 'Selected colonies' }).getByRole('listitem'),
  ).toHaveCount(5)
  await expect(page.locator('[data-objective-kind="milestone"]')).toHaveCount(6)
  await expect(page.locator('[data-objective-kind="award"]')).toHaveCount(6)
  const before = await values(page)
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(
    page.getByLabel('Extended Start', { exact: true }),
  ).toBeDisabled()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  expect(await values(page)).toEqual(before)
  await expect(page.getByRole('button', { name: /reset/i })).toHaveCount(0)
})
test('AC-15: manual first-player and colony choices stay bounded and unique', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Player count').selectOption('3')
  await page.getByLabel('Colonies', { exact: true }).check()
  await enterSetup(page)
  await page
    .getByRole('button', { name: 'Customize first player', exact: true })
    .click()
  await expect(
    page.getByLabel('First-player choice', { exact: true }).locator('option'),
  ).toHaveCount(3)
  await page
    .getByLabel('First-player choice', { exact: true })
    .selectOption('3')
  await expect(page.locator('[data-first-player]')).toHaveText('3')
  await page
    .getByRole('button', { name: 'Customize colonies', exact: true })
    .click()
  const field = page.getByLabel('Colony 1', { exact: true })
  const replacement = await alternative(field)
  await field.selectOption(replacement)
  const colonyIds = await page
    .getByRole('list', { name: 'Selected colonies' })
    .getByRole('listitem')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-colony-id')))
  expect(new Set(colonyIds).size).toBe(5)
  for (let i = 2; i <= 5; i++)
    await expect(
      page
        .getByLabel(`Colony ${i}`, { exact: true })
        .locator(`option[value="${replacement}"]`),
    ).toHaveCount(0)
  await expect(
    page.getByRole('checkbox', { name: /lock colony/i }),
  ).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Customize board', exact: true })
    .click()
  await expect(
    page.getByLabel('Board choice', { exact: true }).locator('option'),
  ).toHaveCount(1)
})
test('AC-13/14: manual objectives auto-lock, filter both directions and reroll preserves locks', async ({
  page,
}) => {
  await page.goto('./')
  await enterSetup(page)
  const awards = await page
    .locator('[data-objective-kind="award"]')
    .allTextContents()
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  const third = page.getByLabel('Milestone 3', { exact: true })
  const choice = await alternative(third)
  await third.selectOption(choice)
  await expect(
    page.getByLabel('Lock milestone 3', { exact: true }),
  ).toBeChecked()
  for (const row of [1, 2, 4, 5])
    await expect(
      page
        .getByLabel(`Milestone ${row}`, { exact: true })
        .locator(`option[value="${choice}"]`),
    ).toHaveCount(0)
  await page.getByLabel('Lock milestone 1', { exact: true }).check()
  const first = await page
    .getByLabel('Milestone 1', { exact: true })
    .inputValue()
  await page
    .getByRole('button', { name: 'Reroll milestones', exact: true })
    .click()
  await expect(page.getByLabel('Milestone 1', { exact: true })).toHaveValue(
    first,
  )
  await expect(third).toHaveValue(choice)
  expect(
    await page.locator('[data-objective-kind="award"]').allTextContents(),
  ).toEqual(awards)
  for (let row = 1; row <= 5; row++)
    await page.getByLabel(`Lock milestone ${row}`, { exact: true }).check()
  const before = await page
    .locator('[data-objective-kind="milestone"]')
    .allTextContents()
  await page
    .getByRole('button', { name: 'Reroll milestones', exact: true })
    .click()
  expect(
    await page.locator('[data-objective-kind="milestone"]').allTextContents(),
  ).toEqual(before)
})
test('AC-31: printed Utopia retains Pioneer with a Colonies limitation and no MA controls', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Use expanded boards').check()
  for (const name of [
    'Original board (Tharsis)',
    'Hellas',
    'Elysium',
    'Terra Cimmeria',
    'Amazonis Planitia',
    'Vastitas Borealis',
  ])
    await page.getByLabel(name, { exact: true }).uncheck()
  await enterSetup(page)
  await expect(page.locator('[data-objective-kind="milestone"]')).toHaveCount(5)
  await expect(
    page
      .getByRole('region', { name: 'Milestones', exact: true })
      .getByText(/Pioneer is unattainable.*Colonies/),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Customize milestones', exact: true }),
  ).toHaveCount(0)
})
test('direct board changes confirm printed-objective loss and cancellation preserves everything', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Use expanded boards').check()
  for (const name of [
    'Original board (Tharsis)',
    'Utopia Planitia',
    'Terra Cimmeria',
    'Amazonis Planitia',
    'Vastitas Borealis',
  ])
    await page.getByLabel(name, { exact: true }).uncheck()
  await enterSetup(page)
  const before = await values(page)
  await page
    .getByRole('button', { name: 'Customize board', exact: true })
    .click()
  const board = page.getByLabel('Board choice', { exact: true })
  const target = await alternative(board)
  await board.selectOption(target)
  await expect(
    page.getByRole('dialog', { name: 'Change board?' }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Keep current board', exact: true })
    .click()
  expect(await values(page)).toEqual(before)
  await board.selectOption(target)
  await page.getByRole('button', { name: 'Change board', exact: true }).click()
  await expect(board).toHaveValue(target)
})
test('D6: an insufficient-pool fixture explains the conflict and permits returning to configuration', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/selection-conflict.html')
  await expect(page.getByRole('alert')).toContainText(
    /not enough eligible colonies/i,
  )
  await expect(page.getByText('Selected board', { exact: true })).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Return to configuration', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Choose game content' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await enterSetup(page)
  await expect(page.getByText('Selected board', { exact: true })).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
})
