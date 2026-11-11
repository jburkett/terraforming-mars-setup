# Feature Specification: Guided Game Setup

**Feature branch:** `001-guided-game-setup`  
**Created / consolidated:** 2026-11-10  
**Status:** **Approved by the user on 2026-11-11**, including the complete specification and SC-001–SC-005. Requirements-quality checklist: **18/18**. R1–R3 are resolved; defaults D1–D3 and D5–D7 are approved, and D4 remains retired under R3. WGT is excluded from v1. Documentation commits and marking PR #4 ready for review are authorized; planning, task generation, application testing and implementation have not been authorized.

## Purpose and scope

A browser-based assistant for preparing a physical, multiplayer Terraforming Mars game. Players configure content, receive randomized public selections, optionally customize them, and follow all applicable physical setup instructions. The primary cases are all-content games and base-game teaching.

Support 2–5 players and non-solo content through the **2023 More Terraforming Mars! Kickstarter**, including that campaign's later-delivered components, with the deliberate v1 scope exception of the optional longer Venus board (R2). The standard Venus board remains supported. The campaign cutoff bounds supported expansions and setup components, not promotional-card membership or individual release dates (R3). Seven boards are supported: Tharsis, Hellas, Elysium, Utopia Planitia, Terra Cimmeria, Amazonis Planitia and Vastitas Borealis. Corporate Era, Venus Next, Prelude, Prelude 2, Colonies, Turmoil and Milestones & Awards are selectable content. Map packs are represented by **Use expanded boards** and board sub-options, not separate Hellas & Elysium or other map-pack selectors.

The supported variants are **Extended Start** and **research drafting**, both initially on. **World Government Terraforming (WGT) is excluded from v1** because it is not material to setup. Do not configure, track or guide WGT; this scope exclusion makes no change to the physical game rules.

Automate **only** the board, colony tiles, replacement milestones/awards, and first-player number. Every standard card deck used during play stays physically shuffled and drawn, including publicly revealed Turmoil events. Display private-component setup instructions without digital dealing, private card entry or card-effect execution. Guide physical deck preparation from selected expansions and printed rules; the assistant does not identify, catalog, filter or validate individual cards.

Excluded from v1: WGT configuration/tracking/guidance, individual card inventories, promo-card identification, card-level release-date tracking, the official optional longer Venus board, solo/Automa, later content, fan expansions/colonies, gameplay or turn-order walkthroughs, recovery after refresh/reopening, completion checkboxes, manual step-progress tracking, and expansion-specific corporation-dealing quotas. No accounts, exports, sharing features or additional product capabilities are introduced by this document.

The setup-rule and component inventory is [rules-reference.md](rules-reference.md). Its SU-01–SU-12 sequence is normative instruction coverage, subject to the explicit product decisions and scope exceptions R1–R3. It contains sources, component families, all board objective sets, all 11 official colonies, and the 70 replacement objective names. Historical discovery notes under `work/` are superseded by these two consolidated documents.

## Clarifications and decision status

### Session 2026-11-10 — consolidated human decisions

