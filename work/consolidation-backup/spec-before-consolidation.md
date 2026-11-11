# Feature Specification: Guided Game Setup

**Feature Branch**: `001-guided-game-setup`
**Created**: 2026-11-10
**Status**: Draft — discovery in progress; not approved or ready for planning
**Input**: Browser-based guided Terraforming Mars setup assistant with optional manual choices and “Do it for me”; scope to be discovered collaboratively.

## Clarifications

### Session 2026-11-10

- Q: If Prelude is off, should Extended Start remain available for three corporations? → A: Yes (A). Keep it available, deal three corporations, and omit Prelude dealing.

- Q: Should setup show all instructions with checkboxes or one step at a time? → A: Tentatively use all applicable instructions in an ordered list, but no checkboxes or manual completion tracking. Assess visual busyness when rendered. This supersedes earlier proposed per-step completion tracking; generated selections and locks still retain state.

- Q: When should randomized public selections first appear? → A: On first entering the setup page, currently page 3 after expansions and variants. Retain results on revisits until explicitly rerolled or cleared by a configuration change. This page-level clarification determines the generation point rather than waiting for each individual instruction.

- Q: Should World Government Terraforming be listed as a variant and what is its default? → A: List it, assuming WGT enabled when Venus Next is in play regardless of the earlier general variant-default instruction. The user clarified that their surprise came from confusing WGT with Turmoil's terraform-rating adjustment; these remain separate rules.

- Q: Which variants should v1 offer? → A: Include research drafting alongside Extended Start. Drafting does not affect setup automation. A possible v2 turn-order walkthrough is future context, not approved v1 scope. Subsequently confirmed: include World Government Terraforming as a variant setting and assume it is enabled when Venus Next is in play. This specific default takes precedence over the earlier blanket variant-default instruction.

- Q: Which public setup choices are automated in v1? → A: Option B: boards, colonies, milestones, awards, and first player. Display first player as a number. No automation for standard card decks used during play; those remain physically shuffled. Turmoil is walkthrough-only.

- Q: Is filtering directional and is sorting needed? → A: Final correction: no sorting. Every milestone/award drop-down excludes values selected in every other row of the same table, above or below, and updates after every selection change. This supersedes earlier directional-filtering and locked-first sorting requirements.

- Q: Should a manual milestone/award choice automatically lock its row? → A: Yes. Manual selections lock automatically. Under the subsequent correction, every drop-down excludes selections in all other rows of its table, regardless of row position, selection origin, or lock status; no sorting is needed.

- Q: Should player-count, board, variant, and expansion changes all use selective clearing? → A: Tentatively for v1, yes: confirm before discarding affected results, locks, and progress, preserve unaffected state, and cancel without changes. The user expects to reconsider this for v2.

- Q: Should Reset return to initial all-on defaults or leave options off? → A: Return to initial all-on defaults, with confirmation before clearing existing setup state.

- Q: What happens when expansions are removed after configuration or setup has state? → A: Confirm the removal and clear configuration/state related to the removed expansion; preserve state for unaffected expansions. Add Reset to clear all state. Reset requires confirmation, clears all existing configuration/setup state, and restores the initial all-on defaults.

- Q: How do unavailable variants behave? → A: Inactive with a brief explanation, plus Back navigation to enable the required expansion. Prelude 2 separately keeps Prelude enabled.
- Q: How are random results edited? → A: Customize reveals drop-down choices and a bottom reroll button; milestones/awards use tables without gridlines, with a drop-down then a lock button in each row. Reroll changes unlocked entries only.
- Q: Is progress recovery needed in v1? → A: No.
- Q: What happens to an empty or disabled board pool? → A: Unchecking every board disables expanded boards. While disabled, only Tharsis is checked and all board controls are inactive; use Tharsis.

- Q: Does Corporate Era determine whether regular corporations can be used? → A: No. The user accepted the rules distinction: regular corporations are available without Corporate Era; Corporate Era changes marked-card inclusion and initial production. Keep this as physical setup guidance without automating the deal.

- Q: How should overlapping corporation-dealing variants be resolved? → A: Use any two corporations and four Prelude cards normally; Extended Start uses any three corporations and six Preludes, where those components are in use. Omit expansion-specific corporation-dealing variants and their combination rules. Guide the physical deal without automating it; users handle any departures at the table. These are explicit user-approved rule overrides, not claims that the published variants combine this way.

- Q: Should quick-set controls include variants? → A: Use separate expansions and variants pages before guided setup. Both default all options on and both have select-all/none controls at the top that affect everything selectable on that page only.

