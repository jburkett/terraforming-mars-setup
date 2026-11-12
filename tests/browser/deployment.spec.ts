import { expect, test } from '@playwright/test'

test('production Pages URL and its compiled module return HTTP 200', async ({
  request,
}) => {
  const response = await request.get('./')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/html')
  const html = await response.text()
  const modules = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
    (match) => match[1]!,
  )
  expect(modules.length).toBeGreaterThan(0)
  for (const module of modules) {
    expect(module).toMatch(/^\/terraforming-mars-setup\/assets\/.+\.js$/)
    const asset = await request.get(module)
    expect(asset.status()).toBe(200)
    expect(asset.headers()['content-type']).toMatch(/javascript/)
  }
})

test('Vue mounts game configuration without runtime errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto('./')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle('Terraforming Mars Setup')
  await expect(page.locator('#app')).toHaveAttribute('data-v-app', '')
  await expect(
    page.getByRole('heading', { name: 'Choose game content' }),
  ).toBeVisible()
  await expect(page.getByLabel('Player count')).toHaveValue('2')
  await expect(page.getByLabel('Use expanded boards')).toBeChecked()
  expect(errors).toEqual([])
})

test('production public selections generate, customize and survive navigation', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('./')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByText('Selected board', { exact: true })).toBeVisible()
  await expect(
    page.getByRole('list', { name: 'Selected colonies' }).getByRole('listitem'),
  ).toHaveCount(5)
  await page
    .getByRole('button', { name: 'Customize first player', exact: true })
    .click()
  await page
    .getByLabel('First-player choice', { exact: true })
    .selectOption('2')
  await expect(page.locator('[data-first-player]')).toHaveText('2')
  const values = await page.locator('[data-selection-value]').allTextContents()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  expect(
    await page.locator('[data-selection-value]').allTextContents(),
  ).toEqual(values)
  expect(errors).toEqual([])
})

test('production setup includes sourced physical guidance and a live summary', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('./')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  const instructions = page.getByRole('region', {
    name: 'Physical setup instructions',
    exact: true,
  })
  const summary = page.getByRole('region', {
    name: 'Configuration summary',
    exact: true,
  })
  await expect(
    instructions.getByRole('list', { name: 'Setup instructions', exact: true }),
  ).toBeVisible()
  await expect(instructions).toContainText('Coming and Distant')
  await expect(instructions).toContainText(
    'separate facedown corporation and Prelude discard piles',
  )
  await expect(
    instructions.locator('[data-instruction-source]').first(),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Customize first player', exact: true })
    .click()
  await page
    .getByLabel('First-player choice', { exact: true })
    .selectOption('2')
  await expect(
    summary.locator('[data-summary-field="firstPlayer"]'),
  ).toHaveText('2')
  await expect(instructions.locator('[data-su="SU-01"]')).toContainText(
    'First player: 2',
  )
  await expect(summary.locator('[data-summary-objective-id]')).toHaveCount(12)
  await expect(instructions.getByRole('checkbox')).toHaveCount(0)
  expect(errors).toEqual([])
})
