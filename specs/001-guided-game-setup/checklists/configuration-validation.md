# US1 incremental verification

**Authorization:** User-requested T022–T028 implementation, 2026-11-12, from latest fetched `origin/main` at `2ab4aa4`. Follow constitution v1.0.0 and `AGENTS.md`; each top-level task has its own commit. T029 and later product tasks are outside scope.

## Per-task evidence

- **T022 — intentional red commit:** 17 configuration cases executed: 14 failed and 3 passed before production configuration logic existed. A callable test-local baseline demonstrates absent all-on defaults, normalization/actions, dependency reasons and bounds validation; no import/tooling failure is used as evidence. Formatting, lint and type checks pass. This red state is intentional and must be resolved by T024 before the PR is ready for merge.

- **T023 — intentional red commit:** All 6 Chromium configuration journeys failed on the old blank shell because labeled controls/headings/navigation were absent. Vite and the browser started successfully; the bounded red run used a 5-second per-case timeout. Formatting, lint and type checks pass. The optional installed-Chromium override is supported by the browser harness; CI will use bundled engines. This red state remains expected until T026–T028.

- **T024 — green domain implementation:** Replaced the test-local baseline with direct production imports. All 17 configuration cases pass, along with the 71 prior tests (88 total). Pure normalization/actions enforce P2/Prelude and the Tharsis fallback without mutating prior state; bounds are checked. Formatting, lint and type checks pass. T023 browser failures remain intentional until UI integration.

- **T025 — green session owner:** Three new behavioral cases failed and one passed before session actions/navigation existed. All four now pass; the complete domain/infrastructure suite passes 92 tests. One app-owned Composition API instance retains configuration/view state, exposes read-only projections, keeps domain values plain and catalogs unchanged, and leaves generated results missing without randomness. Formatting, lint and type checks pass. Browser integration is still intentionally pending.
