# Foundation verification — T005–T021

**Date:** 2026-11-12. **Scope:** Foundation tasks only, authorized by the user after approval of the specification, technical plan and task artifact. Base: latest fetched `origin/main` at `0044246` (merged PR #8). Constitution v1.0.0 and approved requirements/design are unchanged.

## Test-first evidence

Tests were written against minimal callable seams before the corresponding behavior/data was added. The red results below were assertion failures for missing behavior, not merely missing imports or invalid tooling. Seams were replaced with the implementation; no permissive stub remains.

| Cycle | Observed red result | Implementation and observed green result |
| --- | --- | --- |
| T005–T008: validation contract | 17 rejection cases failed, 1 valid-input case passed against permissive validation. | Actual shapes/types, unknown fields/contexts, IDs, prerequisites/references, citations, inventories and SU order validated; all 18 cases passed. |
| T009–T014: real inventories | 5 sourced-inventory/immutability assertions failed against an empty loader; prior contract tests passed. | Sourced JSON populated and recursively frozen loader added; all 23 catalog/validation tests passed. |
| T016–T019: context/random boundaries | 32 cases failed and 6 passed against constant/permissive primitives. | Source-aware eligibility/threshold/notice helpers, fixed Venus additions, unbiased bounded random source and nonmutating sampling added; all 38 context/random tests passed. |
| T020–T021: mandatory build gate | 1 case failed and 4 passed: invalid fixture data still reached Vite and emitted HTML before gating. | Validate before starting Vite; all 5 gate/CLI tests passed. Invalid data preserves existing output and emits no new HTML. |
| Build-path review regression | New alternate-directory bypass case failed, with the previous 5 cases passing. | Build always validates its own `src/content/`; alternate input is accepted only by the standalone validator. All 6 build-gate tests passed using isolated repository copies. |

## Final executed checks

- `npm run format:check`: passed.
- `npm run typecheck`: passed, including native-Node-compatible TypeScript scripts and domain/content/test types.
- `npm run lint`: passed with zero warnings.
- `npm run test -- --run`: 5 test files passed, 67 tests passed.
- `npm run validate:catalogs`: passed for all six real JSON catalogs.
- `npm run build`: validation passed before Vite emitted the existing static HTML scaffold.
- Git whitespace and task-boundary checks: passed before commit.

## Content and boundary review

- Seven named boards have complete source-qualified five-plus-five printed sets; seven content options retain the Prelude 2→Prelude prerequisite.
- Eleven official colonies include the inactive-at-start Titan, Enceladus and Miranda; none is removed from the candidate inventory for inactivity.
- MA contains 35 milestones and 35 awards, separately counted from 35 printed entries of each kind and the fixed Hoverlord/Venuphile pair. Shared names do not collapse source identities.
- Known source/context threshold differences are represented explicitly; other physical scoring definitions defer to their cited objective instead of inventing scoring logic. The assistant does not evaluate gameplay achievement.
- Printed Pioneer/Planetologist/Lobbyist remain available under R1 with every disabled prerequisite reported; MA filtering stays separate. Constructor retains its non-Colonies route and no map is excluded because of a printed limitation.
- SU-01–SU-12 data includes base/CE/Beginner branches, Amazonis supplies, colony activation, physical Turmoil, deals and Prelude 2 discard/refund order. Official rules citations and explicit product overrides have distinct provenance. Structural coverage tests supplement review against `rules-reference.md`; they do not prove future rendered instruction applicability.
- JSON contains data/text/identifiers only. Schema validation rejects extra executable-condition fields; eligibility, context and sampling behavior is TypeScript independent of Vue. Catalogs load as recursively frozen inputs, separate from plain mutable-session type definitions.
- CLI/build tests corrupt only temporary fixture copies and write to isolated output directories; real catalogs/output are not damaged. Build-time validation does not add a backend, persistence, generic rule interpreter or runtime network fetch.

## Limits and stopping point

T022–T064 are unstarted. No configuration normalization/actions, Vue composable, app entry point, views, story selection/customization workflow, instruction rendering, summary or Reset workflow was added. No browser journeys or full application success criteria are claimed; the build still emits the intentionally empty setup scaffold. Future story implementation must continue the constitution's test-first process and obtain its own authorization.
