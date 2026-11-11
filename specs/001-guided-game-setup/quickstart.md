# Future Validation Guide

**Status:** Planning only. There is no application, package manifest or executable test suite yet. These proposed commands apply only after later authorized implementation supplies them; none was run here.

## Prerequisites and proposed commands

Before implementation obtain human approval of substantive architecture in [plan.md](plan.md) and phase authorization. Constitution III requires failing requirements-derived behavioral tests before corresponding code. Node 24 LTS and npm are proposed; later pin compatible tool versions and commit the lockfile. No backend/API key is proposed.

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
npm run test -- --run
npm run test:e2e
npm run build
```

Future browser tests should start a local server and cover Chromium, Firefox and WebKit; install runner system prerequisites if required. These are proposed script contracts, not installed commands or reported results.

## Validation scenarios

Use [contracts/ui.md](contracts/ui.md), [data-model.md](data-model.md) and the approved spec/rules reference for exact behavior. This grouping does not replace any acceptance condition.

| Scenario | Actions and expected outcomes | Coverage |
| --- | --- | --- |
| Initial/teaching configuration | Fresh N=2, all content/boards/variants on. Expansions select-none preserves N/variants, disables P2/Prelude together and leaves Tharsis fallback. Variants bulk controls never enable expansions. | AC-01–06 |
| Dependencies | P2 enables/keeps Prelude with explanation. Extended Start/drafting stay available without expansions. Last board removed restores off/Tharsis fallback. | AC-04–06 |
| Generation/revisit | Enter setup, record results/locks, leave/return unchanged: identical. At N=2/3/4/5 expect 5/5/6/7 distinct colonies; inactive tiles remain candidates. | AC-07–09, SC-002–003 |
| Source/thresholds | Compare printed/MA Builder 8/7, Tycoon 15/10, Merchant 3/2. MA Terraformer 29 versus printed Tharsis/Turmoil 26. Venus adds fixed sixth milestone/award. | AC-09–12,24 |
| Eligibility/customization | Check missing-expansion MA exclusions and Hellas/Utopia Geologist exclusion; Constructor remains eligible without Colonies. Manual row 3 locks and filters every other row, no sorting. Reroll preserves locks and uniqueness; other Customize targets respect their pools/counts. | AC-11,13–15 |
| Printed limitations | MA off: Utopia without Colonies, Cimmeria without Venus, Amazonis without Turmoil retain all printed sets/maps and label Pioneer/Planetologist/Lobbyist plus missing expansion in setup/summary. Re-enable removes notices without identity changes. Audit all maps. | AC-31–35 |
| Edit/cancel | Locked Pioneer plus unrelated MA lock: cancel Colonies removal and verify every value unchanged; confirm and preserve unrelated lock. N=4→5 clears first player/six colonies and later draws seven. Board changes preserve unrelated results. Extended Start changes only relevant instructions. | AC-26–29, SC-004 |
| Physical guidance | Compare all applicable SU rows for all-on, base-only and map/expansion cases: CE, ordinary/Beginner branch, Amazonis eleven oceans, colony positions, Turmoil physical events/delegates, deals and P2 discard/refund sequence. All visible, ordered, sourced. | AC-16–24, SC-001 |
| Summary/scope | Summary agrees with state/limitations. After reset/select-all and Venus off/on, no WGT choice/state/summary value, longer Venus option, private-card inventory/entry/draw/filtering, or gameplay guidance. Standard Venus remains; drafting does not alter opening deal. | AC-25,36–39, SC-005 |
| Reset | Cancel preserves everything; confirm restores N=2/all supported options/boards/variants and clears prior results/locks. Next setup entry draws anew. | AC-30, SC-004 |
| Defensive pool conflict | Future domain-test fixture supplies undersized eligible pool: visible explanatory conflict and return option, no duplicates, partial committed set, silent lock loss or forced expansion. No new UI eligibility controls. | D6, edge cases |

## Coverage and evidence limits

Later domain validation should cover supported player counts, maps and content/variant combinations for applicability, pool/count validity and source rules. Exercise transition and retained-lock boundaries without claiming every random history is enumerated. Inject deterministic randomness; verify unbiased selection logic and no draws on unchanged navigation rather than flaky frequency thresholds.

Catalog review must check seven complete printed map sets, 11 colonies, 35/35 MA definitions and applicable SU instruction/citation coverage. No individual-card validation is introduced. Record actual commands/results only after later execution.

Human rendered review must assess the tentative all-visible list for busyness and selective-clearing explanations. This document claims no application results, usability validation or architectural approval.
