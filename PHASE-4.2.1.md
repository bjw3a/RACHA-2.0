# Racha 2.0 — Phase 4.2.1

Small refinement of the exact supplied `Racha-2.0-Phase-4.2-Flashcards(1).zip`.
Source ZIP SHA-256: f8e83061c148d7c28de88ef81ebf374e26fbb1006e67657f612b5d17b7ee06c0

## Changes

- `js/flashcards-data.js`: added balanced cumulative sampling and corrected only the English side of the buenas noches flashcard to `good evening / good night`.
- `js/flashcards.js`: Review Everything uses the new 30-card sampler. Results use PRACTICE MISSED CARDS with START OVER for topics/units or NEW 30-CARD REVIEW for cumulative review. Retains the complete original topic/unit selection separately from missed-card rounds.
- `index.html`: browser title updated to Racha 2.0 — Phase 4.2.1.
- Tests: updated `tests/phase4.2.mjs`, `tests/phase4.2-browser.mjs`, and `tests/package.json`; added `tests/phase4.2.1.mjs`.
- Documentation: updated README, TESTING, CHANGELOG; added this release guide. Earlier release guides remain historical references.

No CSS, homepage/navigation code, shared curriculum/data, readings, game engine, mastery logic, or local storage code changed. Those files are byte-for-byte identical to Phase 4.2.

## Balanced review

Each unit supplies its existing full card pool. The sampler shuffles those pools and the unit order, then takes one unused card per unit on each pass until it has 30. Cards shared between units are skipped once selected; the final deck is shuffled again.

Spanish 1 gets 4–5 cards per unit across seven units. Spanish 2 gets 6 per unit across five units, including Mixed Present-Tense Review. Sampling before whole-course deduplication keeps that mixed unit represented even though it shares cards with other units.

The complete Spanish 1 database remains 465 unique course-review cards and Spanish 2 remains 406. Topic/unit study still uses the complete selected set. No cards were deleted.

## Results buttons

- PRACTICE MISSED CARDS: only cards marked AGAIN in the round just completed. Additional missed rounds can further narrow that set. As before, this button appears only when there are missed cards; otherwise DONE appears.
- START OVER: shuffles and restarts the entire original topic/unit selection, including when pressed after one or more missed-card rounds.
- NEW 30-CARD REVIEW: generates a fresh balanced random selection from the full course pools. It also remains available after a cumulative review's missed-card rounds.

KNOW IT, AGAIN, reveal, counter, and Shuffle retain their existing behavior. Shuffle changes only unanswered cards.

## Validation

Passed original learning and Phase 4.1/4.2 regression suites, plus 1,000 randomized review checks (500 per course) for exact length, unit balance, uniqueness, varied selections, intact databases, and exclusion of vosotros/vosotras. Added UI tests for revised labels, repeated missed-card rounds, full-set START OVER, cumulative NEW 30-CARD REVIEW, greeting correction, and exact saved-profile isolation.

Chromium browser checks cover both courses at 320×568, 390×844, 768×1024, and 1366×768, including both themes, keyboard reveal, card text fit, results-button fit, navigation, original Learn activities, word-bank behavior, refresh persistence, and deployment under a relative `/racha/` subpath. See TESTING.md for commands. Tests used viewport emulation, not physical Dell laptops or phones; Safari and Firefox were not tested.

## Limitations

Random selections may share some cards with earlier reviews; there is no cross-session exclusion or spaced repetition. Existing flashcard session state remains in memory and resets on leaving/refreshing, exactly as in Phase 4.2. Learn progress still saves normally. No account, tracking, proof-of-completion, backend, or external API was added.

## Upload

Extract `Racha-2.0-Phase-4.2.1.zip` and upload its contents over the existing files at the root of `bjw3a/RACHA_PHASE-4-TEST-ONLY`. Keep `index.html`, `styles.css`, `favicon.svg`, and `js/` at that root. No existing code or files need to be deleted first. Do not upload the ZIP itself or an enclosing version folder.

Suggested commit message: `Phase 4.2.1: Refine Flashcards review`

No repository was modified or deployed during preparation of this ZIP.
