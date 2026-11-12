# MVP integration and acceptance validation

**Scope:** T059–T064 only, authorized by the user, starting from fetched `origin/main` at `ccc27c9` (merged US4), 2026-11-12. Follow constitution v1.0.0, the approved specification/technical plan and `AGENTS.md`. Preserve task commits. No specification expansion, new feature, automatic merge or post-MVP redesign is authorized.

New coverage tests existing behavior directly. A defect must be demonstrated by a failing regression before its correction; no artificial red baseline is introduced for behavior already implemented. Final acceptance combines domain, browser, production artifact, sourced-content and rendered-review evidence. Automated or assistant review is not represented as human usability approval.

## Task evidence

- **T059 — deterministic configuration and transition coverage:** All 246 domain/infrastructure tests pass. The 59 new test groups cover 10,752 valid N/map/content/variant combinations (4 × 7 × 96 × 4), 29,568 independent one-step edits, all 127 nonempty board pools in both objective modes/all player counts (1,016 cases), and 56 map/count/source Reset/all-locked boundaries. Frozen inputs and catalog snapshots guard mutation; injected deterministic draws verify membership, uniqueness, missing-only filling, unchanged revisits, lock retention, complete printed limitations, source thresholds, instruction applicability/order/citations and matching summaries. A fixture discriminant was corrected before commit; existing application behavior passed without correction. Lint, strict types and formatting pass. This is finite configuration/boundary coverage, not every random history, statistical distribution sampling or individual-card validation.

- **T060 — scope and session regressions:** All four new Chromium browser journeys pass. Test-only instrumentation counts native random draws without replacing their values and reads the same cached, deeply frozen catalog module. Unchanged view remounts retain configuration/results/locks with zero new draws; customization/rerolls/board changes keep the summary synchronized; catalogs remain unchanged; storage/cookies stay empty and reload restores a fresh session. Select-all, Reset and Venus off/on retain standard Venus and exclude WGT, longer Venus, private-card/progress/gameplay controls. Test audit types were corrected before commit; lint, strict types and formatting pass. Managed Firefox/WebKit are absent locally; all-engine CI verification is recorded below when executed. No application correction was needed.

- **T061 — accessibility/usability correction and review:** Three keyboard regression cases failed before correction. Navigation now focuses the current view heading (without adding a Tab stop), and a confirmed edit falls back to the current view navigation control when its initiator becomes disabled. A small shared focus-visible rule is the only new styling. All 10 targeted accessibility/dialog/lifetime browser checks, the catalog-gated build and 5 production smoke tests pass; lint, types and formatting pass. Accessible names, native modal keyboard behavior, selection-then-lock columns with zero grid borders, visible ordered instructions and horizontal layout were checked at 1100px and 390px widths. Assistant-inspected desktop/mobile renders remained readable without horizontal overflow. No visual redesign or requirement/architecture change was made.

## Rendered review and deferred findings

- Content controls, prerequisite explanation and scoped bulk actions remain labeled and usable by keyboard. View headings now provide a logical focus destination after navigation.
- Both variants remain available without expansions. Setup keeps one visible ordered instruction list; objective tables remain gridless with selection before lock and fixed Venus entries outside editable rows.
- The all-content instruction list is long and requires vertical scrolling, especially at mobile width. Text, subsection IDs and source lines are readable and required steps are not hidden. This is the approved tentative all-visible presentation; shortening, grouping, collapse controls or aesthetic redesign are deferred to the separate post-MVP epic.
- Selective-loss explanations name affected selections and locks, retain current values until consent, distinguish cancel/confirm and explain that physical actions are not undone. The long Reset loss list can require modal scrolling; native keyboard access remains available.
- No new human usability session or assistive-technology study was conducted by the assistant. These are automated/assistant-rendered findings, not WCAG certification or human approval of busyness. Human acceptance remains the draft PR review. Earlier specification/plan approvals are not represented as a new hands-on usability test.

- **T062 — CI verification and retained evidence:** Three new workflow/reporting regressions failed before configuration changes, then all six workflow checks and six catalog/build-failure cases passed. CI explicitly validates catalogs and selects Chromium/Firefox/WebKit, while the complete domain command includes the matrix. Separate non-opening HTML reports for browser and production suites plus failure traces are retained for seven days using a pinned official artifact action. Local CI-mode execution produced both report indexes; all three focused keyboard cases and five production smoke cases passed, including new HTTP 200/content-type coverage for compiled CSS as well as JavaScript. Lint, types and formatting pass. Existing PR/main triggers, read-only verification privileges, verified-main-only Pages upload/deploy conditions and deployment dependency remain protected by tests; no new service was added.

