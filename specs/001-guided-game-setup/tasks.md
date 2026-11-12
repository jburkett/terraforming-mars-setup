# Tasks: Guided Game Setup

**Feature:** `001-guided-game-setup` | **Generated:** 2026-11-12

**Input:** [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/ui.md](contracts/ui.md), [quickstart.md](quickstart.md), [rules-reference.md](rules-reference.md), constitution v1.0.0.

**Status:** T001–T028 and infrastructure tasks T065–T072 are complete under the user’s separate setup, foundations, deployment and US1 authorizations. T029–T064 remain unstarted. US1 provides configuration, shared in-memory view ownership and navigation to a setup placeholder; no public results, physical setup instructions, summary or Reset workflow are generated. See [US1 verification](checklists/configuration-validation.md) for task-level red/green evidence and [foundation verification](checklists/foundations-validation.md)/[deployment verification](checklists/deployment-validation.md) for earlier phase records. Existing product requirements and architecture remain unchanged.

**US1 commit history:** T022 and T023 are preserved as intentional red-test commits. Each implementation task T024–T028 has a separate commit with passing relevant checks. The final tree resolves the intentional failures.

**US2 progress:** T029–T040 is now authorized; task-level evidence and intentional red states are recorded in [US2 verification](checklists/public-selections-validation.md). Other phase status statements below record earlier work.

**Generation baseline:** This task list was generated from `origin/main` at `f9cf968` using the approved specification and technical plan; project setup starts from `f25ebec`, which includes the merged task artifact. Earlier phase scope statements are historical and do not authorize later tasks.

**Tests:** Required by constitution III and the approved plan, overriding the template's optional-test wording. For every behavior, write the relevant tests first, run them and establish failure for the missing behavior before the corresponding implementation; then establish success. A syntax/tooling failure alone does not prove the required behavior is missing. Task descriptions below describe future test work, not generated tests or claimed results.

**Organization:** Setup → shared foundations → deployment infrastructure → US1/US2/US3 (P1) → US4 (P2) → cross-cutting validation. Story priorities are the specification's advisory labels, not authority to omit lower-priority approved requirements. Paths are relative to repository root; paths not yet present are future deliverables.

## Format and execution rules

Every task uses `- [ ] Tnnn [P?] [USn?] Description with exact file paths`. IDs are stable identifiers; follow phase/dependency order rather than numeric order. Infrastructure additions use T065–T072 so existing story references are not renumbered. Checked boxes denote verified completed work and unchecked boxes denote remaining work. `[P]` means the task can run alongside other marked tasks in its stated group once prerequisites are complete; it never bypasses a dependency or test-first gate. Story labels occur only in story phases; the infrastructure story uses `[INFRA]`. Tasks that touch the same file must be sequenced.

Use Vue 3, strict TypeScript, Vite and the Composition API. Keep domain code free of Vue imports and expose plain-data inputs/outputs. Keep mutable configuration/results separate from read-only catalogs. No Pinia or Vue Router without a concrete requirement and review of the resulting architectural change. No backend, database, persistence, WGT setting/guidance, longer Venus option, digital cards, individual-card inventory/filtering, gameplay execution, progress tracking, accounts, exports or sharing.

## Phase 1: Setup — shared infrastructure

**Purpose:** Establish the approved development and verification tools. This phase alone produces no user-story behavior. T002 and T003 may proceed together after T001; complete both before T004.

- [x] T001 Initialize the Vue 3/Composition API, TypeScript 5.x and Vite project and lock compatible maintained dependency versions in `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json` and `index.html`; use the planned Node 24 LTS runtime, include Vue-aware type checking and no Pinia/router/backend dependencies.
- [x] T002 [P] Configure Vue/TypeScript linting and formatting in `eslint.config.js`, `.prettierrc.json` and `.prettierignore`; enforce readable strongly typed code and avoid generated build/coverage artifacts in checks.
- [x] T003 [P] Configure Vitest and Playwright in `vitest.config.ts` and `playwright.config.ts`, with deterministic domain tests, an automatically started local Vite server and Chromium/Firefox/WebKit browser projects; create no product behavior as runner setup.
- [x] T004 Add the planned `dev`, `format:check`, `lint`, `typecheck`, `test` and `test:e2e` scripts in `package.json` and generated-artifact exclusions in `.gitignore`; type checking must cover Vue single-file components and plain TypeScript modules.

**Checkpoint:** Tooling can execute a focused behavioral test before that behavior is implemented. Catalog/build integration is completed in Phase 2, not silently skipped.

## Phase 2: Foundational — blocking prerequisites

