# Mobile Layout Audit (#11)

## Scope And Baseline

Audit on 2026-10-09 of production main
`3552b82771e70fe70c3243b69c8ef978a88985d8`,
following the round-reference fix in #32 / #35. This issue records findings
and scoped follow-ups; it does not redesign the application.

Node 24.21.0 baseline: 77 of 78 tests passed. The Neutral integration test
"Neutral uses accumulate across cards and cleanup preserves payments, Paths,
Fate cards, and piles" reached its existing 5000ms timeout. Lint, typecheck,
and production build passed. No tests or timeouts were changed.

## Method

Production Vite preview in fixed-width Chromium frames, awaiting
`document.fonts.ready` before measurements and captures; the used Mitr face
was loaded. Dimensions below are CSS pixels, not physical-device resolutions.
Compare document `scrollWidth` with `clientWidth`, not `innerWidth`: these
frames reserve 15px for a vertical scrollbar when content requires one.

For reproducible ordering, initialize `Math.random` to return `0` before app
startup. Draw six Player cards and select each **As Path**, retaining Engineer,
Planner, Trainer, Vanguard, Ranger, and Forager. Draw the remaining six Player
cards and take Fighter **As Resource**, leaving a read-only Prospect and five
unchosen cards, including Aristocrat and Architect. Draw three Neutral and
three Fate cards. No card definitions or application state were patched.

Measure Path item widths and adjacent heading text ranges, document overflow,
round-reference columns/label bounds, card bounds, and tooltip bounds. Activate
draw/selection/resource/payment/sort/cleanup controls with keyboard Enter.
Inspect screenshots as well as measurements: absence of document overflow does
not mean text fits its own column.

## Viewport Results

Empty states have no document overflow at any tested size and every round
reference label/value stays inside its group. The populated matrix is below.
The overflow column is `scrollWidth - clientWidth`; overlaps count adjacent
retained Path heading pairs whose rendered text bounds intersect.

| Frame | Orientation | Reference columns | Path item width | Heading overlaps | Document overflow |
| --- | --- | ---: | ---: | ---: | ---: |
| 320 x 568 | Portrait | 1 | 14.83px | 5 | 7px |
| 360 x 800 | Portrait | 2 | 21.48px | 5 | 0px |
| 390 x 844 | Portrait | 2 | 26.48px | 5 | 0px |
| 430 x 932 | Portrait | 2 | 33.16px | 5 | 0px |
| 568 x 320 | Landscape | 3 | 56.16px | 1 | 0px |
| 800 x 360 | Landscape | 5 | 93.48px | 0 | 0px |
| 844 x 390 | Landscape | 5 | 100.83px | 0 | 0px |
| 932 x 430 | Landscape | 6 | 115.48px | 0 | 0px |
| 900 x 800 | Desktop breakpoint | 6 | 110.16px | 0 | 0px |
| 1200 x 900 | Desktop | 6 | 160.16px | 0 | 0px |

## Confirmed Finding

**Retained Path references crowd on phones.** In
[App.tsx](../src/App.tsx), the retained Path Grid uses fixed `size={2}` items
at every width. Six items plus gaps leave only 14.83px per item at 320px,
while text extends 62-87px. Names, objectives, and scoring rows overlap or
wrap into unusably narrow groups; the final Path also exceeds the document's
305px client width, producing a 312px scroll width.

