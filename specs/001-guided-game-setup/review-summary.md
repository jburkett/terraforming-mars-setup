# Human review summary — Guided Game Setup

**Status:** complete requirements explicitly approved by the user on 2026-11-11, including SC-001–SC-005. PR #4 is authorized to be marked ready for review at 18/18; no later phase is authorized.

## Requirements in brief

1. Configure player count/expansions, then variants, then enter setup. Default supported content and available variants on; deliberately exclude the official optional longer Venus board while retaining standard Venus support; page-local select-all/none. Support multiplayer 2–5 and non-solo content through the 2023 More Terraforming Mars! campaign.
2. Include all seven boards under Use expanded boards. Empty/off uses Tharsis. Prelude 2 keeps Prelude enabled; automated public-component pools filter without fine-grained eligibility controls, except fixed printed objectives under resolved R1. Individual cards are outside app filtering under R3.
3. Generate board, colonies, replacement objectives and numerical first player when setup is first entered. Retain on revisits. Customize permits eligible manual overrides; objective manual choices lock; reroll preserves locks and uniqueness. Drop-downs exclude selections in all other rows; no sorting.
4. Show every applicable physical setup instruction in order, including private-card handling, through the handoff to the first action phase. All in-play card decks stay physical; Turmoil is a walkthrough. No checkboxes/manual progress tracking or v1 recovery.
5. Include Extended Start and research drafting settings. Extended Start uses three corporations and six Preludes when used, and stays available for corporations without Prelude. WGT configuration, tracking and guidance are excluded from v1 as immaterial to setup; standard Venus and applicable Turmoil setup remain supported.
6. Confirm before discarding only state affected by configuration changes, preserving unrelated choices/locks. This is tentative v1 behavior. Confirm Reset before restoring all-on defaults. The all-visible instruction layout is also tentative pending visual review.

## Review packet

- [Specification](spec.md): 26 active functional requirements, two retired requirement identifiers and 39 concrete acceptance conditions, success outcomes and dependency mapping.
- [Official rules / component inventory](rules-reference.md): source register, physical component families, all digital candidates, printed objective sets and SU-01–SU-12 sequence.
- [Quality checklist](checklists/requirements.md): 18/18 passing; no incomplete checklist items.

## Resolved R1 — intentional product decision

With Milestones & Awards off, retain complete printed milestone/award sets on every map. Maps remain available even when printed objectives are unattainable. Identify each such objective and its disabled expansion(s) in setup and summary; never remove/replace it, enable the missing expansion or prohibit the map. This applies to Utopia Planitia/Pioneer/Colonies, Terra Cimmeria/Planetologist/Venus Next, Amazonis Planitia/Lobbyist/Turmoil, and any other applicable map/objective. It is a human product decision, not an official game rule. AC-31–35 cover retention, notices, map availability, configuration changes and unchanged MA filtering.

## Resolved R2 — deliberate scope exception

The standard Venus board remains supported. The official optional longer Venus board is intentionally excluded from v1 because it adds no meaningful setup-assistant functionality and conflicts with the all-on-by-default configuration philosophy. This is a human scope decision, not an assumption or a claim that the component is unofficial. AC-36–37 cover standard-board guidance and exclusion from choices, randomization, defaults, select-all, Reset and the selected summary.

## Resolved R3 — physical deck guidance without individual-card handling

V1 excludes individual card inventories, promo-card identification and card-level release-date tracking. Guide players through physical deck preparation using selected expansions and printed rules; do not identify, catalog, filter or validate individual cards. The 2023 campaign remains the general scope boundary for expansions/setup components, not a promotional-card inventory obligation. Card-level research and historical acceptance obligations are removed. AC-38 makes the boundary observable; D4's proposed prefiltering method is retired.

R1–R3 remain resolved. The active defaults are now approved; final review finding F1 is closed by the explicit WGT scope exclusion. The complete requirements and SC-001–SC-005 are explicitly approved as of 2026-11-11.

## Approved defaults

The user approved D1–D7 as currently documented. Active decisions D1–D3 and D5–D7 specify: initial/reset player count2; bulk buttons preserve count; uniform unbalanced eligible draws with repeats permitted; colony overrides preserve count/uniqueness without assuming new lock-table controls; a visible failure explanation rather than fabricated results if a pool is too small; summary includes first player.

D4 remains retired under R3; this approval does not reinstate a card-filtering method. The subsequent full-specification approval on 2026-11-11 also accepts SC-001–SC-005; implementation remains unauthorized. The rules packet distinguishes official rules from approved product decisions.

## Readiness

**Approved by explicit human decision on 2026-11-11.** F1 concerned WGT state after Venus re-enablement; the user resolved it by excluding WGT from v1 as immaterial to setup. AC-39 covers removal of WGT controls, stored choices, summary values and guidance. FR-027/028 are retired. No material requirement contradiction or acceptance gap remains identified in this document review.

Corrected two editorial conflicts: AC-26 no longer presupposes colony locks beyond approved D5, and Prelude 2 discard piles are prepared before use. The tentative all-visible layout and selective clearing remain v1 choices subject to later usability review; they do not require implementation to decide requirements approval. Story priorities remain advisory. No card-level or optional-longer-board research is reopened.

Checklist: **18/18**. The user explicitly accepted the complete specification, including SC-001–SC-005; the final two approval items are complete. Low-risk review limits are the tentative v1 presentation/selective-clearing choices and advisory story priorities; rendered usability has not been evaluated. The user authorized marking PR #4 ready for review at 18/18. Merging is not authorized. No planning, task generation, testing or implementation is authorized.