**Purpose:** Establish shared catalog boundaries, data, domain types and reusable rule/random primitives. All story phases depend on this phase. These are shared foundations, not hidden services or a generic rule language. Complete catalog shape/validation behavior tests before their implementation; use small explicit fixtures to demonstrate missing validator behavior without depending on completed application views.

- [x] T005 Write and establish failing catalog-contract cases in `tests/domain/catalogs.spec.ts` for actual JSON types/shapes, duplicate IDs, dangling references, unknown context IDs, source-qualified objective identities and citations; later extend the same cases to real inventories in T009 before populating them.
- [x] T006 Define TypeScript catalog schemas in `src/content/types.ts` for boards, expansions, colonies, milestone/award variants, sources and instructions; preserve data-model constraints verbatim: BoardDefinition has “seven entries”, ColonyDefinition has “eleven entries”, MA has “35 milestones and 35 awards”, and InstructionDefinition has “no completion field”; descriptive prerequisites/context IDs are data, not executable expressions.
- [x] T007 Write and establish failing build-validator behavior cases in `tests/domain/catalog-validation.spec.ts` for malformed records/references, missing inventories/SU IDs, file-and-record diagnostics and rejection of unrecognized rule contexts; test actual validation outcomes rather than private implementation shape.
- [x] T008 Implement catalog validation in `scripts/validate-catalogs.ts` against `src/content/types.ts`, inspecting actual JSON values and cross-catalog references; fail with file/record diagnostics, count MA subsets separately from printed/fixed objectives, and never treat casts or JSON import inference as content validation.
- [x] T009 Extend and establish failing sourced-inventory assertions in `tests/domain/catalogs.spec.ts` against `specs/001-guided-game-setup/rules-reference.md`: seven named maps with five printed objectives of each kind, seven content options, 11 official colonies, the 35/35 MA inventories, fixed Venus pair and SU-01–SU-12 coverage; verify source/version distinctions and absence of excluded content.
- [x] T010 Populate `src/content/boards.json` and `src/content/expansions.json` from the approved rules reference: seven boards, printed-objective references, map restrictions/supplies, CE and six other content choices, descriptive whole-expansion prerequisites and sources; no map-pack selectors or longer Venus entry.
- [x] T011 [P] Populate `src/content/colonies.json` with the 11 named official tiles, sources and ordinary/inactive initial-marker metadata; Titan, Enceladus and Miranda remain selectable, and no fan/promo colony is invented (after T009; parallel with T012/T013).
- [x] T012 [P] Populate `src/content/milestones.json` and `src/content/awards.json` with source-qualified printed, MA and fixed Venus records, descriptive thresholds/context IDs and prerequisites; distinguish Builder 8/7, Tycoon 15/10, Merchant 3/2 and Terraformer printed/Turmoil/MA contexts, using the approved rules evidence rather than shared-name substitution (after T009).
- [x] T013 [P] Populate `src/content/instructions.json` with all SU-01–SU-12 sourced text variants, ordering, context IDs and quantity parameters from the approved reference, including physical deck/Beginner/P2 exceptions; label human overrides separately from official rules, and embed no executable applicability or state logic (after T009).
- [x] T014 Load catalog JSON as read-only inputs in `src/content/catalogs.ts`, keeping definitions separate from session values and using stable IDs for references; satisfy T005/T009 without mutating catalogs or adding runtime network fetching.
- [x] T015 Define plain-data session/configuration/selection/pending-edit/conflict types in `src/domain/types.ts`; preserve data-model constraints verbatim: playerCount is “Integer 2–5; initial/reset value 2”, variants are “Extended Start and research drafting only, initially on; neither requires an expansion”, and objective rows have “Five rows per kind when generated; empty rows cannot be locked”; include no WGT, card, persistence or completion state.
- [x] T016 Write and establish failing context-rule cases in `tests/domain/context.spec.ts` for all-required prerequisites, optional non-expansion routes, Hellas/Utopia restrictions, CE/printed/MA versions, fixed Venus additions and R1 printed-retention notices, including every disabled prerequisite (AC-09–12, AC-24, AC-31–35).
- [x] T017 Implement Vue-independent context/eligibility/threshold interpretation in `src/domain/context.ts`, consuming descriptive JSON metadata; filter MA candidates without enabling content, retain complete printed objectives/maps under R1, keep Constructor eligible without Colonies, and expose source-specific notices/thresholds for later projections.
- [x] T018 Write and establish failing random-boundary cases in `tests/domain/random.spec.ts` for uniform bounded integers and sampling without replacement using injected deterministic sources, repeat-permitting rerolls, one-candidate no-op and insufficient-pool failure without partial committed output; avoid flaky frequency assertions (D3/D6).
- [x] T019 Implement the pure injectable sampling contract in `src/domain/random.ts` and browser random adapter in `src/random.ts`; ensure unbiased bounded mapping if using random bytes, no random-sort sampling and no remote randomness; satisfy T018 before use by story selection operations.
- [x] T020 Write and establish failing catalog/build-gate cases in `tests/domain/build-gate.spec.ts` proving invalid catalog input exits unsuccessfully and prevents asset emission, with valid fixtures permitting the build path; use isolated temporary fixtures and output paths rather than damaging real catalogs.
- [x] T021 Wire `validate:catalogs` and the mandatory validate-before-Vite `build` command in `package.json` using `scripts/validate-catalogs.ts`; demonstrate the T020 failure/success outcomes with real catalogs complete, and run all foundation checks before moving to story work.

