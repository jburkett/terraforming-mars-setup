import { expect, test } from '@playwright/test'

const content = [
  'Corporate Era',
  'Venus Next',
  'Prelude',
  'Prelude 2',
  'Colonies',
  'Turmoil',
  'Milestones & Awards',
]
const boards = [
  'Original board (Tharsis)',
  'Hellas',
  'Elysium',
  'Utopia Planitia',
  'Terra Cimmeria',
  'Amazonis Planitia',
  'Vastitas Borealis',
]
test.beforeEach(async ({ page }) => {
  await page.goto('./')
})

test('AC-01: new session has all content/boards and variants on, with two players', async ({
  page,
}) => {
  await expect(
    page.getByRole('heading', { name: 'Choose game content' }),
  ).toBeVisible()
  await expect(page.getByLabel('Player count')).toHaveValue('2')
  for (const name of [...content, ...boards, 'Use expanded boards'])
    await expect(
      page.getByRole('checkbox', { name, exact: true }),
    ).toBeChecked()
  await expect(
    page.getByRole('checkbox', {
      name: /WGT|World Government|longer Venus|Hellas & Elysium/i,
    }),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByLabel('Extended Start', { exact: true })).toBeChecked()
  await expect(
    page.getByLabel('Research drafting', { exact: true }),
  ).toBeChecked()
})
test('AC-02/03 and D2: page-top bulk controls preserve player count and restore all boards', async ({
  page,
}) => {
  await page.getByLabel('Player count').selectOption('5')
  const all = page.getByRole('button', { name: 'Select all', exact: true })
  expect(
    await all.evaluate((node) =>
      Boolean(
        node.compareDocumentPosition(document.querySelector('select')!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ),
  ).toBe(true)
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await expect(page.getByLabel('Player count')).toHaveValue('5')
  for (const name of content)
    await expect(
      page.getByRole('checkbox', { name, exact: true }),
    ).not.toBeChecked()
  await expect(page.getByLabel('Use expanded boards')).not.toBeChecked()
  for (const [index, name] of boards.entries()) {
    const field = page.getByRole('checkbox', { name, exact: true })
    await expect(field).toBeDisabled()
    if (index === 0) await expect(field).toBeChecked()
    else await expect(field).not.toBeChecked()
  }
  await all.click()
  for (const name of [...content, ...boards])
    await expect(
      page.getByRole('checkbox', { name, exact: true }),
    ).toBeChecked()
  await expect(page.getByLabel('Player count')).toHaveValue('5')
})
test('AC-04: P2 visibly keeps Prelude on, while bulk-none disables both atomically', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Prelude 2', { exact: true }).check()
  await expect(page.getByLabel('Prelude', { exact: true })).toBeChecked()
  await expect(page.getByText(/Prelude 2 requires Prelude/)).toBeVisible()
  // Use click: a rejected uncheck intentionally leaves the checkbox checked.
  await page.getByLabel('Prelude', { exact: true }).click()
  await expect(page.getByLabel('Prelude', { exact: true })).toBeChecked()
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await expect(page.getByLabel('Prelude', { exact: true })).not.toBeChecked()
  await expect(page.getByLabel('Prelude 2', { exact: true })).not.toBeChecked()
  await expect(page.getByText(/Prelude 2 requires Prelude/)).toHaveCount(0)
})
test('AC-06: Tharsis may be excluded and the last candidate restores inactive Tharsis', async ({
  page,
}) => {
  await page.getByLabel(boards[0]!, { exact: true }).uncheck()
  await expect(page.getByLabel('Use expanded boards')).toBeChecked()
  for (const name of boards.slice(1))
    await page.getByLabel(name, { exact: true }).uncheck()
  await expect(page.getByLabel('Use expanded boards')).not.toBeChecked()
  await expect(page.getByLabel(boards[0]!, { exact: true })).toBeChecked()
  for (const name of boards)
    await expect(page.getByLabel(name, { exact: true })).toBeDisabled()
})
test('AC-05: variants remain available without expansions; Back and setup retain choices', async ({
  page,
}) => {
  await page.getByLabel('Player count').selectOption('3')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Choose variants' }),
  ).toBeVisible()
  for (const name of ['Extended Start', 'Research drafting']) {
    await expect(page.getByLabel(name, { exact: true })).toBeEnabled()
    await expect(page.getByLabel(name, { exact: true })).toBeChecked()
  }
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  for (const name of ['Extended Start', 'Research drafting'])
    await expect(page.getByLabel(name, { exact: true })).not.toBeChecked()
  await page.getByRole('button', { name: 'Select all', exact: true }).click()
  await page.getByLabel('Extended Start', { exact: true }).uncheck()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByLabel('Player count')).toHaveValue('3')
  for (const name of content)
    await expect(page.getByLabel(name, { exact: true })).not.toBeChecked()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(
    page.getByLabel('Extended Start', { exact: true }),
  ).not.toBeChecked()
  await expect(
    page.getByLabel('Research drafting', { exact: true }),
  ).toBeChecked()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Game setup', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Reset', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(
    page.getByLabel('Extended Start', { exact: true }),
  ).not.toBeChecked()
})
test('expanded boards can be switched off/on and a reload creates a fresh session', async ({
  page,
}) => {
  await page.getByLabel('Use expanded boards').uncheck()
  for (const name of boards)
    await expect(page.getByLabel(name, { exact: true })).toBeDisabled()
  await page.getByLabel('Use expanded boards').check()
  for (const name of boards) {
    await expect(page.getByLabel(name, { exact: true })).toBeEnabled()
    await expect(page.getByLabel(name, { exact: true })).toBeChecked()
  }
  await page.getByLabel('Player count').selectOption('4')
  await page.reload()
  await expect(page.getByLabel('Player count')).toHaveValue('2')
})
