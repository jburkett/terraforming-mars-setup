import { expect, test } from '@playwright/test'

test('T026: expansion view renders defaults and atomic page-local bulk controls', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/expansions.html')
  await expect(
    page.getByRole('heading', { name: 'Choose game content' }),
  ).toBeVisible()
  await page.getByLabel('Player count').selectOption('4')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await expect(page.getByLabel('Player count')).toHaveValue('4')
  await expect(page.getByLabel('Prelude', { exact: true })).not.toBeChecked()
  await expect(page.getByLabel('Prelude 2', { exact: true })).not.toBeChecked()
  await expect(
    page.getByLabel('Original board (Tharsis)', { exact: true }),
  ).toBeChecked()
  await expect(page.getByLabel('Hellas', { exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Select all', exact: true }).click()
  await expect(page.getByLabel('Hellas', { exact: true })).toBeEnabled()
  await expect(page.getByLabel('Hellas', { exact: true })).toBeChecked()
  await expect(page.getByLabel('Player count')).toHaveValue('4')
})
test('T026: dependency rejection is reflected immediately in the native checkbox', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/expansions.html')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Prelude 2', { exact: true }).check()
  await expect(page.getByText(/Prelude 2 requires Prelude/)).toBeVisible()
  await page.getByLabel('Prelude', { exact: true }).click()
  await expect(page.getByLabel('Prelude', { exact: true })).toBeChecked()
})

test('T027: variants are enabled without expansions and bulk controls affect only variants', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/variants.html')
  await expect(
    page.getByRole('heading', { name: 'Choose variants' }),
  ).toBeVisible()
  for (const name of ['Extended Start', 'Research drafting']) {
    await expect(page.getByLabel(name, { exact: true })).toBeChecked()
    await expect(page.getByLabel(name, { exact: true })).toBeEnabled()
  }
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  for (const name of ['Extended Start', 'Research drafting'])
    await expect(page.getByLabel(name, { exact: true })).not.toBeChecked()
  await page.getByRole('button', { name: 'Select all', exact: true }).click()
  for (const name of ['Extended Start', 'Research drafting'])
    await expect(page.getByLabel(name, { exact: true })).toBeChecked()
  await expect(page.getByLabel('Fixture content', { exact: true })).toHaveText(
    'none',
  )
})
test('T027: Back and Continue call the shared owner navigation actions', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/variants.html')
  await expect(page.getByLabel('Fixture view', { exact: true })).toHaveText(
    'variants',
  )
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByLabel('Fixture view', { exact: true })).toHaveText(
    'setup',
  )
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByLabel('Fixture view', { exact: true })).toHaveText(
    'expansions',
  )
})
