# Human review summary — Guided Game Setup

**Status:** consolidated draft; human approval pending. 2026-11-10.

## Requirements in brief

1. Configure player count/expansions, then variants, then enter setup. Default supported content and available variants on; page-local select-all/none. Support multiplayer 2–5 and non-solo content through the 2023 More Terraforming Mars! campaign.
2. Include all seven boards under Use expanded boards. Empty/off uses Tharsis. Prelude 2 keeps Prelude enabled; components filter automatically without fine-grained eligibility controls.
3. Generate board, colonies, replacement objectives and numerical first player when setup is first entered. Retain on revisits. Customize permits eligible manual overrides; objective manual choices lock; reroll preserves locks and uniqueness. Drop-downs exclude selections in all other rows; no sorting.
4. Show every applicable physical setup instruction in order, including private-card handling, through the handoff to the first action phase. All in-play card decks stay physical; Turmoil is a walkthrough. No checkboxes/manual progress tracking or v1 recovery.
5. Include Extended Start, research drafting and WGT settings. Extended Start uses three corporations and six Preludes when used, and stays available for corporations without Prelude. WGT defaults on with Venus and is separate from Turmoil TR revision.
6. Confirm before discarding only state affected by configuration changes, preserving unrelated choices/locks. This is tentative v1 behavior. Confirm Reset before restoring all-on defaults. The all-visible instruction layout is also tentative pending visual review.

## Review packet

- [Specification](spec.md): 28 functional requirements, 30 concrete acceptance conditions, success outcomes and dependency mapping.
- [Official rules / component inventory](rules-reference.md): source register, physical component families, all digital candidates, printed objective sets and SU-01–SU-12 sequence.
- [Quality checklist](checklists/requirements.md): 12/18 passing, with an explanation for each incomplete item.

## Remaining material issues

| Issue | Concrete review question |
| --- | --- |
| R1: printed objectives with missing expansions | What should happen to Utopia's Pioneer without Colonies, Cimmeria's Planetologist without Venus, or Amazonis's Lobbyist without Turmoil when MA is off? Existing decisions require both printed versions and dependency filtering, but do not prescribe a replacement or reduced-count rule. |
| R2: optional longer Venus board | It is an official physical component but not an approved application option. Proposed treatment is standard Venus board unless a separate behavior is explicitly accepted; no selector was silently added. |
| R3: seasonal 2023 cutoff | Campaign content is included despite later delivery, but the later-issued 2023 seasonal pack may span both sides of the cutoff. Primary card-level/add-on historical confirmation is incomplete. |

## Proposed defaults, not hidden approvals

D1–D7 in the spec propose: initial/reset player count2; bulk buttons preserve count; uniform unbalanced eligible draws with repeats permitted; prefilter physical dependency-marked cards with the published redraw alternative explained; colony overrides preserve count/uniqueness without assuming new lock-table controls; a visible failure explanation rather than fabricated results if a pool is too small; summary includes first player.

These need acceptance or amendment with the final draft. They are not a request to approve implementation. The rules packet distinguishes published rules, explicit user overrides, derived source precedence and uncertain cases.

## Readiness

Ready for coherent human review. **Not ready for unconditional approval or planning** until R1–R3 and the proposed defaults are resolved and corresponding acceptance coverage is completed. No additional product scope has been added. No commit or PR has been created.