- Q: Should users have quick configuration presets and which content is active initially? → A: Add select-all/none controls and default everything active. Subsequently clarified: separate expansion and variant pages, each all-on by default with its own select-all/none controls at the top; controls affect only their page. Corporation-dealing conflicts were subsequently resolved by the approved deal override.
- Q: Should players still be offered manual final selection from automatically filtered pools? → A: Randomize by default and permit individual manual overrides (option A).

- Q: How should the configuration page handle expansion dependencies? → A: Initially approved as a Prelude 2-specific exception; subsequently generalized by the user: distinguish whole-expansion prerequisites from component dependencies. Selecting a dependent expansion enables its required expansion(s); component dependencies instead filter components according to expansions in play.
- Q: Which milestone and award versions apply? → A: Milestones & Awards is a full selectable expansion. When enabled, use its versions; when disabled, use the selected board's printed versions.
- Q: How should cross-expansion components be configured? → A: Automatically filter components according to the expansions in play; do not require users to configure individual component eligibility. All-content games and base-game teaching are the primary use cases. The stated usage proportions express expected emphasis, not measured success targets.

## User Scenarios & Testing *(mandatory)*

The following stories, priorities, and acceptance scenarios remain proposals. Explicit scope decisions are recorded separately below; the specification as a whole is not approved. Acceptance scenarios describe observable outcomes, not executable tests.

### User Story 1 - Follow the applicable setup (Priority: P1, proposed)

As a player preparing a physical game, I want to set the number of players and expansions on the first configuration page and variants on a second page, then follow setup instructions appropriate to those choices so I can prepare the table correctly.

**Why this priority**: Accurate guidance is the core product value.
**Independent evaluation**: Walk through one agreed supported configuration and compare the instructions with cited rules.
**Acceptance Scenarios**:
1. **Given** a supported configuration, **When** setup begins, **Then** the assistant presents the applicable preparation steps in an order consistent with the verified rules.
2. **Given** a newly opened setup flow, **When** the first page is displayed, **Then** the first page provides player count and expansion options, the next configuration page provides variant options, and both precede guided setup.
3. **Given** a configuration recorded across both configuration pages, **When** players proceed to guided setup, **Then** the instructions use that configuration.
4. **Given** a step, **When** it is displayed, **Then** players can identify the physical action required and any applicable exception.
5. **Given** a configuration requiring private-card preparation, **When** players reach that stage, **Then** the assistant calls out the applicable shuffling, dealing, choosing, payment, reveal, and discard instructions without automating private components.
6. **Given** any setup instruction in the supported rules that applies to the selected configuration, **When** players follow the complete walkthrough, **Then** that instruction is called out on screen; private-component steps are not omitted.

7. **Given** ordinary corporations are being dealt and Extended Start is disabled, **When** corporation-dealing guidance is displayed, **Then** it instructs players to deal any two eligible corporations per player without an expansion-source quota.
8. **Given** Prelude is enabled and Extended Start is disabled, **When** Prelude-dealing guidance is displayed, **Then** it instructs players to deal four eligible Prelude cards per player.
9. **Given** ordinary corporations are being dealt and Prelude and Extended Start are enabled, **When** dealing guidance is displayed, **Then** it instructs players to deal any three eligible corporations and six eligible Preludes per player without digitally allocating cards or requiring expansion-source quotas.

10. **Given** Corporate Era is disabled, **When** deck and player preparation instructions are shown, **Then** they exclude Corporate Era-marked project and corporation cards, retain access to other regular corporations, and specify production of 1 in every resource before corporation effects.
11. **Given** Corporate Era is enabled, **When** deck and player preparation instructions are shown, **Then** they include Corporate Era-marked cards and specify production of 0 in every resource before corporation effects.

12. **Given** Prelude is disabled and ordinary corporations are being dealt, **When** Extended Start is enabled, **Then** guidance specifies three eligible corporations per player, includes no Prelude deal, and does not enable Prelude or Prelude 2.

### User Story 2 - Delegate a setup choice (Priority: P2, proposed)

As a player, I want to make an eligible choice manually or ask the assistant to choose so I can control how much assistance I receive.

