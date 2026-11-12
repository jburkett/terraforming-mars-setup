# GitHub Pages deployment

The Vue 3 configuration application is served at:

https://jburkett.github.io/terraforming-mars-setup/

This is the intended deployment URL, not a claim that this branch is already published. Vite uses the project base `/terraforming-mars-setup/`; the root `/` is not this project's application URL. No custom domain, router, backend or persistence is configured.

## One-time repository settings

A repository administrator must apply these settings before the first deployment:

1. In **Settings → Pages → Build and deployment**, select **Source: GitHub Actions**. Do not select a branch or create a `gh-pages` branch.
2. In **Settings → Actions → General**, ensure GitHub Actions is enabled and the official `actions/*` actions used by the workflow are allowed. The repository can retain read-only default workflow permissions; the deployment job explicitly requests only `pages: write` and `id-token: write`.
3. In **Settings → Environments**, check the `github-pages` environment. Create it if needed, and allow deployments from `main` (for example, select **Selected branches and tags** and add branch `main`). If required-reviewer protection is configured, a human must approve the environment deployment after each successful verification run. Do not require a branch that the deployment workflow cannot use.

These settings are documented, not changed by this PR. No personal access token or repository secret is needed; deployment uses GitHub's built-in token and OIDC support.

## Verification and deployment

`.github/workflows/pages.yml` runs on pull requests targeting `main` and pushes to `main`, including merges. Its verification job installs locked dependencies, checks formatting/lint/types, runs the domain/infrastructure tests, builds through the catalog gate, runs the complete MVP browser regressions in Chromium, Firefox and WebKit, and smoke-tests the production preview with Chromium.

Only a successful `main` push run uploads `dist` and enters the dependent deployment job. That job uses the `github-pages` environment and the official Pages actions. PR verification has no Pages/OIDC write permissions and never deploys. Runs for a ref are serialized so deployments cannot race. Actions are pinned to immutable commit SHAs.

After merging, inspect **Actions → GitHub Pages**. If environment approval is required, approve that deployment, then follow the deployment URL in the run/environment. Verify that the project URL returns HTTP 200 and shows the game-content configuration page. The local smoke test proves the production artifact is served correctly; only a successful GitHub deployment verifies hosting settings and the live URL.

If deployment fails because Pages is not enabled or an environment rule excludes `main`, fix the one-time setting and rerun the failed workflow job. Keep **Source: GitHub Actions** and the `/terraforming-mars-setup/` base path aligned. A repository rename or custom-domain change would require reviewing that base path and its tests.

## Local verification

Use the pinned Node 24 LTS runtime in `.nvmrc`:

```sh
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test -- --run
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e
npm run test:smoke
```

`build` always validates the real `src/content/` catalogs before Vite emits assets. `test:smoke` expects an existing build, starts its own strict-port preview server on port 4173, verifies HTTP 200 and JavaScript asset content types, and checks that Vue mounts the configuration entry with its expected defaults and no runtime errors. Stop any other process using that port first.

Where Playwright-managed browser downloads are unavailable but compatible Chromium is installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute path for the smoke command or a Chromium-only `test:e2e` run. For example, in the prepared Linux environment:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:smoke
```

CI installs Playwright's own Chromium, Firefox and WebKit with system dependencies; it does not set that override. The regular three-engine browser configuration verifies the complete MVP journeys; the infrastructure smoke project uses Chromium only.

For manual inspection:

```sh
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open http://127.0.0.1:4173/terraforming-mars-setup/. The game-content configuration page is the expected result. Choose content and variants, generate/customize public selections, follow sourced physical setup instructions and review the matching summary. Post-generation edits preview affected losses; Reset restores defaults after confirmation. Refresh starts a new in-memory session.

## Retained verification evidence

CI validates catalogs explicitly, runs the entire domain/configuration matrix and
selects all three browser engines. Separate HTML reports for browser journeys
and production smoke tests, plus available failure traces, are uploaded as
`mvp-validation-<run>-<attempt>` artifacts for seven days even when verification
fails. This artifact upload uses the verification job's existing privileges;
Pages/OIDC write permissions remain confined to the dependent main-only deploy
job. Failed verification still prevents Pages artifact publication/deployment.
