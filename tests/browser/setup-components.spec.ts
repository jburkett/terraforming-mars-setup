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
