# speckit-clarify — second pass, 2026-11-10

Prerequisites resolved current branch 001-guided-game-setup and specs/001-guided-game-setup/spec.md. Constitution v1.0.0 reviewed. No extension hooks registered (extensions.yml absent). No answers accepted in this pass yet; specification still draft. No planning, code, tests, commits or PRs.

Coverage scan: Functional scope Partial (exact public automation/candidate catalog); Domain/state Partial (other edits and lock transitions); Interaction Partial (draw timing and change handling); Non-functional Partial (v1 recovery explicitly excluded, device/accessibility expectations absent); External dependencies Partial (historical rules inventory unfinished, no service dependency established); Edge cases Partial (locks invalidated by configuration, insufficient pools); Constraints Clear; Terminology Partial (variants versus enabled gameplay mechanics); Completion signals Partial (generic rules coverage criteria lack consolidated evidence); Placeholders Partial.

Confirmed decisions must not be re-asked: Prelude 2 re-enables Prelude, select-none turns both off, no v1 recovery, reset confirms and restores all-on, empty/disabled boards fall back to Tharsis, expansion removal selectively clears state after confirmation, manual public overrides permitted, locked milestone/award entries survive rerolls, private setup guided only.

Material remaining behaviors: selective invalidation for adding content/player count/board/variant edits; manual selection lock behavior; exactly which public setup decisions are randomized (e.g. public Turmoil draws versus physically shuffled hidden deck); final variant catalog/prerequisites; draw timing and progress/navigation semantics. Up to five questions will be asked one at a time, prioritizing state correctness and user effort. Low-risk unspecified presentation details do not warrant formal questions.

Author work, not questions for the user: finish the historical campaign component inventory, source-backed setup ordering and official rule overlays; eliminate stale proposed labels for confirmed decisions; replace generic acceptance references with concrete quantities/eligibility and make progress scenarios observable. Prior wording of the checklist notes reflects history, not current unresolved decisions; skill permits only checkbox marker changes in this pass, so notes are not rewritten here. Initial checklist remains 9/18, unchanged; broad completeness items still fail. Do not claim the spec is ready based only on reduced question count.


## Question 1 accepted — tentative v1
All configuration changes use selective clearing after confirmation, preserving unaffected state. User explicitly characterized this as tentative and likely to change in v2. Updated FR-022, FR-016, edge cases, acceptance scenarios, and clarification log to remove now-stale unresolved edit behavior. Full dependency mapping is still rules/evidence work. Questions asked/answered this pass: 1/1. Checklist re-evaluated: 9/18 → 9/18; no newly passing or regressed checkbox items. Full approval, complete concrete acceptance coverage, rules evidence, and remaining behavior gaps still prevent readiness.


## Question 2 accepted
Manual milestone/award selection locks its row automatically. Locked rows sort first; lower-row options exclude higher-row selections. No duplicates within each milestone/award set, including rerolled unlocked values. FR-020, entity description and acceptance scenarios updated. A new upper-row manual value may already exist in a lower unlocked row; this requires one collision-resolution answer rather than guessing how the lower result changes. Questions asked/answered this pass: 2/2. Checklist remains 9/18; no marker changes.


## Question 3 withdrawn as redundant; question 2 clarified
User reiterated the directional filtering rule: every selection change immediately updates all lower drop-downs, excluding every higher selection regardless of manual/random origin and lock status. Locked-first sorting may wait until Reroll. Removed the unnecessary collision-resolution question from draft unresolved behavior; did not adopt automatic collateral rerolls, clearing a row, or symmetric filtering as a separate policy. Updated FR-020, scenarios, entity wording and clarification log. Questions presented this pass: 3, of which question 3 was redundant; two substantive answers plus a correction integrated. Checklist remains 9/18 with no changes; full rules coverage and other substantive gaps still prevent approval.


## User correction supersedes directional filtering
No sorting is necessary. Every drop-down excludes values selected in all other rows of the same milestone/award table, above or below, immediately after every selection. Its own current selection remains displayed. Manual selections still lock; rerolls preserve locked values and return a unique unlocked set. Replaced directional/locked-first requirements, entity description, acceptance scenarios, and clarification answers in the current spec. Earlier notes in this working review are historical and superseded. No further clarification needed on this rule. Checklist remains 9/18 with no marker changes.


## Question 4 accepted
User chose B: automate boards, colonies, milestones, awards, and first-player selection as a number only. Exclude all standard card decks used during play from digital shuffling/drawing, including publicly revealed Turmoil events. Complete physical guidance remains mandatory. Updated FR-003/024/025, clarification log and acceptance scenarios. This is an explicit first-player rule override. Questions presented: 4 (one redundant question corrected); no more than one additional question in this pass. Checklist remains 9/18; remaining catalog/behavior/evidence and approval gaps prevent completion.


## Question 5 response and follow-up
Include research drafting alongside Extended Start; no setup automation changes. A possible v2 gameplay/turn-order walkthrough is future context only. Integrated FR-026, acceptance prose, variant descriptions and clarification log. User then asked whether WGT is an option; answer with official standard/longer-game distinction, without counting this as approval to include the toggle. Five questions presented in this pass (including one redundant question corrected), so do not start a sixth formal clarification question. Remaining material ambiguities should be reported as deferred at pass completion. Checklist remains 9/18 with no checkbox marker changes.


## WGT follow-up resolved by user
Include WGT as a variant setting and assume WGT enabled when Venus Next is in play. This is a specific default exception to any earlier blanket variant-default interpretation. User's confusion was with Turmoil TR revision; WGT and TR revision remain distinct and independently applicable. Added FR-027/028 and concrete acceptance scenarios; removed WGT-under-discussion text. No WGT gameplay automation or turn-order walkthrough added. Checklist remains 9/18 with no marker changes; full evidence, remaining state semantics and explicit approval still incomplete.
