# Future Validation Guide

**Status:** Planning only. There is no application, package manifest or executable test suite yet. These proposed commands apply only after later authorized implementation supplies them; none was run here.

## Prerequisites and proposed commands

Before implementation obtain human approval of the revised technical plan in [plan.md](plan.md) and phase authorization. The design uses Vue 3, TypeScript, Vite and the Composition API, built-in reactivity and in-memory session state, with Vue-independent domain logic. No Pinia or Vue Router is planned without a concrete requirement. Static JSON catalogs under `src/content/` have TypeScript-defined schemas and required build-time validation. Constitution III requires failing requirements-derived behavioral tests before corresponding code. Node 24 LTS and npm are proposed; later pin compatible tool versions and commit the lockfile. No backend, database, persistence or API key is proposed.

From repository root, once the later manifest, lockfile and scripts exist:

```sh
npm ci
npx playwright install
npm run dev -- --host 127.0.0.1
```

Open the dev server's printed URL. Proposed verification commands:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run validate:catalogs
npm run test -- --run
npm run test:e2e
npm run build
```

The proposed `typecheck` includes TypeScript and Vue single-file components. `validate:catalogs` checks actual JSON shapes/types, unique IDs, references, recognized context identifiers and required inventory coverage. `build` must invoke this validation before Vite emits assets; failure stops the build with file/record diagnostics. Standalone validation is useful for diagnosis but does not replace the build gate. These are planned interfaces, not generated scripts or validation code.

Future browser tests should start a local server and cover Chromium, Firefox and WebKit; install runner system prerequisites if required. These are proposed script contracts, not installed commands or reported results.

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
| Defensive pool conflict | Future domain-test fixture supplies undersized eligible pool: visible explanatory conflict and return option, no duplicates, partial committed set, silent lock loss or forced expansion. No new UI eligibility controls. | D6, edge cases |

## Coverage and evidence limits

Later domain validation should cover supported player counts, maps and content/variant combinations for applicability, pool/count validity and source rules. Exercise transition and retained-lock boundaries without claiming every random history is enumerated. Inject deterministic randomness; verify unbiased selection logic and no draws on unchanged navigation rather than flaky frequency thresholds.

Future catalog validation must check JSON shapes against TypeScript-defined schemas, duplicate IDs, dangling references, recognized contexts, seven complete printed map sets, 11 colonies, the 35/35 MA subsets and SU instruction coverage. An invalid catalog must prevent a successful build; structural validation alone does not prove rules accuracy. Human review checks sources and meaning. Eligibility rules, algorithms and transitions remain TypeScript rather than executable JSON. No individual-card validation is introduced.

Later browser validation must confirm that Vue view changes/remounts retain the same application-owned in-memory session, do not mutate catalogs and consume no randomness on unchanged navigation. Reload/reopening has no recovery. Record actual commands/results only after later execution; this revision generates no tests, application code, JSON catalogs or validator.

Human rendered review must assess the tentative all-visible list for busyness and selective-clearing explanations. This document claims no application results, usability validation or architectural approval.