- Q: What content is supported? → A: All non-solo content through the 2023 campaign, including all seven boards; later releases excluded.
- Q: How is configuration organized? → A: Expansions/player count on page 1, variants on page 2, setup on page 3. Each configuration page has select-all/none at its top, scoped to that page. All applicable options initially on.
- Q: How do dependencies work? → A: Whole-expansion prerequisites enable required expansions; automated public-component pools filter against enabled content except fixed printed objectives under R1. Individual cards are outside app filtering under R3; physical deck preparation stays guided. Prelude 2 enables/keeps Prelude on. Back navigation returns from variants to expansions without losing unrelated state. Neither supported variant requires an expansion.
- Q: How are boards configured? → A: Expanded boards reveals all seven initially checked. Excluding Tharsis is allowed. Empty pool disables expanded boards; while off, only Tharsis is checked and every board checkbox is inactive; use Tharsis.
- Q: What is automated? → A: Boards, colonies, milestones/awards and first player as a number. Card decks, including Turmoil, are walkthrough-only.
- Q: When are results created? → A: On first entry to setup page 3; retain on revisits and regenerate only missing/invalidated results.
- Q: How are results customized? → A: Customize reveals drop-down choices and a bottom reroll control. Milestones/awards use two-column tables without gridlines, selection then lock. Manual choices lock. Each row excludes values selected in every other row of its table. Update immediately; no sorting. Reroll preserves locks and changes only unlocked choices.
- Q: Which objective versions apply? → A: Milestones & Awards on uses expansion versions and dependency filtering; off retains the complete printed milestone and award sets. Under resolved R1, maps remain available even if a printed objective is unattainable because an expansion is disabled. Identify each such objective and name the disabled expansion; never remove/replace it, enable the missing expansion or prohibit the map. This applies to all seven maps, including Utopia Planitia, Terra Cimmeria and Amazonis Planitia. This is an intentional product decision, not an official game rule.
- Q: Which dealing rules apply? → A: Any two corporations / four Preludes normally; any three/six with Extended Start. No expansion-source quotas. Extended Start remains available without Prelude and then changes only the corporation deal. All dealing stays physical.
- Q: Does the assistant inventory or validate cards? → A: No. R3 excludes individual card inventories, promo-card identification and card-level release-date tracking. Guide players through physical deck preparation using selected expansions; players handle cards and printed dependency rules themselves. The campaign cutoff is a general expansion/setup-component boundary, not a promotional-card research obligation.
- Q: Which Venus board is supported? → A: The standard Venus board only. The official optional longer board is deliberately excluded from v1: it adds no meaningful setup-assistant functionality and conflicts with the all-on-by-default configuration philosophy. This is an approved scope exception, not an assumption or a claim that the component is unofficial.
- Q: Which variants are included? → A: Extended Start and research drafting. WGT is explicitly excluded as immaterial to setup; this supersedes earlier WGT selection/default decisions. Possible v2 turn guidance is not v1 scope.
- Q: What happens on edits? → A: **Tentative v1:** confirm before clearing affected results/locks; retain unrelated state. Reconsider for v2.
- Q: What does Reset do? → A: Confirm, clear all state, restore initial all-on defaults; cancellation changes nothing.
- Q: How are instructions presented? → A: **Tentative:** all applicable instructions visible in order, without checkboxes; assess busyness when rendered. No progress recovery in v1.

These recorded decisions form part of the complete specification explicitly approved by the user on 2026-11-11. The published ordinary first-player procedure and expansion-specific corporation quotas are intentionally overridden. Extended Start availability without Prelude/Prelude 2 is also an explicit human decision.

## User Scenarios & Testing *(mandatory)*

Acceptance conditions below are requirements prose, not executable tests or an implementation test plan. The journeys can each be evaluated using a stated configuration; they are not claims that every journey is a separate implementation/MVP slice. Priorities are proposed for review.

### User Story 1 — Configure the physical game (Priority: P1)

As a player, I can choose player count, expansions, eligible boards and variants before setup. This lets an all-content group or a teaching group get instructions for the game they intend to play.

**Independent evaluation:** inspect configuration and its transition to setup without requiring any actual cards to be entered.

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-01 | New session: content options and all seven board candidates are on; Extended Start and research drafting are on. Player-count default is 2 under approved D1. |
| AC-02 | Select-none on expansions turns off all expansion/content options, including Prelude 2 and Prelude together; expanded boards falls back to checked/inactive Tharsis. It does not change player count under D2. |
| AC-03 | Select-all on expansions enables all content and all seven boards. Select-all/none on variants affects that page's available variant toggles only; it never turns an expansion on. The only variant toggles are Extended Start and research drafting; WGT is absent. |
| AC-04 | Enable Prelude 2 with Prelude off: Prelude turns on and the reason is visible. Try leaving Prelude off while Prelude 2 stays on: Prelude returns on. Bulk select-none leaves both off. |
| AC-05 | With Venus and Prelude off, Extended Start and research drafting remain available. Back returns to expansion configuration with existing choices retained; no variant control enables an expansion. WGT has no control or stored choice. |
| AC-06 | Uncheck only Tharsis with expanded boards enabled: only the other six boards can be selected. Uncheck the last board: expanded boards becomes off; Tharsis alone becomes checked and all board checkboxes become inactive. |

