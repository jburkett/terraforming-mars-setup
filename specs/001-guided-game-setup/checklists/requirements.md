# Specification Quality Checklist: Guided Game Setup

**Purpose:** assess the consolidated draft for human review and later approval.  
**Reviewed:** 2026-11-10  
**Feature:** [spec.md](../spec.md)  
**Evidence:** [rules-reference.md](../rules-reference.md)  
**Result:** **12/18 passing**, up from 10/18. Ready for human review; not yet ready for unconditional approval or planning. This is a document review, not executed application testing.

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No clarification markers remain
- [ ] Requirements are fully testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic
- [ ] All acceptance scenarios are defined
- [x] Edge cases are identified
- [ ] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [ ] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [ ] Measurable outcomes agreed by the user
- [x] No implementation details leak into specification
- [x] Existing ratified constitution reviewed and draft aligned
- [ ] Requirements explicitly approved by user

## Changes in this review

Newly passing: measurable success criteria and concrete primary-flow coverage. No regressions. Replaced generic conditions with 30 concrete conditions across configuration, public randomization/customization, physical guidance/summary, and selective state changes. The requirement-to-acceptance table covers FR-001–FR-028; SU-01–SU-12 supplies a source-backed sequence rather than an undefined promise of “all applicable rules.”

Obsolete requirements removed: single configuration page, completion checkboxes/manual step progress, sorting locked rows, directional duplicate filtering, expansion-source corporation quotas, undefined automation of public card draws, and the Big Box-era content cutoff. Confirmed decisions are not being reopened by this checklist.

## Why six items remain incomplete

| Incomplete item | Exact reason / closure condition |
| --- | --- |
| Fully testable and unambiguous requirements | R1 leaves filtering of unavailable printed milestones unresolved; R2 leaves optional longer Venus-board behavior unresolved. D1–D7 are explicit proposals rather than silently approved defaults. Resolve/accept and update requirements. |
| All acceptance scenarios defined | AC-10/18 identify the missing printed-objective/optional-board cases; complete those branches after R1/R2. Add the final historical eligibility cases after R3. Existing settled-behavior conditions are concrete. |
| Clearly bounded scope | Expansion/map cutoff and exclusions are clear, but exact inclusion of 2023 seasonal cards is not certified from accessible primary historical evidence. Resolve R3 or approve an explicit interpretation; do not silently include all later seasonal releases. |
| Every functional requirement has clear acceptance criteria | FR-001/012 retain the material inventory/filtering uncertainties. Other IDs have explicit acceptance references; those references do not falsely resolve R1–R3. |
| Measurable outcomes agreed | SC-001–SC-005 are now measurable correctness outcomes, but the consolidated outcomes/defaults have not been explicitly accepted as the full specification. No arbitrary timing/adoption metric is required merely to fill a template. |
| Requirements approved | No full-spec approval received. Tentative v1 selective clearing and all-visible instruction layout are retained as tentative, not promoted to final approval. |

“No clarification markers remain” is a formatting fact, not a claim that no decisions remain: R1–R3 are clearly labeled review issues. The missing matters are deliberately visible rather than hidden in assumptions.

## Evidence and limits

All eight core setup sources, the three map families, Milestones & Awards, and identified promo families were reviewed. The inventory enumerates seven boards, seven printed objective pairs, 11 colonies and 70 replacement objectives, plus the physical setup families/counts. Official rules establish the ordered setup coverage and Venus/Turmoil objective precedence. A publisher-authored base rulebook mirror supplies complete setup and component counts; the complete MA publisher index is Swedish with English-name cross-checking.

Primary campaign text does not expose its full historical add-on manifest; R3 records this limit. The optional Venus sheet establishes existence of the longer board but not an approved application default. The printed-objective conflict is a product interpretation the agent must not resolve by inventing replacement rules.

No plans, task breakdowns, application code, executable tests, commits or PRs were produced. No UI has been rendered; busyness/usability of the tentative ordered-list layout is not claimed to be validated.