**Why this priority**: Default randomization reduces setup decisions while manual overrides preserve player control.
**Independent evaluation**: Compare manual and automated completion of one agreed choice.
**Acceptance Scenarios**:
1. **Given** an eligible choice, **When** the player uses “Do it for me”, **Then** the assistant displays a selection satisfying the agreed eligibility and quantity rules.
2. **Given** that same choice, **When** the player chooses manually, **Then** the assistant records and displays the selected option.
3. **Given** the configuration page, **When** the player enables “Use expanded boards”, **Then** all seven board checkboxes appear checked and no separate Hellas & Elysium selector is presented.
4. **Given** an enabled expanded-board pool, **When** the player unchecks a board, **Then** that board is excluded from subsequent board consideration.
5. **Given** “Use expanded boards” is enabled with all boards checked, **When** the player unchecks only “Original board (Tharsis)”, **Then** the remaining six boards form a permitted randomization pool and the original board cannot be selected from that pool.
6. **Given** Prelude and Prelude 2 are disabled, **When** the player enables Prelude 2, **Then** Prelude is enabled automatically and the assistant identifies that change and its reason.
7. **Given** the Milestones & Awards expansion is enabled, **When** milestone and award definitions are presented, **Then** they use that expansion's versions rather than same-named board versions.
8. **Given** the Milestones & Awards expansion is disabled, **When** the board's milestone and award definitions are presented, **Then** they use that board's printed versions rather than same-named expansion tiles, subject to separately resolved official overlays.
9. **Given** a component with verified prerequisites in two expansions and one prerequisite disabled, **When** the assistant forms an eligible component pool, **Then** that component is excluded without enabling the missing expansion or asking the user to toggle that component.
10. **Given** private cards with expansion prerequisites, **When** physical deck preparation is shown, **Then** the assistant instructs players how to filter for their enabled expansions without asking them to enter private cards or digitally dealing them.
11. **Given** a new configuration, **When** the expansions page first opens, **Then** all supported non-solo expansion/content options are enabled and all seven board candidates are checked.
12. **Given** a configuration with some expansion/content options disabled, **When** select-all on the expansions page is selected, **Then** all supported non-solo expansion/content options are enabled.
13. **Given** a configuration with expansion/content options enabled, **When** select-none on the expansions page is selected, **Then** all those options are disabled, including Prelude 2 and Prelude, without re-enabling one through dependency handling.
14. **Given** the variants page is first opened, **When** its options are displayed, **Then** all supported variant toggles are on, except variants whose prerequisites are missing, which are inactive with a brief explanation.
15. **Given** either configuration page, **When** its select-all or select-none control is used, **Then** it changes that page's supported toggles and does not change options on the other page, subject to separately resolved cross-page dependency handling.
16. **Given** a randomized public component selection, **When** the player replaces an individual result with an eligible manual choice, **Then** that choice is used instead of the randomized result and remains subject to the selection's quantity and uniqueness constraints once those constraints are defined.

17. **Given** one board is checked, **When** the player unchecks it, **Then** expanded boards turns off and only Tharsis is checked with all board checkboxes inactive.
18. **Given** some milestone or award entries are locked, **When** reroll is selected, **Then** locked entries remain unchanged and only unlocked entries are randomized.
19. **Given** a variant lacks a required expansion, **When** the variants page is shown, **Then** it is inactive with an explanation and a Back control permits returning to expansion configuration.
20. **Given** a randomized public selection, **When** Customize is selected, **Then** an eligible-choice drop-down and bottom reroll control are available.

21. **Given** an eligible manual milestone or award choice, **When** the player selects it from the drop-down, **Then** that row becomes locked and every other row in the same table immediately excludes its selected value from available choices; no sorting is required.
22. **Given** a milestone or award table with distinct manual or random selections, locked or unlocked, **When** any row changes selection, **Then** every other row immediately excludes the newly selected value, regardless of whether it is above or below that row; the old value becomes eligible again if no other row holds it and it otherwise satisfies eligibility rules.
23. **Given** locked and unlocked selections, **When** reroll is selected, **Then** locked values remain unchanged and the resulting unlocked values contain no duplicates with locked selections or each other within the same table, without sorting by lock status.

24. **Given** a configured multiplayer count, **When** first-player randomization occurs, **Then** the assistant displays a number from 1 through that count without requiring names.
25. **Given** Turmoil is enabled, **When** its event setup is reached, **Then** the assistant instructs physical shuffling and drawing and does not digitally shuffle or select event cards.

26. **Given** research drafting is selected, **When** setup guidance and the final configuration are displayed, **Then** the configuration records drafting, and the setup does not add an initial-hand draft or automate private cards.

27. **Given** Venus Next is enabled in a new or reset configuration, **When** the variants page is shown, **Then** WGT is enabled by default; choosing its off state records the longer-game variant.
28. **Given** Venus Next and Turmoil are enabled, **When** WGT is turned off, **Then** Turmoil remains enabled and its TR revision rule is unchanged.