### User Story 2 — Receive and customize public selections (Priority: P1)

As a player, I receive a usable random configuration automatically and can replace particular choices without managing component eligibility. This removes awkward physical randomization while retaining control.

**Independent evaluation:** inspect generated public choices, customize them, and reroll; no private hand is required.

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-07 | First entry to page 3 creates exactly one board and one integer first-player result in 1…N. Only enabled public selections appear. Leave and return without configuration changes: every result and lock is unchanged. |
| AC-08 | Colonies on with 2/3/4/5 players produces respectively 5/5/6/7 distinct choices from the 11 named official tiles. Colonies off produces no colony selection. Inactive-at-start Titan/Enceladus/Miranda are still in the candidate pool. |
| AC-09 | MA on, Venus off: exactly five distinct milestone tiles and five distinct award tiles from MA's respective eligible pools. MA on, Venus on: those five-plus-five selections plus fixed Hoverlord and Venuphile, for six of each total. Fixed Venus additions are not rerolled as MA tiles. |
| AC-10 | MA off, Elysium chosen: display its printed five-plus-five set; do not randomize from MA or provide replacement choices from that pool. Display Tycoon as 15 played blue/green projects, not MA Tycoon 10. Unavailable printed entries follow AC-31–35; they do not block the map. |
| AC-11 | MA on, Turmoil off: Lobbyist and Politician cannot be selected. Colonies off: Pioneer cannot be selected. Venus off: Planetologist cannot be selected. Hellas or Utopia: Geologist cannot be selected. Constructor remains eligible without Colonies because cities count. |
| AC-12 | MA on: Builder uses 7 building tags, Tycoon 10 played blue/green projects, Merchant 2 of each resource. MA off: Tharsis Builder uses 8; Elysium Tycoon 15; Amazonis Merchant 3 of each. No cross-version substitution. |
| AC-13 | Choose an eligible manual milestone in row 3: it locks; its value immediately disappears from every other milestone row's options, above and below. Award options are unaffected. Its former value becomes available again where otherwise eligible. No row sorting occurs. |
| AC-14 | Lock two of five replacement milestones and reroll: both locked values/rows remain; the three unlocked results stay eligible, exclude locked values, and are mutually distinct. With all five locked, reroll changes no value. Same behavior independently applies to awards. |
| AC-15 | Customize beside board/first player/colony selection exposes eligible alternatives and a reroll control. A board override cannot select an unchecked board; a first-player override stays within 1…N; colony overrides preserve the required count and uniqueness. Colony customization follows approved D5; no colony lock-table behavior is required. |

### User Story 3 — Prepare the table and review the configuration (Priority: P1)

As a player, I see every applicable setup instruction in order, including physical private-card steps, and can review the resulting configuration. I do not have to check off work or enter my cards.

