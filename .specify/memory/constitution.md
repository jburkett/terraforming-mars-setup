<!--
Sync Impact Report
Version: unratified template -> 1.0.0 (initial adoption)
Modified principles: template placeholders replaced by I–VI below.
Added sections: Scope and Interpretation; Development and Review.
Removed sections: none.
Dependent templates: reviewed; unchanged. Constitution governs generic optional-test wording.
Follow-up TODOs: none.
Remove this temporary report before committing.
-->
# terraforming-mars-setup Constitution

## Core Principles

### I. Simplicity

Solutions MUST use the simplest approach that meets approved requirements. Added abstractions,
dependencies, or infrastructure MUST have a documented technical need; speculative needs do not
justify complexity.

### II. Separation of Concerns

Domain logic MUST remain independent of presentation and infrastructure. Architecture MUST be
proportionate to the project's size and needs; separation MUST NOT require unnecessary layers or
services.

### III. Test-Driven Development

Behavioral tests MUST be derived from human-approved requirements and written before the
corresponding implementation. Tests MUST demonstrate failure for the missing behavior before
implementation and pass afterward. Tests MUST favor observable behavior over implementation
details so refactoring does not invalidate correct behavior.

### IV. Code Quality

Code MUST be readable, maintainable, and strongly typed. Automated formatting, linting, type
checking, and relevant behavioral tests MUST verify changes and pass before merge. Review MUST
address clarity and maintainability beyond what automated checks can establish.

### V. Human Authority

AI MAY identify ambiguities and propose changes. Substantive requirements and architectural
decisions MUST receive explicit human approval before implementation; AI MUST NOT treat its own
assumptions or proposals as approval. Approval MUST be recorded in the relevant specification,
plan, or review discussion.

### VI. Idiomatic Implementation

Implementation MUST follow established conventions of the chosen language and framework.
Patterns imported from other ecosystems MUST have a documented technical justification for
this project.

## Scope and Interpretation

This constitution governs project decisions and development practices. Application requirements
MUST be defined in approved specifications; technical designs MUST be defined in approved plans.
Neither may be inferred from template examples or from this constitution. Tool and workflow
choices MUST comply with these principles without requiring a particular AI agent or experimental
testing workflow.

## Development and Review

Before implementation, review MUST confirm approved requirements, approval of substantive
architectural decisions, and behavioral tests covering the intended change. Before merge, review
MUST confirm compliance with all six principles and successful automated verification. Any
noncompliance MUST be resolved or addressed through a human-approved constitutional amendment.

## Governance

This constitution takes precedence over conflicting project guidance and template defaults,
including any wording that makes required behavioral tests optional. Specifications, plans, tasks,
and reviews MUST apply its rules.

Amendments MUST document the proposed change, rationale, and any effect on existing work, receive
explicit human approval, and update affected guidance. Versions MUST follow semantic versioning:
MAJOR for incompatible principle or governance changes, MINOR for additions or material expansions,
and PATCH for clarifications that do not change obligations. Each amendment MUST update the
version and last-amended date while preserving the original ratification date.

**Version**: 1.0.0 | **Ratified**: 2026-11-10 | **Last Amended**: 2026-11-10
