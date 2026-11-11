# Planning Research: Guided Game Setup

**Date:** 2026-11-11. **Status:** Proposed architectural decisions for human review, not approval.

Evidence: [spec.md](spec.md), [rules-reference.md](rules-reference.md), constitution v1.0.0, installed Spec Kit helpers and a read-only research-agent assessment. This is design synthesis of approved evidence, not new primary-source verification or application measurement.

## R-01 — Stack and tooling

**Decision:** Propose strict TypeScript 5.x, native semantic HTML/CSS and Vite, without a runtime UI framework. Propose Vitest, Playwright, ESLint and Prettier for distinct verification needs. Node 24 LTS is the proposed development runtime; pin compatible exact maintained versions and the lockfile during later authorized setup.

**Rationale:** Three views and small finite pools need no server, database, router or state library. Strong typing and automated verification follow the constitution. No package installation is needed to review this design.

**Alternatives considered:** React offers component conventions but is not necessary at this size; a server adds unsupported infrastructure; raw JavaScript omits static typing. Revisit a framework only for a concrete maintenance need and human approval. Exact package patches are later setup details, not product clarifications.

## R-02 — State and projections

**Decision:** One in-memory session holds configuration, generated public results, objective locks and transient UI state. Derive instructions, alternatives, limitations and summary through domain functions independent of the DOM.

**Rationale:** Supports live Back navigation without introducing recovery; derived summary cannot drift from results.

**Alternatives considered:** Persistence introduces excluded recovery behavior; duplicated projections risk stale content; a state library is disproportionate. No physical card or step-completion state is needed.

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

## R-06 — Sourced instructions

**Decision:** Typed static definitions carry SU IDs, applicability, quantities, ordering and source references. Product overrides are labeled separately from official rules. Preserve SU-06 preparation before SU-09 discards; SU-10 remains a reminder.

**Rationale:** SC-001 requires complete applicable instruction coverage and traceability. Physical deck preparation uses expansion/rules guidance without digital card handling.

**Alternatives considered:** Runtime scraping adds availability/provenance problems; rules copied into UI handlers can conflict; card inventories/effect execution reopen R3 exclusions. Existing evidence is a starting source, not proof of unimplemented catalog correctness.

## R-07 — Verification and approval

**Decision:** Later tests derive from AC-01–39 and SC-001–005. Validate catalogs against evidence; use deterministic domain checks and observable browser journeys, with failing tests before implementation. Run formatting/lint/types/relevant tests before merge.

**Rationale:** Meets constitution III–V without treating document approval as application validation. Human visual review must still assess all-visible-list busyness and confirmation clarity.

**Alternatives considered:** Internal-shape tests constrain refactoring without proving behavior; statistical random tests are flaky and cannot establish algorithm correctness. No performance target is invented.

Technical questions have proposed resolutions; none requires regenerating requirements. Human architectural approval remains a later implementation gate.
