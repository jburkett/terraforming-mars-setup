# US4 incremental verification

**Scope:** User-authorized T050–T058, starting from fetched `origin/main` at `37728fa` (merged US3), 2026-11-12. Follow constitution v1.0.0 and `AGENTS.md`; preserve task commits and dedicated intentional red-test commits. T059–T064 remain unstarted.

Use the approved state dependency map and tentative v1 selective-loss policy. A preview normalizes the proposed configuration without changing the committed snapshot or drawing randomness. Where the selected board is excluded, future board draws are not known yet: preview/clear only board-dependent rows that could be ineligible in the remaining pool, retaining rows valid across that pool. Fixed printed identities follow R1; changed instructions describe the newly selected setup and do not undo physical actions.

## Per-task evidence

- **T050 — intentional red:** 15 edit assertions fail and 6 preservation-only cases pass against callable no-change baselines. Failures demonstrate missing dependency clearing, lock-loss previews, source transitions and normalized atomic commits, not broken imports/tooling. Lint, type checking and formatting pass. Affected-state cases resolve in T053 and commit/cancel cases in T054.
