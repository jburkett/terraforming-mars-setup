import { catalogs } from '../../src/content/catalogs'
function frozen(value: unknown): boolean {
  return (
    value === null ||
    typeof value !== 'object' ||
    (Object.isFrozen(value) && Object.values(value).every(frozen))
  )
}
// Test-only reader of the same cached catalog module used by the application.
// This fixture is never imported by the production entry.
Object.defineProperty(globalThis, '__mvpCatalog', {
  value: () => ({ json: JSON.stringify(catalogs), frozen: frozen(catalogs) }),
})
