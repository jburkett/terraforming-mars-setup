# Guided Game Setup — run and validation

**Implementation:** US1–US4 are available. This guide describes existing scripts
and behavior. Run-specific results, acceptance mappings, review findings and
limitations are in [implementation-validation.md](checklists/implementation-validation.md).
The approved specification and rules reference remain authoritative.

## Runtime and installation

Use Node **24.22.1** from `.nvmrc` and npm 11. The project records npm 11.9.0 in
`packageManager`; CI uses npm supplied with the pinned Node installation and
installs the committed `package-lock.json` with `npm ci`.

From repository root:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run dev
```

On Linux, use `npx playwright install --with-deps chromium firefox webkit` when
browser system packages are needed. CI executes that command. No backend,
database, API key or account is required.

Open the printed Vite URL at `/terraforming-mars-setup/`. The root `/` is not the
project application URL. The Vue Composition API session remains in memory
across all three views; a refresh or reopening starts defaults without recovery.

## Complete verification

```sh
npm run format:check
npm run lint
npm run typecheck
npm run validate:catalogs
npm run test -- --run
npm run test:e2e -- --project=chromium --project=firefox --project=webkit
npm run build
npm run test:smoke
```

`typecheck` covers TypeScript and Vue single-file components. Catalog validation
checks actual JSON shapes, IDs, references, recognized contexts and required
inventory coverage. `build` repeats the catalog gate before emitting assets;
invalid catalogs must prevent a successful build. Domain/build-gate tests
exercise invalid inputs rather than relying only on the standalone validator.

Browser and smoke commands start their own servers on port 4173. Run them
sequentially and stop a manual preview/dev server on that port first. Regular
journeys use Vite dev; smoke uses the compiled production preview and requires a
successful build. Smoke verifies HTTP 200/content types for HTML/JavaScript/CSS,
Vue mounting, public customization, instructions/summary and confirmed edits/Reset.

CI explicitly selects Chromium, Firefox and WebKit, including the matrix,
lifetime/scope and accessibility regressions. Its HTML reports are kept in
`playwright-report/browsers` and `playwright-report/production`, with failure
traces in `test-results`; the workflow uploads these as seven-day
`mvp-validation-<run>-<attempt>` artifacts. CI opens no report browser and uses
zero test retries.

For a compatible system Chromium fallback in the prepared Linux environment:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=chromium
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:smoke
```

This verifies a local Chromium subset. The acceptance record distinguishes that
result from the full three-engine CI run.

