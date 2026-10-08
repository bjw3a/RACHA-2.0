# Racha 2.0 — Phase 4.3.1

Base: the latest `Racha-2.0-Phase-4.3(1).zip` (October 7, 2026). The original archive is unchanged. This is a complete static application, not a patch.

## Navigation
A compact Listen & Speak card now appears after topic mastery progress and before Up Next. Optional practice is labeled inside the card. Required mastery remains the same five activities.

The practice menu has three large cards:
- **Listen & Choose:** Listen to Spanish. Choose the answer.
- **Listen & Type:** Listen. Type what you hear in Spanish.
- **Read & Record:** Read the Spanish aloud and hear yourself.

Every activity has Back to Topic and Back to Listen & Speak controls. Completion offers Practice Again, Back to Listen & Speak, and Back to Topic.

## Structured sessions
Each current topic, unit review, and course review supplies ten prompts. Sessions are temporary and never update XP, mastery, completion dates, or other saved progress. Future smaller content banks use their available prompts rather than padding with duplicate dictation items.

Listen & Choose combines existing translated vocabulary/phrases (up to seven) with existing authored passage comprehension questions (up to three). Vocabulary questions use four choices when possible; existing passage questions retain their three vetted choices. Choices come from the same source topic even in mixed reviews. Duplicate answers, known overlapping translation aliases, and selected near-synonyms are excluded as distractors. A whole short passage may be replayed for different comprehension questions.

Students select an answer and press Check. Incorrect answers receive Try again; correct answers reveal the Spanish transcript and Next. There is no early transcript control. Replay is unlimited.

Listen & Type provides short words/phrases followed by sentences from existing topic readings. Students type exactly what they hear. It uses Racha's existing normalization: capitalization, extra whitespace, punctuation, and vowel accents do not affect correctness; ñ remains distinct from n. No word substitution, automatic grammar correction, reordered words, or negation removal is allowed. Audio dictates Spanish words, including numbers; numeric digits are not substitutes for Spanish dictation.

Both listening activities count correct **first attempts** for the optional session summary. Retrying successfully advances, but does not retroactively improve the first-attempt count. No XP or mastery credit is awarded.

Read & Record combines words, phrases, and sentences in one ten-prompt session. Hear Spanish and Record are visible initially. Stop and a recording indicator appear during recording. Playback, Record Again, and Hear Spanish Again are available after capture. Next remains available without recording. There is no pronunciation grading, speech recognition, or recording requirement.

## Content and extension
`js/practice-sessions.js` adapts the existing `practice-data.js`, catalog, vocabulary aliases, curriculum selections, and readings. No existing curriculum/question file was modified. The existing mixed-verb reading mapping is retained. Topic banks are cached in memory; each new session samples and orders its own items. There is no new browser storage key or separate vocabulary database.

Future topics use the same existing curriculum, vocabulary/catalog, and keyed reading sources. Add explicit listening metadata only if an authored question needs it. Keep distractors semantically distinct and source topics scoped. All current topic banks and randomized sessions were audited by the included data tests.

## Audio, privacy, and preservation
`js/practice-audio.js` is byte-for-byte unchanged from Phase 4.3: Latin American Spanish voice preference, 0.85 rate, Sound toggle integration, browser recording/playback, late-permission handling, 60-second capture limit, fallback messages, and cleanup are preserved. Speech and recordings never autoplay.

Recordings remain transient Blobs/object URLs, never uploaded, emailed, stored permanently, or sent to external APIs. Moving between prompts/screens, hiding the page, or leaving disposes audio resources. Microphone denial and unsupported recording still allow model listening, practice aloud, Next, and Back.

Flashcards remain disabled; their files and audio fields are preserved. All existing units, topics, questions, five-activity progression, 80% mastery, XP, achievements, storage keys, completion indicators, summaries, and teacher email configuration are unchanged. Existing progress stays available on the same origin/browser profile.

## Files
Modified: `js/app.js` (practice-card placement only), `js/practice.js` (structured screens), `styles.css` (scoped additions), `index.html` (version), `CHANGELOG.md`.

Added: `js/practice-sessions.js`, `PHASE-4.3.1.md`, and `tests/phase4.3.1.mjs`, `tests/phase4.3.1-dom.mjs`, `tests/phase4.3.1-browser.mjs`.

All Phase 4.3 audio code, curriculum/data, flashcard files, storage/progression/engine, teacher configuration, historical tests, and prior documentation are retained. Historical Phase 4.3 browser tests target the former practice menu; use the new Phase 4.3.1 browser suite for the new navigation.

## Verification performed
Passed:
- Existing Phase 4 core, 4.1 word-bank, 4.2.4 time/typing, DOM five-activity progression, completion/email-preparation, and navigation suites.
- Existing Phase 4.3 audio/data unit tests, including voice selection, sound gating, denied/unsupported microphone, late permission, empty/interrupted recording, and failed playback.
- New content tests across every topic, unit, and course review, with 20 randomized sessions per mode/selection: ten items, topic scope, choice/alias uniqueness, dictation uniqueness, accent/case/spacing/punctuation acceptance, and ñ/grammar/negation rejection.
- New DOM end-to-end suite: 15 complete sessions across family, greetings, time, adjectives, and Spanish 2 -ER verbs; placement, all three menu choices, Check/retry/Next, hidden transcripts, first-attempt scores, restart/Back, unchanged localStorage, simulated recording/playback/re-record/cleanup, denied/unsupported mic, Sound toggle, replay, and themes.
- Byte comparison confirmed preservation of all original files except the five explicitly modified files above.

**Validation limitation:** this session's environment blocked Chromium startup (`socket() failed: Operation not permitted`). The new browser suite is included but did not execute. Therefore fresh desktop/mobile rendering, real browser reload, physical microphone, audible voice quality, and browser console verification are not claimed as passed for 4.3.1. DOM/mocked-audio tests do not replace those checks. The working Phase 4.3 audio architecture was preserved exactly, as requested.

The stylesheet retains existing responsive rules and adds 48px practice controls, single-column mobile cards/recording controls, and scoped hidden-state behavior. Visual device testing remains necessary.

Run from `tests` after `npm ci`:
```
node phase4.3.1.mjs
node phase4.3.1-dom.mjs
node phase4.3.mjs
node phase4.2.4-dom.mjs
node phase4.2.4-completion.mjs
node phase4.2.4-navigation.mjs
```
With a supported Chromium environment:
```
npx playwright install chromium
node phase4.3.1-browser.mjs
node phase4.2.4-browser.mjs
```
The new browser suite accepts an optional `RACHA_CHROMIUM` executable path.

## Deploy
Use the existing repository and hosting setup; a new repo is not required. Extract this complete ZIP and update the existing application files, including the new `js/practice-sessions.js`. Keep `index.html` at the same deployment root. No teacher email or code edits are needed. Keep the same site origin to retain browser-local student progress. This package was not deployed automatically.