- **T063 — actual run/verification documentation:** README, quickstart and Pages guidance now describe the implemented three-view workflow, pinned Node 24.22.1/npm 11 reference, locked installation, actual scripts, serial strict-port browser/production tests, three-engine CI, retained reports and Chromium-only local fallback. Removed obsolete planning-only/no-application/setup-placeholder claims. Physical card handling, R1 limitations, standard Venus, scope exclusions, memory-only lifetime and separate human merge/deployment decisions remain explicit. Formatting and whitespace checks pass; commands/results are distinguished from coverage limits and human usability approval.

## Final acceptance method

The following outcomes compare the implemented application with the approved specification and `rules-reference.md`. “Pass” means the cited automated checks and assistant source/render review found the criterion satisfied within the stated coverage. It does not replace human PR approval or claim exhaustive random-history, physical tabletop or assistive-technology testing. Test paths below are relative to `tests/`; `domain/configuration-matrix.spec.ts` is abbreviated **matrix**. Browser counterparts exercise the rendered integration rather than only projections.

### Acceptance criteria

| Criterion | Outcome | Evidence and reviewed behavior |
| --- | --- | --- |
| AC-01 | Pass | `browser/configuration.spec.ts`: all content, seven boards and both variants on; N=2. |
| AC-02 | Pass | Configuration domain/browser tests and matrix board pools: page-top bulk actions affect content toggles, preserve N and restore valid board fallback. |
| AC-03 | Pass | Configuration browser tests: variant bulk actions affect both variants only and retain N/content. |
| AC-04 | Pass | Configuration domain/browser tests: P2 requires/retains Prelude; bulk-none disables both atomically. |
| AC-05 | Pass | Configuration domain/browser tests: independent variants without expansions; Back/Continue retain choices. |
| AC-06 | Pass | Matrix's 1,016 board-pool cases and configuration browser tests: seven candidates, unchecked Tharsis allowed, empty/disabled pool restores inactive Tharsis. |
| AC-07 | Pass | `domain/selections.spec.ts`, matrix and `browser/scope-and-lifetime.spec.ts`: first entry creates one eligible board and first player in 1…N; unchanged revisits consume no new draws. |
| AC-08 | Pass | Selections/catalog tests and matrix: colony counts 5/5/6/7 for N=2/3/4/5, unique candidates from all 11 including initially inactive tiles. |
| AC-09 | Pass | Objectives tests, matrix and public-selection browser tests: independent five-row MA sets, plus the fixed Venus pair when enabled. |
| AC-10 | Pass | Objectives/summary tests and matrix: complete printed Elysium sets and its printed Tycoon threshold 15 remain source-specific. |
| AC-11 | Pass | Context/objectives tests and matrix: MA prerequisites, volcano geography and Constructor's city alternative are interpreted without enabling content. |
| AC-12 | Pass | Context/objectives tests and matrix: Builder 8/7, Tycoon 15/10 and Merchant 3/2 use the correct source/context. |
| AC-13 | Pass | Objectives tests and selection browser journeys: manual choice auto-locks, all other row values excluded symmetrically, former value released, stable row order and independent sets. |
| AC-14 | Pass | Objectives/random tests, matrix and browser journeys: reroll preserves every lock; all-locked is a no-op for either set. |
| AC-15 | Pass | Selections tests and public-selection browser journeys: checked-pool board override, bounded first-player override, unique correctly sized colonies with no colony locks. |
| AC-16 | Pass | Matrix, instruction/browser component tests and accessibility review: applicable sourced SU steps in one visible ordered list, no completion/progress/private-card controls. |
| AC-17 | Pass | Instructions tests and sourced-content review: generation 1, oxygen 0, temperature −30, TR 20, CE production 0 versus base production 1, physical marked-card and ordinary corporation branches. |
| AC-18 | Pass | Matrix, instructions tests and Amazonis browser journey: eleven oceans and thirteen additional tiles on Amazonis, nine elsewhere, printed tracks/standard-project/map reminders. |
| AC-19 | Pass | Instructions/catalog tests and source review: one fleet/player, ordinary marker position 2, Enceladus/Miranda/Titan picture-side markers and physical activation guidance. |
| AC-20 | Pass | Instructions/scope tests and source review: one lobby/six reserve delegates, neutral chairman, Coming/Distant events and neutral dominance, no Current event in generation 1, Greens policy; no digital event or ruling-party selection. |
| AC-21 | Pass | Matrix, instructions tests and teaching/Prelude browser journeys: ten projects, ordinary two/three corporations, four/six Preludes keeping two, no Prelude deal when absent, no source quotas or initial drafting. |
| AC-22 | Pass | Instructions/source review and teaching browser journey: Beginner Corporation's 42 M€ and ten free projects distinct from ordinary purchases, no beginner configuration selector. |
| AC-23 | Pass | Instructions/source review: player-order reveal/effects, 3 M€ ordinary purchases before resolving two Preludes; P2 piles prepared before use and unplayable-Prelude refund 15 M€. |
| AC-24 | Pass | Objectives/instructions tests and matrix: printed Tharsis Terraformer TR 26 with Turmoil, MA Terraformer TR 29, fixed Venus additions in either mode. |
| AC-25 | Pass | Summary tests, matrix and browser lifetime/summary comparisons: every specified field follows committed configuration and public results, source versions and limitations included; no WGT state. |
| AC-26 | Pass | Edits domain/browser tests: removing Colonies previews losses, cancel preserves everything, confirm clears colonies and MA Pioneer/lock while retaining unrelated eligible locked milestone. |
| AC-27 | Pass | Edits tests and matrix: N=4→5 clears first-player/six-colony results after consent, next entry fills valid first player/seven colonies; board and unrelated objectives/locks survive. |
| AC-28 | Pass | Board-change/edits tests, matrix and browser journeys: printed board replacement requires consent, unaffected first player/colonies survive; eligible MA identities/locks retained and geography re-evaluated. |
| AC-29 | Pass | Edits/session tests and browser journey: Extended Start, drafting and Prelude instruction-only changes preserve unrelated results without card redealing or loss confirmation. |
| AC-30 | Pass | Reset tests, matrix and browser journey: cancel leaves exact state; confirm clears all results/locks, resets N=2/all content/seven boards/both variants and generates fresh results on entry. |
| AC-31 | Pass | Objectives/matrix and Utopia browser journey: complete printed sets including Pioneer; Colonies limitation, no replacement, forced content or map exclusion. |
| AC-32 | Pass | Objectives/matrix and Cimmeria browser journey: complete printed sets including Planetologist; Venus limitation, no replacement, forced content or map exclusion. |
| AC-33 | Pass | Objectives/matrix and Amazonis instruction journey: complete printed sets including Lobbyist; Turmoil limitation, no replacement, forced content or map exclusion. |
| AC-34 | Pass | Edits browser journey: printed Utopia identities remain unchanged across Colonies off/on, limitation appears/disappears, colony-result loss requires consent. |
| AC-35 | Pass | Matrix independently checks all printed disabled prerequisites on all maps; objective/summary tests and browser journeys match every limitation, retain full sets and distinguish MA filtering. |
| AC-36 | Pass | Instruction matrix and Amazonis/scope browser journeys: standard Venus starts at 0 on every map; no longer-board or WGT guidance. |
| AC-37 | Pass | Configuration/reset/matrix and scope browser tests: new session, bulk-all and Reset retain supported defaults without offering/selecting the longer Venus board. |
| AC-38 | Pass | Instructions/scope/source review and model/runtime inspection: physical decks and P2/Turmoil preparation use selected content; no card inventory, card identity/release lookup or digital standard-card draw. |
| AC-39 | Pass | Scope/lifetime browser tests, configuration types and matrix: defaults, bulk actions, Reset and Venus toggles offer/store/report no WGT setting or gameplay procedure. |

