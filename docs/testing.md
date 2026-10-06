# Rule-Backed Coverage

This checklist covers issue #12, Phase 1 only. Tests observe the exported card
and round reference data. Expectations are literal values checked against the
rulebook's native text and illustrations, with physical-deck confirmation noted
below; tests do not read the local PDF, extractions, or image files.

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

## Remaining Phase 1 Gaps

- [ ] Easy, Medium, Hard, and Valour values for Years 1, 2, 4, 5, and 6
  (20 values). The full-board illustrations on PDF pp. 3 and 5 are too small
  for a reliable transcription; a clearer Player-board reference is needed.
- [ ] A complete audit of all Player/Neutral resource rewards, Trade Goods,
  Scouting Patterns, and all Fate faces and their multiplicities. The illustrated
  examples and field-domain checks above are not a complete card-face audit.
  No rule-backed uniqueness assertion is made for Fate faces.

## Boundaries And Verification

Deck refactoring and draw/shuffle behavior, persistence, Prospect retention,
Neutral usage, automatic Year sequencing, and UI workflows are outside this
Phase 1 work. Completing the checks above does not complete issue #12.

Tests live in [cardData.test.ts](../src/settings/cardData.test.ts) and
[rounds.test.ts](../src/settings/rounds.test.ts). Run the required gates with:

```bash
npm test -- --watchAll=false
npm run build
```

A passing test run does not resolve the remaining reference gaps above and must
not be reported as a complete card-face audit or complete Phase 1 coverage.

Verified on 2026-10-06: the full test command passed with all 45 tests passing
and none skipped; the production build compiled successfully.