# Human review summary — Guided Game Setup

**Status:** consolidated draft; human approval pending. 2026-11-10.

## Requirements in brief

1. Configure player count/expansions, then variants, then enter setup. Default supported content and available variants on; deliberately exclude the official optional longer Venus board while retaining standard Venus support; page-local select-all/none. Support multiplayer 2–5 and non-solo content through the 2023 More Terraforming Mars! campaign.
2. Include all seven boards under Use expanded boards. Empty/off uses Tharsis. Prelude 2 keeps Prelude enabled; automated public-component pools filter without fine-grained eligibility controls, except fixed printed objectives under resolved R1. Individual cards are outside app filtering under R3.
3. Generate board, colonies, replacement objectives and numerical first player when setup is first entered. Retain on revisits. Customize permits eligible manual overrides; objective manual choices lock; reroll preserves locks and uniqueness. Drop-downs exclude selections in all other rows; no sorting.
4. Show every applicable physical setup instruction in order, including private-card handling, through the handoff to the first action phase. All in-play card decks stay physical; Turmoil is a walkthrough. No checkboxes/manual progress tracking or v1 recovery.
5. Include Extended Start, research drafting and WGT settings. Extended Start uses three corporations and six Preludes when used, and stays available for corporations without Prelude. WGT defaults on with Venus and is separate from Turmoil TR revision.
6. Confirm before discarding only state affected by configuration changes, preserving unrelated choices/locks. This is tentative v1 behavior. Confirm Reset before restoring all-on defaults. The all-visible instruction layout is also tentative pending visual review.

## Review packet

- [Specification](spec.md): 28 functional requirements, 38 concrete acceptance conditions, success outcomes and dependency mapping.
- [Official rules / component inventory](rules-reference.md): source register, physical component families, all digital candidates, printed objective sets and SU-01–SU-12 sequence.
- [Quality checklist](checklists/requirements.md): 15/18 passing, with an explanation for each incomplete item.

## Resolved R1 — intentional product decision

With Milestones & Awards off, retain complete printed milestone/award sets on every map. Maps remain available even when printed objectives are unattainable. Identify each such objective and its disabled expansion(s) in setup and summary; never remove/replace it, enable the missing expansion or prohibit the map. This applies to Utopia Planitia/Pioneer/Colonies, Terra Cimmeria/Planetologist/Venus Next, Amazonis Planitia/Lobbyist/Turmoil, and any other applicable map/objective. It is a human product decision, not an official game rule. AC-31–35 cover retention, notices, map availability, configuration changes and unchanged MA filtering.

## Resolved R2 — deliberate scope exception

The standard Venus board remains supported. The official optional longer Venus board is intentionally excluded from v1 because it adds no meaningful setup-assistant functionality and conflicts with the all-on-by-default configuration philosophy. This is a human scope decision, not an assumption or a claim that the component is unofficial. AC-36–37 cover standard-board guidance and exclusion from choices, randomization, defaults, select-all, Reset and the selected summary.

## Resolved R3 — physical deck guidance without individual-card handling

V1 excludes individual card inventories, promo-card identification and card-level release-date tracking. Guide players through physical deck preparation using selected expansions and printed rules; do not identify, catalog, filter or validate individual cards. The 2023 campaign remains the general scope boundary for expansions/setup components, not a promotional-card inventory obligation. Card-level research and historical acceptance obligations are removed. AC-38 makes the boundary observable; D4's proposed prefiltering method is retired.

No unresolved material issues remain under R1–R3. Proposed defaults and full requirements approval remain outstanding.

## Proposed defaults, not hidden approvals

D1–D3 and D5–D7 in the spec propose: initial/reset player count2; bulk buttons preserve count; uniform unbalanced eligible draws with repeats permitted; colony overrides preserve count/uniqueness without assuming new lock-table controls; a visible failure explanation rather than fabricated results if a pool is too small; summary includes first player.

These need acceptance or amendment with the final draft. They are not a request to approve implementation. The rules packet distinguishes published rules, explicit user overrides, derived source precedence and uncertain cases.

## Readiness

Ready for coherent human review. **Not ready for unconditional approval or planning** until the remaining proposed defaults and complete specification are explicitly approved. No additional product scope has been added; R2 and R3 deliberately narrow v1 scope. Documentation is published in draft PR #4; full requirements approval remains outstanding. The checklist is now 15/18: R3 closes the remaining scope, acceptance-scenario and requirement-mapping gaps. Unambiguous approved defaults, agreement on measurable outcomes and full-spec approval remain incomplete.