29. **Given** expansion and variant configuration is complete and no public results exist, **When** the setup page (currently page 3) is first entered, **Then** generate and display the applicable board, colony, milestone, award, and first-player selections.
30. **Given** public setup results and locks already exist, **When** the player leaves and returns to setup without changing configuration, **Then** the same results and locks remain without rerandomization.
31. **Given** a confirmed configuration edit cleared some results while preserving others, **When** the setup page is next entered, **Then** generate missing results for the new configuration while retaining unaffected results and locks.

### User Story 3 - Review the game configuration (Priority: P2, proposed)

As a player, I want to see the ordered setup instructions and a summary of the game configuration so I can prepare the physical game and review what we selected without checking off steps.

**Independent evaluation**: Review the visible instruction list and compare the configuration summary with recorded choices.
**Acceptance Scenarios**:
1. **Given** a recorded game configuration, **When** the setup page is displayed, **Then** all applicable instructions appear in order without completion checkboxes or a requirement to mark steps complete.
2. **Given** completed setup, **When** the summary is displayed, **Then** it agrees with the final recorded configuration.

3. **Given** Colonies has generated selections and unrelated milestone/award selections are recorded, **When** the player removes Colonies and confirms the dialog, **Then** Colonies-related selections and locks are cleared while unrelated still-eligible milestone/award selections retain their state.
4. **Given** an expansion-removal confirmation is displayed, **When** the player cancels, **Then** the expansion selection, generated results and locks remain unchanged.
5. **Given** multiple expansions have recorded state, **When** one expansion is removed with confirmation, **Then** state for untouched expansions is retained except results whose verified prerequisites include the removed expansion.

6. **Given** a configuration with generated results, locks, and completed steps, **When** Reset is confirmed, **Then** those results and locks are cleared and expansion/content options, all seven boards, and available variants return to the initial all-on defaults.
7. **Given** the Reset confirmation is displayed, **When** the player cancels, **Then** configuration, generated results and locks remain unchanged.

8. **Given** four-player Colonies setup has generated colony choices and unrelated board state exists, **When** player count changes to five and the player confirms discarding affected state, **Then** clear the affected colony choices and locks while preserving unrelated board state.
9. **Given** generated results exist, **When** a configuration change would invalidate some results and the player cancels its confirmation, **Then** retain the previous configuration, results and locks.

### Edge Cases

- If the last board candidate is unchecked, “Use expanded boards” is unchecked automatically.
- Whenever “Use expanded boards” is off, all board sub-options are inactive and only Original board (Tharsis) is checked; Tharsis is used.
- Variants lacking prerequisites are inactive with an explanation; Back navigation allows expansion changes.
- Tentative v1: configuration edits confirm before clearing dependent state and preserve unrelated state; revisit this policy for v2.
- Milestone/award rerolls preserve locked entries and reroll unlocked entries.
- Progress recovery is outside v1 scope.
- Still unresolved: the complete dependency map for selective clearing; insufficient eligible candidates. Generate public results on first entry to the setup page and preserve them on revisits unless explicitly rerolled or invalidated. All other rows in the same table update their options immediately after every selection; no sorting is required.

## Requirements *(mandatory)*

### Functional Requirements

Requirements express the draft behavior. FR-001 and the public-only automation boundary reflect recorded human scope decisions; FR-007 and FR-008 reflect the user-directed configuration-first flow; FR-009 and FR-010 reflect the user-directed board-pool configuration. Remaining proposed behavior and the specification as a whole await approval.