**Independent evaluation:** compare the visible instructions with SU-01–SU-12 for the stated content, then compare summary fields with the selected configuration.

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-16 | Setup shows the applicable SU sequence as one ordered instruction list without completion checkboxes, hidden mandatory wizard steps, or private-card entry. Off expansions contribute no expansion-specific instruction. |
| AC-17 | Tharsis, CE off: initial TR 20, generation 1, oxygen 0%, temperature −30°C, nine oceans and production 1 in every resource before corporation effects; instruct players to exclude CE-marked corporations/projects physically. CE on changes the production instruction to 0 and instructs players to include marked cards. Explain that ordinary corporations remain available in both; do not identify or validate any card. |
| AC-18 | Amazonis chosen: instruct eleven oceans, extra city/greenery supply and its Standard Project tile/printed tracks; do not reuse the ordinary nine-ocean instruction. No-volcano-map placement notes and ignored delegate/colony bonuses follow the source-specific SU reminders. Use the standard Venus board when Venus is enabled; never substitute the optional longer board because Amazonis is selected (AC-36). |
| AC-19 | Colonies: one fleet per player at the fleet tile. Ordinary selected tiles start at the highlighted second position; selected Titan/Enceladus/Miranda start on their pictures with the activation explanation. |
| AC-20 | Turmoil: instructions show one lobby/six reserve delegates per player, neutral chairman, physical shuffle, Coming and Distant events, event-indicated neutral delegates/dominance, no Current event in generation 1, and Greens policy on top. There is no digitally selected event or random ruling party. |
| AC-21 | Ordinary deal, Extended Start off: any 2 corporations and10 projects per player; with Prelude, four Preludes and keep 2. Extended Start on: any 3 corporations; with Prelude, six Preludes and keep 2. Without Prelude, Extended Start remains available but no Prelude deal appears. No expansion-source quotas or initial-hand drafting. |
| AC-22 | Beginner branch is explicitly described as following Beginner Corporation's 42 M€ and ten free starting projects, not the ordinary 3 M€ purchase-per-project rule. No beginner-player configuration selector or automated deal is added. |
| AC-23 | Ordinary starting purchases follow corporation reveal/starting effects in player order and cost 3 M€ per retained project. Prelude resolution follows all starting purchases and precedes the first action phase. P2 on uses its separate facedown corporation/Prelude discard piles and its 15 M€ unplayable-Prelude rule. |
| AC-24 | MA off, Tharsis and Turmoil on: printed Terraformer is replaced by TR 26. MA on: its Terraformer stays TR 29 even on Tharsis. Venus adds its pair in either source mode. |
| AC-25 | Summary agrees with N, first-player number, board, enabled content, Extended Start/drafting choices, colonies and objective sets. No WGT selection is recorded or summarized; no recurring game phase is executed by the assistant. |

### User Story 4 — Change configuration without losing unrelated choices (Priority: P2)

As a player, I can revise setup while keeping unrelated selections, or deliberately reset everything. This is the user's tentative v1 behavior and may change in v2.

**Independent evaluation:** begin with known generated selections/locks, make the specified edit and inspect retained/cleared fields.

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-26 | With MA on, remove Colonies while colony results exist and Pioneer plus an unrelated eligible milestone are locked: confirmation precedes loss; confirmation clears colonies and the ineligible MA Pioneer selection/lock, but preserves the unrelated milestone and lock. Cancellation preserves the entire previous configuration/results. With MA off, retain all printed objectives and update their limitation notices instead (AC-34). |
| AC-27 | Change N from 4 to 5: after confirmation clear the first-player result and six-colony selection; next setup entry creates a valid first-player number and seven colonies, preserving the selected board and unrelated eligible objectives/locks. |
| AC-28 | Change board Hellas→Elysium with MA off: confirm before replacing the printed objective sets; retain unrelated colony and first-player results. With MA on, keep still-eligible selected objectives/locks; board-dependent eligibility must be re-evaluated. |
| AC-29 | Turn Extended Start off: revise physical deal instructions but preserve the board, first-player result, colonies and eligible objective choices; no card identities have been stored or digitally redealt. |
| AC-30 | Confirm Reset: clear generated choices and locks, restore all supported content/all seven boards/Extended Start/research drafting on; WGT remains excluded. Next setup entry generates fresh choices. Cancel Reset: nothing changes. Approved D1 resets player count to 2. |

### Printed-objective retention — resolved R1 acceptance conditions

These conditions record an intentional product decision, not an official game rule. Existing Venus additions and the printed-Tharsis Turmoil overlay still apply.

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-31 | MA off, Utopia Planitia selected, Colonies off: show all five printed milestones and all five printed awards, including Pioneer. Mark Pioneer unattainable and name disabled Colonies as the cause. Utopia remains available for manual and random board selection; Colonies stays off and no replacement is supplied. |
| AC-32 | MA off, Terra Cimmeria selected, Venus off: show all five printed milestones and all five printed awards, including Planetologist. Mark Planetologist unattainable and name disabled Venus Next as the cause. Cimmeria remains available for manual and random board selection; Venus stays off and no replacement is supplied. |
| AC-33 | MA off, Amazonis Planitia selected, Turmoil off: show all five printed milestones and all five printed awards, including Lobbyist. Mark Lobbyist unattainable and name disabled Turmoil as the cause. Amazonis remains available for manual and random board selection; Turmoil stays off and no replacement is supplied. |
| AC-34 | MA off, Utopia selected with Colonies on: disable Colonies and confirm the loss of colony results. The board and its complete printed objective sets remain unchanged; Pioneer gains the Colonies limitation notice. Re-enable Colonies: the notice disappears without changing the board or printed objective identities. |
| AC-35 | For any supported map with MA off, each displayed printed objective that is unattainable because an expansion is disabled has a notice naming that objective and every disabled expansion causing the limitation. The summary identifies the same limitations. Retain the complete printed sets; do not substitute objectives, enable expansions or exclude the map. With MA on instead, apply the eligible replacement pools in AC-11, not this printed-set exception. |

