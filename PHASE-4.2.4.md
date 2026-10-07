# Racha 2.0 — Phase 4.2.4

Built from the exact Library ZIP Racha-2.0-Phase-4.2.3(1).zip.

## Changes
- `js/data.js`: typing-mode vocabulary questions consistently prompt English and expect Spanish. Existing Spanish alternatives remain accepted. Multiple-choice generation is unchanged. Numeric recognition questions carry a numeric-response marker.
- `js/data.js`: generated time questions use a scoped equivalence normalizer. It removes optional `Son las` / `Es la` and the optional first `y` immediately after the hour. It retains the internal `y` in numbers such as `cincuenta y cinco`. This applies generally, not to a hard-coded list of examples. Existing model answers, including cuarto/media/en punto, remain unchanged. One o'clock uses `Es la una`; bare `una` works, and `Son las una` is rejected. Case, spacing, optional vowel accents, and distinct ñ behavior are preserved.
- `js/app.js`: passes typing mode to the generator; numeric typing says `TYPE THE NUMBER.`. A single `FLASHCARDS_ENABLED=false` flag sends course choices directly to units and the Back button to courses. Set it to true to restore the existing Learn / Flashcards gateway. Flashcard implementation and data files are byte-for-byte unchanged.
- `index.html`: version title updated.
- Added this release note and five `tests/phase4.2.4*.mjs` regression scripts. No existing tests were rewritten.

## Preserved
Teacher email/configuration, unit completion/email code, curriculum, readings, all Flashcards files, storage keys/structures, progression, scoring, XP, achievements, mastery thresholds and responsive stylesheet are byte-for-byte unchanged. No migration or reset was added. Unit completion continues to require the same existing topic/activity mastery.

## Validation
Passed: 6,048 time-variant checks over all 720 possible hour/minute combinations; wrong hour/minute rejection; una agreement; typing audit across both courses; numeric 43; accents and ñ. Seeded before/after comparisons verified unchanged multiple-choice question generation.

Passed: existing core/progression and word-bank tests; DOM end-to-end five-activity progression, failures/retries, completion summaries, copy fallback, course resume, all topics and saved records; all-unit completion requirements, configured email preparation and encoding, names, clipboard and progress; direct course navigation, hidden Flashcards, unit indicators and numeric typing submission.

Passed: original Flashcards regression suites against a temporary test copy with the flag enabled, including 1,000 randomized balanced reviews and intact 465/406-card databases. Temporary copies are not included.

Full Chromium browser tests could not run: the environment denied the browser's socket operation during launch. Therefore visual/mobile and full-browser restart checks are not claimed as passed. A browser regression script is included for a supported environment. Responsive CSS is unchanged. No email was sent.

Run from `tests` after `npm ci`:
```
node phase4.2.4.mjs
node phase4.2.4-dom.mjs
node phase4.2.4-completion.mjs
node phase4.2.4-navigation.mjs
```
With Playwright Chromium available: `node phase4.2.4-browser.mjs`.
Historical tests targeting the visible Flashcards gateway assume that feature is enabled. The historical 4.2.2 suite also assumes an unconfigured teacher email; the new completion suite accounts for the existing configured email.

## Deploy
Upload the extracted contents to GitHub Pages. `index.html` is at ZIP root. This package has not been deployed automatically. Retain the same site origin to retain students' browser-local progress.