**Checkpoint:** All catalog schemas/data and foundation behavior are verified against the approved evidence; semantic source review supplements structural validation. Vue-independent primitives and domain types are available. No story is considered done merely because its data exists.

## Phase 3: Infrastructure story — Deploy the minimal application to GitHub Pages

**Authorization:** The user requested this infrastructure story and its implementation on 2026-11-12, after Foundations and before US1. This authorizes a blank runnable Vue shell and a merge-to-main deployment pipeline, without configuration/gameplay functionality.

**Goal:** After a verified merge/push to `main`, publish the blank Vue application at `https://jburkett.github.io/terraforming-mars-setup/`. Pull requests run verification and build/smoke checks only; they cannot deploy.

**Independent acceptance:** INFRA-01: Vue mounts a blank page with no US1 controls or runtime errors. INFRA-02: built module URLs use `/terraforming-mars-setup/`. INFRA-03: the production preview page and compiled JavaScript return HTTP 200, with JavaScript content type. INFRA-04: Pages deploys only from a successful verification job on a `main` push; PR jobs have read-only repository permissions. INFRA-05: the one-time Pages/environment settings and local verification commands are documented.

### Required tests first, then implementation

- [x] T065 [INFRA] Establish failing build-prefix and blank-shell tests in `tests/domain/deployment.spec.ts` and `tests/browser/deployment.spec.ts`; an empty HTML response must not count as a mounted Vue application (INFRA-01–03).
- [x] T066 [INFRA] Mount the smallest blank Vue shell in `src/main.ts`, `src/App.vue` and `index.html`, with the SFC import boundary in `src/vue.d.ts`; expose no state, configuration controls, router, persistence or US1 behavior (INFRA-01).
- [x] T067 [INFRA] Set Vite's repository base to `/terraforming-mars-setup/` in `vite.config.ts`, add `preview` in `package.json`, and adapt isolated build fixtures in `tests/domain/build-gate.spec.ts` to include the minimal shell without weakening catalog gating (INFRA-02).
- [x] T068 [INFRA] Configure `playwright.smoke.config.ts`, the shared base URL in `playwright.config.ts` and `test:smoke` in `package.json` to test the production preview; verify HTTP 200 for HTML/compiled assets and actual blank Vue mounting (INFRA-01–03).
- [x] T069 [INFRA] Establish failing workflow-policy tests in `tests/domain/pages-workflow.spec.ts` for verification gates, main-push-only deployment, least-privilege job permissions and official pinned actions; use the development-only YAML parser in `package.json`/`package-lock.json` to check real workflow structure (INFRA-04).
- [x] T070 [INFRA] Add `.github/workflows/pages.yml` to verify PRs/main pushes, build through catalog validation, smoke-test the production artifact and upload/deploy only after successful verification on `main`; scope Pages/OIDC write permissions to the deployment job (INFRA-04).
- [x] T071 [INFRA] Document one-time GitHub Pages Source=GitHub Actions, environment branch/protection settings, project URL and local run/smoke commands in `docs/github-pages.md` and `README.md`; describe deployment infrastructure in `specs/001-guided-game-setup/plan.md` without changing product requirements (INFRA-05).
- [x] T072 [INFRA] Run formatting, lint, types, all domain/infrastructure tests, the gated production build and HTTP/browser smoke checks; record red/green results and hosting limits in `specs/001-guided-game-setup/checklists/deployment-validation.md`, leaving T022–T064 unchecked.

**Checkpoint:** The application is a blank Vue shell, not US1. The workflow publishes only after this work is merged to `main` and the documented repository settings are applied. No live deployment is claimed by local smoke tests or PR creation.

