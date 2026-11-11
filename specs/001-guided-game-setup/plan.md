# Implementation Plan: Guided Game Setup

**Git branch:** `feature/001-guided-game-setup` | **Spec Kit feature:** `001-guided-game-setup` | **Date:** 2026-11-11

**Input:** [approved spec](spec.md), [rules evidence](rules-reference.md), constitution v1.0.0.

**Status:** Proposed architecture and design for human review. Planning only; no tasks, code or executable tests generated. Architectural approval and implementation authorization remain outstanding.

## Summary

Provide three browser views for configuring a physical 2–5-player game, customizing public selections and reading all applicable SU-01–SU-12 instructions and summary. Propose a static TypeScript application, in-memory session state, pure domain operations, sourced component data and native HTML controls. Automate only board, first-player number, colonies and objectives. Preserve R1–R3, approved defaults and WGT exclusion.

## Checkout and feature context

Fetched origin and fast-forwarded the clean `work` checkout from `2a6f57d` to `aa32fd448b5eebd93b8f7bfa334e1344e40f126a`, PR #4's merge. The planning branch is based on that fetched `origin/main` commit; the approved specification matches that ref exactly. Requirements approval is dated 2026-11-11; checklist 18/18.

This installed Spec Kit resolves explicit feature state independently of Git branch names. Neither setup-plan nor prerequisite checking requires a feature branch. Planning used `SPECIFY_FEATURE=001-guided-game-setup` and `SPECIFY_FEATURE_DIRECTORY=specs/001-guided-game-setup`; setup persisted the latter in ignored `.specify/feature.json`. Its JSON `BRANCH` value is the feature identifier, not the actual Git branch.

At the user's subsequent request, created the working branch from the verified current main commit to commit the planning artifacts for draft review against `main`. The branch was initially named `plan/001-guided-game-setup` and was renamed locally to `feature/001-guided-game-setup`. After the user closed draft PR #5 and deleted its old remote branch, the feature branch was pushed for a replacement draft PR. The same feature pointer/number is retained. No create-new-feature command or requirements regeneration was needed; the merged requirements branch was not resurrected.

The approved packet's earlier statements that planning was unauthorized are historical scope records. The user subsequently authorized planning and submission of these artifacts for draft review; those approved documents remain unchanged. Task generation and implementation remain outside the authorized scope.

## Technical Context

**Language/Version:** Proposed TypeScript 5.x with strict checking, semantic HTML and CSS; compatible maintained exact dependency versions pinned during later implementation setup.

**Primary Dependencies:** Proposed Vite build/dev tooling; no production framework, router, state library or backend.

**Storage:** Browser memory only; no database, cookies, local/session storage or recovery mechanism.

**Testing:** Proposed Vitest for domain/catalog behavior, Playwright for browser journeys, ESLint, Prettier and TypeScript verification.

**Target Platform:** Standard browser DOM APIs; Chromium/Firefox/WebKit validation proposed as engineering coverage, not an added compatibility promise.

**Project Type:** One static web application.

**Performance Goals:** No numerical performance or setup-time target is approved. Evaluate correctness against SC-001–SC-005; do not randomize during rendering.

**Constraints:** Seven maps, 11 colonies, 35/35 replacement objectives, source-specific printed sets and fixed Venus pair. No digital cards, WGT, longer Venus choice, recovery or progress tracking.

**Scale/Scope:** One session, 2–5 players, three views and small finite pools. No accounts, exports, sharing or network integration.

## Constitution Check

Evaluated before research and rechecked after design against constitution v1.0.0. Pass for planning does not authorize implementation.

| Principle | Pre-research gate | Post-design assessment |
| --- | --- | --- |
| I. Simplicity | Smallest solution meeting approved scope. | Pass: one static app, bounded catalogs; tools have build/verification purposes. |
| II. Separation | Domain independent of presentation/infrastructure. | Pass: pure transitions/projections and typed content; DOM/randomness at boundaries. |
| III. TDD | Approved ACs govern later behavioral tests. | Pass for planning: validation guide only. Later tests must demonstrate missing behavior before corresponding code. |
| IV. Quality | Strong typing and automated checks required later. | Pass for planning: strict types, formatting, lint and relevant domain/browser checks proposed; no execution claims. |
| V. Human Authority | Requirements approved; planning newly authorized. | Pass: architecture explicitly proposed, no requirements changes. Explicit architectural approval remains required before implementation. |
| VI. Idiomatic practice | Proportionate language/browser conventions. | Pass: standard TypeScript modules/native controls; no imported enterprise layering. |

No constitutional exception or amendment is proposed. The implementation gate remains closed pending architectural approval and separate authorization.

## Phase 0: Research

[research.md](research.md) resolves technical choices as proposals, with rationale and alternatives. Evidence comprises repository documents/helpers and a read-only research-agent assessment. No card inventory, new feature or requirements investigation was introduced.

## Phase 1: Design

[data-model.md](data-model.md) defines entities and transitions; [contracts/ui.md](contracts/ui.md) defines the exposed browser interface; [quickstart.md](quickstart.md) defines future validation commands and scenarios.

Configuration edits normalize dependencies, compute losses, then commit or cancel atomically after required confirmation. Setup entry fills only missing results, resolving the board first. Preserve valid rows and locks. Printed sets are not filtered through MA eligibility. Instructions and summary derive from committed state. Contextual thresholds and source identities remain distinct; physical card effects stay physical.

## Project Structure

### Documentation (this feature)

```text
specs/001-guided-game-setup/
├── spec.md                         # Approved, unchanged
├── rules-reference.md              # Existing evidence, unchanged
├── review-summary.md               # Existing record, unchanged
├── checklists/requirements.md      # Existing 18/18 review, unchanged
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/ui.md
```

### Proposed source layout (not created)

```text
src/
├── domain/       # Configuration, selection, eligibility, projections
├── content/      # Sourced typed component/instruction definitions
├── ui/           # Three views and confirmation presentation
└── main.ts       # Composition and browser random adapter
tests/
├── domain/       # Requirements-derived behavior and catalog invariants
└── browser/      # Observable journeys and instruction coverage
```

**Structure decision:** One application with domain/content/UI boundaries. This describes proposed architecture, not implementation tasks. No source folders or package manifest were generated.

## Complexity Tracking

No violations identified. Vite handles browser module development/build; Vitest and Playwright cover different behavioral boundaries. TypeScript, ESLint and Prettier address required quality checks without production services.

## Completion and limits

Phase 0/1 design artifacts drafted for review. No `.specify/extensions.yml` exists, so no before/after planning hooks are registered. No task list, source, executable tests or requirements changes were produced. Application correctness and rendered usability remain untested. The approved tentative all-visible layout and selective clearing remain tentative v1 decisions.
