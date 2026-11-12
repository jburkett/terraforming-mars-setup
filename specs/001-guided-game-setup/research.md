# Planning Research: Guided Game Setup

**Date:** 2026-11-11. **Status:** Supporting architectural decisions approved with the revised technical plan on 2026-11-12; see [plan.md](plan.md) for the approval record.

Evidence: [spec.md](spec.md), [rules-reference.md](rules-reference.md), constitution v1.0.0 and the user's requested Vue/JSON/in-memory architectural direction. This revision supersedes the earlier framework-free proposal. It is design synthesis, not new primary-source verification or application measurement; the revised plan received human approval on 2026-11-12.

## R-01 — Stack and tooling

**Decision:** Use Vue 3, the Composition API, strict TypeScript 5.x and Vite for a client-side SPA with semantic HTML/CSS. Use Vue's built-in reactivity, avoiding Pinia and Vue Router unless a concrete requirement justifies them. Propose Vitest, Playwright, ESLint, Prettier and Vue-aware TypeScript checking for distinct verification needs. Node 24 LTS remains the proposed development runtime; pin compatible exact maintained versions and the lockfile during later authorized setup.

**Rationale:** This follows the user's requested frontend direction. Composition API components and an application-lifetime reactive session serve three views without additional routing/state libraries. Strong typing and automated verification follow the constitution. No package installation is needed to review this design.

**Alternatives considered:** The earlier framework-free approach and React are superseded by the requested Vue direction. Pinia and Vue Router add concepts without a current requirement for stores, URLs or route navigation. A server adds unsupported infrastructure; raw JavaScript omits static typing. Exact package patches remain later setup details.

## R-02 — State and projections

**Decision:** An application-level Composition API composable owns one reactive in-memory session containing configuration, generated results, locks and transient UI/view state. Keep it alive across all three views, separate from read-only JSON catalogs. Domain functions accept/return plain TypeScript data without Vue imports; the composable adapts and commits their results. Derive instructions, alternatives, limitations and summary without mutation or random draws in computed values/watchers/rendering.

**Rationale:** Built-in reactivity supports live Back navigation without persistence or a separate state library. Keeping ownership above the views prevents remounts from resetting the session. Pure domain boundaries permit framework-independent reasoning; derived summaries cannot drift from results.

**Alternatives considered:** Persistence introduces excluded recovery behavior; view-local session ownership loses state on remount; mutable catalogs mix definitions with play state; duplicated projections risk stale content. No database, physical card state or step-completion state is needed.

## R-03 — Atomic edits

**Decision:** Normalize an edit, calculate its affected results/locks, and confirm before destructive commit. Cancellation preserves committed state exactly. Fill only missing results on setup entry, board first. Direct board override on setup reconciles dependent results immediately after required confirmation.

**Rationale:** Implements selective clearing and prevents mutation before cancellation. Bulk select-none is atomic so Prelude 2 cannot re-enable Prelude accidentally. AC-27 clears first player on any player-count change even if the old number is still in range.

**Alternatives considered:** Mutate-and-undo risks stale locks and random consumption; global clearing loses unrelated choices; validity-only first-player retention fails AC-27. Preview must consume no randomness.

## R-04 — Objective identity and precedence

**Decision:** Stable identities include source, kind and board where printed. Context-dependent thresholds are separate from identity. Keep MA rows, printed sets, fixed Venus additions and printed-Tharsis Turmoil overlay distinct. Evaluate all prerequisites, distinguishing required from optional interactions.

**Rationale:** Shared Builder/Tycoon/Merchant names have incompatible versions. R1 keeps printed entries and maps, annotating every disabled prerequisite rather than filtering them. A CE threshold change does not by itself invalidate an identity/lock.

**Alternatives considered:** Name-only lookup conflates versions; one generic filter violates R1; blocking maps contradicts AC-31–35. No individual-card dependencies are modeled.

## R-05 — Selection

**Decision:** Uniform draws; sets sampled without replacement after excluding retained/locked values. Preserve row positions and valid locks; rerolls may repeat old unlocked values. Inject the random source for deterministic later tests; a browser random adapter using bytes must use an unbiased bounded-integer mapping. Generate only missing results, never as a render effect. Failed set generation commits no partial outputs.

**Rationale:** Implements D3, uniqueness and live-session preservation with tiny local pools. D6 supplies the insufficient-pool conflict and configuration-return behavior.

**Alternatives considered:** Random sort is biased; draws with replacement allow duplicates; forced changed rerolls violate approved repeat behavior; remote randomness is unnecessary. Never fabricate components, enable expansions or silently lose locks to resolve failure.

## R-06 — JSON catalogs, schemas and sourced instructions

**Decision:** Store boards, expansions, colonies, milestones, awards and setup instructions in JSON files under `src/content/`. Define catalog schemas with TypeScript types. A TypeScript build-time validator checks actual JSON shapes/types, unique identities, references, recognized rule/context identifiers and required inventory counts before Vite emits assets. Validation failure reports the file/record and stops the build. JSON contains data, text, citations and identifiers only; TypeScript implements eligibility, applicability/quantity interpretation, threshold rules, selection algorithms and state transitions. No expressions, scripts, dynamic evaluation or executable rules are embedded in JSON.

Instruction records retain SU IDs, ordering, source references and descriptive variants/parameters. Product overrides are labeled separately from official rules. Preserve SU-06 preparation before SU-09 discards; SU-10 remains a reminder.

**Rationale:** Separates editable game facts from behavior and mutable state. TypeScript types define the expected data contract, while build validation establishes that actual catalogs satisfy it; casts and import inference alone cannot check cross-file references or completeness. SC-001 still requires human-auditable source coverage. Physical deck preparation remains expansion/rules guidance without digital card handling.

**Alternatives considered:** TypeScript object literals for game catalogs are superseded by the requested JSON storage. Type assertions alone provide no content validation; runtime-only validation discovers errors after distribution. Executable JSON creates a second rule language; runtime scraping adds availability/provenance problems. Card inventories/effect execution reopen R3 exclusions. Structural validation cannot prove rules accuracy; source review is still required. No validator or JSON data is implemented in this planning revision.

## R-07 — Verification and approval

**Decision:** Later tests derive from AC-01–39 and SC-001–005. Validate JSON catalogs against TypeScript-defined schemas during every build and review their meaning against evidence. Use deterministic domain checks and observable Vue SPA journeys, with failing tests before corresponding behavior implementation. Run formatting/lint/Vue type checking/relevant tests and the catalog-gated build before merge. No tests or validation code are generated now.

**Rationale:** Meets constitution III–V without treating document approval as application validation. Human visual review must still assess all-visible-list busyness and confirmation clarity.

**Alternatives considered:** Internal-shape tests constrain refactoring without proving behavior; statistical random tests are flaky and cannot establish algorithm correctness. No performance target is invented.

Technical questions have documented resolutions; none requires regenerating requirements. Human architectural approval is recorded in [plan.md](plan.md); later-phase authorization remains separate.
