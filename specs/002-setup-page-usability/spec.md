# Feature Specification: Setup Page Usability

**Feature Branch**: `feature/setup-page-usability`

**Created**: 2026-11-15

**Status**: Draft for human review; requirements and design decisions are not approved.

**Input**: Redesign the Setup experience with natural physical-setup instructions, cohesive visual design, improved information architecture, responsive layouts, less clutter, and accessible interactions. Preserve all existing rules, domain behavior, configuration options, selection logic, and necessary guidance. Evaluate alternatives to the current three-page presentation. Specification only; no implementation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prepare the physical table confidently (Priority: P1)

As the person setting up Terraforming Mars, I can find the next physical action and carry it out without decoding internal labels or searching repetitive explanations.

**Why this priority**: Correct, complete physical preparation is the purpose of this experience.

**Independent Test**: Give a player a prepared configuration and its setup instructions. Observe physical preparation against the existing applicable instruction inventory, including private decks and expansion exceptions.

**Acceptance Scenarios**:

1. **Given** a base-game configuration, **When** I read the instructions, **Then** actions appear in the required order with the components, quantities, starting values, and exceptions needed at that point.
2. **Given** an expansion-heavy configuration, **When** I prepare the table, **Then** every applicable setup action remains available, inapplicable actions are absent, and related actions have descriptive headings.
3. **Given** I need a rule explanation, **When** I open the associated supporting detail, **Then** I can find its source without leaving or losing my place in setup; internal SU IDs and source codes do not interrupt the primary instructions.

### User Story 2 - Understand and adjust public selections (Priority: P1)

As the person organizing the game, I can identify the chosen board, first player, colonies, milestones, and awards, and find the permitted ways to customize them.

**Why this priority**: These results determine which physical components players prepare.

**Independent Test**: Using a valid configuration with replacement objectives enabled, identify all results, customize a result, lock an objective, reroll, and inspect the resulting guidance and summary.

**Acceptance Scenarios**:

1. **Given** generated selections, **When** I scan setup, **Then** current results are prominent and distinguishable from controls that change them.
2. **Given** customization is available, **When** I open it, **Then** manual choices, rerolls, and objective lock states are clearly labeled and obey existing eligibility, uniqueness, and locking behavior.
3. **Given** a board change affects existing choices, **When** confirmation appears, **Then** it explains the affected results and offers clear confirm/cancel actions; cancellation preserves everything and confirmation preserves unaffected state.
4. **Given** an unattainable printed objective, **When** I review selections or the summary, **Then** its identity and missing-expansion explanation remain visible; the board and objective are retained.

### User Story 3 - Find context and return to preparation (Priority: P2)

As a player checking the game configuration, I can distinguish configuration, public results, and physical instructions and move between them without losing choices.

**Why this priority**: Reduces searching and repeated reading during a shared tabletop activity.

**Independent Test**: From the middle of setup, find the player count and variants, return to the prior instruction, and revisit configuration without changing generated values.

**Acceptance Scenarios**:

1. **Given** I am reading instructions, **When** I seek the configuration summary, **Then** a clearly named route leads to every existing summary field, with values matching the current selections.
2. **Given** I revisit configuration without editing, **When** I return to setup, **Then** selections and locks are unchanged and my current location is understandable.
3. **Given** I edit configuration or request Reset, **When** the existing confirmation policy applies, **Then** affected state and consequences are understandable before I confirm; physical work is never described as automatically undone.

### User Story 4 - Use setup on any supported screen or input (Priority: P1)

As a player using a phone, tablet, keyboard, or screen reader, I can read instructions and operate every available action.

**Why this priority**: Devices and input methods vary around a game table.

**Independent Test**: Complete selection customization, supporting-detail navigation, summary review, and confirmation/cancellation on narrow and wide layouts with touch, keyboard, and a screen reader.

**Acceptance Scenarios**:

1. **Given** a narrow screen or enlarged text, **When** I review long instructions and objective names, **Then** text wraps, values remain associated with labels, and controls remain usable without horizontal page scrolling.
2. **Given** keyboard-only navigation, **When** I traverse sections, disclose controls, or dismiss a dialog, **Then** focus is visible, follows a meaningful order, and returns to the initiating control or a logical fallback.
3. **Given** a screen reader, **When** a selection changes or a conflict appears, **Then** its result and required next action are available without re-reading the entire page.