- **FR-001**: Players can configure multiplayer setup using non-solo content released before or included in the 2023 More Terraforming Mars! Kickstarter campaign, including all seven boards, Prelude, Prelude 2, and Corporate Era. Solo setup and content introduced after that campaign are excluded. The supported content inventory and optional-rule choices are detailed below.
- **FR-002**: The assistant calls out every setup step in the supported Terraforming Mars rules that applies to the recorded configuration, including private-component preparation, shuffling, dealing, selection, reveal, payment, and discard instructions where applicable. Irrelevant expansion steps are absent. Public visibility limits automation, not guidance coverage.
- **FR-003**: For each agreed automatable public setup choice, players can select manually or use “Do it for me” and see the resulting selection. Automation is restricted to the explicitly listed public choices, excluding standard card decks used during play; private-component setup receives on-screen guidance but no automation, including no private-hand allocation or project-card randomization. Version 1 automates board selection, colony selection, milestone/award selection, and first-player selection. First-player output is a number from 1 through the configured player count; player names are not required. No standard card deck used during play is digitally shuffled or drawn, even for publicly revealed cards. Turmoil setup is walkthrough-only, including physical shuffling and opening event draws.
- **FR-004** *(tentative presentation for review)*: The setup page displays all applicable instructions as an ordered list. Do not provide completion checkboxes or require players to record step completion. The all-visible layout is tentative pending visual review for busyness. No step-by-step wizard is required.
- **FR-005**: The final summary displays the recorded board, enabled expansions and rules, and any recorded colony, milestone, and award selections.
- **FR-006**: Rule-derived instructions remain traceable to a named source and section in the requirements evidence. Proposed house rules are identified separately.
- **FR-007**: Configuration is split into two pages before guided setup: the first provides player count and expansion options, and the second provides variant options. Expansion and variant controls are visually separated by being on different pages.
- **FR-008**: Guided setup uses the configuration recorded across both configuration pages to determine applicable instructions, quantities, and exceptions.
- **FR-009**: The expansions page presents a top-level “Use expanded boards” option among expansion options. When enabled, it displays all seven supported boards as checkboxes, initially checked, including an explicitly labeled “Original board (Tharsis)” sub-option. Players can uncheck any board they do not want considered, including the original board.
- **FR-010**: Checked boards constitute the candidate pool for board selection; unchecking a board excludes it from consideration. The original board is independently excludable and is not implicitly added back into an enabled pool. A pool containing all six other boards and excluding the original must be permitted for randomization. The expansions page does not present a separate Hellas & Elysium expansion selector. Map availability is configured through “Use expanded boards” and its board sub-options rather than separate map-pack selectors. Unchecking the final board automatically disables “Use expanded boards”. Whenever it is disabled, only Original board (Tharsis) is checked, all board sub-options are inactive, and Tharsis is used as the fallback.

- **FR-011**: When a player enables an expansion with verified whole-expansion prerequisites, the assistant automatically enables those prerequisites and visibly explains the change. Prelude 2 enables Prelude. A component-level dependency MUST NOT enable another expansion. Prelude 2 remaining enabled requires Prelude to be enabled; attempts to leave Prelude off restore Prelude to on. Select-none disables both together.
- **FR-012**: Milestones & Awards is a full selectable expansion on the expansions page. When enabled, milestone and award selection uses the versions from that expansion. When disabled, use the milestones and awards printed on the selected board. Do not substitute thresholds or definitions from another version merely because an entry has the same name. Interactions with explicit expansion overlays, including Venus additions and Turmoil's Tharsis Terraformer replacement, still require reconciliation with this decision.

- **FR-013**: The assistant automatically filters expansion-dependent components against the expansions in play. A component is eligible only when its verified expansion prerequisites are satisfied, including all prerequisites where multiple expansions are required. Users are not required to configure individual component eligibility or dependency exceptions. Private components receive physical filtering instructions rather than digital dealing or inspection of private hands. This does not authorize removing components merely because an optional interaction is unavailable where the rules explicitly allow that interaction to be ignored.
- **FR-014**: The configuration flow supports both all supported non-solo content and base-game teaching configurations. Do not add fine-grained component eligibility controls. The explicitly requested board checkboxes remain available; individual manual final component overrides are permitted. The initial configuration enables all supported non-solo expansion/content options and all supported variants. Each configuration page has its own select-all/none controls. Corporation-dealing conflicts are resolved by FR-017. Variants with missing prerequisites are shown inactive with a brief explanation and do not enable expansions. A Back control on the variants page returns to expansion configuration so users can enable prerequisites. Extended Start and research drafting are selected variants. Research drafting does not alter setup automation; World Government Terraforming is also a selectable setting, enabled by default when Venus Next is in play, as specified in FR-027.

- **FR-015**: The expansions and variants pages each initially have all their applicable supported toggle options on; variants lacking prerequisites are inactive. Select-all and select-none buttons appear at the top of each page and apply to that page's options only. The expansions page includes “Use expanded boards” with all seven board candidates checked. Selecting none on the expansions page disables both Prelude and Prelude 2 without immediately re-enabling either. Player count remains a separate variable; its initial value and whether quick-set controls reset it have not been specified. The all-on default applies to available variants; absent prerequisites make a variant inactive rather than enabling an expansion. Research drafting, Extended Start, and World Government Terraforming are selected settings. WGT is assumed enabled when Venus Next is in play; its specific default takes precedence over blanket variant defaults. The corporation-deal overlap is resolved by FR-017.
- **FR-016**: Eligible public setup choices default to randomization. Players may manually override individual final choices, constrained to the automatically eligible pool. An override selects the result; it does not change component eligibility or enable missing expansions. A Customize button beside a randomized choice reveals a drop-down for an eligible manual alternative. A reroll button appears at the bottom of the customization area. Generate the eligible public setup selections on first entry to the setup page (currently page 3 after expansion and variant configuration). Preserve results on revisits; merely navigating away and back does not reroll. When setup is entered after configuration changes, generate only missing or cleared results and retain unaffected results and locks. All configuration changes use the tentative v1 selective-clearing behavior in FR-022; this is explicitly subject to reconsideration for v2.