## Phase 4: User Story 1 — Configure the physical game (P1)

**Goal:** Configure player count, content, boards and variants across the first two views while retaining live choices.

**Independent evaluation:** New session and page-local select-all/none obey defaults, dependency enforcement and Tharsis fallback; Back retains selections and Continue reaches setup without private-card entry. Validate configuration independently of generated results/instructions. Destructive post-generation edits are completed under US4 before an integrated release.

### Required tests first

- [x] T022 [P] [US1] Write and establish failing configuration behavior cases in `tests/domain/configuration.spec.ts` for AC-01–06, D1/D2, P2→Prelude normalization including atomic bulk-none, all-seven board defaults/fallback, variant independence and exclusion of WGT/longer Venus.
- [x] T023 [P] [US1] Write and establish failing labeled-control/navigation journeys in `tests/browser/configuration.spec.ts` for top-of-page bulk controls, N preservation, visible P2 dependency reason, unchecked/disabled boards, variants→expansions Back retention and Continue to setup (AC-01–06, AC-37, AC-39).

### Implementation after the relevant failure evidence

- [x] T024 [US1] Implement defaults and pure configuration normalization/actions in `src/domain/configuration.ts`; quote and enforce the board constraint “Removing the last candidate restores off/Tharsis fallback” and preserve N on page-local bulk actions; normalize P2/Prelude bulk changes atomically without variant controls enabling expansions.
- [x] T025 [US1] Establish the application-lifetime Composition API owner in `src/composables/useGameSession.ts` with initial configuration, current view and explicit action boundaries; pass plain values to domain functions, keep catalogs read-only/separate and retain the same session across view remounts, without Pinia, router or persistence.
- [x] T026 [US1] Build `src/ui/ExpansionsView.vue` with labeled N/content controls, top select-all/none, Use expanded boards and all seven board checkboxes, fallback/inactive presentation and the P2 dependency explanation; invoke the shared session actions rather than embedding domain rules in components.
- [x] T027 [US1] Build `src/ui/VariantsView.vue` with only Extended Start/research drafting, page-local bulk controls, Back and Continue; both toggles remain available without expansions and leave unrelated state intact.
- [x] T028 [US1] Extend the existing blank infrastructure shell in `src/App.vue` and `src/main.ts`, create one shared session above the three view boundaries and semantic navigation, and satisfy T023; do not treat setup rendering/mounting as permission to draw selections or introduce URL routing.

**Checkpoint:** US1 can be demonstrated with configuration journeys alone. This is a development increment, not a complete approved product or permission to deploy.

## Phase 5: User Story 2 — Receive and customize public selections (P1)

**Goal:** Generate only eligible public results on first setup entry, retain them across unchanged visits and offer bounded manual choices/rerolls.

**Independent evaluation:** With an explicit normalized configuration, verify board/first-player bounds, colony counts, source-specific objective sets/limitations and customization/lock behavior without requiring any physical card input. Integrated navigation uses US1; domain tests can supply configuration directly.

### Required tests first

- [x] T029 [P] [US2] Write and establish failing generation/customization cases in `tests/domain/selections.spec.ts` for AC-07–09/AC-15, N=2/3/4/5 colonies 5/5/6/7, inactive tiles, retained visits/missing-only fills, explicit-target rerolls, duplicate prevention, one-candidate/repeat behavior and D6 all-or-nothing conflicts.
- [x] T030 [P] [US2] Write and establish failing objective cases in `tests/domain/objectives.spec.ts` for AC-09–14, AC-24 and AC-31–35: independent five-row MA sets, source thresholds, fixed Venus pair, complete printed retention/notices, symmetric alternatives, manual auto-lock, stable row positions and all-locked no-op.
- [ ] T031 [P] [US2] Write and establish failing browser journeys in `tests/browser/selections.spec.ts` for first-entry generation/unchanged revisits, eligible Customize drop-downs and bottom reroll controls, two-column gridless objective tables, independent table filtering/locks and D6 explanation/return behavior; start each scenario with its explicit configuration.

### Implementation after the relevant failure evidence

