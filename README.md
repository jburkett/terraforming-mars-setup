# Terraforming Mars Setup

A Vue 3, TypeScript and Vite assistant for preparing a physical 2–5-player game.
Choose content and variants, customize public selections, then follow the sourced
physical setup instructions and review the matching summary.

## Run locally

Use Node **24.22.1** from [.nvmrc](.nvmrc) and npm 11. The repository records npm
11.9.0 in `packageManager`; `npm ci` installs the exact committed lockfile.

```sh
npm ci
npm run dev
```

Open the printed URL with the `/terraforming-mars-setup/` project prefix. The
three views share an in-memory session. Back/Continue keeps results and locks;
refreshing or reopening starts a new session.

```sh
npm run build
npm run preview
```

`build` validates every JSON catalog before Vite emits `dist`. Open the preview
URL at the same project prefix. The app uses no backend, API key, database,
persistence, router or additional state library.

## Game workflow and scope

1. Choose 2–5 players, supported content and board candidates. Defaults are two
   players, all supported content/seven Mars boards and both variants on.
2. Choose Extended Start and research drafting. Each configuration view has
   page-local Select all/none controls; Prelude 2 keeps Prelude enabled.
3. Setup generates the board, numerical first player, colonies and applicable
   objectives. Customize exposes eligible choices and target rerolls. Manual MA
   choices lock; rerolls preserve locked rows. Printed sets stay complete and
   show disabled-expansion limitations.

Configuration changes preview affected selection/lock losses. Confirm applies
only those losses; cancel preserves the previous game. Unrelated choices survive
and setup entry generates only missing results. Reset requires confirmation and
restores all defaults. Instructions describe the new physical setup; physical
actions are not undone.

Supported content follows the approved 2023 **More Terraforming Mars!** campaign
boundary, including its later-delivered components. Standard card decks and card
effects stay physical. The app has no private-card entry/inventory/dealing,
WGT guidance, optional longer Venus board, solo mode, progress checkboxes or
recurring gameplay execution. Standard Venus is supported on every Mars map.

## Verify

Install Playwright's managed engines (Linux hosts may also need `--with-deps`):

```sh
npx playwright install chromium firefox webkit
npm run format:check
npm run lint
npm run typecheck
npm run validate:catalogs
npm run test -- --run
npm run test:e2e -- --project=chromium --project=firefox --project=webkit
npm run build
npm run test:smoke
```

Run the browser and smoke suites sequentially. They start their own strict-port
servers on port 4173; stop a manual server on that port first. Smoke checks use
the built production artifact and verify HTTP 200, JavaScript/CSS assets, Vue
mounting and complete configuration/customization/instruction/Reset journeys.

The domain suite includes deterministic configuration and transition matrices.
The browser suite includes keyboard access, scope/lifetime, source/summary and
confirmation regressions. See the [quickstart validation guide](specs/001-guided-game-setup/quickstart.md)
and [acceptance record](specs/001-guided-game-setup/checklists/implementation-validation.md)
for scope, evidence and limitations.

A local Chromium-only fallback is available when managed engine downloads are
unavailable and compatible Chromium is already installed:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=chromium
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:smoke
```

That is a local subset; GitHub CI installs and verifies all three managed
engines. CI retains separate HTML browser/production reports and failure traces
in `mvp-validation-<run>-<attempt>` artifacts for seven days.

## GitHub Pages and development

[GitHub Pages deployment](docs/github-pages.md) documents one-time repository
settings, the project URL and the workflow. Pull requests verify only. Successful
verified `main` pushes deploy through the `github-pages` environment, subject to
its protection rules. This working branch is not a live deployment claim.

Follow [AGENTS.md](AGENTS.md) for test-first work, task commit boundaries and
scope authorization. Product decisions remain in the approved
[specification](specs/001-guided-game-setup/spec.md),
[technical plan](specs/001-guided-game-setup/plan.md) and
[rules reference](specs/001-guided-game-setup/rules-reference.md).

## Spec Kit with Codex

Initialized with GitHub Spec Kit (`specify-cli` 1.3.2), using the official
[existing-project instructions](https://github.com/github/spec-kit/blob/main/docs/how-to/existing-projects.md)
and [Codex integration](https://github.com/github/spec-kit/blob/main/docs/integrations/codex.md).

The development tools require Python 3.11+, `uv`, and Codex CLI. To install the
same Specify CLI version:

```sh
uv tool install specify-cli==1.3.2
```

Ensure uv's tool executable directory is on `PATH`. In the prepared cloud
environment, Specify is installed at `/workspace/.tools/bin/specify`; use
`export PATH="/workspace/.tools/bin:$PATH"` to invoke it as `specify`.

Codex discovers the repository's `.agents/skills/speckit-*/SKILL.md` files.
Start a new Codex session in this repository to load them, then invoke skills
with a dollar prefix, such as `$speckit-constitution`. Shared templates,
Bash helpers, workflow metadata, and an unfilled constitution template live in
`.specify/`.