### Venus-board scope exception — resolved R2 acceptance conditions

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-36 | Venus Next on, with any supported Mars map including Amazonis Planitia: instruct preparation of the standard Venus board at 0 and retain the applicable Venus setup instructions, without WGT configuration or guidance. Do not instruct use of the optional longer Venus board. |
| AC-37 | In a new session, after select-all on either configuration page, and after confirmed Reset: the optional longer Venus board is never enabled, offered as a board/variant choice, randomized or reported as selected in the summary. The supported options retain their specified all-on defaults; the longer board's exclusion does not disable standard Venus support. |

### Physical-deck boundary — resolved R3 acceptance condition

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-38 | With Prelude 2 and Turmoil enabled, setup instructs players to prepare and shuffle the physical project, corporation, Prelude and Global Event decks using the selected expansions and applicable printed rules, then perform the prescribed deals/reveals. No card name, image, inventory, promo identity or release date is requested or checked; no individual card is selected, filtered or validated by the assistant. Changing expansions updates the deck-preparation instructions without requiring a card inventory or release-history lookup. |

### WGT scope exclusion — final review decision

| Acceptance | Concrete condition and expected behavior |
| --- | --- |
| AC-39 | In a new session, after select-all/none, after Reset, and after disabling/re-enabling Venus, no WGT setting is offered, stored, randomized or reported as a selected summary value, and no WGT gameplay procedure is guided. The supported variant controls remain Extended Start and research drafting; standard Venus setup and Turmoil setup are unaffected. |

### Edge cases

- All objective rows locked: reroll is a no-op; locks never authorize duplicate or ineligible replacement results. Unattainable printed objectives are retained under R1, not treated as invalid replacement selections.
- One board candidate: select that board; do not invent an alternative to guarantee a changed reroll.
- Component dependencies require all prerequisites, not merely one of them. Optional interactions explicitly ignored by rules are not prerequisites. Missing prerequisites never filter fixed printed objectives or their maps under R1; explain their limitations instead.
- No eligible set large enough: do not output duplicates or fabricate components; approved D6 defines the visible fallback.
- Invalidated locked entries are affected state and need confirmation before clearing; unaffected locks survive.
- Refresh/reopening has no recovery promise in v1. Live-session Back navigation is distinct from recovery.
- R1–R3 are explicit resolved product decisions, not hidden defaults. Individual card eligibility and promo release history are not application validation cases.

## Requirements *(mandatory)*

### Functional requirements and acceptance mapping

Existing identifiers are retained so earlier decisions remain traceable. Each requirement is observable; no technology or implementation approach is prescribed.