- [ ] T032 [US2] Implement public-result generation and missing-only filling in `src/domain/selections.ts` using T017/T019; resolve board before board-dependent objectives, enforce “first player is in 1…N” and colony counts, and commit no partial result on an insufficient pool (AC-07–09, D6).
- [ ] T033 [US2] Implement effective objective projection and row alternatives in `src/domain/objectives.ts`: MA five-plus-five with fixed Venus additions, printed complete sets/R1 notices, source/context thresholds and all-other-row exclusion without sorting (AC-09–13, AC-24, AC-31–35).
- [ ] T034 [US2] Add explicit setup-entry and target generation actions to `src/composables/useGameSession.ts`; fill only missing applicable values, preserve valid unlocked rows as well as locks on revisits, retain values across remounts and never draw in computed values, watchers or rendering.
- [ ] T035 [US2] Implement objective manual selection, lock/unlock and reroll actions in `src/domain/customization.ts`, preserving row positions, excluding other/locked values and auto-locking manual choices; support eligible board/first-player/colony replacements and target-only rerolls without adding colony lock state (AC-13–15).
- [ ] T036 [US2] Implement direct board-change preview/commit in `src/domain/board-change.ts`: calculate printed-set replacement or invalid MA rows/locks before mutation, require confirmation before losses, cancel without any state/random change and reconcile only affected objectives after acceptance while retaining eligible rows and unrelated results (AC-15, AC-28).
- [ ] T037 [US2] Build `src/ui/ObjectiveTable.vue` with drop-down then lock columns and no gridlines, stable rows, symmetric live option exclusions, manual auto-lock and unlocked-only reroll; do not expose MA controls for printed sets or fixed Venus entries.
- [ ] T038 [US2] Build `src/ui/PublicSelections.vue` with board, first-player and colony Customize controls, eligible alternatives and bottom reroll controls; preserve count/uniqueness and keep colony interaction within D5 without a new fine-grained eligibility or lock system.
- [ ] T039 [US2] Integrate generation/customization/board-confirmation actions and result presentation in `src/composables/useGameSession.ts`, `src/ui/SetupView.vue` and `src/ui/PublicSelections.vue`, satisfying T031 with no physical-card state; use a labeled confirmation presentation for the direct board-loss preview and retain its cancellation semantics.
- [ ] T040 [US2] Add selection-conflict display and configuration-return action in `src/ui/SelectionConflict.vue` and connect it through `src/ui/SetupView.vue`, exposing D6's configuration conflict without partial sets, fabricated values, forced enabling or silent lock loss; satisfy deterministic domain and browser conflict cases.

**Checkpoint:** US2 works against explicit configurations and live unchanged navigation. Board-dependent selection is reconciled before commit; other post-generation configuration-edit behavior remains an explicit US4 dependency for integrated delivery.

## Phase 6: User Story 3 — Prepare the table and review configuration (P1)

**Goal:** Show all applicable physical setup instructions in order and an exact summary of the committed configuration/results.

**Independent evaluation:** Supply known configurations/results and compare applicable SU-01–SU-12 text, sources, quantities and summary against the rules packet, independently of randomness. Integrated UI additionally consumes US1/US2.

### Required tests first

- [ ] T041 [P] [US3] Write and establish failing instruction projection cases in `tests/domain/instructions.spec.ts` for AC-16–24/AC-36/AC-38: applicability and ordering, base/CE/Beginner branches, Amazonis supplies, colony positions, Turmoil physical setup, normal/Extended Start deals and P2 preparation/discard/refund sequence; assert every output has a source or recorded override.
- [ ] T042 [P] [US3] Write and establish failing summary cases in `tests/domain/summary.spec.ts` for AC-25/AC-35/AC-39: N, first-player number, board/content/two variants, colony/objective identities/versions and every printed limitation agree with committed state, with no WGT value or independently mutable saved summary.
- [ ] T043 [P] [US3] Write and establish failing browser journeys in `tests/browser/instructions.spec.ts` for all-visible ordered sourced instructions and matching summary, all-on/base-only/map-specific variants, standard Venus and physical decks; assert no progress checkboxes, private-card entry, digital card/event choice, longer Venus or gameplay guidance (AC-16–25, AC-35–39).

### Implementation after the relevant failure evidence