- **FR-017**: Physical dealing guidance uses any two eligible corporations and, when Prelude cards are in use, four eligible Prelude cards per player. With Extended Start enabled, it uses any three eligible corporations and six eligible Prelude cards per player. Do not require a corporation from any particular expansion, expose expansion-specific corporation-dealing variant selectors, or try to reconcile those published variants. This is an explicit user-approved override. Card dependency filtering from FR-013 still applies. Deals and private card choices remain physical and are not automated; the assistant does not adjudicate table-specific departures from the displayed procedure. Extended Start remains available without Prelude: it changes the ordinary corporation deal to three and adds no Prelude dealing. With Prelude enabled, it also changes the Prelude deal to six. Extended Start does not require enabling Prelude or Prelude 2 in the application; this is an explicit user-approved availability rule.

- **FR-018**: Corporate Era guidance includes its marked project and corporation cards and starts resource production at 0 before corporation effects. Without Corporate Era, guidance excludes those marked cards and starts resource production at 1 before corporation effects. Regular corporation cards remain available in either mode. Neither mode automates private dealing.

- **FR-019**: On the variants page, variants lacking required expansions are inactive and accompanied by a brief explanation. A Back control returns to the expansions page so users can enable the missing expansion. Variant controls never enable expansions automatically.
- **FR-020**: Randomized public choices have a Customize control that reveals an eligible-choice drop-down, with a reroll button at the bottom. Milestones and awards are displayed as tables without visible gridlines: the first column contains the selection drop-down and the second a lock button. Manual choices automatically lock their row. After every selection change, immediately update every other row's options in the same table to exclude the selected value, regardless of row position, selection origin, or lock status. Each row retains its own selected value as its current selection; values selected in other rows are unavailable. Apply uniqueness separately within the milestone table and within the award table. No sorting or reordering by lock status is required. Reroll preserves locked selections and replaces only unlocked selections with an eligible set containing no duplicates with locked selections or one another. Whether a reroll must produce a different value remains unspecified.
- **FR-021**: Version 1 does not provide progress recovery after refreshing, closing, or reopening the application. No persisted resume behavior is required. The ordered instruction list has no completion checkboxes or user-recorded step progress.

- **FR-022** *(tentative v1 decision; reconsider for v2)*: Player-count, board, variant, and expansion changes (including additions and removals) clear only configuration, generated results and locks that depend on the changed value. Before discarding existing affected state, present a confirmation dialog. Confirmation applies the change and clears affected state; cancellation preserves the previous configuration and all state. Preserve unaffected state. Multi-expansion components depend on every required expansion. The precise dependency mapping must follow the verified setup rules. Prelude 2's automatic Prelude prerequisite remains enforced. This is a provisional v1 behavior selected by the user, not approval of the complete specification.
- **FR-023**: A Reset control presents a confirmation dialog before clearing all existing configuration and setup state, including generated choices and locks. Confirmation restores the initial all-on configuration: all supported non-solo expansion/content options enabled, all seven boards checked, and all available variants enabled. Reset does not retain prior random results. Cancelling leaves all state unchanged. The initial player-count value remains to be specified.

- **FR-024**: Randomly select and display a first-player number from 1 through the configured number of players. Version 1 does not require names or player profiles for this choice. This is a user-approved override of the published first-player selection procedure.
- **FR-025**: Standard card decks used during play remain physically shuffled and drawn. Do not automate them even if a setup draw is publicly visible. Turmoil receives complete setup guidance but no digital event randomization; private decks likewise receive guidance only.

- **FR-026**: The variants page includes research drafting, enabled by default alongside other applicable variants and controlled by that page's select-all/none actions. Record the selected drafting rule in the game configuration and summary. This is Research-phase drafting, not an initial-hand draft; it does not change setup automation or privately deal cards. A gameplay/turn-order walkthrough is outside v1 scope.