### Edge Cases

- Base game only, all supported content enabled, 2 and 5 players, long names, and expansion-specific quantities must remain readable.
- One eligible board, repeated reroll results, all objective rows locked, and no valid eligible set retain existing outcomes; presentation must explain these without promising a different result.
- Fixed Venus objectives, printed objective limitations, replacement objectives, and source-dependent thresholds remain distinguishable.
- Configuration edits while customization or supporting details are open must not leave stale values or focus on removed controls.
- Reset cancellation, board-change cancellation, and conflict recovery must preserve existing state guarantees.
- Narrow landscape screens, 200% text enlargement, and 400% zoom must not hide actions behind fixed or sticky regions.
- Collapsing or changing sections must not imply completion of physical tasks or claim to undo physical preparation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 — Behavior preservation**: The redesign MUST preserve the approved behavior in [001-guided-game-setup](../001-guided-game-setup/spec.md), including its active defaults, supported content, 2–5-player scope, dependencies, physical/private-component guidance, public-only automation, exclusions, quantities, applicability, and sequencing. Presentation changes proposed below do not authorize rule changes.
- **FR-002 — Selection preservation**: All existing configuration options and selection operations MUST remain available with the same eligibility, counts, randomness, possible repeated results, uniqueness, auto-lock/manual-lock rules, fixed additions, printed-objective limitations, and selective invalidation. Navigation, resizing, and opening/closing details MUST NOT reroll or clear state.
- **FR-003 — Actionable language**: Primary instructions MUST address players directly, use familiar game-component names and concrete action verbs, and place quantities and conditions beside the relevant action. Copy review MUST map every existing applicable instruction to its revised wording, preserving all necessary facts and exceptions. Splitting or combining sentences MUST preserve dependencies.
- **FR-004 — Layered explanation**: Internal instruction IDs, source codes, and implementation explanations MUST be absent from primary player-facing instructions. Rule references and the distinction between rules and product decisions MUST remain accessible through clearly labeled supporting detail associated with the relevant guidance. Required actions, quantities, warnings, and exceptions MUST NOT require opening optional explanatory detail.
- **FR-005 — Information architecture**: Users MUST be able to locate three clearly named areas: current public selections, ordered physical preparation, and configuration summary. Their hierarchy MUST distinguish an outcome, a physical action, and a control that changes state. The selected layout is subject to D1 below.
- **FR-006 — Reduced repetition**: Each physical action MUST have one primary location. Repeated summary values MUST serve verification rather than repeat full instruction prose or customization controls. All current summary information MUST remain reachable and consistent, including content, variants, board, first player, colonies, objective versions, thresholds, and limitations.
- **FR-007 — Controls and feedback**: Equivalent actions MUST use consistent names, visual treatment, and interaction conventions. Current selections, editable versus fixed results, locked states, disabled/unavailable actions, conflicts, and affected-state confirmations MUST be understandable from text as well as visual styling. Selection changes MUST provide perceivable feedback without unexpectedly moving the user away from the task.
- **FR-008 — Navigation**: Users MUST have descriptive section/page names, a clear current location, and an accessible way to reach instructions, selections, summary, and configuration. Returning without edits MUST retain state. Navigation labels MUST describe their destination or action rather than rely solely on an ambiguous “Back.” Configuration MUST still be established before initial public generation and physical guidance.
- **FR-009 — Visual cohesion**: The reviewed design MUST define a consistent heading/body/metadata hierarchy, spacing scale, palette, surface treatment, and control states. The same semantic role MUST receive consistent treatment across setup, its navigation, and its edit/confirmation surfaces. Required actions and current results MUST have greater visual emphasis than references and secondary controls. Exact visual choices remain D3 proposals.
- **FR-010 — Responsive use**: All tasks MUST remain available at representative widths of 320, 768, and 1280 CSS pixels, in portrait and landscape, without clipped text, overlapping controls, or horizontal page scrolling. At 200% text enlargement and 400% zoom from a 1280-pixel viewport, content MUST reflow and remain operable. Wide-screen grouping MUST preserve a meaningful reading order on narrow screens.
- **FR-011 — Accessibility**: The experience MUST meet WCAG 2.2 AA for affected surfaces, including meaningful headings/regions, programmatic control names and states, keyboard operation, visible unobscured focus, appropriate dialog focus containment/restoration, accessible change/error feedback, and no color-only meaning. Normal text MUST meet 4.5:1 contrast, large text and relevant non-text controls 3:1; targets MUST meet the 24-by-24 CSS-pixel AA minimum or its spacing exceptions. Hover MUST NOT be required to discover necessary guidance or actions.
- **FR-012 — Existing recovery semantics**: Conflict recovery, dependency explanations, confirmation before affected state is cleared, cancel behavior, and confirmed Reset MUST retain their existing effects and expose clear next actions. No new persistence, undo, completion tracking, private-card automation, or gameplay guidance is introduced.
- **FR-013 — Review before implementation**: Human review MUST compare the layout alternatives below using the same representative configurations and tasks. The chosen layout, disclosure pattern, visual direction, and any explicit supersession of old presentation requirements MUST be recorded before implementation. This feature does not silently replace prior approved requirements.

