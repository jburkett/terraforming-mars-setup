# Specification Quality Checklist: Guided Game Setup

**Purpose:** assess the consolidated draft for human review and later approval.  
**Reviewed:** 2026-11-10  
**Feature:** [spec.md](../spec.md)  
**Evidence:** [rules-reference.md](../rules-reference.md)  
**Result:** **12/18 passing**, unchanged after resolving R1 and R2. Ready for human review; not yet ready for unconditional approval or planning. This is a document review, not executed application testing.

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

R1 is resolved by explicit human decision, with concrete AC-31–35 for complete printed sets, limitation notices, map availability, expansion edits and the MA-filtering boundary. R2 is resolved as a deliberate exclusion of the official longer Venus board, with AC-36–37 covering standard-board guidance and the exclusion from application choices/defaults. No aggregate checklist item changes status: R3, proposed defaults and full approval still block the same six items. No regressions. The consolidated packet now contains 37 concrete conditions across configuration, public randomization/customization, physical guidance/summary, and selective state changes. The requirement-to-acceptance table covers FR-001–FR-028; SU-01–SU-12 supplies a source-backed sequence rather than an undefined promise of “all applicable rules.”

Obsolete requirements removed: single configuration page, completion checkboxes/manual step progress, sorting locked rows, directional duplicate filtering, expansion-source corporation quotas, undefined automation of public card draws, and the Big Box-era content cutoff. Confirmed decisions are not being reopened by this checklist.

## Why six items remain incomplete

| Incomplete item | Exact reason / closure condition |
| --- | --- |
| Fully testable and unambiguous requirements | R1 printed-objective behavior and the R2 longer-Venus-board exclusion are resolved and testable; R3 still leaves historical card inclusion unresolved. D1–D7 are explicit proposals rather than silently approved defaults. Resolve/accept and update requirements. |
| All acceptance scenarios defined | AC-31–35 complete the R1 printed-objective cases; AC-18/36–37 complete the R2 standard-board and exclusion cases. Add the final historical eligibility cases after R3. Existing settled-behavior conditions are concrete. |
| Clearly bounded scope | Expansion/map cutoff and exclusions are clear, but exact inclusion of 2023 seasonal cards is not certified from accessible primary historical evidence. Resolve R3 or approve an explicit interpretation; do not silently include all later seasonal releases. |
| Every functional requirement has clear acceptance criteria | FR-001 retains the R3 inventory uncertainty, affecting physical deck guidance under FR-002/008. R1 has concrete coverage in AC-31–35 and R2 in AC-18/36–37. Other IDs have explicit acceptance references; those references do not falsely resolve R3. |
| Measurable outcomes agreed | SC-001–SC-005 are now measurable correctness outcomes, but the consolidated outcomes/defaults have not been explicitly accepted as the full specification. No arbitrary timing/adoption metric is required merely to fill a template. |
| Requirements approved | No full-spec approval received. Tentative v1 selective clearing and all-visible instruction layout are retained as tentative, not promoted to final approval. |

“No clarification markers remain” is a formatting fact, not a claim that no decisions remain: R1 and R2 are labeled resolved product decisions; R3 is a clearly labeled review issue. The missing matters are deliberately visible rather than hidden in assumptions.

## Evidence and limits

All eight core setup sources, the three map families, Milestones & Awards, and identified promo families were reviewed. The inventory enumerates seven boards, seven printed objective pairs, 11 colonies and 70 replacement objectives, plus the physical setup families/counts. Official rules establish the ordered setup coverage and Venus/Turmoil objective precedence. A publisher-authored base rulebook mirror supplies complete setup and component counts; the complete MA publisher index is Swedish with English-name cross-checking.

Primary campaign text does not expose its full historical add-on manifest; R3 records this limit. The optional Venus sheet establishes that the longer board is official; the user deliberately excludes it from v1 because it adds no meaningful setup-assistant functionality and conflicts with all-on defaults. Standard Venus support remains, and no longer-board usage-rule investigation is required for v1. The user resolved the printed-objective conflict through an intentional product decision: retain complete printed sets and maps, identify unattainable objectives and missing expansions, and do not replace objectives or enable expansions. This policy is distinguished from official rules.

No plans, task breakdowns, application code or executable tests were produced. Documentation commits and draft PR #4 are authorized; full requirements approval remains pending. No UI has been rendered; busyness/usability of the tentative ordered-list layout is not claimed to be validated.
