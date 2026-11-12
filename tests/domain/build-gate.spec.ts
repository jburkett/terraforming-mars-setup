import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
  copyFileSync,
  symlinkSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, expect, it } from 'vitest'
import { catalogs } from '../../src/content/catalogs'
const temporary: string[] = []
afterEach(() => {
  for (const path of temporary.splice(0))
    rmSync(path, { recursive: true, force: true })
})
function workspace() {
  const root = mkdtempSync(join(tmpdir(), 'mars-build-'))
  temporary.push(root)
  const input = join(root, 'src/content')
  const output = join(root, 'output')
  mkdirSync(input, { recursive: true })
  mkdirSync(output)
  mkdirSync(join(root, 'scripts'))
  for (const path of [
    'package.json',
    'index.html',
    'vite.config.ts',
    'scripts/build.ts',
    'scripts/validate-catalogs.ts',
    'src/content/types.ts',
    'src/content/validation.ts',
  ])
    copyFileSync(resolve(path), join(root, path))
  symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir')
  for (const [name, data] of Object.entries(catalogs))
    writeFileSync(join(input, `${name}.json`), JSON.stringify(data))
  return { input, output }
}
function build(input: string, output: string) {
  // Exercise the exact npm script, not a test-only alternate build path.
  return spawnSync('npm', ['run', 'build', '--', '--out-dir', output], {
    cwd: resolve(input, '../..'),
    encoding: 'utf8',
    timeout: 30_000,
  })
}
it('invalid catalog input prevents asset emission and preserves existing output', () => {
  const { input, output } = workspace()
  writeFileSync(
    join(input, 'boards.json'),
    JSON.stringify([{ id: 'not-a-board' }]),
  )
  writeFileSync(join(output, 'keep.txt'), 'existing output')
  const result = build(input, output)
  expect(result.error).toBeUndefined()
  expect(result.status).not.toBe(0)
  expect(result.stdout + result.stderr).toContain('boards.json[0]')
  expect(existsSync(join(output, 'index.html'))).toBe(false)
  expect(readFileSync(join(output, 'keep.txt'), 'utf8')).toBe('existing output')
}, 40_000)
it('valid complete catalogs permit Vite to emit the current HTML scaffold', () => {
  const { input, output } = workspace()
  const result = build(input, output)
  expect(result.error).toBeUndefined()
  expect(result.status, result.stdout + result.stderr).toBe(0)
  expect(readFileSync(join(output, 'index.html'), 'utf8')).toContain(
    'Terraforming Mars Setup',
  )
}, 40_000)
it.each(['{invalid JSON', 'null'])(
  'validator CLI rejects malformed content %s with file diagnostics',
  (body) => {
    const { input } = workspace()
    writeFileSync(join(input, 'boards.json'), body)
    const result = spawnSync(
      process.execPath,
      [resolve('scripts/validate-catalogs.ts'), '--content-dir', input],
      { encoding: 'utf8' },
    )
    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('boards.json')
  },
)
it('validator CLI reports missing files and rejects unknown flags', () => {
  const { input } = workspace()
  rmSync(join(input, 'instructions.json'))
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/validate-catalogs.ts'), '--content-dir', input],
    { encoding: 'utf8' },
  )
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('instructions.json[file]')
  const flags = spawnSync(
    process.execPath,
    [resolve('scripts/validate-catalogs.ts'), '--skip-validation'],
    { encoding: 'utf8' },
  )
  expect(flags.status).not.toBe(0)
})

it('cannot bypass the real build catalogs with an alternate valid directory', () => {
  const broken = workspace()
  const valid = workspace()
  writeFileSync(join(broken.input, 'boards.json'), '[]')
  const result = spawnSync(
    'npm',
    [
      'run',
      'build',
      '--',
      '--content-dir',
      valid.input,
      '--out-dir',
      broken.output,
    ],
    { cwd: resolve(broken.input, '../..'), encoding: 'utf8', timeout: 30_000 },
  )
  expect(result.status).not.toBe(0)
  expect(existsSync(join(broken.output, 'index.html'))).toBe(false)
}, 40_000)
