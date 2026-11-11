# Data Model: Guided Game Setup

**Status:** Proposed design, not an implemented schema. [spec.md](spec.md) remains authoritative. The revised technical plan remains subject to human approval. Mutable state lives only in browser memory, separate from static JSON catalogs.

## Configuration

| Field | Meaning and invariant |
| --- | --- |
| playerCount | Integer 2–5; initial/reset value 2. |
| enabledContent | CE, Venus Next, Prelude, Prelude 2, Colonies, Turmoil, MA; all initially on. P2 implies Prelude. |
| expandedBoards | Initially on; off means only checked/inactive Tharsis and inactive board controls. |
| boardCandidates | Nonempty subset of seven boards when enabled; initially all seven. Removing the last candidate restores off/Tharsis fallback. |
| variants | Extended Start and research drafting only, initially on; neither requires an expansion. |

No WGT, longer Venus, beginner selector, card inventory or dealing-quota field. Map packs have no expansion toggles. Page-local bulk selection preserves N and the other page's toggles.

## Static JSON catalogs and TypeScript schemas

Store game data under `src/content/` as `boards.json`, `expansions.json`, `colonies.json`, `milestones.json`, `awards.json` and `instructions.json`. TypeScript types in the same content boundary define their schemas. Imported catalogs are read-only domain inputs; generated choices refer to stable IDs rather than mutating catalog records. Source references may be nested data within these catalogs.

| Entity | Fields and relationships |
| --- | --- |
| BoardDefinition | Stable ID/name, printed milestone/award references, map/supply context and sources; seven entries. |
| ExpansionDefinition | Stable ID/name, descriptive prerequisite IDs and source references for supported content; TypeScript enforces dependency behavior. Corporate Era and MA use this content-option catalog too. |
| ColonyDefinition | Stable ID/name, initial marker mode (ordinary second position or inactive picture), sources; eleven entries. |
| ObjectiveDefinition | Stable source/kind/board-qualified identity, name, descriptive thresholds/context IDs, prerequisite IDs and sources. Milestone and award catalogs include the MA 35/35 subsets plus distinct printed and fixed Venus records. TypeScript implements threshold and eligibility interpretation. |
| SourceReference | Rules-register ID and section/page/link, or recorded human override reference. |
| InstructionDefinition | Stable subsection ID, parent SU ID, descriptive applicability/context IDs, text variants and quantity parameters, ordering, evidence/override references; no completion field. TypeScript selects applicable variants and calculates quantities. |

Identity is distinct from contextual description. Printed Tharsis Terraformer gets the Turmoil TR-26 overlay; MA Terraformer stays TR 29. CE can change thresholds without changing identity. Shared names never imply interchangeable versions. Check every required expansion; optional non-expansion routes remain valid.

Eligibility predicates, selection algorithms and state transitions are TypeScript domain behavior, independent of Vue. JSON stores facts/identifiers rather than functions, expressions or executable logic. Recognized context identifiers connect descriptive data to explicit TypeScript rules; no generic rule interpreter or dynamic evaluation is proposed.

Before Vite emits assets, build-time validation checks actual JSON against TypeScript-defined shapes/types, unique IDs, cross-catalog references, recognized contexts, seven boards with complete printed sets, 11 colonies, MA's 35/35 subsets and SU-01–SU-12 coverage. Invalid data fails the build with file/record diagnostics. Type assertions/import inference alone are insufficient. Source review separately checks rule meanings and citations; no types, catalogs or validator are generated in this revision.

## Live state and projections

| Entity | Fields and invariants |
| --- | --- |
| Session | Committed Configuration, current view, PublicSelections and transient UI/confirmation state, owned by one application-lifetime Composition API composable using Vue built-in reactivity. |
| PublicSelections | Optional board, first-player number, colony set, MA milestone/award rows; missing applicable values need generation. |
| ObjectiveRow | Stable row position, MA reference or empty slot, locked flag. Five rows per kind when generated; empty rows cannot be locked. |
| PendingEdit | Proposed normalized configuration/direct board change, calculated losses and reason for confirmation; no mutation of committed state. |
| SetupProjection | Derived instructions, effective objectives, limitations, alternatives and summary. |
| SelectionConflict | Failed count/pool context and explanation with return-to-configuration option; no fabricated component. |

Manual MA choice auto-locks that row. Board/first-player/colony manual selections are retained results with explicit reroll, without introducing colony lock tables. Printed/fixed objectives are derived and have no MA replacement controls.

The composable survives all three view changes; components do not recreate or independently own game state. It submits plain-data snapshots/actions to Vue-independent domain functions and commits returned state only after required confirmation. Read-only reactive projections may derive display data, but computed values, watchers and view mounts do not draw randomness or perform destructive transitions. No Pinia, Vue Router, database or persistence is required; an additional state/router library needs a concrete requirement.

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
