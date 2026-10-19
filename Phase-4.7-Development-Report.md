# Racha 2.0 — Phase 4.7 Development Report

Date: October 19, 2026

## Release status

Incremental mobile-focused implementation completed. Automated logic and DOM tests pass. **Rendered browser QA is blocked in this environment; this is a development build pending visual and real-device acceptance, not an app-store-ready release.** No repository was modified and nothing was deployed.

Source: the actually attached `Racha-2.0-Phase-4.6.1(4).zip`. The prompt named `(3).zip`; it was not the attachment used. Original ZIP untouched. SHA-256: `e0140f15ecad76f1677142877e04f93326e6049ef8afe3a2bad9e7f46d2a3071`.

## Changes

- Preserved lime/lavender palette, dark/light themes, system typography, cards, rewards, and existing curriculum modules. No runtime dependencies, accounts, paid services, framework, or native packaging added.
- Added safe-area support and `viewport-fit=cover`; compacted phone headers, cards, questions, feedback, audio controls, and results controls. Added wrapping protection, 44px minimum button heights, 44×44 accent keys, 52px primary question actions, and touch behavior without hover movement. Long content remains vertically scrollable.
- Replaced full-window-only positioning with VisualViewport-aware input/submit positioning. Keyboard resize bursts are debounced; controls stay in document flow. Very small viewports prioritize the input; normal scrolling and keyboard Done remain available. Added `enterkeyhint="done"` to both typing forms. Preserved Enter submission and reduced-motion support.
- Added an in-activity Turn Sound On action, clearer requesting/recording/stopping labels, and distinct permission-denied, microphone-missing, and busy/unavailable messages. Preserved one Spanish model playback button, replay, recording/playback gates, temporary recordings, resource cleanup, and explicit practice-aloud fallback. No pronunciation scoring claimed.
- Added consistent leave confirmation for unfinished audio and standard rounds, including the home logo. Browser unload warning is best effort. Completed activities remain saved; unfinished rounds still restart if the user confirms leaving or the OS terminates the app.
- Added level number to standard question headings; retained Back, Next Level, Next Topic, and results controls.

## Activity sequence and curriculum decisions

The supplied ZIP differed from the requested sequence. The Phase 4.7 specification takes precedence:

| Level | Phase 4.7 activity | Stable storage ID | Round size |
|---|---|---|---|
| 1 | Match-Up | match | 6 pairs |
| 2 | Listen & Choose | choose | 10 questions |
| 3 | Recognition | quick | 10 questions |
| 4 | Listen & Type | type | 10 questions |
| 5 | Typing | lives | 10 questions |
| 6 | Read & Record | record | 10 prompts |
| 7 | Choose English | streak | 5 questions |
| 8 | Mixed Review | story | 5 questions |

Substantive curriculum changes:

1. Level 7 previously displayed **In Context**, a five-question typed cloze activity. It now presents five Spanish-to-English choices using the existing taught translation bank and synonym-filtered distractors. The original cloze generator remains in `data.js` for future use but is no longer on the eight-activity path. Old level-7 mastery is credited rather than revoked; historical scores may therefore represent the former cloze activity.
2. Level 8 previously displayed **Story Challenge**. It is now named **Mixed Review**, retaining its existing passages, questions, five-answer length, and 80% threshold. Topic reviews use that topic; unit reviews combine constituent topics. Unit Mixed Review remains the final topic in each unit.
3. Spanish 1 introductory units 1–3 Listen & Choose sessions now use only existing taught vocabulary/phrase items, excluding authored comprehension clips that introduced contextual nouns or verbs. Small banks repeat selected items to retain ten questions. The 45 authored short clips and later-course passages remain in source; later listening comprehension is retained.
4. Earlier source corrections to beginner greetings/origin text were retained. No additional grammatical error was identified and corrected in this phase; this is not a claim of exhaustive linguistic validation. No large reading rewrite, vosotros introduction, or change to Latin American forms was made.

Accent/case/punctuation tolerance remains unchanged. Meaningful differences—including ñ, negation, number, and agreement—remain checked. Scored mastery stays at 80%; Match-Up requires 5/6 first attempts. Speaking remains participation-based with explicit fallback when unavailable.

## Progress compatibility

The existing `racha-progress-v1` key and activity/topic IDs remain intact. All 256 possible completed-activity combinations were tested for loading, preservation, earliest-missing progression, and replay. Reordering can change which unfinished activity is next; completed activities remain replayable. XP, badges, bests, completion dates, and per-course resume remain compatible on the same browser origin. Moving to another host or a native app does not automatically transfer browser storage.

## Files modified

