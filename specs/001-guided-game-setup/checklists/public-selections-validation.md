# US2 incremental verification

**Scope:** User-authorized T029–T040 implementation from latest fetched `origin/main` at `b2c1fe0`, 2026-11-12. Follow constitution v1.0.0 and `AGENTS.md`; preserve a separate commit per task, including the explicitly authorized red-test tasks. US3/US4 and later tasks remain unstarted.

Configuration controls become read-only after successful generation in this interim US2 increment. Unchanged Back/Continue revisits and public customization remain available. This prevents silent result/lock loss without implementing US4's general edit/invalidation workflow; direct board-change confirmation is included because T036 explicitly authorizes it.

## Per-task evidence

- **T029 — intentional red:** 10 selection assertions failed and 1 passed against callable no-generation/no-change baselines. Failures demonstrate missing bounded generation, set sizes, missing-only filling, conflicts and manual targets, not broken imports or tooling. Formatting, lint and type checks pass. Customization assertions remain intentionally red until T035.

- **T030 — intentional red:** All 13 objective projection/customization cases fail before implementation. They cover source/version precedence, fixed Venus additions, complete printed sets/limitations, symmetric alternatives, auto-locking and unlocked-only rerolls. Lint, types and formatting pass; projection resolves in T033 and mutation behavior in T035.

- **T031 — intentional red:** All 6 new browser journeys fail against the pre-US2 setup placeholder/empty conflict fixture. Vite and Chromium start normally; failures are absent results, customization/confirmation or conflict presentation. Static checks pass. UI integration/conflict work in T037–T040 will resolve these failures.
