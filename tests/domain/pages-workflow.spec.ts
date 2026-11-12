import { existsSync, readFileSync } from 'node:fs'
import { expect, it, vi } from 'vitest'
import { parseDocument } from 'yaml'

const workflowPath = new URL(
  '../../.github/workflows/pages.yml',
  import.meta.url,
)
function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}
function workflow() {
  const document = parseDocument(
    existsSync(workflowPath) ? readFileSync(workflowPath, 'utf8') : '{}',
    { uniqueKeys: true },
  )
  expect(document.errors).toEqual([])
  return record(document.toJS() as unknown)
}
const trustedMainPush =
  "github.event_name == 'push' && github.ref == 'refs/heads/main'"
it('verifies pull requests but only deploys verified main pushes through the Pages environment', () => {
  const value = workflow()
  expect(value.on).toMatchObject({
    push: { branches: ['main'] },
    pull_request: { branches: ['main'] },
  })
  expect(value.permissions).toEqual({ contents: 'read' })
  const jobs = record(value.jobs)
  expect(jobs.deploy).toMatchObject({
    if: trustedMainPush,
    needs: 'verify',
    environment: { name: 'github-pages' },
    permissions: { pages: 'write', 'id-token': 'write' },
  })
  expect(record(jobs.verify).permissions).toBeUndefined()
})
it('requires checks, a catalog-gated build and production smoke before uploading the main artifact', () => {
  const verify = record(record(workflow().jobs).verify)
  const steps: unknown[] = Array.isArray(verify.steps) ? verify.steps : []
  const commands = steps
    .map((step) => record(step).run)
    .filter((run): run is string => typeof run === 'string')
  for (const command of [
    'npm ci',
    'npm run format:check',
    'npm run lint',
    'npm run typecheck',
    'npm run test -- --run',
    'npm run build',
    'npm run test:smoke',
  ])
    expect(commands).toContain(command)
  const build = commands.indexOf('npm run build')
  expect(build).toBeLessThan(commands.indexOf('npm run test:smoke'))
  const upload = steps
    .map(record)
    .find(
      (step) =>
        typeof step.uses === 'string' &&
        step.uses.startsWith('actions/upload-pages-artifact@'),
    )
  expect(upload).toMatchObject({ if: trustedMainPush, with: { path: 'dist' } })
  expect(
    steps.findIndex((step) => record(step).run === 'npm run test:smoke'),
  ).toBeLessThan(
    steps.findIndex(
      (step) => record(step) === upload || record(step).uses === upload?.uses,
    ),
  )
})
it('pins official actions and keeps deployment privileges out of untrusted verification', () => {
  const value = workflow()
  const jobs = Object.values(record(value.jobs)).map(record)
  const uses = jobs
    .flatMap((job) =>
      Array.isArray(job.steps) ? (job.steps as unknown[]).map(record) : [],
    )
    .map((step) => step.uses)
    .filter((use): use is string => typeof use === 'string')
  expect(uses.length).toBeGreaterThanOrEqual(5)
  for (const use of uses) expect(use).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/)
  expect(record(value.on).pull_request_target).toBeUndefined()
})

it('MVP verification validates catalogs explicitly and runs every browser engine', () => {
  const steps = record(record(workflow().jobs).verify).steps as unknown[]
  const commands = steps.map((step) => record(step).run)
  expect(commands).toContain('npm run validate:catalogs')
  expect(commands.indexOf('npm run validate:catalogs')).toBeLessThan(
    commands.indexOf('npm run test -- --run'),
  )
  expect(commands).toContain(
    'npm run test:e2e -- --project=chromium --project=firefox --project=webkit',
  )
})
it('keeps distinct browser/production reports and retains failure evidence without changing Pages guards', () => {
  const steps = (record(record(workflow().jobs).verify).steps as unknown[]).map(
    record,
  )
  const browsers = steps.find(
    (step) =>
      typeof step.run === 'string' && step.run.startsWith('npm run test:e2e'),
  )
  const production = steps.find((step) => step.run === 'npm run test:smoke')
  expect(record(browsers?.env).PLAYWRIGHT_HTML_OUTPUT_DIR).toBe(
    'playwright-report/browsers',
  )
  expect(record(production?.env).PLAYWRIGHT_HTML_OUTPUT_DIR).toBe(
    'playwright-report/production',
  )
  const reports = steps.find(
    (step) =>
      typeof step.uses === 'string' &&
      step.uses.startsWith('actions/upload-artifact@'),
  )
  expect(reports).toMatchObject({
    if: 'always()',
    with: { 'retention-days': 7, 'if-no-files-found': 'ignore' },
  })
  expect(record(reports?.with).path).toContain('playwright-report/')
  expect(record(reports?.with).path).toContain('test-results/')
  expect(steps.indexOf(production!)).toBeLessThan(steps.indexOf(reports!))
  const pages = steps.find(
    (step) =>
      typeof step.uses === 'string' &&
      step.uses.startsWith('actions/upload-pages-artifact@'),
  )
  expect(pages?.if).toBe(trustedMainPush)
  expect(steps.indexOf(reports!)).toBeLessThan(steps.indexOf(pages!))
})
it('enables a non-opening HTML report in CI while retaining the three engine projects', async () => {
  vi.stubEnv('CI', 'true')
  vi.resetModules()
  const { default: config } = await import('../../playwright.config')
  expect(config.projects?.map((project) => project.name)).toEqual([
    'chromium',
    'firefox',
    'webkit',
  ])
  expect(config.reporter).toEqual([['line'], ['html', { open: 'never' }]])
})
