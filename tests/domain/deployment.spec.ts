import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { expect, it } from 'vitest'

it('builds a module-backed Vue entry with assets under the repository Pages prefix', () => {
  const output = mkdtempSync(join(tmpdir(), 'mars-pages-'))
  try {
    const result = spawnSync(
      'npm',
      ['run', 'build', '--', '--out-dir', output],
      { encoding: 'utf8', timeout: 30_000 },
    )
    expect(result.status, result.stdout + result.stderr).toBe(0)
    const html = readFileSync(join(output, 'index.html'), 'utf8')
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
      (match) => match[1]!,
    )
    expect(scripts.length).toBeGreaterThan(0)
    for (const path of scripts) {
      expect(path).toMatch(/^\/terraforming-mars-setup\/assets\/.+\.js$/)
      const asset = readFileSync(
        join(output, path.replace('/terraforming-mars-setup/', '')),
        'utf8',
      )
      expect(asset.length).toBeGreaterThan(0)
    }
  } finally {
    rmSync(output, { recursive: true, force: true })
  }
}, 40_000)
