import { expect, test } from '@playwright/test'
test('T047: instructions render one visible ordered sourced list without interaction or progress state', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/instruction-list.html')
  const region = page.getByRole('region', {
    name: 'Physical setup instructions',
    exact: true,
  })
  const list = region.getByRole('list', {
    name: 'Setup instructions',
    exact: true,
  })
  await expect(list).toBeVisible()
  const rows = list.locator(':scope > li')
  expect(await rows.count()).toBeGreaterThan(12)
  await expect(rows.first()).toContainText('SU-01')
  await expect(rows.first()).toContainText('Board: Tharsis. First player: 2.')
  await expect(rows.first()).toContainText('Rules · B')
  await expect(rows.first()).toContainText('Product decision · SPEC')
  const ids = await rows.evaluateAll((nodes) =>
    nodes.map((n) => n.getAttribute('data-su')),
  )
  expect(ids).toEqual([...ids].sort())
  for (const row of await rows.all()) {
    await expect(row).toBeVisible()
    await expect(row.locator('[data-instruction-source]').first()).toBeVisible()
  }
  await expect(region.locator('input,select,button,details')).toHaveCount(0)
  await expect(region).toContainText('15 M€')
})

test('T048: printed summary includes committed values and the complete Pioneer limitation without edit controls', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/configuration-summary.html')
  const region = page.getByRole('region', {
    name: 'Configuration summary',
    exact: true,
  })
  await expect(region).toBeVisible()
  await expect(region.locator('[data-summary-field="playerCount"]')).toHaveText(
    '3',
  )
  await expect(region.locator('[data-summary-field="firstPlayer"]')).toHaveText(
    '2',
  )
  await expect(region.locator('[data-summary-field="board"]')).toHaveText(
    'Utopia Planitia',
  )
  await expect(region.locator('[data-summary-field="content"]')).toHaveText(
    'Base game only',
  )
  await expect(
    region.locator('[data-summary-field="extendedStart"]'),
  ).toHaveText('Off')
  await expect(
    region.locator('[data-summary-field="researchDrafting"]'),
  ).toHaveText('On')
  await expect(region.locator('[data-summary-objective-id]')).toHaveCount(10)
  await expect(region).toContainText(
    'Pioneer is unattainable: requires Colonies.',
  )
  await expect(region).toContainText('Printed · Utopia Planitia')
  await expect(region.locator('input,select,button,details')).toHaveCount(0)
})
test('T048: MA and fixed Venus source versions appear with selected colonies and effective thresholds', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/configuration-summary.html?mode=ma')
  const region = page.getByRole('region', {
    name: 'Configuration summary',
    exact: true,
  })
  await expect(region).toContainText('Terraformer: 29 TR.')
  await expect(region).toContainText('Milestones & Awards · replacement')
  await expect(region).toContainText('Venus Next · fixed')
  await expect(region.locator('[data-summary-objective-id]')).toHaveCount(12)
  await expect(region.locator('[data-summary-field="colonies"]')).toContainText(
    'Enceladus',
  )
  await expect(region).not.toContainText(/WGT|World Government|longer Venus/)
})