### Success criteria

| Criterion | Outcome | Evidence and limits |
| --- | --- | --- |
| SC-001 | Pass | Matrix checks applicability, SU order and citations for all 10,752 valid N/map/content/variant combinations; source review covers all 32 instruction variants across SU-01–12; representative rendered journeys. No solo row. |
| SC-002 | Pass | Matrix checks counts, membership, uniqueness, MA prerequisites and printed limitations; manual overrides covered by unit/browser tests. Bounded random rejection/mapping tested deterministically, without claiming a statistical frequency study. |
| SC-003 | Pass | Matrix's lock/all-locked/revisit boundaries and browser native-RNG counter prove unchanged revisits do not draw and locked results survive rerolls. |
| SC-004 | Pass | 29,568 independent one-step edit cases plus targeted multi-step/direct-board/cancel/Reset domain and browser journeys verify dependency-only invalidation and atomic committed state. Not every possible edit history. |
| SC-005 | Pass | Matrix projections and rendered summary comparisons match current fields; runtime/model/scope review finds no standard-card drawing, private-card entry or individual-card inventory/validation. |

### Physical setup/source review

Reviewed against the repository's approved source register and its recorded rules/overrides, not a newly downloaded primary-PDF/errata audit. `domain/sourced-content-review.spec.ts` independently compares printed map sets, MA 35/35 names and all eleven colony names/markers to that register, verifies literal approved quantities, and checks registered rules citations versus explicit product-decision citations. Combined with the applicability matrix and human-readable instruction review, all seven boards, seven content toggles, eleven colonies, 71 milestone entries, 71 award entries and 32 instruction variants are accounted for. Executable rules remain TypeScript, catalogs remain JSON and generated state remains memory-only.

