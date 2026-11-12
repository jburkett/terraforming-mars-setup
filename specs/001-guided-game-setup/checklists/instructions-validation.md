# US3 incremental verification

**Scope:** T041–T049, authorized by the user, starting from fetched `origin/main` at `f6d7e16` (merged US2), 2026-11-12. Follow constitution v1.0.0 and `AGENTS.md`, preserving each task commit and the explicitly dedicated red-test commits. No US4 or later work is authorized.

Use the approved SU-01–SU-12 sequence and existing build-validated JSON descriptions. Domain projections stay independent of Vue; computed presentation never draws randomness or edits committed state. The existing post-generation configuration guard remains until US4.

## Per-task evidence

- **T041 — intentional red:** All 24 instruction context/projection cases fail on the callable empty baselines, demonstrating missing applicable steps, quantities and physical guidance. Tooling loads normally. Fixture board identifiers were corrected to catalog-qualified IDs before committing; type checking, lint and formatting pass. Context cases resolve in T044 and ordered projection cases in T045.

- **T042 — intentional red:** All 8 summary cases fail against the callable empty projection, covering committed fields, source identities/thresholds, all three printed limitations, live reprojection and WGT exclusion. Lint, type checking and formatting pass. Implementation is assigned to T046.