Scoped fix: responsive minimum item widths that wrap whole Path
name/objective/scoring groups on phones, retaining six columns when desktop
space permits. Preserve current typography, complete labels, the six-Path cap,
draw-instance keys, and the already-fixed round reference. Implementation and
regression coverage are tracked in
[#36](https://github.com/vatioz/hadrians-wall-helper/issues/36), not this PR.

## Other Checked States

- All ten populated frames keep the Prospect read-only and disable all five
	remaining **As Path** controls at the six-Path cap. A seventh keyboard
	selection attempt at 320px leaves exactly six Paths.
- Long names and objectives in the drawn Player cards stay inside their card
	bounds across the matrix. Three Neutral and three Fate cards render alongside
	the Prospect and five unchosen Player cards without a separate confirmed
	card-list overflow defect.
- At 320px, zero resources disable Neutral payments. Adding one Brick and one
	Black, then buying/scouting once, yields one Resource placement, one Soldier
	placement, and exactly two extra invasion draws. Both actions disable again
	after payment. Drawing another Neutral card preserves the original card DOM
	node, its placements, and the extra-draw total.
- Keyboard focus reveals disabled-payment and Neutral cleanup hints at 320px;
	their horizontal bounds fit the 305px client width. Player cleanup hints fit
	both horizontally and vertically at all ten sizes. Fate cleanup's explanatory
	hint also appears on keyboard focus at 320px.
- At 320px, Neutral cleanup removes cards/placements and resets extra draws to
	zero while retaining the Prospect and six Paths. Fate sorting/cleanup removes
	three revealed cards and resets attack totals. Player cleanup removes the
	Prospect and unchosen cards while retaining all six Paths. Existing automated
	tests cover remaining-pile behavior; this audit does not independently prove
	every deck/exhaustion contract.

## Limits And Device Follow-Up

No physical phone, real touch interaction, mobile Safari, browser chrome,
virtual keyboard, or physical keyboard was available. These results describe
fixed-width desktop Chromium frames and automated keyboard activation only.
Landscape frames are separate loads, not a physical orientation-change test.

Neutral action buttons measure approximately 37px high, and the smallest enabled
buttons approximately 36.5px. This is a touch-usability observation, not a proven
physical-device failure or an accessibility conformance audit. On actual phones,
check tap accuracy, long-press payment hints, cleanup hint discovery, focus
visibility, and scrolling/orientation with populated lists before declaring
physical-device validation complete. No additional layout fix was confirmed.

## Evidence

PNG files live only on the orphan `pr-evidence` branch, pinned to
`4369921530d550678a22db1380c68d5c357dbd38`. The 320px raw URL returned HTTP 200.
Path crops show the retained grid, not a full phone screen. The paid Neutral
image is the 320 x 568 frame; other state images are element crops.

- [320px retained Paths](https://raw.githubusercontent.com/vatioz/hadrians-wall-helper/4369921530d550678a22db1380c68d5c357dbd38/11-mobile-layout-audit/paths-320.png)
- [430px retained Paths](https://raw.githubusercontent.com/vatioz/hadrians-wall-helper/4369921530d550678a22db1380c68d5c357dbd38/11-mobile-layout-audit/paths-430.png)
- [568px landscape Paths](https://raw.githubusercontent.com/vatioz/hadrians-wall-helper/4369921530d550678a22db1380c68d5c357dbd38/11-mobile-layout-audit/paths-568.png)
- [1200px desktop Paths](https://raw.githubusercontent.com/vatioz/hadrians-wall-helper/4369921530d550678a22db1380c68d5c357dbd38/11-mobile-layout-audit/paths-1200.png)
- [320px paid Neutral and payment hint](https://raw.githubusercontent.com/vatioz/hadrians-wall-helper/4369921530d550678a22db1380c68d5c357dbd38/11-mobile-layout-audit/paid-neutral-hint-320.png)
- [390px read-only Prospect](https://raw.githubusercontent.com/vatioz/hadrians-wall-helper/4369921530d550678a22db1380c68d5c357dbd38/11-mobile-layout-audit/prospect-390.png)
- [360px wrapping round reference](https://raw.githubusercontent.com/vatioz/hadrians-wall-helper/4369921530d550678a22db1380c68d5c357dbd38/11-mobile-layout-audit/round-reference-360.png)

## Branch Verification

Only this document changes. Source, dependencies, test files, and test
configuration match main; there is no new application behavior to pin with
an additional unit test. The new behavior-scoped checks are the browser matrix
and interaction checks recorded above.

| Check | Unchanged-main baseline | Audit branch |
| --- | --- | --- |
| `npm test` | 77/78 pass; Neutral cleanup test timeout | 76/78 pass; Neutral cleanup and independent deck-control test timeouts |
| `npm run lint` | Pass | Pass |
| `npm run typecheck` | Pass | Pass |
| `npm run build` | Pass | Pass; identical production asset names |

A supplemental `npm test -- --maxWorkers=1 --no-file-parallelism` run passes
77/78, with the two-trades/one-scout Neutral test timing out instead. This
does not replace or misreport the required full run. All failures are at the
existing 5000ms timeout, consistent with the documented local-container issue;
none justify changing assertions, skipping tests, or raising timeouts. Use the
PR's clean-runner CI result for the full-suite release gate.

The audit preview server was stopped after browser checks. No physical-device
validation or layout fix is claimed by this documentation-only branch.