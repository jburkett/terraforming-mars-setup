import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { options, readCatalogDirectory } from './validate-catalogs.ts'

try {
  const { contentDir, outDir } = options(process.argv.slice(2))
  if (contentDir !== resolve('src/content'))
    throw new Error(
      'Build always validates src/content; alternate directories are supported only by validate:catalogs.',
    )
  // Do not start Vite (or alter any previous output) unless all catalogs are valid.
  readCatalogDirectory(contentDir)
  console.log('Catalog validation passed; starting Vite build.')
  const result = spawnSync(
    process.execPath,
    [resolve('node_modules/vite/bin/vite.js'), 'build', '--outDir', outDir],
    { stdio: 'inherit' },
  )
  if (result.error) throw result.error
  process.exitCode = result.status ?? 1
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