- **FR-027**: The variants page includes a “World Government Terraforming” setting. When Venus Next is enabled, WGT is assumed enabled by default, including after Reset. Turning WGT off selects the official longer-game variant. The specific WGT-enabled default takes precedence over any blanket default interpretation that would select omission of WGT. Without Venus Next, the setting is inactive under FR-019. The setting records the intended gameplay rule; it does not automate the recurring Solar phase.
- **FR-028**: WGT and Turmoil's terraform-rating revision are distinct rules. Enabling or disabling WGT does not enable, disable, or alter Turmoil's TR revision. Turmoil guidance identifies its own applicable rule separately rather than treating it as WGT.

### Key Entities

- **Game configuration**: Chosen board, game mode, player count, expansions, and optional rules; all seven boards and multiplayer expansion coverage are in scope; selected variants are Extended Start, research drafting, and World Government Terraforming. Extended Start remains available without Prelude; WGT requires Venus Next.
- **Setup choice**: An eligible selection, its manual or automated result, lock status where applicable, table position for milestones/awards, and expansion dependencies used to determine whether it survives configuration changes. Manual milestone/award selection locks the row. Each selection immediately constrains all other rows in its table regardless of row position, lock status, or selection origin. No lock-based sorting is required.
- **Setup step**: Physical instruction, applicability, and expansion dependencies. Steps have no user-recorded completion state; the instruction list is derived from the current game configuration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Proposed correctness criteria; no arbitrary timing or adoption targets have been adopted.

- **SC-001**: Every setup instruction for an agreed supported configuration is traceable to verified rules or an explicitly approved deviation.
- **SC-002**: Every automated selection satisfies the approved pool, quantity, and compatibility constraints.
- **SC-003**: The completed summary matches every recorded configuration choice.

Usability measures and acceptable thresholds remain to be agreed with the user.

## Assumptions

### Human decisions recorded — 2026-11-10

- Support all expansions, including Prelude and Corporate Era; make all boards available.
- Solo is out of scope.
- Corporation/Prelude dealing override: normal deal is any two corporations and four Preludes; Extended Start is any three corporations and six Preludes, where those components are in use. Omit expansion-specific corporation-dealing variants and conflict resolution; guide physical dealing only.
- Expansion-level prerequisites auto-enable required expansions (Prelude 2 → Prelude). Component-level dependencies instead filter components against the expansions in play. This later explicit principle supersedes the earlier Prelude 2-only restriction.
- Default both expansion/content options and variants to on. Provide page-local select-all/none buttons at the top of both pages. This supersedes cross-page preset interpretations; unavailable variants are inactive with an explanation and Back navigation to expansions; the selected variants are Extended Start, research drafting, and WGT; Extended Start remains available without Prelude.
- Randomize eligible public setup choices by default; permit individual manual overrides from the automatically eligible choices. This does not introduce fine-grained eligibility configuration.
- Avoid individual component eligibility configuration. Prioritize all-content games and base-game teaching; user-provided usage estimates are qualitative context, not measured acceptance targets.
- Milestones & Awards is a full expansion selector and determines the source of milestone/award versions: expansion versions when on, printed board versions when off.
- Application flow (supersedes the earlier single-page configuration): first page sets player count and expansions; second page sets variants; guided setup follows and uses both pages' values. Each page defaults all supported options on and has select-all/none buttons at the top affecting only that page.
- Board configuration: a top-level “Use expanded boards” expansion option reveals all seven boards as initially checked checkboxes. Users can uncheck boards to exclude them from consideration, explicitly including “Original board (Tharsis)”; allowing all six other boards while excluding the original is required. This replaces a separate Hellas & Elysium selector and groups map choices under one option.
- Automate only publicly visible components; project-card randomization is excluded as impractical. Subsequent explicit clarification: guidance MUST still call out every applicable setup step across the supported rules, including private-component setup. Private-component setup is guided, never automated.
- Content cutoff clarified by the user: include non-solo components up through the 2023 More Terraforming Mars! Kickstarter campaign, including its later-delivered content. This supersedes the original Big Box fallback as the content boundary; exclude subsequent releases.

These decisions authorize the stated scope, not approval of the complete specification. Latest presentation decision: show the ordered instructions without completion checkboxes or manual progress tracking; the all-visible layout is tentative pending visual review. Earlier clarification references to clearing progress do not require per-step completion state.

### Content inventory derived from those decisions