- [ ] T044 [US3] Implement instruction context/applicability/quantity interpretation in `src/domain/instruction-context.ts` using configuration, selected board/colonies and descriptive JSON variants; keep executable rules in TypeScript, omit off-expansion instructions and avoid card inventories or generic JSON evaluation.
- [ ] T045 [US3] Implement ordered instruction projection in `src/domain/instructions.ts`, carrying SU/source/override references: ordinary nine oceans vs Amazonis eleven, CE production 1/0, Beginner 42 M€ and ten free projects, colony activation/fleets, physical Turmoil sequence, 2/4 vs 3/6 deals, no initial draft/quotas, P2 discard piles prepared before use and 15 M€ unplayable Prelude handling; preserve all SU prerequisites and R2/R3 exclusions.
- [ ] T046 [US3] Implement summary projection in `src/domain/summary.ts` from committed configuration/results/effective objectives only, reusing R1 notices/source versions and including first player and both supported variants without WGT or persistence (AC-25, AC-35, D7).
- [ ] T047 [US3] Build `src/ui/InstructionList.vue` as one visible ordered applicable list with source/override traceability and physical-action text, without mandatory hidden steps, completion state or card entry (AC-16–24, AC-36, AC-38).
- [ ] T048 [US3] Build `src/ui/ConfigurationSummary.vue` for every specified summary field, complete printed limitations and correct objective versions, using projection data rather than independent editable/copied state (AC-25, AC-35).
- [ ] T049 [US3] Connect read-only instruction/summary computations in `src/composables/useGameSession.ts` and `src/ui/SetupView.vue` to T044–T048, keeping computations free of random draws and catalog mutation; satisfy the T043 observable journeys without adding gameplay or recovery features.

**Checkpoint:** With supplied state, SU coverage and summary correctness can be validated without random selection. Live end-to-end guidance still requires integrated US1/US2 and US4 edit semantics.

## Phase 7: User Story 4 — Change configuration without losing unrelated choices (P2)

**Goal:** Confirm affected state loss, preserve unrelated results/locks, cancel atomically and deliberately reset to defaults. Preserve the approved tentative v1 policy rather than redesigning it.

**Independent evaluation:** Use known generated selections and locks, preview/confirm/cancel each dependency-map edit and Reset, then compare exact retained/cleared state. Integrate all views only after the pure transitions pass.

### Required tests first

- [ ] T050 [P] [US4] Write and establish failing edit cases in `tests/domain/edits.spec.ts` covering every row of the spec state dependency map and AC-26–29/AC-34: MA on plus Colonies on with locked MA Pioneer and an unrelated lock, N=4→5, printed vs MA board changes, CE threshold-only changes, Venus/Turmoil/MA source changes, all-prerequisite handling and instruction-only changes; previews/cancellation consume no randomness and preserve prior committed state.
- [ ] T051 [P] [US4] Write and establish failing Reset cases in `tests/domain/reset.spec.ts` for AC-30, D1 and scope/default invariants: cancellation changes nothing; confirmation clears all results/locks and restores N=2, all seven boards/content/two variants; next setup entry generates fresh results without WGT or longer Venus state.
- [ ] T052 [P] [US4] Write and establish failing browser journeys in `tests/browser/edits.spec.ts` for confirmation before loss, cancel/confirm, MA Pioneer vs unrelated lock, printed Utopia notice changes with MA off, N and board edits, instruction-only edits and Reset; scenarios set MA/Colonies explicitly and never assume colony locks.

### Implementation after the relevant failure evidence

- [ ] T053 [US4] Implement the full dependency-based affected-state calculation in `src/domain/invalidation.ts`, reusing board-change/context primitives: clear first-player/colonies on N changes even if still in range, clear only excluded board/ineligible rows, preserve valid locks/identities, derive R1 limitations instead of invalidating printed sets and treat changed instructions as newly selected physical setup (AC-26–29, AC-34).
- [ ] T054 [US4] Implement normalized pending-edit/commit/cancel transitions in `src/domain/edits.ts` with exact loss previews and atomic committed-state replacement; preserve invalidated locks until consent, enforce P2/Prelude bulk semantics, commit non-loss edits without destructive confirmation and never draw during preview (FR-022, spec dependency map).
- [ ] T055 [US4] Implement Reset preview/commit/cancel in `src/domain/reset.ts` using US1 defaults, clearing all public choices/locks only after confirmation and leaving next-entry generation to US2 (AC-30).
- [ ] T056 [US4] Route configuration edits/Reset through `src/composables/useGameSession.ts`, keeping pending and committed state separate and recomputing only projections until consent; after commit let next setup entry fill missing values while preserving unaffected selections (AC-26–30).
- [ ] T057 [US4] Consolidate the existing board-loss confirmation and other loss/Reset confirmations into `src/ui/ConfirmationDialog.vue` and `src/ui/PublicSelections.vue`, with clear affected-result/lock explanations, labeled confirm/cancel and operable focus behavior; retain US2 direct-board semantics and all cancellation guarantees.
- [ ] T058 [US4] Wire pending-edit/cancel/confirm and Reset interactions through `src/App.vue`, `src/ui/ExpansionsView.vue`, `src/ui/VariantsView.vue` and `src/ui/SetupView.vue`; show committed values while awaiting consent, restore them on cancel, and satisfy T052 without globally clearing state or claiming physical actions were undone.

