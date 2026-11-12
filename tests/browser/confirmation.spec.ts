import { expect, test } from '@playwright/test'
test('T057: board confirmation focuses cancellation, supports keyboard control and restores the trigger', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/confirmation.html?mode=board')
  const trigger = page.getByRole('button', {
    name: 'Preview change',
    exact: true,
  })
  await trigger.click()
  const dialog = page.getByRole('dialog', {
    name: 'Change board?',
    exact: true,
  })
  await expect(dialog).toContainText('printed milestones and awards')
  const cancel = page.getByRole('button', {
    name: 'Keep current board',
    exact: true,
  })
  await expect(cancel).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Change board', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(cancel).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.getByLabel('Committed board', { exact: true })).toHaveText(
    'tharsis',
  )
  await trigger.click()
  await page.getByRole('button', { name: 'Change board', exact: true }).click()
  await expect(page.getByLabel('Committed board', { exact: true })).toHaveText(
    'hellas',
  )
  await expect(trigger).toBeFocused()
})
test('T057: configuration dialog names actual selection and lock losses, retaining committed state before consent', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/confirmation.html?mode=edit')
  const trigger = page.getByRole('button', {
    name: 'Preview change',
    exact: true,
  })
  await trigger.click()
  const dialog = page.getByRole('dialog', {
    name: 'Change configuration?',
    exact: true,
  })
  await expect(dialog).toContainText(/Pioneer.*locked/)
  await expect(dialog).toContainText('Colonies')
  await expect(dialog).toContainText('Physical actions are not undone')
  await expect(page.getByLabel('Pioneer locked', { exact: true })).toHaveText(
    'true',
  )
  await page
    .getByRole('button', { name: 'Keep configuration', exact: true })
    .click()
  await expect(page.getByLabel('Pioneer locked', { exact: true })).toHaveText(
    'true',
  )
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
  await expect(page.getByLabel('Pioneer locked', { exact: true })).toHaveText(
    'false',
  )
  await expect(
    page.getByLabel('Committed colonies', { exact: true }),
  ).toHaveText('none')
})
test('T057: Reset uses the shared dialog and clears selections only after the labeled confirmation', async ({
  page,
}) => {
  await page.goto('./tests/fixtures/confirmation.html?mode=reset')
  await page
    .getByRole('button', { name: 'Preview change', exact: true })
    .click()
  await expect(
    page.getByRole('dialog', { name: 'Reset game setup?', exact: true }),
  ).toContainText(/Pioneer.*locked/)
  await expect(page.getByLabel('Committed board', { exact: true })).toHaveText(
    'tharsis',
  )
  await page.getByRole('button', { name: 'Reset setup', exact: true }).click()
  await expect(page.getByLabel('Committed board', { exact: true })).toHaveText(
    'none',
  )
  await expect(page.getByLabel('Committed view', { exact: true })).toHaveText(
    'expansions',
  )
  await expect(
    page.getByRole('button', { name: 'Preview change', exact: true }),
  ).toBeFocused()
})