- `index.html`: release title and safe-area viewport metadata.
- `styles.css`: scoped Phase 4.7 responsive and touch refinements.
- `js/viewport.js`: visible-viewport positioning and keyboard resize handling.
- `js/app.js`: sequence integration, English-choice rendering, activity location, navigation guards, inline sound control, typing metadata.
- `js/engine.js`: requested activity names and descriptions; round lengths preserved.
- `js/progression.js`: requested display/progression order with stable IDs.
- `js/practice-sessions.js`: English-choice questions, taught-only early listening, ten-question repetition for small banks.
- `js/practice.js`: sound action, recording-state labels, active-round status, typing metadata.
- `js/practice-audio.js`: actionable microphone error messages.
- `tests/package.json`: current test suite and browser QA command; legacy command retained for historical reference.
- `README.md`, `TESTING.md`, `CHANGELOG.md`: current release and test guidance.

Added: `tests/phase4.7-{content,migration,flow,audio-dom,ui,viewport,leave,browser}.mjs`, this report, `Future-App-Store-Readiness.md`, and `tests/phase4.7-results.txt`. Historical files/tests remain included; tests asserting old activity names/order are superseded by the 4.7 copies, not silently represented as passing.

## Tests and results

**15 current automated suites passed** using Node 24, JSDOM, fake timers, and simulated audio/microphone APIs. Test-only dependencies were installed locally and are excluded from the ZIP; existing lockfile retained.

| Coverage | Result / evidence |
|---|---|
| Both courses, all units/topics/reviews, mastery boundaries | Passed core and session suites |
| Complete fresh eight-activity journeys | Passed DOM journeys in Spanish 1 Days and Spanish 2 -ER verbs |
| Choose English content | Passed 3,400 generated questions over both courses and reviews; one accepted choice, valid taught translations |
| Listening/typing/speaking session size and scope | Passed 20 randomized sessions per selection/type; ten prompts retained |
| Time, numeric answers and tolerance | Passed 6,048 time variants, wrong-time rejection, accents, punctuation, ñ, agreement and negation checks |
| Saved progress | Passed all 256 mastery combinations, repeated loads/saves, retained XP/badges, no duplicate rewards |
| Audio/recording | Passed mock speech, record/stop/play/re-record, denied/missing permission, missing voice/recorder, sound toggle, late permission cleanup and fallback tests |
| Results/navigation/completion | Passed both-course journeys, all 12 unit gates, Next Level/Topic, resume, optional reports and copy fallback |
| Accidental exit | Passed cancel/confirm guards and beforeunload conditions in DOM; completed XP retained |
| Keyboard positioning | Passed simulated geometry for reduced height, viewport offsets, tiny viewport, resize, long content and detached screens |
| Rendered layout at 320/375/390/430/1366px | **Not verified.** Chromium launch blocked by environment socket permissions before any page rendered |
| Real audio quality, microphone and phone keyboard | **Not tested on actual devices** |

Browser test attempt: Chromium 134 downloaded successfully, but launch terminated with `socket() failed: Operation not permitted` before page rendering. No screenshots, actual media capture, or browser layout results are claimed. `npm run test:browser` supplies a current two-course, eight-activity, two-theme matrix at the five widths for an unrestricted test machine. That suite itself remains unexecuted here. JSDOM does not render CSS; mocked geometry is not proof of screen fit.

## Known limitations and acceptance checklist

- Verify portrait layouts at 320×568, 375×667, 390×844, 430×932, plus Chromebook 1366×768 and a larger desktop. The supplied browser suite uses height 844 for phone widths; manually add short 568/667 heights. Check all eight modes, results, long passages, completion forms, zoom, and both themes for overflow, overlap and readable scrolling.
- On iPhone Safari and Android Chrome: open/close keyboards repeatedly; use accent keys; submit with Done and the button; move through feedback/Next; check browser chrome and safe-area insets. VisualViewport handling is implemented but not device-validated.
- Test speaker/Bluetooth output, replay, initial voice loading, permission allow/deny/re-enable, recording and playback, calls/background interruptions, and stop/Back cleanup. Missing Spanish voices still prevent scored listening; there is no fabricated mastery bypass.
- Unfinished rounds are not checkpointed. Mobile OS termination may bypass unload warnings. Browser back/refresh may leave the app rather than traverse an in-app history stack.
- Progress is local to the browser/origin; clearing site data, private sessions, storage eviction, reinstall, or changing host may lose access. No backup/import or native storage integration was added.
- No offline cold-start support/service worker yet. Web speech voice availability and offline behavior depend on the device/provider; no pronunciation evaluation exists.
- Existing optional classroom completion functionality and configured teacher email are preserved. Review/remove school-specific destination and wording before public distribution.

Open through a local web server, not a file:// double-click. See README for instructions. No deployment or repository action was performed.
