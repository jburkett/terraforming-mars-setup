# speckit-clarify — fourth pass, 2026-11-10

Prerequisites checked once; active spec specs/001-guided-game-setup/spec.md, branch 001-guided-game-setup. Constitution v1.0.0 reviewed. No extensions.yml, hence no before/after hooks. Current checklist 10/18; no marker changes at review start. Full specification unapproved. No planning, implementation, tests, commits or PRs.

Internal coverage scan: Scope Clear except component inventory verification; Domain Partial (step completion lifecycle); Interaction Partial (how the setup page guides/checks off steps); Quality Partial (recoverability excluded, other targets absent); External/rules evidence Partial; Edge cases Partial (insufficient eligible candidates); Constraints Clear; Terminology Partial (stale generic clauses); Completion Partial (full coverage criteria lack complete consolidated rules evidence); Misc Partial (stale unresolved narratives).

Do not reopen confirmed randomization timing, dependency rules, defaults, state clearing, reset, board fallback, physical-card boundary, symmetric uniqueness, no sorting, locked rerolls, variant selection or WGT-vs-Turmoil distinction.

Highest-impact remaining user decision: setup-page interaction/progress. A single p3 “setup page” with public results has been approved, but draft FR-004 only distinguishes complete/incomplete and story 3 assumes a recording action without defining it. An all-visible checklist versus sequential step presentation changes the observable experience materially. Ask one question; do not invent a mandatory wizard or automatic completion.

Remaining author work must not become repeated questions: consolidate rules sequence/dependency inventory, official overlay precedence and campaign components; define source-backed fixed quantities, eliminate generic “agreed eligibility” clauses and normalize “Do it for me” vs random-by-default. Initial count and repeat-possible random rerolls can be presented as low-risk assumptions for final review instead of demanding separate answers. Extended Start applicability without Prelude remains explicit unresolved behavior; do not silently set that prerequisite. Official optional Venus board still requires evidence reconciliation.


## Question 1 answered
User tentatively accepts all-visible ordered instructions, explicitly rejects checkboxes. Remove the old proposed manual-completion/progress interaction instead of adding alternative progress UI. Updated FR-004, story 3 and acceptance/state references. Results/locks still persist within the live session; no recovery added. The all-visible presentation remains tentative pending visual busyness review; no UI implementation or screenshot was produced. Earlier log references to progress are historical, not a continuing step-completion requirement. Checklist remains 10/18; unfinished evidence and behavior still prevent full readiness.


## Subsequent availability clarification resolved
User chose A: Extended Start stays available without Prelude, deals three corporations and no Preludes, and does not enable Prelude/Prelude 2. Updated FR-017, a concrete acceptance scenario, entity catalog wording and clarification log. Rules-source reconciliation and author cleanup remain; full specification still unapproved. No planning/code/tests/commit/PR. Checklist stays 10/18 because no broad incomplete item is fully resolved by this one answer.
