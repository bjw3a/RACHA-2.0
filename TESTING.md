# Phase 4.6.1 testing report

## Passed
- Full npm test suite: curriculum and generation, 80% thresholds, all 256 activity-mastery combinations, legacy saved progress, XP/badges/replay, forgiving answers, meaningful negation/ñ/grammar rejection, 6,048 time-answer variants, full eight-activity DOM journeys in both courses, completion reports, clipboard fallback, teacher mailto encoding and simulated click.
- 20 randomized sessions per selection/mode: ten-item sessions, topic containment, unique choices, accepted answers, deliberate repetition in short banks.
- Integrated audio DOM tests: 20 sessions across both courses; record/play/re-record gates, denied/missing microphone, missing voice, sound toggle, cleanup, summaries and replay XP.
- New content tests: 45 introductory clips <=10 words, exact answer keys, Mixed Review bank containment, final-review completion gates and report coverage in all 12 units.
- Chromium 153: actual rendered order in every Spanish 1/2 unit; Next Topic opens Introductions, then Mixed Review; review completion exposes unit email; XP remains unchanged by navigation.
- Chromium: all eight activities in both themes at 1366×768 and 390×844; no horizontal overflow; full question/control area fits Chromebook viewport for the seven shorter activity types. Story deliberately permits scrolling. Screenshots inspected for listening and recording.
- Existing Chromium audio journey: 70% fail/80% pass and unlocks; actual MediaRecorder and playback with synthetic microphone; ten prompts; denied-mic fallback; reload; copy summaries; sound replay; stream cleanup; 320/390/768/1366 widths; both themes; 48px audio touch targets. Browser speech synthesis is stubbed in this test.
- No browser JavaScript errors in either browser suite.

## Changes to older tests
Tests now require final Mixed Review before unit completion and expect Replay Topic/Back to Topics navigation. A pre-existing randomized word-bank assertion was made case-insensitive to match the existing grading and deduplication behavior; no grading code was changed.

## Remaining manual checks
- A real district Chromebook microphone, audible model Spanish, student recording, playback and Record Again. Synthetic-mic tests do not establish microphone quality, real speech, classroom noise or district permissions.
- Actual email app opening and sending the completion draft to Mr. Walsh; automated tests inspect the encoded draft but send no email.
- District network access to the existing GitHub Pages URL and a hard refresh after deployment.
- Teacher review of clip difficulty with students, particularly contextual time/month/subject questions. Recognition and pronunciation scoring are intentionally absent.

## Reproduce
From tests/: npm ci, then npm test. Install Playwright Chromium and run npm run test:browser. An installed Chromium can be selected with RACHA_CHROMIUM=/absolute/path/to/chromium. Test dependencies are not runtime dependencies and are not included in the ZIP. Browser screenshots are written to /tmp by default.

No live site was changed.
