# US2 incremental verification

**Scope:** User-authorized T029–T040 implementation from latest fetched `origin/main` at `b2c1fe0`, 2026-11-12. Follow constitution v1.0.0 and `AGENTS.md`; preserve a separate commit per task, including the explicitly authorized red-test tasks. US3/US4 and later tasks remain unstarted.

Configuration controls become read-only after successful generation in this interim US2 increment. Unchanged Back/Continue revisits and public customization remain available. This prevents silent result/lock loss without implementing US4's general edit/invalidation workflow; direct board-change confirmation is included because T036 explicitly authorizes it.

## Per-task evidence

- **T029 — intentional red:** 10 selection assertions failed and 1 passed against callable no-generation/no-change baselines. Failures demonstrate missing bounded generation, set sizes, missing-only filling, conflicts and manual targets, not broken imports or tooling. Formatting, lint and type checks pass. Customization assertions remain intentionally red until T035.

- **T030 — intentional red:** All 13 objective projection/customization cases fail before implementation. They cover source/version precedence, fixed Venus additions, complete printed sets/limitations, symmetric alternatives, auto-locking and unlocked-only rerolls. Lint, types and formatting pass; projection resolves in T033 and mutation behavior in T035.

- **T031 — intentional red:** All 6 new browser journeys fail against the pre-US2 setup placeholder/empty conflict fixture. Vite and Chromium start normally; failures are absent results, customization/confirmation or conflict presentation. Static checks pass. UI integration/conflict work in T037–T040 will resolve these failures.

- **T032 — green generation:** All 9 generation cases pass. The domain fills only missing results, resolves the board before objective eligibility, preserves valid row references/locks, includes inactive colonies and returns conflicts without partial output. Static checks pass; the previously committed customization/projection/browser red groups remain intentionally pending their assigned tasks.

- **T033 — green objective projection:** All 9 projection cases pass. Corrected the retention assertion to compare printed identities only: enabling Venus legitimately adds its fixed pair. Source thresholds, fixed additions, R1 notices and symmetric alternatives pass; static checks pass. The 4 mutation cases remain intentionally red until T035.

- **T034 — green explicit generation:** Three new session cases failed before implementation; all seven owner cases now pass. Setup entry fills once, unchanged revisits retain the same results with no additional draws, conflicts commit nothing, and the interim configuration guard preserves existing results. The old missing-results assertion now applies before setup entry, reflecting the authorized US2 change. Static checks pass.

- **T035 — green customization:** All 119 current domain/infrastructure tests passed, including the previously red manual targets, source-valid objective choices, auto-lock and unlocked-only rerolls. Final helpers use direct imports, with no permissive seams remaining. Static checks pass. Board preview/commit remains separate in T036; browser presentation remains pending.

- **T036 — green direct-board transactions:** All 5 new board cases failed before implementation and now pass. Preview is pure/no-draw; printed replacement or potentially ineligible MA locks require consent. Cancellation leaves the snapshot untouched; commit reconciles only affected rows, preserves eligible locks/other pools, rejects unchecked boards and handles one-candidate rerolls without draws. Static checks pass.

- **T037 — green objective controls:** Two focused browser cases failed on an empty fixture before implementation and both now pass. Tables have selection-then-lock columns without gridlines, live symmetric alternatives, manual auto-lock and unlocked-only reroll. Fixed Venus entries remain outside editable rows and printed sets have no replacement controls. Lint, types and formatting pass.