| ID | Required behavior | Acceptance |
| --- | --- | --- |
| FR-001 | Support the content boundary, seven boards and 2–5-player multiplayer scope above; exclude the optional longer Venus board and solo/later/fan content. Inventory is in the rules reference; the campaign cutoff bounds expansions/setup components, not individual cards. Exclude card inventories, promo-card identification and card-level release-date tracking under R3. | AC-01,07–12,36–38 |
| FR-002 | Display every applicable SU-01–SU-12 setup instruction, including private components and physical card exceptions; omit inapplicable expansion instructions and optional longer-Venus-board instructions. Deck guidance uses selected expansions without identifying or validating individual cards. | AC-16–24,36,38 |
| FR-003 | Automate only board, colony/objective sets and first-player number; randomize by default and permit eligible manual overrides. | AC-07–15,31–35 |
| FR-004 | Show all instructions in order without completion checkboxes/manual progress. All-visible presentation is tentative pending visual review. | AC-16 |
| FR-005 | Show a configuration summary consistent with the active choices and objective source versions, including first player and printed-objective limitation notices. | AC-25,35 |
| FR-006 | Trace rules-derived behavior to source/section and SU ID; identify official rules, approved product decisions and unresolved review findings separately. | Source register, AC-17–24 |
| FR-007 | Provide expansions/player-count page, variants page, then setup page. | AC-01–07 |
| FR-008 | Derive instruction applicability, quantities and eligibility from the selected configuration. | AC-08–12,16–24 |
| FR-009 | Show Use expanded boards with all seven initially checked sub-options including Original board (Tharsis). | AC-01,06 |
| FR-010 | Exclude unchecked boards; empty/disabled pool uses checked/inactive Tharsis; no map-pack selectors. Never exclude a map for unattainable printed objectives. | AC-02,06,15,31–35 |
| FR-011 | Prelude 2 enables/keeps Prelude on with a visible explanation; select-none turns both off together. Component filtering does not enable expansions. | AC-02,04,11 |
| FR-012 | MA on uses five eligible replacement tiles of each type; off retains each complete printed set, including unattainable objectives. Identify every unattainable printed objective and the disabled expansion(s) causing its limitation in setup and summary; never replace/remove it or enable missing expansions. This is the R1 product decision, not an official rule. Apply verified Venus additions and printed-Tharsis Turmoil overlay; keep distinct versions separate. | AC-09–12,24,31–35 |
| FR-013 | Automatically filter prerequisites for automated public-component pools without eligibility controls. Guide players to prepare physical decks using selected expansions and printed rules; do not identify, catalog, filter or validate individual cards. R1 exempts fixed printed objectives and map availability from this filtering; MA replacement pools remain filtered. | AC-11,19–23,31–35,38 |
| FR-014 | Default supported content and available variants on; the excluded longer Venus board is not an option and is never enabled by defaults, select-all or Reset. Support base-game teaching through page-local select-none. | AC-01–05,36–37 |
| FR-015 | Put select-all/none controls at the top of each configuration page; affect its toggle options only. Approved D2 leaves N unchanged. | AC-02–05 |
| FR-016 | Generate public results on first setup entry, retain on revisits, and regenerate only missing/cleared results after edits; Customize reveals alternatives/reroll. | AC-07,13–15,26–30 |
| FR-017 | Guide any 2 / 4 normal and any 3 / 6 Extended Start corporation/Prelude dealing; no quotas. Extended Start needs neither Prelude nor Prelude2; omit Prelude cards if off. | AC-21–23 |
| FR-018 | Correctly distinguish CE card inclusion and production from ordinary/Beginner Corporation choices. | AC-17,22 |
| FR-019 | Back permits returning from variants to expansion configuration with choices retained. Extended Start and research drafting remain available without expansions; variant controls never enable expansions. | AC-05 |
| FR-020 | Objective tables: no gridlines, drop-down then lock, manual auto-lock, symmetric duplicate filtering after every change, no sorting; reroll only unlocked eligible results. | AC-09,11–14 |
| FR-021 | No recovery or step-completion tracking in v1. | AC-16; exclusions |
| FR-022 | **Tentative v1:** confirm before clearing state affected by any configuration edit, preserve unaffected state; cancellation changes nothing. Dependency map below defines affected state. | AC-26–29 |
| FR-023 | Confirm Reset before clearing all results/locks and restoring all-on configuration. | AC-30 |
| FR-024 | Randomize numerical first player in 1…N; no names/profiles required. | AC-07,15,27 |
| FR-025 | Never digitally shuffle/draw standard in-play card decks or identify, catalog, filter or validate individual cards; Turmoil is walkthrough-only. | AC-20–23,38 |
| FR-026 | Include research drafting, default on; record it without changing initial setup dealing or adding v1 gameplay guidance. | AC-03,21,25 |
| FR-027 | **Retired:** the former WGT setting/default requirement is superseded by the explicit v1 scope exclusion. | AC-39 |
| FR-028 | **Retired:** the former WGT interaction-setting requirement is superseded by the v1 exclusion. Applicable Turmoil setup remains covered by FR-002/012. | AC-20,24,39 |

