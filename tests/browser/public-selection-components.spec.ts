import { expect, test } from '@playwright/test'
test('T037: manual objective selection locks and filters all other rows', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/objectives.html')
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await page
    .getByLabel('Milestone 3', { exact: true })
    .selectOption('ma:milestone:terraformer')
  await expect(
    page.getByLabel('Lock milestone 3', { exact: true }),
  ).toBeChecked()
  for (const row of [1, 2, 4, 5])
    await expect(
      page
        .getByLabel(`Milestone ${row}`, { exact: true })
        .locator('option[value="ma:milestone:terraformer"]'),
    ).toHaveCount(0)
  await expect(page.locator('[data-objective-kind="milestone"]')).toHaveCount(6)
  await expect(page.getByText('Hoverlord', { exact: true })).toBeVisible()
})
test('T037: unlocked-only reroll leaves a manually locked row in place', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/objectives.html')
  await page
    .getByRole('button', { name: 'Customize milestones', exact: true })
    .click()
  await page
    .getByLabel('Milestone 3', { exact: true })
    .selectOption('ma:milestone:terraformer')
  await page
    .getByRole('button', { name: 'Reroll milestones', exact: true })
    .click()
  await expect(page.getByLabel('Milestone 3', { exact: true })).toHaveValue(
    'ma:milestone:terraformer',
  )
})
