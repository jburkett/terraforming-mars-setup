import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
async function namedControls(page: Page) {
  for (const control of await page.locator('button,input,select').all())
    await expect(control).toHaveAccessibleName(/.+/)
}
for (const viewport of [
  { width: 1100, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`T061: ${viewport.width}px keyboard navigation announces each view and keeps the setup readable`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.goto('./')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await namedControls(page)
    await page.getByLabel('Use expanded boards').focus()
    await page.keyboard.press('Space')
    await expect(page.getByLabel('Use expanded boards')).not.toBeChecked()
    await page.getByRole('button', { name: 'Continue', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(
      page.getByRole('heading', { name: 'Choose variants', exact: true }),
    ).toBeFocused()
    await namedControls(page)
    await page.getByRole('button', { name: 'Back', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(
      page.getByRole('heading', { name: 'Choose game content', exact: true }),
    ).toBeFocused()
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await page.getByRole('button', { name: 'Continue', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(
      page.getByRole('heading', { name: 'Game setup', exact: true }),
    ).toBeFocused()
    await page
      .getByRole('button', { name: 'Customize milestones', exact: true })
      .focus()
    await page.keyboard.press('Enter')
    await namedControls(page)
    const table = page.getByRole('table', { name: 'Milestones', exact: true })
    await expect(table.getByRole('columnheader')).toHaveText([
      'Milestone',
      'Lock',
    ])
    for (const cell of await table.locator('th,td').all()) {
      expect(
        await cell.evaluate((node) => {
          const style = getComputedStyle(node)
          return [
            style.borderTopWidth,
            style.borderRightWidth,
            style.borderBottomWidth,
            style.borderLeftWidth,
          ].every((width) => width === '0px')
        }),
      ).toBe(true)
    }
    const instructions = page.getByRole('region', {
      name: 'Physical setup instructions',
      exact: true,
    })
    await expect(
      instructions.getByRole('list', {
        name: 'Setup instructions',
        exact: true,
      }),
    ).toBeVisible()
    await expect(
      instructions.locator('details,input,select,button'),
    ).toHaveCount(0)
    for (const step of await instructions
      .locator('[data-instruction-id]')
      .all())
      await expect(step).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await expect(page.locator('[aria-current="step"]')).toHaveText('3 Setup')
  })
}
test('T061: confirmed loss returns focus to Continue when the initiating board checkbox becomes disabled', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Select none', exact: true }).click()
  await page.getByLabel('Use expanded boards').check()
  for (const name of [
    'Original board (Tharsis)',
    'Elysium',
    'Utopia Planitia',
    'Terra Cimmeria',
    'Amazonis Planitia',
    'Vastitas Borealis',
  ])
    await page.getByLabel(name, { exact: true }).uncheck()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByLabel('Hellas', { exact: true }).click()
  await expect(
    page.getByRole('dialog', { name: 'Change configuration?', exact: true }),
  ).toContainText('Hellas')
  await page.getByRole('button', { name: 'Apply changes', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Hellas', { exact: true })).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Continue', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Choose variants', exact: true }),
  ).toBeFocused()
})