For manual production inspection:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/terraforming-mars-setup/`. Use labeled controls and
Back/Continue to visit all views. Keyboard navigation focuses the current view
heading. Loss dialogs initially focus cancellation, support Escape and return
focus to a usable control; no selection or lock is lost before consent.

## Validation scenarios

Use [contracts/ui.md](contracts/ui.md), [data-model.md](data-model.md) and the approved spec/rules reference for exact behavior. This grouping does not replace any acceptance condition.

Scenarios are independent: start a fresh session and explicitly select each row's configuration, rather than carrying over MA off from the printed-limitations scenario into the MA lock scenario.

| Scenario | Actions and expected outcomes | Coverage |
| --- | --- | --- |
| Initial/teaching configuration | Fresh N=2, all content/boards/variants on. Expansions select-none preserves N/variants, disables P2/Prelude together and leaves Tharsis fallback. Variants bulk controls never enable expansions. | AC-01–06 |
| Dependencies | P2 enables/keeps Prelude with explanation. Extended Start/drafting stay available without expansions. Last board removed restores off/Tharsis fallback. | AC-04–06 |
| Generation/revisit | Enter setup, record results/locks, leave/return unchanged: identical. At N=2/3/4/5 expect 5/5/6/7 distinct colonies; inactive tiles remain candidates. | AC-07–09, SC-002–003 |
| Source/thresholds | Compare printed/MA Builder 8/7, Tycoon 15/10, Merchant 3/2. MA Terraformer 29 versus printed Tharsis/Turmoil 26. Venus adds fixed sixth milestone/award. | AC-09–12,24 |
| Eligibility/customization | Check missing-expansion MA exclusions and Hellas/Utopia Geologist exclusion; Constructor remains eligible without Colonies. Manual row 3 locks and filters every other row, no sorting. Reroll preserves locks and uniqueness; other Customize targets respect their pools/counts. | AC-11,13–15 |
| Printed limitations | MA off: Utopia without Colonies, Cimmeria without Venus, Amazonis without Turmoil retain all printed sets/maps and label Pioneer/Planetologist/Lobbyist plus missing expansion in setup/summary. Re-enable removes notices without identity changes. Audit all maps. | AC-31–35 |
| MA edit/cancel | Start with MA on and Colonies on; enter setup and manually select/lock MA Pioneer and an unrelated eligible MA milestone. Remove Colonies: cancel and verify every committed value unchanged; repeat and confirm, clearing colonies and MA Pioneer/its lock while preserving the unrelated selection/lock. Do not apply this lock scenario to printed Utopia Pioneer with MA off. | AC-26, SC-004 |
| Other selective edits | Start with N=4 and Colonies on: N=4→5 clears first player/six colonies after confirmation and later generates seven. With MA off, changing board replaces printed sets after confirmation while preserving unrelated results. Extended Start changes only relevant instructions. | AC-27–29, SC-004 |
| Physical guidance | Compare all applicable SU rows for all-on, base-only and map/expansion cases: CE, ordinary/Beginner branch, Amazonis eleven oceans, colony positions, Turmoil physical events/delegates, deals and P2 discard/refund sequence. All visible, ordered, sourced. | AC-16–24, SC-001 |
| Summary/scope | Summary agrees with state/limitations. After reset/select-all and Venus off/on, no WGT choice/state/summary value, longer Venus option, private-card inventory/entry/draw/filtering, or gameplay guidance. Standard Venus remains; drafting does not alter opening deal. | AC-25,36–39, SC-005 |
| Reset | Cancel preserves everything; confirm restores N=2/all supported options/boards/variants and clears prior results/locks. Next setup entry draws anew. | AC-30, SC-004 |
| Defensive pool conflict | The domain/browser fixture supplies undersized eligible pool: visible explanatory conflict and return option, no duplicates, partial committed set, silent lock loss or forced expansion. No new UI eligibility controls. | D6, edge cases |

## Coverage and evidence limits

The deterministic domain matrix enumerates 10,752 valid combinations of player
count, selected map, supported content and both variants. Prelude 2 implies
Prelude, so there are 96 valid content sets. Additional cases cover independent
one-step edits, all nonempty board pools, retained locks and Reset. This does not
enumerate every random history or establish randomness through frequency tests;
bounded rejection/sampling behavior has separate deterministic tests.

Browser instrumentation verifies unchanged-navigation draws, frozen catalog
snapshots and empty storage without adding production hooks. Test-only catalog
and conflict fixtures live under `tests/fixtures/` and are not imported by the
production entry. No private card inventory, deck filtering or effect execution
is introduced. Players handle cards and printed exceptions physically.

Compare implemented content with SU-01–SU-12 and the source register in
[rules-reference.md](rules-reference.md), including CE/Beginner branches,
Amazonis supplies, colony activation, physical Turmoil, deals and P2 discard/refund
ordering. Each instruction displays its SU ID and rules/product-decision
references. Structural catalog validation supports, but does not replace, this
semantic content review.

The approved all-visible instruction layout is long at mobile width. Automated
keyboard/layout checks and assistant-rendered inspection are recorded separately
from human usability approval; visual redesign and enhancements are deferred to
the post-MVP epic. There is no formal assistive-technology or WCAG certification
claim. Human review/merge and any protected Pages deployment remain separate
from test completion. See [Pages deployment](../../docs/github-pages.md) for
one-time hosting settings; local preview success does not prove live hosting.
