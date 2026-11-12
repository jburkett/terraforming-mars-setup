import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CATALOG_FILES } from '../src/content/types.ts'
import type { Catalogs } from '../src/content/types.ts'
import {
  CatalogValidationError,
  parseCatalogs,
} from '../src/content/validation.ts'

export function readCatalogDirectory(directory: string): Catalogs {
  const input: Record<string, unknown> = {}
  const diagnostics: string[] = []
  for (const name of CATALOG_FILES) {
    try {
      const value: unknown = JSON.parse(
        readFileSync(resolve(directory, `${name}.json`), 'utf8'),
      )
      input[name] = value
    } catch (error) {
      diagnostics.push(
        `${name}.json[file]: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
  if (diagnostics.length) throw new CatalogValidationError(diagnostics)
  return parseCatalogs(input)
}

export function options(args: readonly string[]): {
  contentDir: string
  outDir: string
} {
  const result = { contentDir: resolve('src/content'), outDir: resolve('dist') }
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i]
    const value = args[i + 1]
    if (
      !['--content-dir', '--out-dir'].includes(flag ?? '') ||
      !value ||
      value.startsWith('--')
    )
      throw new Error('Usage: [--content-dir DIRECTORY] [--out-dir DIRECTORY]')
    if (flag === '--content-dir') result.contentDir = resolve(value)
    else result.outDir = resolve(value)
  }
  return result
}

if (import.meta.main) {
  try {
    const { contentDir } = options(process.argv.slice(2))
    readCatalogDirectory(contentDir)
    console.log(`Catalogs valid: ${contentDir}`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
