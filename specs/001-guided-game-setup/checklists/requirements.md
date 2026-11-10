# Specification Quality Checklist: Guided Game Setup

**Purpose:** assess the consolidated draft for human review and later approval.  
**Reviewed:** 2026-11-10  
**Feature:** [spec.md](../spec.md)  
**Evidence:** [rules-reference.md](../rules-reference.md)  
**Result:** **15/18 passing**, up from 12/18 after resolving R3. Ready for human review; not yet ready for unconditional approval or planning. This is a document review, not executed application testing.

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

## Changes in this review

R1–R3 are resolved by explicit human decisions. R1 is covered by AC-31–35; R2 by AC-18/36–37. R3 excludes individual card inventories, promo-card identification and card-level release-date tracking. Expansion-based physical deck guidance remains, without app identification, cataloging, filtering or validation of individual cards (AC-17/38). The former promo inventory, historical card-eligibility research and card-level acceptance obligations are removed; D4 is retired.

Newly passing: all acceptance scenarios defined, clearly bounded scope, and functional-requirement acceptance mapping. The packet now contains 38 concrete conditions and mappings for FR-001–FR-028. Proposed defaults have explicit behaviors and acceptance references; those references do not mean the user has accepted the proposals. SU-01–SU-12 remains the source-backed physical sequence, subject to the explicit scope decisions. No regressions.

Obsolete requirements removed: single configuration page, completion checkboxes/manual step progress, sorting locked rows, directional duplicate filtering, expansion-source corporation quotas, automation of standard-card draws, the Big Box-era content cutoff, exhaustive promo-card inventories and card-level release-history certification. Confirmed decisions are not being reopened.

## Why three items remain incomplete

| Incomplete item | Exact reason / closure condition |
| --- | --- |
| Fully testable and unambiguous requirements | Settled behavior and the remaining proposals have concrete observable conditions, but D1–D3 and D5–D7 still require acceptance or amendment to establish the final behavior. D4 is retired by R3. No R1–R3 ambiguity remains. |
| Measurable outcomes agreed | SC-001–SC-005 are measurable correctness outcomes, but the consolidated outcomes/defaults have not been explicitly accepted as the full specification. No arbitrary timing/adoption metric is required merely to fill a template. |
| Requirements approved | No full-spec approval received. Tentative v1 selective clearing and all-visible instruction layout remain tentative. Resolve the remaining proposed defaults and explicitly approve the complete requirements before planning. |

“No clarification markers remain” is a formatting fact, not a claim of full approval. R1–R3 are labeled resolved product decisions; the remaining proposed defaults and tentative behaviors remain visible for review.

## Evidence and limits

The core setup sources, three map families and Milestones & Awards provide the retained setup evidence. Individual promo-card inventories and release histories are outside the approved v1 scope. The inventory enumerates seven boards, seven printed objective pairs, 11 colonies and 70 replacement objectives, plus the physical setup families/counts. Official rules establish the ordered setup coverage and Venus/Turmoil objective precedence. A publisher-authored base rulebook mirror supplies complete setup and component counts; the complete MA publisher index is Swedish with English-name cross-checking.

R3 removes any obligation to reconstruct a historical card-level add-on manifest: the campaign boundary applies generally to supported expansions/setup components, not individual promotional cards. Aggregate package counts are source context, not an app card inventory or validation requirement. The optional Venus sheet establishes that the longer board is official; the user deliberately excludes it from v1 because it adds no meaningful setup-assistant functionality and conflicts with all-on defaults. Standard Venus support remains, and no longer-board usage-rule investigation is required for v1. The user resolved the printed-objective conflict through an intentional product decision: retain complete printed sets and maps, identify unattainable objectives and missing expansions, and do not replace objectives or enable expansions. This policy is distinguished from official rules.

No plans, task breakdowns, application code or executable tests were produced. Documentation commits and draft PR #4 are authorized; full requirements approval remains pending. No UI has been rendered; busyness/usability of the tentative ordered-list layout is not claimed to be validated.
