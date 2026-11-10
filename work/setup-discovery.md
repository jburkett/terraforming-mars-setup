# Setup discovery — working evidence, 2026-11-10

## Governance and workflow
Correction after fetching main: the initial branch was outdated. Fast-forwarded 5e966e4 to 2a6f57d on 2026-11-10; verified all three draft files were byte-for-byte preserved before editing these notes. Constitution v1.0.0 is ratified and contains Simplicity, Separation of Concerns, Test-Driven Development, Code Quality, Human Authority, and Idiomatic Implementation. No replacement or amendment was made. The prior constitution clarification is resolved; product scope remains undecided. No extensions.yml exists, so no before/after hooks apply. Sequential feature numbering is configured. Feature branch and directory: 001-guided-game-setup. No commits or pushes.

## Verified rule evidence (paraphrased)
- Colonies rulebook p2: multiplayer draws player count + 2 colony tiles, except two players use five. Titan, Enceladus, and Miranda have conditional activation. Solo p3 instead draws four and chooses three; M€ production is reduced by two. https://cdn.1j1ju.com/medias/55/6a/42-terraforming-mars-colonies-rulebook.pdf
- Prelude p2: deal four preludes, retain two alongside corporation/project selection; resolve after corporation reveal and initial-card payment, before normal actions. Solo p3 changes the generation limit. https://cdn.1j1ju.com/medias/6e/a5/22-terraforming-mars-prelude-rulebook.pdf
- Prelude 2 p2–3: requires Prelude; card expansion markings govern eligibility; offers an Extended Start variant. https://fryxgames.se/wp-content/uploads/2024/09/TM_PRELUDE2_RULES_ENGi.pdf
- Venus Next p2–3: prepare Venus board at zero, mix eligible cards before dealing, add Hoverlord and Venuphile. Solo differs from multiplayer. https://cdn.1j1ju.com/medias/6f/8f/c8-terraforming-mars-venus-next-rulebook.pdf
- Milestones & Awards publisher instructions: choose five of each before dealing; Venus additions still apply. https://fryxgames.se/product/terraforming-mars-milestones-awards/
- Amazonis publisher sheet: larger map, extended parameters and additional components, optional extended Venus board. https://fryxgames.se/wp-content/uploads/2024/09/TM_AV_WRAP_ENG.pdf

## Provisional sequence — not yet verified as complete
Determine mode/player count and content; choose map and variants; prepare main board, supplies, player areas and eligible decks; perform expansion-specific preparation; establish milestones/awards before dealing; deal and select opening cards; reveal corporations, apply starting conditions and pay for retained projects; resolve preludes if enabled; hand off to the first action phase. Configuration summary and progress are product proposals, not game rules.

## Research gaps
Base official PDF retrieval exceeded web tool size limit; alternate transcription has mixed languages and is not accepted as final verification. Turmoil PDF has no extracted text; inspected p3 image describes play, not setup. Must inspect setup pages. Hellas/Elysium and Utopia/Cimmeria full rule sheets, Automa, base solo, drafting, Corporate Era, beginner handling, promos and expansion interactions need further review after coverage is agreed. Do not infer full support from this list.

## Automation candidates — all unapproved
Board selection from an agreed owned/eligible pool; colony draws with player-count rules; milestone/award selection under the selected variant; optional first-player randomization as a labeled deviation where appropriate. Physical dealing guidance versus digital card allocation is unresolved. Strategic choices must not be delegated without an explicit product decision.

## Later discovery topics
Audience and detail level; exact seven maps; solo/Automa; owned content; optional rules versus house rules; randomization fairness and pools; rerolls/locks/undo; changing configuration and invalidating prior progress; persistence and reset; shared screen and secrecy; summary contents/export; accessibility/language; setup endpoint and card-specific effects; measurable usability goals. These are questions, not a task backlog or approved scope.


## Discovery update — user scope decisions, 2026-11-10
All expansions/all boards are required; no solo. Only public components may be automated; private components still receive complete setup guidance. Project randomization and private-hand allocation are excluded. Use Big Box Kickstarter as fallback, without treating its historical release date as a cutoff on the explicit all-expansions instruction. Inventory is recorded in the spec; public promo coverage and optional rules still need human resolution.

Verified publisher context: the original Big Box Kickstarter FAQ dates to 2020 and refers to the expansion range ending at Turmoil at that time. Later expansions exist, so Big Box alone is not a complete inventory. https://www.kickstarter.com/projects/strongholdgames/terraforming-mars-big-box/faqs
Publisher expansion bundle describes Automa as solo-only, consistent with excluding it. https://fryxgames.se/product/terraforming-mars-expansion-bundle/

Base rulebook successfully located as an English publisher-rulebook mirror: https://world-of-board-games.com.sg/docs/Terraforming-Mars.pdf . Page 7 establishes board/supplies/decks/player preparation, physical dealing and selection, corporation starting conditions/payment, then action-phase handoff. Page 13 variants still need closer review. This resolves the earlier base-rulebook retrieval gap; expansion integration still requires verification.

Guidance boundary confirmed by subsequent user clarification: every applicable setup step across the supported rules must be called out on screen, including physical private-component preparation and dealing. Public-only scope limits automation, not guidance. Private-component setup must not be automated. Recording revealed cards or computing card-specific effects has not been approved.


## Completeness criterion clarified by user
A setup instruction is not excluded because it concerns a private component. The rules review must account for every applicable setup instruction across the supported rulebooks and variants, including any setup changes and exceptions. A complete screen-by-screen sequence remains unverified until this cross-check is finished. Coverage is conditional on selected expansions/rules; it does not mean displaying mutually exclusive setup instructions together.


## Content cutoff resolved by user
The user clarified that they had conflated the 2020 Big Box and the 2023 More Terraforming Mars! campaigns. Include non-solo content up through the latter campaign, including its 2024-delivered components. Exclude Automa/solo and content introduced afterward. This supersedes the earlier interpretation of unrestricted current expansion coverage and the Big Box fallback as the content boundary. The supported multiplayer expansion/map inventory remains unchanged; promo and public-component inventory requires reconciliation against historical campaign contents rather than current store bundles. No additional product approval is needed to apply this stated cutoff.


## Configuration-first flow confirmed by user
The first application page sets number of players, enabled expansions, and variants. Guided setup follows and uses those values. This settles the flow order, but does not settle the exact variant catalog, defaults, compatibility handling, board-selection placement, or edits to configuration after starting setup. These remain open; no implicit defaults have been adopted.


## Expanded-board pool confirmed by user
On the configuration page, present a top-level “Use expanded boards” expansion option. Enabling it reveals all seven boards as checkboxes; the user's instruction that they can uncheck unwanted boards establishes initial inclusion of all boards. Checked boards form the candidate pool. Replace separate map-pack selectors, explicitly including Hellas & Elysium, with this grouped control. Final board selection method, disabled-state behavior, and an empty pool still need clarification. No final board is implied merely by defining the pool.


## Original board eligibility clarified by user
“Original board (Tharsis)” is an explicit sub-option under “Use expanded boards,” not an implicit mandatory member of the pool. Users may enable the group and uncheck only the original board, leaving the other six eligible for randomization. This randomization use case is confirmed; timing, disabled-state behavior, empty-pool behavior, and the manual final-choice flow remain open.