| Step | Outcome | Reviewed physical guidance and sources |
| --- | --- | --- |
| SU-01 | Pass | Selected Mars board and generated first-player number; B and SPEC. |
| SU-02 | Pass | Generation/global/TR tracks, nine/eleven oceans and Amazonis thirteen extra tiles; B and AV. |
| SU-03 | Pass | Physical Turmoil delegate/chairman/event/policy preparation and generation-one exceptions; T. |
| SU-04 | Pass | Standard Venus 0, colony fleets/markers and conditional map reminders; V, C, HE, UC, AV and SPEC R2. |
| SU-05 | Pass | Complete printed or MA five/five sets, source thresholds, fixed Venus pair and explicit printed limitations; MA, V, T and SPEC R1. |
| SU-06 | Pass | Selected-content physical project/corporation/Prelude deck preparation, CE handling and early P2 discard piles; B, P, P2 and SPEC R3. |
| SU-07 | Pass | CE/base production distinction and explicit Beginner branch; B. |
| SU-08 | Pass | Ten projects, two/three corporations, four/six Preludes keeping two; no quotas or initial-hand drafting; B, P, P2 and SPEC. |
| SU-09 | Pass | Physical choices/discards, player-order reveal/effects and ordinary starting purchases at 3 M€; B. |
| SU-10 | Pass | Reminder to use already-prepared separate facedown P2 discard piles, without delaying their initial preparation; P2. |
| SU-11 | Pass | Two Preludes resolved after all purchases, P2 15 M€ unplayable rule and physical effects/activation; P, P2 and C. |
| SU-12 | Pass | Matching summary/review and handoff, first-generation order/research exceptions, drafting recorded without recurring gameplay/WGT; B and SPEC. |

## Remaining limitations and approval

No additional functional requirement failure was found in the covered configurations, source comparisons or rendered review beyond the two focus defects corrected under T061. Finite deterministic enumeration does not prove all random sequences or all edit histories. Physical shuffling, printed card effects and tabletop execution remain players' responsibility; individual cards are outside the approved scope. No backend, persistence, routing or state library was added.

Firefox and WebKit executables are absent locally; Chromium is available through `/usr/bin/chromium`. A fresh local Firefox install was attempted and its download endpoints returned HTTP 403 “Domain forbidden”; three-engine evidence must come from the GitHub-hosted run. The initial CI attempt and explicit rerun each passed 137/138 browser cases but Firefox reproducibly crashed during the same role-scoped `allTextContents()` summary read; this was a browser-process crash, not an assertion mismatch. The retained trace located the failure in the main-world bulk-text query. The regression now uses the standard retrying `toHaveText(colonies)` locator assertion for the same ordered colony names and count, retaining every summary comparison and engine. No application behavior, skip, automatic retry or timeout relaxation was introduced (`retries: 0`). Follow-up results are recorded below.

All-visible instruction length and long Reset dialogs remain documented usability limitations; no aesthetic or post-MVP redesign was introduced. No independent human usability session, assistive-technology study or WCAG certification was performed. Human acceptance remains PR review. PR verification does not publish the branch: Pages upload/deploy remains verified-main-only. No live-deployment claim or automatic merge is made.

## Executed local verification (2026-11-12)

Node 24.22.1 and npm 11.9.0; committed lockfile installed with `npm ci --cache /tmp/guided-setup-npm-cache`. Commands were run sequentially from repository root, without reusing a server on strict port 4173:

| Command | Result |
| --- | --- |
| `npm ci --cache /tmp/guided-setup-npm-cache` | Pass; fresh locked installation. |
| `npm run format:check` | Pass. |
| `npm run lint` | Pass, zero warnings. |
| `npm run typecheck` | Pass. The new source-review fixture's unsafe generic enumeration/matcher types were corrected before commit; no production change was required. |
| `npm run validate:catalogs` | Pass, actual committed catalogs valid. |
| `npm run test -- --run` | 253 passed across 18 files, including four final source-review checks. |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=chromium` | 46 passed, including desktop/mobile keyboard, lifetime/scope and all four stories. |
| `npm run build` | Pass, catalog validation before production Vite build. |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:smoke` | 5 passed against compiled assets: HTML/JS/CSS HTTP 200 and content types, mounting and complete setup/customization/edit/Reset journeys. |
| `git diff --check` | Pass. |

The three a11y regressions were observed failing before T061's two focus corrections; workflow/reporting regressions likewise failed before T062's configuration changes. Existing matrix, lifetime and source-catalog behavior already satisfied the added assertions, so no artificial failing implementation was introduced. Earlier story-specific red/green evidence remains in the linked incremental validation records.
