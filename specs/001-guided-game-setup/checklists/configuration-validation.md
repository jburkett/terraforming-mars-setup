# US1 incremental verification

**Authorization:** User-requested T022–T028 implementation, 2026-11-12, from latest fetched `origin/main` at `2ab4aa4`. Follow constitution v1.0.0 and `AGENTS.md`; each top-level task has its own commit. T029 and later product tasks are outside scope.

## Per-task evidence

- **T022 — intentional red commit:** 17 configuration cases executed: 14 failed and 3 passed before production configuration logic existed. A callable test-local baseline demonstrates absent all-on defaults, normalization/actions, dependency reasons and bounds validation; no import/tooling failure is used as evidence. Formatting, lint and type checks pass. This red state is intentional and must be resolved by T024 before the PR is ready for merge.

- **T023 — intentional red commit:** All 6 Chromium configuration journeys failed on the old blank shell because labeled controls/headings/navigation were absent. Vite and the browser started successfully; the bounded red run used a 5-second per-case timeout. Formatting, lint and type checks pass. The optional installed-Chromium override is supported by the browser harness; CI will use bundled engines. This red state remains expected until T026–T028.

- **T024 — green domain implementation:** Replaced the test-local baseline with direct production imports. All 17 configuration cases pass, along with the 71 prior tests (88 total). Pure normalization/actions enforce P2/Prelude and the Tharsis fallback without mutating prior state; bounds are checked. Formatting, lint and type checks pass. T023 browser failures remain intentional until UI integration.

- **T025 — green session owner:** Three new behavioral cases failed and one passed before session actions/navigation existed. All four now pass; the complete domain/infrastructure suite passes 92 tests. One app-owned Composition API instance retains configuration/view state, exposes read-only projections, keeps domain values plain and catalogs unchanged, and leaves generated results missing without randomness. Formatting, lint and type checks pass. Browser integration is still intentionally pending.

- **T026 — green expansion view:** Two focused component browser cases failed on an empty fixture before implementation, then both passed using the real shared owner and expansion view. They cover bulk controls/N retention, inactive Tharsis fallback and immediate native-checkbox reflection of rejected Prelude removal. Formatting, lint and types pass. The root app remains unchanged here; the six full T023 journeys intentionally await T028. Fixture pages are development tests, not production build entries.

- **T027 — green variant view:** Two focused browser cases failed before the view existed, then both passed. Both variants stay available without expansions, bulk controls affect variants only, and Back/Continue call the same owner’s navigation actions. Formatting, lint and types pass. Development-only fixture output observes the owner; it is not part of the production application. Root integration still awaits T028.

- **T028 — green integrated US1:** All 6 original T023 journeys and the 4 focused view journeys pass in local Chromium. All 92 domain/infrastructure tests, formatting, zero-warning lint, strict type checking, the catalog-gated production build and both production HTTP/Vue smoke checks pass. The Pages verifier now runs the configuration journeys in Chromium, Firefox and WebKit before its build/smoke/artifact gate, preserving main-only deployment permissions. The production smoke expectation advances from the historical blank shell to the authorized configuration entry.

## Final boundaries and evidence

- Separate commits for T022–T028 preserve the two intentional red states and the task-level implementation boundaries; no squash/rebase was applied to the working branch.
- The application creates one session owner above the views. Configuration values and variant choices survive Back/Continue navigation; reload starts a fresh in-memory session. Catalogs stay read-only, and there are no stores, routers or persistence dependencies.
- Browser coverage includes defaults, bounds at the domain boundary, page-local bulk actions preserving N, visible Prelude dependency enforcement/rejected uncheck, board exclusion/empty-pool fallback, independent variants, Back retention and setup entry. No generated selections or physical-card input are introduced.
- Existing production assets return HTTP 200 under `/terraforming-mars-setup/`; Vue mounts the configuration entry without runtime errors. Build fixtures copy the current source tree to isolated repositories, retaining all invalid-catalog/no-emission guarantees.
- Desktop and 375-pixel mobile layout were inspected; no horizontal overflow was observed on mobile. Fixture diagnostic outputs are not included in the production build.
- Local browser runs use the documented installed-Chromium override. The repository CI configuration installs and runs all three bundled browser engines; live CI results are reviewed separately from these local observations.
- T029 and later tasks remain unstarted. “Game setup” is a navigation placeholder with Back only: no board/colony/objective/first-player generation, customization, dealing guidance, summary, confirmation-loss or Reset functionality is implemented.
