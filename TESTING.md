# Phase 4.2.2 validation

See PHASE-4.2.2.md for current coverage and the school-device email limitation. The historical results below describe earlier releases.

# Phase 4.2.1 validation — September 28, 2026

Passed:

- `node tests/phase4.2.1.mjs`: 1,000 balanced 30-card samples; every unit represented; no within-session duplicates; varied selections; full 465/406 pools intact; greeting correction; results labels; missed-only rounds; full topic/unit START OVER after repeated missed rounds; cumulative NEW REVIEW after missed rounds; exact saved-profile isolation.
- Phase 4.2 browser suite extended to check cumulative 30-card results, missed subsets, NEW 30-CARD REVIEW, topic START OVER after a missed round, and longer results buttons fitting phone viewports.

- `node tests/phase4.mjs`: all existing topics/unit reviews, five-step mastery, 80% boundary, saved progress, completion dates, normalization, distractors, and Latin American forms.
- `node tests/phase4-dom.mjs`: complete learning progression through matching, recognition, typing, In Context, and Story; failure/retry thresholds; completion copy fallback; resume; all topics/courses; saved records.
- `node tests/phase4.1.mjs`: both courses' word-bank placement, noninteractive chips, deduplication, all-topic answer coverage, typed correct/incorrect answers, unchanged saved profile.
- `node tests/phase4.2.mjs`: all flashcard topics/unit/course decks, deterministic counts, deduplication, no vosotros/vosotras, representative conjugations/agreement, 0–100, time, new-card extension, reveal, Know it/Again, shuffle, subset rounds, all-known/all-again summaries, clean course home, Continue Learning, exact saved-profile isolation.
- `node tests/browser.mjs`: real Chromium at 320×568, 390×844, 768×1024, 1366×768; original progression screens, primary button placement, matching → next level, refresh persistence, questions, course isolation, light theme, relative subpath assets, no browser/resource errors.
- `node tests/phase4.1-browser.mjs`: both courses, phone/laptop layouts, light/dark, word-bank placement, no overflow, typing correct/incorrect responses, refresh persistence.
- `node tests/phase4.2-browser.mjs`: both courses and themes at all four viewport sizes; keyboard reveal, touch targets, primary controls above fold, all card text fitting, topic/unit/course selection, shuffle, missed-card rounds, local progress isolation, refresh, relative `/racha/` deployment paths, no browser/resource errors.
- Visual screenshot review of phone and laptop screens.
- Historical Phase 4.2 comparison: `engine.js`, `progression.js`, `storage.js`, and `curriculum.js` unchanged byte-for-byte. `data.js` changes only export visibility for `matchBank`. Readings differ only in quotation marks.

Run the complete suites from `tests/` with `npm ci`, `npm test`, and `npm run test:browser` (install Chromium with `npx playwright install chromium` first). Browser tests support optional `RACHA_SCREENSHOTS=/absolute/path` for screenshots.

These are automated DOM and Chromium tests with viewport emulation, not physical-device, Safari, Firefox, or live GitHub deployment tests. Flashcard round state intentionally resets on refresh; saved Learn progress remains intact.

Phase 4.2.1 archive comparison: CSS, app navigation, shared data, curriculum, readings, game engine, progression, and storage are byte-for-byte identical to the exact Phase 4.2 source ZIP.
