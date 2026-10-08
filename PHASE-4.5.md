# Racha 2.0 — Phase 4.5

## Exact source and focused scope

This complete app is an incremental upgrade of `Racha-2.0-Phase-4.4(2).zip`.
The source ZIP is preserved. No repository was created or modified and nothing was deployed.
The intended existing repository remains `bjw3a/RACHA-2.0`.

Source SHA-256: `21fe286734cb7362ce47d7b6c21df5e0050647f9ba1eb8b15de86d5713d34b9c`

## Required order, used across both courses

| Level | Stable ID | Activity | Mastery |
|---|---|---|---|
| 1 | match | Match-Up | 80% (at least 5 of 6 first pair attempts) |
| 2 | choose | Listen & Choose | 80% |
| 3 | quick | Recognition | 80% |
| 4 | type | Listen & Type | 80% |
| 5 | lives | Typing | 80% |
| 6 | record | Read & Record | Every prompt practiced; no pronunciation score |
| 7 | streak | In Context | 80% |
| 8 | story | Story Challenge | 80% |

All original question sets, content generation, feedback, scoring, and retry behavior are unchanged.
The first unfinished activity in this order is Up Next. Completed activities remain available
for replay. Other unfinished activities are locked. After passing a round, continuation skips
any activities already mastered. Fresh students must finish Story Challenge to complete a topic.

The progress count remains out of eight. Audio screens derive their level numbers from the shared
sequence rather than hard-coded labels. Read & Record instructions are selected by activity ID.
The completed-topic replay button now opens Story Challenge. There is no optional audio menu.

## Progress protection and migration strategy

Inspection confirmed Phase 4.4 already stores mastery by activity ID under `racha-progress-v1`,
for example `mastery['1:family'].quick`, not by level number. Phase 4.5 changes the order in which
those same eight IDs are visited; it does not rename, translate, or reset records.

No new data migration or version marker is necessary. Loading the same valid Phase 4.4 profile
repeatedly preserves its activity mastery, scores, timestamps, XP, achievements, records, XP
high-water marks, course/topic resume data, and preferences. No reward function runs on migration.
The existing storage loader is byte-for-byte unchanged.

The relevant changes are derived navigation rules:

- Play is permitted for the earliest unfinished activity OR any already-mastered activity.
- Up Next and original-game result continuation both use the earliest unfinished activity.
- Completion requires all eight IDs, regardless of their order; existing completed topics remain
  complete, including their completion dates.
- Replaying a migrated Story Challenge cannot claim Topic Complete if another activity is missing.

| Migration example | Retained mastery | Up Next |
|---|---|---|
| A: New student | None | Match-Up, Level 1 |
| B: Match-Up + Recognition | Both, now at Levels 1 and 3 | Listen & Choose, Level 2 |
| C: Original five mastered | All five, at Levels 1, 3, 5, 7, 8 | Listen & Choose, Level 2 |
| D: All eight mastered | All eight; topic remains complete | Replay available |
| E: Match-Up + Listen & Choose | Both, at Levels 1 and 2 | Recognition, Level 3 |

For B and C, mastering Listen & Choose skips the saved Recognition mastery and targets Listen & Type.
For C, completing the remaining audio activities can complete the topic because both final
challenges were already mastered; the student does not have to repeat those challenges.

XP and achievements use the unchanged Phase 4.4 high-water-mark system. Equal/worse repeats award
no duplicate XP; genuine improvements may earn additional XP as before. Stored achievements are
not duplicated. Unit completion, topic summaries, and email reports iterate the shared sequence
and therefore present results in the new order while retaining actual mastery values.

## Files changed

- `js/progression.js`: activity order and replay permission across gaps.
- `js/app.js`: earliest-unfinished result continuation, updated rule/lock labels, Story replay.
- `js/practice.js`: derive audio level numbers from the shared sequence.
- `index.html`: Phase 4.5 title.
- `README.md`, `CHANGELOG.md`, `TESTING.md`, this document, and test scripts/package configuration.

Byte-for-byte checks confirmed that storage/reward logic, activity engine, audio implementation,
practice data/session generation, curriculum, readings, vocabulary, teacher email configuration,
unit email workflow, CSS, and flashcard code/data are unchanged. Previous documentation and tests
remain included. Flashcards are still disabled. Recordings remain private and temporary.

## Verification

Before editing, all ten selected regression suites passed on the exact Phase 4.4(2) source.
After editing, the current `npm test` runs ten suites covering:

- All original activities, 80% thresholds, topic and unit-review data, context word banks,
  time-answer variants, both-course typing, and disabled Flashcards.
- The exact new order and migration examples A–E in both courses.
- Every one of the 256 possible combinations of mastered activities, ensuring preserved identity,
  replay access, correct locks, earliest missing activity, and no required repeats.
- Repeated load/save idempotence, XP/achievement/history retention, full completion timestamps,
  listening fail/pass thresholds, speaking completion without a score, and reward deduplication.
- Fresh complete 1→8 UI journeys in Spanish 1 and Spanish 2. Read & Record at Level 6 does not
  prematurely complete a fresh topic; Story Challenge at Level 8 does.
- Migrated B–E UI states, later-activity replay across gaps, skipping completed Recognition, and
  preventing a replayed Story Challenge from falsely reporting topic completion.
- Twenty audio DOM sessions across Family, Greetings, Time, Adjectives, and Spanish 2 -ER,
  including recording/playback/re-record gates, denied/missing microphone, missing voice,
  explicit fallback, sound/theme controls, copied summaries, and replay rewards.
- All 12 units, ordered completion reports, saved student names, mailto encoding/click handling,
  clipboard fallback, and browser persistence.

`npm run test:browser` checks Chromium with real MediaRecorder/HTML Audio and a synthetic microphone:
new activity order, Levels 2/4/6 labels, 70%/80% listening attempts, ten recording prompts and
completed playback, denied-mic fallback, no duplicate replay XP, reload persistence, summaries,
copy workflow, released microphone tracks, and no page errors. It also checks 320, 390, 768, and
1366-pixel layouts in both themes with no horizontal overflow and 48-pixel audio buttons.
Phone and desktop screenshots are rendered for inspection.

Current package scripts select the updated tests; historical tests asserting the old Phase 4.4
order remain historical references. No production email was sent.

## Existing limitations retained

Spanish speech voices and microphone access depend on the browser/device. Automation stubs the
Spanish speech output for deterministic content checks and uses a synthetic microphone; human
voice quality and physical classroom microphones still require an on-device check. Speaking has
the existing listen/practice-aloud/confirm fallback, with read-aloud instructions when speech is
also unavailable. Listening needs a working Spanish browser voice.

Existing Listen & Choose content is preserved exactly: vocabulary uses four choices when available,
while authored passage-comprehension questions retain their three vetted choices. No new distractors
were invented as part of this ordering-only update.

Saved progress remains specific to the existing website origin and browser. Upload the extracted
ZIP contents to the existing repository root, with index.html at root; retain the existing website
address and do not clear student browser data. No teacher-email reconfiguration is necessary.
