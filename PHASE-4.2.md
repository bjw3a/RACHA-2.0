# Racha 2.0 — Phase 4.2 Flashcards

Built directly from Racha-2.0-Phase-4.1(2).zip, retrieved September 28, 2026.
Source ZIP SHA-256: 8a58ee39fc31b9ac2735fd84d55ed02d99b3d4f4a0503dd9e264fd8e1114584d

## What changed

- `js/app.js`: a compact course home, then Learn / Flashcards. Learn keeps the existing unit/topic screens and five activities. Continue Learning still opens the most recently played learning topic and its next activity; flashcard use does not change that bookmark.
- `js/flashcards.js` (new): dedicated topic/unit/course selection, reveal, Know it / Again, shuffle, and round summaries.
- `js/flashcards-data.js` (new): centralized, deterministic cards derived from the existing course content. Each card includes course, unit, topic, front, back, language tags, kind, stable ID, and optional `audio` (currently null).
- `js/data.js`: only exported the existing `matchBank` function so Flashcards can reuse complete vocabulary/sentence banks. No learning questions or curriculum were rewritten.
- `styles.css`: appended styles for the compact course gateway and responsive Flashcards screens.
- `index.html`: updated browser title to Phase 4.2 Flashcards.
- `js/readings.js`: replaced angle quotation marks with standard double quotes. Reading content and difficulty otherwise remain unchanged.
- Tests: updated `tests/browser.mjs` and `tests/phase4-dom.mjs` for the course gateway; added `tests/phase4.2.mjs` and `tests/phase4.2-browser.mjs`; expanded `tests/package.json` scripts.
- Documentation: updated README, TESTING, CHANGELOG; added this guide. Earlier release notes remain included.

The engine, mastery/progression logic, storage code, and curriculum structure are byte-for-byte identical to the source ZIP. The Phase 4.1 word-bank boxes, typing requirements, XP, records, achievements, summaries, and browser storage key remain intact.

## Content and editing

Spanish 1 has 465 unique course-review cards across all 15 existing topics. Spanish 2 has 406 across all 6 existing topics. Totals include vocabulary, numbers, digital time, phrases, sentences, and grammar prompts; they are not counts of distinct vocabulary words. Mixed Present-Tense Review reuses the regular verb content, and those duplicates are removed from course review.

Primary data lives in `js/flashcards-data.js`, importing the existing vocabulary and grammar helpers from `js/data.js` and units from `js/curriculum.js`. English-to-Spanish is the main direction; a consistent subset is reversed. All current cards exclude vosotros/vosotras and their verb forms. Digital time uses the existing application's five-minute intervals and prefers existing quarter/half-hour variants where available.

To add a card without changing the study interface, add an object to `extraCards` in `js/flashcards-data.js`, using an existing course/unit/topic:

```js
{
  course: 1,
  unit: 's1-u1',
  topic: 'greetings',
  front: 'Hello!',
  back: '¡Hola!',
  frontLang: 'en',
  backLang: 'es',
  kind: 'phrase',
  audio: null
}
```

To edit existing Flashcards-only generation, edit `topicCards` in that file. Changes to shared vocabulary in `js/data.js` also affect Learn, so use that file only when a curriculum-wide change is intended. A genuinely new curriculum topic also needs an ID in `units` in `js/curriculum.js` and a label in `topics` in `js/data.js`; the Flashcards interface then discovers it automatically. Add the new topic's cards to `extraCards`; unrecognized source banks safely contribute no automatic cards. New Learn topics also require their own learning content and reading support; adding Flashcards does not manufacture those.

## Student flow

1. Choose Spanish 1 or Spanish 2, then Flashcards.
2. Select a unit and topic, Review This Unit, or Review Everything.
3. Tap the card (or focus it and use Space/Enter) to reveal. Know it and Again enable after revealing.
4. Know it counts the card as known for this round. Again sets it aside. Either advances once.
5. At the end, Practice Again contains only that round's Again cards. Restart round repeats the current round; Done appears when every card is known.

Review Everything combines all available topics in the selected course, removes matching front/back pairs (including reversed duplicates), and shuffles the deck. Unit review deduplicates within that unit. The Shuffle button shuffles only unanswered cards, so it preserves completed answers and the Again list.

## Testing

See TESTING.md for the complete checks and commands. Tests cover the original progression and word bank, Flashcards topic/unit/course selection, reveal, keyboard operation, Know it/Again, repeated practice, shuffle, deduplication, content checks, local progress isolation, refresh, both themes, and layouts from 320px phones to 1366px laptops. Chromium tests serve the app under `/racha/` to verify relative GitHub Pages paths.

## Limits

- Flashcard results exist only during the open study round. Leaving the round or refreshing resets them. Flashcards never writes mastery/XP or browser progress. Learn still saves normally.
- No spaced repetition, audio playback, accounts, cloud sync, or teacher dashboard. Audio references are reserved for a future release.
- Review Everything is the full deck, including every number 0–100 and digital time examples; students wanting shorter practice can select a topic.
- Testing used Chromium viewport emulation, not physical Dell laptops or phones. Safari/Firefox were not tested.
- No repository was changed or deployed. This ZIP is intended for the test repository.

## Upload to the test repository

Extract the ZIP. In `bjw3a/RACHA_PHASE-4-TEST-ONLY`, upload the extracted files and folders to the repository root so `index.html`, `styles.css`, `favicon.svg`, and `js/` are alongside one another. Do not upload only the ZIP or nest the application inside another folder. Include both new JavaScript files. No build command or backend is required.

Suggested commit message: `Phase 4.2: Add Flashcards study mode`
