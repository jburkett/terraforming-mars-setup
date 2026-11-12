# US1 incremental verification

**Authorization:** User-requested T022–T028 implementation, 2026-11-12, from latest fetched `origin/main` at `2ab4aa4`. Follow constitution v1.0.0 and `AGENTS.md`; each top-level task has its own commit. T029 and later product tasks are outside scope.

## Per-task evidence

- **T022 — intentional red commit:** 17 configuration cases executed: 14 failed and 3 passed before production configuration logic existed. A callable test-local baseline demonstrates absent all-on defaults, normalization/actions, dependency reasons and bounds validation; no import/tooling failure is used as evidence. Formatting, lint and type checks pass. This red state is intentional and must be resolved by T024 before the PR is ready for merge.