**Checkpoint:** All four stories can now be integrated without violating configuration-edit safety. Confirmed MA removal clears MA Pioneer, while printed Utopia Pioneer remains under R1; no colony locks are assumed.

## Phase 8: Polish and cross-cutting concerns

**Purpose:** Verify the complete approved scope and quality gates; do not add speculative features or performance targets. T059 and T060 can run together after all four story phases; any behavioral defect found must first gain a failing regression case before a correction.

- [ ] T059 [P] Add and execute deterministic cross-configuration/invariant coverage in `tests/domain/configuration-matrix.spec.ts` for all supported player counts/maps/content/variant combinations, source precedence, eligible counts, all disabled printed prerequisites, missing-only generation and transition/lock boundaries; prove SC-001–SC-005 without claiming every possible random history or individual-card coverage.
- [ ] T060 [P] Add and execute end-to-end scope/lifetime regressions in `tests/browser/scope-and-lifetime.spec.ts` for shared Vue state across view remounts, unchanged-navigation randomness, no catalog mutation, no storage-based recovery, scope exclusions after select-all/Reset/Venus toggling and summary consistency; no private inventories, WGT, longer Venus or progress/gameplay controls (AC-37–39).
- [ ] T061 Review the rendered three-view experience against `specs/001-guided-game-setup/contracts/ui.md` and adjust `src/ui/styles.css` and relevant Vue components for labeled keyboard-operable controls, gridless objective tables and readable all-visible instructions; record busyness/selective-clearing findings in `specs/001-guided-game-setup/checklists/implementation-validation.md` and seek human direction before substantive requirement/architecture changes.
- [ ] T062 Extend verification in `.github/workflows/pages.yml` running the locked install, formatting, lint, Vue/TypeScript checking, domain tests, browser journeys and catalog-gated build; fail on invalid catalogs and relevant test failures, while preserving the existing main-only Pages deployment guard and adding no new service.
- [ ] T063 Update actual installation/run/verification guidance in `README.md` and `specs/001-guided-game-setup/quickstart.md` to match implemented scripts and pinned runtime, keeping exclusions and physical setup boundaries intact; do not present planned commands or unrun checks as measured application results.
- [ ] T064 Execute the complete quickstart verification and sourced-content review, recording commands/results, SU-01–SU-12 coverage, AC-01–39/SC-001–SC-005 outcomes and any human usability-review findings in `specs/001-guided-game-setup/checklists/implementation-validation.md`; resolve failures through test-first corrections and leave merge/deployment decisions to their separately authorized workflow.

## Dependencies and execution order

```text
Setup T001–T004
       ↓
Foundations T005–T021
       ↓
Deployment infrastructure T065–T072
       ↓
US1 configuration T022–T028
       ↓
US2 public selections T029–T040
       ↓
US3 physical guidance/summary T041–T049
       ↓
US4 safe edits/Reset T050–T058
       ↓
Cross-cutting validation T059–T064
```

This is the recommended integration order, not a claim that story domain tests require preceding UI implementations. Within foundations: T005→T006; T007→T008; T009 precedes catalog population; T010/T011/T012/T013→T014; T015→T016→T017; T018→T019; T020 precedes T021, which requires T008 and completed catalogs. All foundation work completes before story implementation. Deployment infrastructure follows Foundations and precedes US1; existing user-story IDs remain unchanged.

Within each story, the test group precedes its relevant implementation, with recorded missing-behavior failures. US1 configuration actions precede its composable/views/shell. US2 generation/projections/customization precede reactive integration and conflict rendering; direct board preview depends on source/eligibility projections. US3 context precedes ordered projection and views. US4 affected-state calculations precede transactional edits, session integration and confirmation UI. T062 follows completed tooling/application behavior; T064 follows all other final checks and documentation alignment.

US2 domain behavior can be evaluated with supplied configuration; US3 projections can be evaluated with supplied configuration/results; US4 transitions can be evaluated with supplied committed state. Their integrated browser journeys reuse the earlier stories, as the product requires. Do not mark a story independently releasable when it depends on missing safe-edit or summary behavior. Preserve the original specification's warning that user journeys are not necessarily standalone MVP slices.

### Parallel execution examples