### Key Entities

- **Configuration**: Existing player count, enabled content, board pool, and variants; unchanged by visual presentation alone.
- **Public selection**: Existing generated or manually chosen public result, including its source, limitations, and objective lock state.
- **Physical instruction**: An applicable, ordered physical action and its necessary conditions, quantities, exceptions, and traceable supporting references.
- **Configuration summary**: A readable view of the same active configuration and results, never an independently editable copy.
- **Presentation location**: The visible section/page and disclosure state; conveys location, not physical completion or durable saved progress.

## Success Criteria *(mandatory)*

### Measurable Outcomes

These are proposed acceptance targets for human review, not measured results or approved commitments.

- **SC-001 — Guidance completeness**: Copy comparison accounts for 100% of existing instruction entries and their applicability, quantities, exceptions, and order. There are zero omitted necessary facts or changed domain outcomes across base-only, expansion-heavy, Amazonis, printed-objective limitation, and replacement-objective setups.
- **SC-002 — Findability**: In a formative review with at least five Terraforming Mars players, including two unfamiliar with this app, at least four can identify the board/first player, find a specified physical instruction, inspect variants in the summary, and find customization within 30 seconds per task without facilitator help.
- **SC-003 — Preparation clarity**: In those sessions, at least four of five participants correctly explain and carry out the assigned representative physical-setup sequence without clarification caused by the interface. Any omitted or misleading rule fact blocks acceptance regardless of the count. Observe base and expansion-heavy preparation; exclude time spent finding physical pieces from findability timing.
- **SC-004 — Interaction reliability**: Every existing public-selection, lock/reroll, configuration-edit, cancellation, conflict-recovery, and Reset acceptance case retains its domain outcome. Navigation and disclosure produce zero unintended selection or lock changes.
- **SC-005 — Responsive accessibility**: Every task in stories 2–4 can be completed at the FR-010 sizes and zoom levels with no clipped or unreachable controls. Keyboard and screen-reader review finds zero unresolved WCAG 2.2 AA failures on affected surfaces; automated checks alone do not satisfy this criterion.
- **SC-006 — Cohesion and clutter**: Visual/copy review finds zero unexplained deviations from the approved hierarchy and control conventions, zero internal IDs/source codes in primary instructions, and zero duplicate full physical-action instructions. Supporting references and every existing summary field remain reachable.

## Assumptions

- The existing approved specification and current behavior are the preservation baseline. This is a UX redesign, not a new rules audit or an opportunity to broaden content support.
- English copy is in scope. Localization, new game options, exports, accounts, persistent recovery, completion checkboxes, and gameplay assistance are out of scope.
- Players use the screen alongside physical components and may share it. The interface does not request or reveal private hands.
- Required guidance remains directly available; optional supporting explanation may use disclosure. A completed physical step is not recorded.
- Usability targets are draft review proposals. Recruitment and observation are later validation work; no user study or rendered visual review has been performed for this specification.
- Dependencies: the prior approved specification, its rules reference, and existing observable behavior. A later implementation phase requires human-approved requirements and behavioral tests under the constitution.

## Design Alternatives and Open Decisions

### Current evidence and limits