### State dependency map

| Changed input | Related state/instructions | State retained when still valid |
| --- | --- | --- |
| N | First-player number; required colony set size/choices; player-specific physical quantities | Board; eligible objective sets/locks |
| Expanded-board option/candidate pool or chosen board | Board result if excluded; printed objectives; board-dependent eligibility and map/supply instructions | First player, colonies, still-eligible MA choices/locks |
| Colonies | Colony results; colony-dependent MA selections/locks; printed-objective limitation notices; fleet/deck/marker instructions | Board, complete printed sets, first player and unrelated eligible objectives |
| Venus | Venus instructions, fixed objective pair, Venus-dependent components; printed-objective limitation notices | Board, complete printed sets, unrelated colonies and eligible MA objectives |
| Turmoil | Physical event/delegate instructions, printed Terraformer overlay, delegate-dependent MA components; printed-objective limitation notices | Board and printed identities (subject to Terraformer overlay), unrelated random results |
| MA | Printed/replacement objective source and selection state | Board, first player, colonies |
| CE | Marked-card/production instructions and source-dependent thresholds (e.g. Generalist); selections only if their identity/eligibility actually changes | Board, first player, colonies, eligible objective identities |
| Prelude / Prelude2 / Extended Start | Physical deck/deal/discard instructions and printed-rule reminders; whole-expansion dependency enforcement still applies, without app evaluation of individual cards | Unrelated public random results |
| Drafting | Recorded rule and relevant explanatory instructions | All otherwise-valid generated selections/locks |

Clearing is dependency-based, not a global restart. No physical action is claimed to be undone: changed instructions describe the newly selected setup. This mapping implements the user's tentative v1 policy at the observable-behavior level, not a technical design.

### Key entities

- **Configuration:** N, enabled content, eligible board pool/chosen board, selected variants, and first-player number.
- **Public selection:** component identity and source version, generated/manual value, and lock where applicable. Eligibility/uniqueness is evaluated within its pool/table.
- **Instruction:** physical action, source, applicability and ordering dependencies. It has no completion checkbox/state.
- **Summary:** readable projection of the current configuration/results, not an independent or persistent saved game.

## Success Criteria *(mandatory)*

### Measurable outcomes for requirements acceptance

- **SC-001:** For every supported configuration, all applicable SU-01–SU-12 rows appear and every displayed instruction has a cited rules source or recorded human override. No solo-only row appears.
- **SC-002:** Every generated/manual public selection meets the exact counts and membership conditions in AC-07–15; there are zero duplicates within each colony/objective set and zero prerequisite violations in replacement selection pools. Fixed printed sets instead meet AC-31–35: retain every objective and identify all disabled-expansion limitations without excluding maps.
- **SC-003:** Reroll changes zero locked selections; unchanged setup-page revisits change zero generated selections/locks.
- **SC-004:** Every accepted configuration edit clears only dependency-affected state; every cancelled edit/Reset changes zero prior values. Reset restores the specified defaults.
- **SC-005:** Summary fields match the current configuration/results exactly; there are zero digital standard-card draws and zero private-card entry requirements or individual-card identification, filtering or validation actions (AC-38).

These are correctness/completeness outcomes, not implementation tests or claimed measured results. No unsupported setup-time reduction, satisfaction percentage or performance target is invented. R1–R3 are resolved and the current defaults are approved. F1 is closed by the WGT scope exclusion; the user explicitly approved SC-001–SC-005 and the complete specification on 2026-11-11. This records requirements acceptance, not measured application results.

## Approved defaults and remaining review issues

### Confirmed constraints

The constitution is existing **v1.0.0**, with Simplicity, Separation of Concerns, Test-Driven Development, Code Quality, Human Authority and Idiomatic Implementation. It has not been replaced or amended. Requirements and substantive changes need explicit human approval; behavioral tests belong to a later authorized phase after requirements approval. The historical all-content usage percentages were context, not metrics.

### Approved defaults — explicit human approval recorded