| Group | Safe parallel example after prerequisites | Join/serialization boundary |
| --- | --- | --- |
| Setup | T002 lint/format configs and T003 runner configs after T001 | Both join at T004; do not concurrently edit `package.json`. |
| Foundation catalogs | T011 colonies, T012 objective JSON and T013 instruction JSON after T009 | Independent files; all join with T010 at T014, then full build gate T021. |
| US1 | T022 domain configuration failures and T023 browser configuration failures | Establish both applicable failures before behavior/UI implementation. |
| US2 | T029 selection, T030 objective and T031 browser selection failures | Shared source/composable implementation proceeds after the relevant failures; no simultaneous edits to shared files. |
| US3 | T041 instruction, T042 summary and T043 browser instruction failures | Join at domain/UI integration T049; do not concurrently modify the composable. |
| US4 | T050 edit, T051 Reset and T052 browser edit failures | T053–T058 integrate sequentially; shared Vue/control files are not independent work. |
| Final verification | T059 domain matrix and T060 browser lifetime regressions | Full suite/results join before T064. |

These examples are future scheduling options, not dispatches or authorization to implement now. Pure US3 projection work may be developed against fixtures alongside US2 after foundation completion, but integration in `useGameSession.ts`/`SetupView.vue` must remain serialized.

## Acceptance and design traceability

| Approved behavior | Future tasks and independent proof |
| --- | --- |
| AC-01–06: configuration/defaults/dependencies | T022–T028; fresh session, page-local toggles, N preservation, P2 normalization and Back retention. |
| AC-07–09: generation/counts/lifetime | T029, T031–T034, T038–T040; injected deterministic draws and unchanged browser revisit. |
| AC-10–12, AC-24: objective source/eligibility/thresholds | T009, T012, T016–T017, T030, T033; printed/MA/Venus/Turmoil/CE separation. |
| AC-13–15: customization/locks | T030–T031, T035–T039; all-other-row alternatives, stable positions, all-locked no-op, bounded public choices. |
| AC-16–23: physical sourced guidance | T013, T041, T043–T045, T047, T049; ordered visible SU rows and correct applicable physical preparation. |
| AC-25: exact summary | T042–T043, T046, T048–T049; compare projection/rendered values with supplied committed state. |
| AC-26–30: loss confirmation/selective retention/Reset | T050–T058, plus T036 direct-board preview; cancel/confirm exact-state comparisons and next-entry generation. |
| AC-31–35: R1 printed retention and notices | T016–T017, T030, T033, T042, T046, T050, T052–T054; all maps remain eligible and every missing expansion is named. |
| AC-36–39: standard Venus, R2/R3 and WGT exclusions | T009–T013, T022–T023, T041, T043–T045, T051, T059–T060; defaults/Reset/Venus toggles and physical-only deck guidance. |
| D3/D6 and edge cases | T018–T019, T029–T032, T035, T040, T059; unbiased bounded behavior, repeat-permitting draws, insufficient pool without partial state. |
| JSON/Vue/domain boundary and quality | T005–T021, T025, T034, T049, T056, T059–T064; invalid JSON blocks build, Vue-independent rules and shared session without persistence. |

SC-001 maps to T009/T013/T041/T043–T045/T047/T059/T064; SC-002 to T016–T019/T029–T040/T059; SC-003 to T029–T035/T059–T060; SC-004 to T036/T050–T058/T064; SC-005 to T042–T049/T060/T064. All 26 active FRs are covered by their spec AC mappings above; retired FR-027/028 stay retired and are covered only as exclusions in AC-39. No requirement is regenerated or expanded by this list.

## Implementation strategy and review gate

1. Review this task artifact before separately authorizing implementation. Its generated checkboxes do not confer that authorization.
2. After authorization, complete setup/foundations and deployment infrastructure, then US1 as the smallest configuration demonstration. Validate US1 independently; it is not a complete setup assistant or approved deployment scope.
3. Add US2 selections, US3 physical guidance/summary and US4 selective edits in the recommended integration order, maintaining test-first failure/success evidence per behavior. Do not expose partially implemented destructive edits as completed functionality.
4. Run cross-cutting verification and human rendered review before proposing the finished feature for merge. Do not infer deployment/merge permission from task completion or from earlier documentation approvals.

**Generation checks (initial task generation):** 64 sequential tasks; US1 7, US2 12, US3 9, US4 9; setup 4, foundations 17, cross-cutting 6. All tasks use unchecked checklist IDs, story labels where required and concrete file paths. No `.specify/extensions.yml` exists, so no before/after task-generation hooks are registered. This artifact records intended future work, not application test results.

**Current infrastructure addition:** 72 tasks total: the original 64 plus T065–T072. Execute the new infrastructure phase before US1 despite its higher numeric IDs. T029–T064 remain unstarted. The blank infrastructure entry point has now been extended by T028 for US1 configuration navigation only.
