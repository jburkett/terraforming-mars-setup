# Data Model: Guided Game Setup

**Status:** Proposed design, not an implemented schema. [spec.md](spec.md) remains authoritative. Mutable state lives only in browser memory.

## Configuration

| Field | Meaning and invariant |
| --- | --- |
| playerCount | Integer 2–5; initial/reset value 2. |
| enabledContent | CE, Venus Next, Prelude, Prelude 2, Colonies, Turmoil, MA; all initially on. P2 implies Prelude. |
| expandedBoards | Initially on; off means only checked/inactive Tharsis and inactive board controls. |
| boardCandidates | Nonempty subset of seven boards when enabled; initially all seven. Removing the last candidate restores off/Tharsis fallback. |
| variants | Extended Start and research drafting only, initially on; neither requires an expansion. |

No WGT, longer Venus, beginner selector, card inventory or dealing-quota field. Map packs have no expansion toggles. Page-local bulk selection preserves N and the other page's toggles.

## Static definitions

| Entity | Fields and relationships |
| --- | --- |
| BoardDefinition | Stable ID/name, printed milestone/award references, map/supply context and sources; seven entries. |
| ColonyDefinition | Stable ID/name, initial marker mode (ordinary second position or inactive picture), sources; eleven entries. |
| ObjectiveDefinition | Stable source/kind/board-qualified identity, name, threshold/description rules, prerequisites and sources. MA has 35 milestones and 35 awards; printed and fixed Venus records are separate. |
| SourceReference | Rules-register ID and section/page/link, or recorded human override reference. |
| InstructionDefinition | Stable subsection ID, parent SU ID, applicability, contextual text/quantities, ordering, evidence/override references; no completion field. |

Identity is distinct from contextual description. Printed Tharsis Terraformer gets the Turmoil TR-26 overlay; MA Terraformer stays TR 29. CE can change thresholds without changing identity. Shared names never imply interchangeable versions. Check every required expansion; optional non-expansion routes remain valid.

## Live state and projections

| Entity | Fields and invariants |
| --- | --- |
| Session | Committed Configuration, current view, PublicSelections and transient UI/confirmation state. |
| PublicSelections | Optional board, first-player number, colony set, MA milestone/award rows; missing applicable values need generation. |
| ObjectiveRow | Stable row position, MA reference or empty slot, locked flag. Five rows per kind when generated; empty rows cannot be locked. |
| PendingEdit | Proposed normalized configuration/direct board change, calculated losses and reason for confirmation; no mutation of committed state. |
| SetupProjection | Derived instructions, effective objectives, limitations, alternatives and summary. |
| SelectionConflict | Failed count/pool context and explanation with return-to-configuration option; no fabricated component. |

Manual MA choice auto-locks that row. Board/first-player/colony manual selections are retained results with explicit reroll, without introducing colony lock tables. Printed/fixed objectives are derived and have no MA replacement controls.

## Invariants

- Board is in the active pool or the Tharsis fallback; first player is in 1…N.
- Colonies off has no result; on has 5/5/6/7 distinct official IDs at N=2/3/4/5. Inactive-at-start tiles remain eligible.
- MA on has five distinct eligible objectives per kind. Every row excludes all other selected rows in its table; row positions persist. Venus adds a fixed pair outside those five rows.
- MA off retains complete printed five-plus-five identities. Show every missing prerequisite causing unattainability in setup and summary; never filter a printed set or map under R1.
- Duplicate checks are per corresponding set/table. Locks cannot authorize invalid or duplicate identities. Instructions/summary derive from committed state and share its source versions/limitations.

## Transitions

| Transition | Result |
| --- | --- |
| New session / confirmed Reset | N=2; supported content, seven boards and two variants on; generated results/locks empty. Cancellation preserves everything. |
| Back / unchanged setup revisit | Preserve all results/locks/configuration. No random draw on render or unchanged navigation. |
| Setup entry after edits | Fill only missing applicable values, board before objectives. Retain still-valid rows, including unlocked rows not explicitly rerolled. |
| Configuration edit | Normalize, compute dependency effects, confirm before losing affected values/locks, then commit atomically or cancel. Preview draws no randomness. |
| Player-count change | Clear first player and colony selection on confirmation, even if old values/count remain valid; preserve board and eligible objectives/locks. |
| Board candidate/direct choice change | Clear excluded board or commit eligible manual board; recompute printed source and board-dependent MA eligibility. Confirm losses; retain unrelated results and eligible rows/locks. |
| Expansion/MA change | Clear only dependency-affected random entries/locks; source-mode change clears obsolete MA state. Printed identities/limitation notices are derived under R1. |
| Prelude/Extended Start/drafting | Revise relevant physical instructions/recorded choice, preserving unrelated results; enforce whole-expansion dependency. |
| Manual MA choice | Validate against all other rows, replace immediately, lock row, release previous value for eligible alternatives; no sorting. |
| MA reroll | Preserve locked positions/values; uniformly fill unlocked rows excluding locks, allowing old unlocked values. All locked is no-op. |
| Other manual choice/reroll | Change only explicit target, maintaining eligibility/count/uniqueness; board changes reconcile dependent objectives after required confirmation. |
| Insufficient pool | Explain conflict and offer configuration return. No partial committed draw, duplicates, silent lock loss or expansion enabling. |

Use the full spec dependency map for all edits. Invalidated locked entries require confirmation; valid locks survive. New instructions never claim to undo physical actions already performed.