| ID | Approved decision | Decision context |
| --- | --- | --- |
| D1 | N defaults to 2 in a new/reset session, restricted to 2–5. | Approved initial/reset count; supported range remains 2–5. |
| D2 | Select-all/none changes toggles only and preserves N. | “Everything on screen” cannot sensibly select all player-count values. |
| D3 | Ordinary random draws are uniform over eligible choices, without hidden balancing; rerolls can repeat values and one-candidate rerolls are no-ops. | Approved uniform draws; no balancing or guaranteed-change promise. |
| D5 | Colony manual customization uses the same count/uniqueness eligibility as its initial draw; use the existing drop-down/reroll approach without adding fine-grained eligibility controls. Lock-table treatment beyond objectives is not assumed. | Detailed colony row presentation was not chosen; no new control system is introduced. |
| D6 | If a valid-size eligible set cannot be formed, show a clear explanation identifying the configuration conflict and permit returning to configuration; never fabricate duplicates, silently enable an expansion, or discard locks without confirmation. | Approved defensive behavior; no fabricated results or silent configuration changes. |
| D7 | Summary includes first-player number alongside the other generated configuration values. | Approved summary field. |

D4 is retired by the R3 decision: there is no app card-filtering or card-level research requirement. Physical preparation follows selected expansions and printed rules, without a proposed mandatory prefiltering method. The user approved D1–D7 as documented in the current specification: active decisions D1–D3 and D5–D7 are approved; D4 remains retired. This approval does not reinstate card filtering or override R3.

The defaults approval was followed by explicit approval of the complete specification on 2026-11-11. Neither authorizes additional behavior beyond these requirements. Existing tentative decisions are the all-visible instruction layout (review for busyness) and selective invalidation (v1, revisit in v2). No rendered UI or implementation is being produced now.

### Resolved product decisions

**R1 — retain printed objectives:** explicitly resolved by the user. With MA off, retain complete printed milestone/award sets on every map, even when disabled expansions make objectives unattainable. Identify each limitation and its missing expansion(s). No removal, replacement, automatic expansion enabling or map prohibition. This intentional product decision overrides generic component filtering for fixed printed sets; it is not attributed to official rules. See AC-31–35 and the rules reference.

**R2 — optional longer Venus board excluded:** explicitly resolved by the user as a deliberate v1 scope exception. The component is official but adds no meaningful functionality to the setup assistant and conflicts with the all-on-by-default configuration philosophy. Support the standard Venus board; do not offer, enable, randomize or guide use of the longer board. This is a scope decision, not an assumption, proposed default or official rules claim. See AC-36–37.

**R3 — individual-card scope excluded:** explicitly resolved by the user. V1 excludes individual card inventories, promo-card identification and card-level release-date tracking. The assistant guides physical deck preparation using selected expansions but does not identify, catalog, filter or validate individual cards. The 2023 campaign remains the general expansion/setup-component boundary; no exhaustive promotional-card inventory, release-history research or card-level acceptance coverage is required. D4 is retired; see AC-38.

### Remaining review matters

R1–R3 are resolved and the active defaults are approved. Final document review found one additional ambiguity, now resolved by the user:

**F1 — closed by WGT exclusion:** the re-enablement behavior of a WGT setting was unspecified. The user excludes WGT from v1 because it is not material to setup. All WGT configuration, stored selections, summary values and gameplay guidance are removed; FR-027/028 are retired for traceability. AC-39 covers the exclusion. No WGT state-restoration decision remains.

Editorial corrections made without a new product decision: AC-26 no longer assumes colony locks beyond D5; SU-06 prepares Prelude 2 discard piles before SU-09 uses them. Tentative v1 layout/selective-clearing choices remain explicit and are not promoted to permanent commitments. Story priorities are advisory review labels. No rendered-layout validation is claimed.

**Readiness:** **requirements approved on 2026-11-11; checklist 18/18.** The user explicitly approved the complete specification, including SC-001–SC-005 and the documented tentative v1 behaviors. No material requirements blockers remain identified. This approval is not application validation or authorization to begin planning or any later phase. The user authorized marking PR #4 ready for review once the checklist reached 18/18. Merging and later-phase work remain unauthorized.
