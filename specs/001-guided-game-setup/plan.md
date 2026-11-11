# Implementation Plan: Guided Game Setup

**Git branch:** `feature/001-guided-game-setup` | **Spec Kit feature:** `001-guided-game-setup` | **Date:** 2026-11-11

**Input:** [approved spec](spec.md), [rules evidence](rules-reference.md), constitution v1.0.0.

**Status:** Proposed architecture and design for human review. Planning only; no tasks, code or executable tests generated. Architectural approval and implementation authorization remain outstanding.

## Summary

Provide three browser views for configuring a physical 2–5-player game, customizing public selections and reading all applicable SU-01–SU-12 instructions and summary. Use Vue 3, TypeScript, Vite and the Composition API for a client-side SPA. Vue's built-in reactivity retains in-memory session state across views; domain logic remains independent of Vue. Load static game data from build-validated JSON catalogs under `src/content/`. Automate only board, first-player number, colonies and objectives. Preserve R1–R3, approved defaults and WGT exclusion.

## Feature context

The existing feature is `001-guided-game-setup`, with approved requirements in [spec.md](spec.md) and an 18/18 requirements checklist. Spec Kit selects `specs/001-guided-game-setup` through ignored local `.specify/feature.json`; the Git branch is `feature/001-guided-game-setup`.

This revision incorporates the user's requested architectural direction. The revised technical plan as a whole remains subject to explicit human approval; task generation, tests and implementation are outside this revision's scope.

## Technical Context

**Language/Version:** Vue 3 with the Composition API, TypeScript 5.x with strict checking, semantic HTML and CSS; compatible maintained exact dependency versions pinned during later implementation setup.

**Primary Dependencies:** Vue 3, Vite and its Vue integration. Use built-in Vue reactivity; no Pinia or Vue Router unless a concrete requirement justifies introducing them. No backend.

**Static Data:** JSON files under `src/content/` for boards, expansions, colonies, milestones, awards and setup instructions. TypeScript types define their schemas; a build-time validator checks actual JSON values and cross-catalog references before Vite emits the application. Eligibility rules, selection algorithms and state transitions remain TypeScript domain logic, not executable JSON.

**Storage:** Browser memory only; no database, cookies, local/session storage or recovery mechanism.

**Testing:** Proposed Vitest for domain behavior and Playwright for browser journeys. ESLint, Prettier and TypeScript/Vue type checking support verification; catalog validation is a required build gate. No tests or validation implementation are generated in this revision.

**Target Platform:** Standard browser DOM APIs; Chromium/Firefox/WebKit validation proposed as engineering coverage, not an added compatibility promise.

**Project Type:** One client-side SPA distributed as static assets.

**Performance Goals:** No numerical performance or setup-time target is approved. Evaluate correctness against SC-001–SC-005; do not randomize during rendering.

**Constraints:** Seven maps, 11 colonies, 35/35 replacement objectives, source-specific printed sets and fixed Venus pair. No digital cards, WGT, longer Venus choice, recovery or progress tracking.

**Scale/Scope:** One session, 2–5 players, three views and small finite pools. No accounts, exports, sharing or network integration.

## Constitution Check

Evaluated before research and rechecked after design against constitution v1.0.0. Pass for planning does not authorize implementation.

| Principle | Pre-research gate | Post-design assessment |
| --- | --- | --- |
| I. Simplicity | Smallest solution meeting approved scope. | Pass: one Vue SPA, built-in reactivity and bounded JSON catalogs; no Pinia, router, backend or persistence without demonstrated need. |
| II. Separation | Domain independent of presentation/infrastructure. | Pass: framework-independent TypeScript transitions/projections, static JSON data and separate Vue presentation/state integration. |
| III. TDD | Approved ACs govern later behavioral tests. | Pass for planning: validation guide only. Later tests must demonstrate missing behavior before corresponding code. |
| IV. Quality | Strong typing and automated checks required later. | Pass for planning: strict TypeScript/Vue checks, build-time catalog validation, formatting, lint and relevant behavioral checks proposed; no application execution claims. |
| V. Human Authority | Requirements approved; planning newly authorized. | Pass: architecture explicitly proposed, no requirements changes. Explicit architectural approval remains required before implementation. |
| VI. Idiomatic practice | Proportionate language/browser conventions. | Pass: Vue Composition API, built-in reactivity and semantic controls, with plain TypeScript domain modules. |

No constitutional exception or amendment is proposed. The implementation gate remains closed pending architectural approval and separate authorization.

## Phase 0: Research

[research.md](research.md) records the requested architectural direction and remaining design proposals, with rationale and alternatives. Evidence comprises the approved requirements, current user direction and repository documents. No card inventory, new feature or requirements investigation was introduced.

## Phase 1: Design

[data-model.md](data-model.md) defines entities and transitions; [contracts/ui.md](contracts/ui.md) defines the exposed browser interface; [quickstart.md](quickstart.md) defines future validation commands and scenarios.

Configuration edits normalize dependencies, compute losses, then commit or cancel atomically after required confirmation. Setup entry fills only missing results, resolving the board first. Preserve valid rows and locks. Printed sets are not filtered through MA eligibility. Instructions and summary derive from committed state. Contextual thresholds and source identities remain distinct; physical card effects stay physical.

An application-level Composition API composable owns reactive configuration, generated selections and view state for the lifetime of the SPA. Switching views does not recreate that session. Vue components submit explicit actions to the composable; it passes plain data to framework-independent domain functions and commits their results. Reactive projections are read-only computations; watchers, renders and component mounts must not trigger random draws or destructive edits. No Vue imports or reactive proxies are required by the domain API. Static catalogs are read-only inputs, separate from mutable session state.

The JSON catalogs contain descriptive values, identifiers, references and source citations. TypeScript owns interpretation of prerequisites, context-specific thresholds, instruction applicability/quantities, selection and transitions. Catalog validation checks shape/types, unique IDs, references, required inventory counts and recognized rule/context identifiers; errors identify the file/record and fail the build. Type assertions or JSON import inference alone do not validate catalog contents. Human rules review remains necessary for semantic correctness.

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
├── domain/       # Vue-independent TypeScript configuration, rules, selection, transitions
├── content/      # boards.json, expansions.json, colonies.json, milestones.json,
│                 # awards.json, instructions.json; TypeScript catalog types
├── composables/  # Application-lifetime reactive session and domain integration
├── ui/           # Vue views/components and confirmation presentation
├── App.vue       # Three-view SPA shell; no router required
└── main.ts       # Vue entry and browser random adapter
scripts/          # Proposed TypeScript build-time catalog validator
tests/
├── domain/       # Requirements-derived behavior and catalog invariants
└── browser/      # Observable journeys and instruction coverage
```

**Structure decision:** One Vue SPA with explicit static-data, domain and reactive presentation boundaries. This describes proposed architecture, not implementation tasks. No source folders, JSON catalogs, validator, tests or package manifest were generated.

## Complexity Tracking

No violations identified. Vue 3 and the Composition API provide the requested component model and shared reactivity; Vite builds the SPA. Pinia and Vue Router need a concrete requirement before introduction. TypeScript catalog schemas plus build-time validation protect the data boundary. Vitest/Playwright, type checking, ESLint and Prettier address verification without production services.

## Completion and limits

Phase 0/1 design artifacts drafted for review. No `.specify/extensions.yml` exists, so no before/after planning hooks are registered. No task list, source, executable tests or requirements changes were produced. Application correctness and rendered usability remain untested. The approved tentative all-visible layout and selective clearing remain tentative v1 decisions.