Publisher-listed multiplayer content: Corporate Era, Venus Next, Prelude, Prelude 2, Colonies, Turmoil, Hellas & Elysium, Utopia & Cimmeria, Amazonis & Vastitas, and Milestones & Awards. Board names: Tharsis, Hellas, Elysium, Utopia Planitia, Terra Cimmeria, Amazonis Planitia, Vastitas Borealis. Automa is a solo expansion and is excluded by the no-solo decision. The content boundary is the 2023 More Terraforming Mars! campaign, not the 2020 Big Box campaign. Include non-solo campaign components and earlier non-solo content, including relevant promos within that boundary. The exact public-component and promo inventory must be checked against campaign contents; do not infer eligibility from current shop bundles. Later seasonal promos and subsequent releases are excluded. Private promo cards receive applicable physical setup guidance, not digital dealing or randomization.

### Remaining decisions

Corporate Era distinction confirmed with the user: regular corporations are available without Corporate Era. Without Corporate Era, exclude Corporate Era-marked project and corporation cards and start each resource production at 1 before corporation effects. With Corporate Era, include those marked cards and start production at 0 before corporation effects. Corporate Era does not switch between generic and specific corporations. Physical dealing remains guided, not automated, and follows the normal/Extended Start override. Beginner Corporation handling remains an applicable instruction to cover, not an approved new configuration selector.


Extended Start and research drafting are selected for v1. Research drafting is the base rulebook variant for subsequent Research phases, not an initial-hand draft. A possible v2 turn-order walkthrough is future context only. World Government Terraforming is now confirmed as a variant setting, assumed enabled when Venus Next is in play. It is separate from Turmoil's terraform-rating revision. This specific default overrides any blanket variant-default interpretation that would omit WGT.

Board-pool configuration is confirmed on the first page through “Use expanded boards.” Resolved fallback: the last unchecked board disables “Use expanded boards”; whenever it is off, only Tharsis is checked and every board checkbox is inactive. Tharsis is used. Randomization from the checked pool is explicitly supported by the user’s clarification. Generate the board choice on first entering the setup page; a manual final-board override is permitted. “Use expanded boards” defaults on with all seven board candidates checked. Prelude 2 keeps Prelude enabled; selecting none turns both off. Removing an expansion clears only related state after confirmation and retains unaffected state. All configuration edits use tentative v1 selective clearing with confirmation before discarding affected state and retention of unrelated state; revisit for v2.

Resolved guidance boundary: include every applicable rules-defined setup instruction, including physical preparation and dealing of private components. Do not stop the walkthrough after shared components are prepared. Exact wording and ordering remain subject to the complete rules review.

Resolved promo boundary: include relevant non-solo promo components available before or included in the 2023 More Terraforming Mars! campaign. Exact component names and setup effects remain an evidence-verification gap, not an open request to choose a later release cutoff.

Progress recovery is excluded from v1. Customize drop-downs and reroll controls are confirmed; milestone/award tables have hidden gridlines, a selection drop-down in column one and a lock button in column two. Rerolls change unlocked entries only. Public selections are generated on first entry to the setup page (currently page 3), and retained on revisits unless explicitly rerolled or cleared by a configuration edit. Filtering across all other rows in each table updates after each selection; no sorting is required. All configuration edits use tentative v1 selective clearing under FR-022, subject to later v2 reconsideration. Primary use cases are all-content multiplayer and base-game teaching. Milestone/award source selection is resolved; official overlays and eligibility for expansion-dependent entries remain unresolved. No behavior for these is silently assumed.

### Constitutional alignment

The existing constitution v1.0.0, ratified 2026-11-10, was reviewed after updating this branch to origin/main at 2a6f57d. Its six approved principles are Simplicity, Separation of Concerns, Test-Driven Development, Code Quality, Human Authority, and Idiomatic Implementation.

Human Authority requires explicit human approval of substantive requirements; the recorded human scope decisions are binding inputs while remaining stories, priorities, requirements, and success criteria are proposals. Simplicity favors the smallest scope meeting approved needs, but does not authorize AI to decide that scope. The constitution does not supply application requirements or a technical design. Behavioral tests will be derived from approved requirements in a later authorized phase, before implementation; acceptance scenarios here remain requirements prose. The remaining implementation principles will govern later design and development, without introducing technology decisions into this specification.

The constitution itself has not been changed.

No constitution changes, commits, pull requests, plans, task breakdowns, executable tests, or application code are authorized at this stage.

### Evidence and discovery status

See `work/setup-discovery.md`. Research is partial; a complete combined setup sequence has not yet been verified. This draft cannot pass the readiness gate until scope, rules, edge behavior, and human approval are resolved.
