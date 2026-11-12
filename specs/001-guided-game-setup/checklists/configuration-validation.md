# US1 incremental verification

**Authorization:** User-requested T022–T028 implementation, 2026-11-12, from latest fetched `origin/main` at `2ab4aa4`. Follow constitution v1.0.0 and `AGENTS.md`; each top-level task has its own commit. T029 and later product tasks are outside scope.

## Per-task evidence

- **T022 — intentional red commit:** 17 configuration cases executed: 14 failed and 3 passed before production configuration logic existed. A callable test-local baseline demonstrates absent all-on defaults, normalization/actions, dependency reasons and bounds validation; no import/tooling failure is used as evidence. Formatting, lint and type checks pass. This red state is intentional and must be resolved by T024 before the PR is ready for merge.

- **T023 — intentional red commit:** All 6 Chromium configuration journeys failed on the old blank shell because labeled controls/headings/navigation were absent. Vite and the browser started successfully; the bounded red run used a 5-second per-case timeout. Formatting, lint and type checks pass. The optional installed-Chromium override is supported by the browser harness; CI will use bundled engines. This red state remains expected until T026–T028.