The current app presents Content → Variants → Setup. Setup stacks public choices, two objective sections, instructions, and a summary that repeats results. Instructions display SU identifiers and source metadata inline. Customization is disclosed, but lock status occupies an objective-table column even outside editing. These observations come from the current presentation and instruction content; they are not findings from a usability study or a rendered-device audit.

### Alternatives to compare

| Alternative | Organization and interaction | Expected benefits | Tradeoffs and review focus |
| --- | --- | --- | --- |
| A: Refined three-page flow | Keep Content, Variants, Setup; give Setup named sections, concise selection results, ordered action groups, and secondary summary access. | Familiar sequence; limited navigation change; configuration remains distinct. | Separate configuration pages may still feel fragmented; long Setup page needs section navigation. Test returning to an instruction after reviewing configuration. |
| B: Configure → Prepare | Combine existing configuration controls into one organized Configure view; Prepare groups public results and physical instructions with on-demand summary access. | Fewer page transitions; clearer distinction between choosing settings and preparing components. | Dense configuration can overwhelm phones; select-all/none scope and first-entry generation boundary need explicit labels. Test base-game configuration and expansion-heavy edits. |
| C: Single workspace | Configuration, results, preparation, and summary occupy named regions in one workspace; section links navigate on mobile and optional columns support wide screens. | Fast cross-reference and direct access to settings. | Competing regions may increase clutter; generation/edit boundaries and focus/scroll behavior must remain explicit. Test accidental edits and reading order at narrow widths. |
| D: Task-group guided preparation | Keep a configuration boundary, then navigate named preparation groups with an overview and direct access to all groups; no completion state. | Smaller reading units and clearer local focus. | Hidden context and extra navigation can obscure required steps; users may mistake groups for tracked completion. Test completeness and resuming after interruption. |

No alternative is selected. Compare each against the same tasks and preservation constraints, rather than choosing by page count alone. Low-fidelity review material should expose public results, required actions, summary, customization, and configuration edits for both base-only and expansion-heavy cases at phone and desktop sizes. Reject any option that hides necessary guidance, changes generation timing, loses state, or fails keyboard navigation. Record evidence, tradeoffs, and the human decision.

### Decisions for human review

| ID | Open decision and alternatives | Proposed evaluation direction; not approval |
| --- | --- | --- |
| D1 | Overall architecture: A, B, C, or D; may configuration controls be regrouped beyond the Setup page? | Compare A and B first, retain C and D as meaningful alternatives. Broader presentation changes must be explicitly approved; all configuration behavior stays fixed. |
| D2 | Instruction density: all expanded action groups with section links, or collapsible groups with clear overview and an expand-all route? Should summary be inline, a secondary region, or disclosed? | Prefer required actions expanded for initial comparison. Evaluate long-page scanning against disclosure discoverability and interruption recovery. Keep necessary warnings and exceptions with their action. |
| D3 | Visual direction: restrained tabletop reference or stronger Mars-themed styling? How prominent should customization and locked-state indicators be? | Review typography, spacing, palette, sample results, long instructions, and complete control states together. Prefer legibility and action hierarchy over decoration. Larger touch targets may be proposed while preserving the AA minimum. |
| D4 | Navigation and edit entry points: section links, page navigation, or grouped task navigation; location on return after inspecting summary/configuration? | Preserve current values and focus semantics; compare whether players can return to their place without a progress tracker. Specify exact labels and focus/scroll behavior in the chosen design. |

These are deliberately open design-review choices, not missing domain requirements. Human review may select among them while preserving the testable outcomes above. No choice is inferred from this draft.

### Relationship to prior presentation requirements

The prior feature's FR-007 specifies three pages; FR-004 tentatively specifies all-visible instructions; FR-020 specifies objective-table presentation as well as selection behavior. D1/D2/D3 may propose superseding their presentation portions only. Until a human explicitly approves that supersession, those requirements remain the baseline. Ordered complete guidance, no completion tracking, dropdown/manual/reroll capabilities, objective order, locking, eligibility, and all other domain semantics remain preserved. Rule traceability under prior FR-006 is retained while its primary visual placement is proposed to change under FR-004 here.

**Review gate**: This draft is ready for UX/design discussion and `$speckit-clarify`. Record approval of requirements, targets, and D1–D4 before `$speckit-plan` or implementation. No plan, tasks, application changes, or new behavioral tests are part of this specification-only change.
