# Human review summary — Guided Game Setup

**Status:** consolidated draft; human approval pending. 2026-11-10.

## Requirements in brief

1. Configure player count/expansions, then variants, then enter setup. Default supported content and available variants on; deliberately exclude the official optional longer Venus board while retaining standard Venus support; page-local select-all/none. Support multiplayer 2–5 and non-solo content through the 2023 More Terraforming Mars! campaign.
2. Include all seven boards under Use expanded boards. Empty/off uses Tharsis. Prelude 2 keeps Prelude enabled; components filter automatically without fine-grained eligibility controls, except fixed printed objectives under resolved R1.
3. Generate board, colonies, replacement objectives and numerical first player when setup is first entered. Retain on revisits. Customize permits eligible manual overrides; objective manual choices lock; reroll preserves locks and uniqueness. Drop-downs exclude selections in all other rows; no sorting.
4. Show every applicable physical setup instruction in order, including private-card handling, through the handoff to the first action phase. All in-play card decks stay physical; Turmoil is a walkthrough. No checkboxes/manual progress tracking or v1 recovery.
5. Include Extended Start, research drafting and WGT settings. Extended Start uses three corporations and six Preludes when used, and stays available for corporations without Prelude. WGT defaults on with Venus and is separate from Turmoil TR revision.
6. Confirm before discarding only state affected by configuration changes, preserving unrelated choices/locks. This is tentative v1 behavior. Confirm Reset before restoring all-on defaults. The all-visible instruction layout is also tentative pending visual review.

## Review packet

- [Specification](spec.md): 28 functional requirements, 37 concrete acceptance conditions, success outcomes and dependency mapping.
- [Official rules / component inventory](rules-reference.md): source register, physical component families, all digital candidates, printed objective sets and SU-01–SU-12 sequence.
- [Quality checklist](checklists/requirements.md): 12/18 passing, with an explanation for each incomplete item.

## Resolved R1 — intentional product decision

With Milestones & Awards off, retain complete printed milestone/award sets on every map. Maps remain available even when printed objectives are unattainable. Identify each such objective and its disabled expansion(s) in setup and summary; never remove/replace it, enable the missing expansion or prohibit the map. This applies to Utopia Planitia/Pioneer/Colonies, Terra Cimmeria/Planetologist/Venus Next, Amazonis Planitia/Lobbyist/Turmoil, and any other applicable map/objective. It is a human product decision, not an official game rule. AC-31–35 cover retention, notices, map availability, configuration changes and unchanged MA filtering.

## Resolved R2 — deliberate scope exception

The standard Venus board remains supported. The official optional longer Venus board is intentionally excluded from v1 because it adds no meaningful setup-assistant functionality and conflicts with the all-on-by-default configuration philosophy. This is a human scope decision, not an assumption or a claim that the component is unofficial. AC-36–37 cover standard-board guidance and exclusion from choices, randomization, defaults, select-all, Reset and the selected summary.

## Remaining material issues

| Issue | Concrete review question |
| --- | --- |
| R3: seasonal 2023 cutoff | Campaign content is included despite later delivery, but the later-issued 2023 seasonal pack may span both sides of the cutoff. Primary card-level/add-on historical confirmation is incomplete. |

## Proposed defaults, not hidden approvals

D1–D7 in the spec propose: initial/reset player count2; bulk buttons preserve count; uniform unbalanced eligible draws with repeats permitted; prefilter physical dependency-marked cards with the published redraw alternative explained; colony overrides preserve count/uniqueness without assuming new lock-table controls; a visible failure explanation rather than fabricated results if a pool is too small; summary includes first player.

These need acceptance or amendment with the final draft. They are not a request to approve implementation. The rules packet distinguishes published rules, explicit user overrides, derived source precedence and uncertain cases.

## Readiness

Ready for coherent human review. **Not ready for unconditional approval or planning** until R3 and the proposed defaults are resolved and corresponding acceptance coverage is completed. No additional product scope has been added; R2 deliberately narrows v1 scope. Documentation is published in draft PR #4; full requirements approval remains outstanding. The checklist remains 12/18: resolving R1 and R2 completes their acceptance coverage, while R3, proposed defaults and full-spec approval still prevent closing the six incomplete items.
