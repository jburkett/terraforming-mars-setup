# Browser UI Contract

**Status:** Proposed design for [Guided Game Setup](../spec.md). The exposed interface is the browser UI. No network API, persistence/export format or public programming API is proposed.

## Expansions and player count

View 1 shows N=2 (2–5 allowed), seven content options, and Use expanded boards with all seven candidates checked. Top select-all/none affects that page's toggles only, preserving N and variants. No map-pack expansion selectors.

Prelude 2 enables/keeps Prelude on with visible explanation; bulk select-none disables both atomically. Expanded boards off shows checked/inactive Tharsis and inactive board controls. Removing the last board restores fallback. Printed-objective attainability never excludes a map.

Continue enters variants. Use labeled native controls and operable confirmation presentation as a proportionate way to expose the required choices.

## Variants

View 2 contains Extended Start and research drafting only, both initially on and available without expansions. Top bulk controls affect these toggles only. Back retains committed choices; Continue enters setup. There is no WGT control.

## Setup and customization

First entry generates all missing applicable public choices; unchanged revisits retain every result/lock. Show all applicable SU-01–SU-12 instructions in order as one visible list, with matching summary. No hidden mandatory wizard steps, completion checkboxes or card entry.

Customize beside board, first player and colonies reveals eligible drop-down alternatives and a bottom reroll control. Board stays within checked candidates, first player within 1…N, colonies at required distinct count. No colony lock table is introduced.

MA tables have two columns without gridlines: selection then lock. Manual selection updates immediately and locks its row. Each row excludes every other row's value in the same table, above and below; tables filter independently and never sort. Reroll affects only unlocked rows; all locked is no-op. Fixed Venus pair stays outside replacement controls. MA off shows complete printed sets without MA replacement choices.

R1 notices identify each unattainable printed objective and all disabled expansions responsible, in setup and summary. No replacement, forced expansion or map exclusion. Source versions/thresholds follow the rules packet.

## Confirmation and failure

Before an edit loses affected results/locks, explain and offer confirm/cancel. Cancellation preserves all committed choices. Confirmation clears only affected state; setup entry fills missing results. Direct board override on setup reconciles dependent objectives after required confirmation.

Reset confirmation clears results/locks and restores N=2 and all supported options/seven boards/two variants on; next setup entry generates anew. Cancel changes nothing.

Insufficient eligible pool shows a configuration-conflict explanation and return option. Never fabricate components, output duplicates, silently enable expansions or lose locks without confirmation.

## Content and lifetime

Coverage follows [rules-reference.md](../rules-reference.md): CE/Beginner distinctions, Amazonis supplies, colony activation, physical Turmoil, ordinary/Extended Start deals and Prelude 2 discard/refund order. Each instruction is traceable to SU ID plus rules source or recorded override. No card inventory, private entry, digital card draw/filter/validation or effect execution.

Summary matches N, first-player number, board, content, both variants, colonies, objective versions and limitations. No selected WGT value. Standard Venus remains supported; longer Venus is absent. Drafting is recorded without changing opening deals or guiding gameplay.

Live navigation retains state; reopening/reloading does not recover it. No accounts, exports, sharing or progress tracking. Later checks map to AC-01–39 and SC-001–005; this contract is not rendered/tested evidence.
