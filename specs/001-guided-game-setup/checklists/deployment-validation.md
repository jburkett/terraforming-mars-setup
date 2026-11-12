# Deployment infrastructure verification

**Date:** 2026-11-12. **Authorization:** User-requested infrastructure story between Foundations and US1, implemented from latest fetched `origin/main` at `4b6856d`. Existing product requirements and the constitution are unchanged. The additional deployment design is recorded in [plan.md](../plan.md).

## Test-first evidence

| Check | Observed red result before implementation | Green result |
| --- | --- | --- |
| Built entry and repository base | The production build assertion failed because the old scaffold had no module entry. | A compiled module exists under `/terraforming-mars-setup/assets/` and the referenced output file exists. |
| Production HTTP and Vue mounting | Both smoke cases failed against the old scaffold: HTML alone did not provide a compiled module or a mounted Vue root. | HTML and JavaScript return HTTP 200 with appropriate content types; Vue mounts an empty `main`, without controls or runtime errors. |
| Workflow policy | Three assertions failed before the Pages workflow existed. | The workflow parses as YAML and enforces verification/build/smoke gates, main-push-only artifact upload/deployment, read-only verification, deployment-only Pages/OIDC permissions and pinned official actions. |

No US1 tests were written or implemented. The existing isolated build-gate fixtures were extended to copy the blank shell, preserving the invalid-catalog/no-emission checks.

## Final local checks

- Clean `npm ci`: passed with the committed lockfile. `yaml` is a development-only dependency for workflow-policy tests.
- `npm run format:check`: passed.
- `npm run lint`: passed with zero warnings, including typed SFC imports without rule suppression.
- `npm run typecheck`: passed.
- `npm run test -- --run`: 71 tests passed across 7 files, including all 67 foundation tests.
- `npm run build`: catalog validation passed before Vite emitted the runnable Vue shell and repository-prefixed module URLs.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:smoke`: 2 production-preview checks passed. The server was started and stopped by Playwright.
- Git whitespace, documentation links and task-boundary checks: passed before commit.

The smoke project uses production preview rather than Vite's development module URLs. It is isolated from the normal three-engine development browser suite. Local validation used installed system Chromium because Playwright browser downloads were previously blocked by this environment; CI installs Playwright's bundled Chromium and does not set the local override.

## Workflow and hosting limits

PRs run verification only. Successful pushes/merges to `main` can upload `dist` and deploy through the dependent `github-pages` job/environment. Neither this local verification nor draft PR creation deploys the site. The live URL and GitHub Pages/environment settings have not been claimed as verified here; apply the [one-time settings](../../../docs/github-pages.md), merge after review, and inspect the resulting deployment.

Only the blank infrastructure shell was added. T022–T064 remain unstarted: there is no game configuration, reactive session, public-selection workflow, setup guidance, summary or Reset UI. T028 will reuse and extend this shell when US1 is separately authorized; T062 will extend the existing verification workflow for complete application coverage.
