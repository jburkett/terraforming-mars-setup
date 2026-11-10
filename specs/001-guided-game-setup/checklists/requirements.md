# Specification Quality Checklist: Guided Game Setup

**Purpose:** assess the consolidated draft for human review and later approval.  
**Reviewed:** 2026-11-10  
**Feature:** [spec.md](../spec.md)  
**Evidence:** [rules-reference.md](../rules-reference.md)  
**Result:** **16/18 passing**, after defaults approval and the final WGT scope exclusion. Ready for explicit human approval review; not approved and no later phase authorized. This is a document review, not executed application testing.

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No clarification markers remain
- [x] Requirements are fully testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [ ] Measurable outcomes agreed by the user
- [x] No implementation details leak into specification
- [x] Existing ratified constitution reviewed and draft aligned
- [ ] Requirements explicitly approved by user

## Final requirements-quality review

The user approved D1–D7 as documented: D1–D3 and D5–D7 are active approved decisions; D4 remains retired under R3. R1–R3 remain resolved. No individual-card research or optional-longer-board obligation is reopened.

The final review identified a WGT state-restoration ambiguity (F1). The user resolved it by excluding WGT configuration, tracking and guidance from v1 as immaterial to setup. AC-39 covers the exclusion; FR-027/028 are retired rather than renumbered. The packet contains 26 active requirements, two retired identifiers and 39 concrete acceptance conditions. Existing mappings are updated for the remaining two variants.

Two editorial inconsistencies were corrected: AC-26 no longer assumes colony locks beyond approved D5, and SU-06 prepares P2 discard piles before SU-09 uses them, with SU-10 as a reminder. No new scope or product behavior was inferred. Reviewed expansion compatibility, printed/replacement objective boundaries, instruction ordering, configuration state changes, randomness/defaults, summary consistency and the limits of automation against the recorded decisions.

Newly passing: requirements are fully testable and unambiguous at this review's document level. No unresolved material contradiction or acceptance gap was identified after these corrections. The complete document is still a draft; this assessment is not a declaration of full approval or exhaustive correctness.

## Why two items remain incomplete

| Incomplete item | Exact reason / closure condition |
| --- | --- |
| Measurable outcomes agreed | SC-001–SC-005 are measurable correctness outcomes; the user approved the defaults, not these consolidated outcomes as part of the complete specification. Explicit acceptance is outstanding. No application testing is claimed or required during this requirements review. |
| Requirements approved | No full-spec approval received. Explicit human approval must include the complete packet and the tentative v1 presentation/selective-clearing behavior before any later phase. |

## Low-risk limits for human review

The all-visible instruction presentation and selective clearing remain explicit tentative v1 choices, with later usability review and possible v2 revision. No rendered-layout validation is claimed. Story priorities are advisory review labels, not an approved implementation order. D5 leaves exact colony visual arrangement open while fixing observable count/uniqueness and customization behavior; no additional lock system is assumed. These limits do not introduce unresolved behavior that blocks approval in this document review.

## Evidence and limits

The core setup sources, three map families and Milestones & Awards provide the retained setup evidence. Individual promo-card inventories and release histories are outside the approved v1 scope. The inventory enumerates seven boards, seven printed objective pairs, 11 colonies and 70 replacement objectives, plus the physical setup families/counts. Official rules establish the ordered setup coverage and Venus/Turmoil objective precedence. A publisher-authored base rulebook mirror supplies complete setup and component counts; the complete MA publisher index is Swedish with English-name cross-checking.

R3 removes any obligation to reconstruct a historical card-level add-on manifest: the campaign boundary applies generally to supported expansions/setup components, not individual promotional cards. Aggregate package counts are source context, not an app card inventory or validation requirement. The optional Venus sheet establishes that the longer board is official; the user deliberately excludes it from v1 because it adds no meaningful setup-assistant functionality and conflicts with all-on defaults. Standard Venus support remains, and no longer-board usage-rule investigation is required for v1. The user resolved the printed-objective conflict through an intentional product decision: retain complete printed sets and maps, identify unattainable objectives and missing expansions, and do not replace objectives or enable expansions. This policy is distinguished from official rules.

No plans, task breakdowns, application code or executable tests were produced. Documentation commits and draft PR #4 are authorized; full requirements approval remains pending. No UI has been rendered; busyness/usability of the tentative ordered-list layout is not claimed to be validated.
