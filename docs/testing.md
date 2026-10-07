# Rule-Backed Coverage

This checklist covers issue #12's Phase 1 and the shared deck work from issue
#4 (Phase 2). Tests observe exported reference data, the shared deck hook, and
real App interactions. Card-reference expectations are literal values checked
against the rulebook's native text and illustrations, with physical-deck
confirmation noted below. Tests do not read local rulebook artifacts.

## Completed Rule Checks

- [x] Player and Neutral exports each contain 12 cards with distinct names
  (PDF pp. 2, 22).
- [x] The Fate export contains 48 cards (PDF p. 2). The user confirmed that the
  formerly repeated centre-attack face with Trade Good 3 and gladiator value 3
  occurs once in the physical deck. After the re-enabled count regression failed
  at 49, one of the two identical adjacent entries was removed and the test passed.
- [x] All 12 Path scoring tables are checked independently in both exports
  (PDF p. 23).
- [x] Ranger scores 1, 2, 3 VP for 1, 3, 5 completed scouting columns. The
  regression failed for both exports before correcting their 4-column threshold
  to 5, then passed (PDF p. 23).
- [x] The round reference lists Years 1 through 6 (PDF pp. 2, 4).
- [x] Year 3: Easy 3, Medium 4, Hard 5, Valour 2. Easy, Hard, and Valour are
  confirmed by the example text and board; Medium is legible on the yellow flag
  in the enlarged board illustration (PDF p. 20).
- [x] Resource kinds and Trade Goods 1-6 are validated across all exported
  card entries; Fate directions are left, centre, or right (PDF pp. 2, 13, 20).
- [x] Exact resource quantities, Trade Goods, and Scouting Pattern examples for
  Trainer and Defender (PDF p. 5), Fighter (PDF p. 13), and Vanguard (PDF p. 19)
  are checked in both Player and Neutral exports.
- [x] The centre-attack and visible right-attack Fate cards from PDF p. 20 are
  checked for direction, Trade Good, gladiator value, and resource quantities.
  Resource comparisons preserve multiplicity without requiring array order.

## Helper Contracts

- [x] Player and Neutral definitions agree by card name, but their exported
  arrays, card objects, scoring tables, and resource arrays are not shared.
  This is a reference-data check, not proof of independent drawing or shuffling.
- [x] Player and Neutral Scouting Pattern labels use the helper's supported
  `Line`, `Square`, `T`, `L`, and `S` vocabulary. Valid labels alone do not
  establish that each unseen printed pattern was transcribed correctly.

## Deck Integrity (Issue #4)

- [x] A copied Fisher-Yates shuffle preserves the source and card multiplicity.
  Deterministic tests cover both zero and the upper end of the random range;
  statistical shuffle tests are not used.
- [x] Drawing consumes exactly one card and displays a distinct draw instance.
  Batched draws consume consecutive cards rather than losing updates.
- [x] Every card in a pile is consumed before that pile reshuffles; no instance
  repeats within a cycle.
- [x] Player, Neutral, and Fate hooks have independent piles and displayed lists,
  including across drawing, clearing, and reshuffling.
- [x] Clearing the display and discarding cards do not replenish a pile.
- [x] Discarding one instance preserves equal-content instances. Repeating a
  discard does not remove another instance.
- [x] Display sorting preserves instance identities, the previous displayed
  array, and the remaining pile.
- [x] Real App regressions verify that rendering never mutates imported decks
  and all three draw/clear controls continue consuming their separate piles.
  Fate discard also updates its displayed attack total.
- [ ] Confirm the Player/Neutral exhaustion policy for a six-Year game before
  enforcing extra-year restrictions. The hook preserves the existing generic
  behavior: the next draw after exhaustion shuffles a fresh copy of that source.
  Clear only clears displayed cards; it is not a shuffle or refill command.

The shared public interface is in [useDeck.ts](../src/hooks/useDeck.ts), with
focused tests in [useDeck.test.ts](../src/hooks/useDeck.test.ts).

## Remaining Phase 1 Gaps

- [ ] Easy, Medium, Hard, and Valour values for Years 1, 2, 4, 5, and 6
  (20 values). The full-board illustrations on PDF pp. 3 and 5 are too small
  for a reliable transcription; a clearer Player-board reference is needed.
- [ ] A complete audit of all Player/Neutral resource rewards, Trade Goods,
  Scouting Patterns, and all Fate faces and their multiplicities. The illustrated
  examples and field-domain checks above are not a complete card-face audit.
  No rule-backed uniqueness assertion is made for Fate faces.

## Boundaries And Verification

Resource-state fixes (#2), card-list key changes (#3), persistence, Prospect
retention, Neutral usage, and automatic Year sequencing remain outside this
work. Draw-instance identities are used for deck operations; the separate UI
card-list identity work is not claimed complete. Issue #12 remains incomplete.

Tests live in [cardData.test.ts](../src/settings/cardData.test.ts) and
[rounds.test.ts](../src/settings/rounds.test.ts), with deck integration tests in
[App.test.tsx](../src/App.test.tsx). Run the required gates with:

```bash
npm test -- --watchAll=false
npm run build
```

A passing test run does not resolve the remaining reference gaps above and must
not be reported as a complete card-face audit or complete Phase 1 coverage.

## Prospect Retention (Issue #13)

- [x] Real App interactions assign Path and Prospect in either order. Path
  selection grants no resources; the retained objective and scoring reference
  remain visible (PDF pp. 4-5, 23).
- [x] Trainer grants one Purple and one Brick, retaining its name, Trade Good 4,
  and S Scouting Pattern (PDF p. 5). The Prospect has no reward or Path controls,
  including after unrelated draws and resource changes.
- [x] Choosing another Prospect explicitly replaces the retained card. Player
  Clear removes both the Prospect and unchosen display without losing Paths or
  replenishing the Player pile. Automatic Year advancement remains deferred.

These checks are in [App.prospect.test.tsx](../src/App.prospect.test.tsx).
The boundaries above describe the earlier reference/deck work, not this follow-up.
The missing independent references and incomplete Phase 3 work still leave #12 open.

Verified on 2026-10-07: the full test command passed with all 63 tests passing
and none skipped; the production build compiled successfully. Existing retained
Path list-key and stale browser-data warnings remain outside this change.