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

test('Vue mounts a blank page without US1 controls or runtime errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto('./')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle('Terraforming Mars Setup')
  await expect(page.locator('#app')).toHaveAttribute('data-v-app', '')
  await expect(page.getByRole('main')).toBeEmpty()
  await expect(page.locator('body')).toHaveText('')
  await expect(page.locator('input, button, select, textarea')).toHaveCount(0)
  expect(errors).toEqual([])
})
