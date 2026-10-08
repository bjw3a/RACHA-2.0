# Racha 2.0 — Phase 4.4

## Source and scope

Incremental upgrade of the complete `Racha-2.0-Phase-4.3.1(1).zip`.
The source archive is unchanged. The output contains the entire app and all previous documentation.
No new service, account, API, upload, speech recognition, or paid dependency was added.

All existing Spanish 1 and Spanish 2 topics, unit reviews, and course reviews use their existing
curriculum content. The supplied Phase 4.3.1 curriculum has no Clothing topic; this upgrade does
not invent a new unit. Flashcards remain disabled, with their source and content preserved.

## Eight-level path

1. Match-Up
2. Recognition
3. Typing
4. In Context
5. Story Challenge
6. Listen & Choose
7. Listen & Type
8. Read & Record

The first five game implementations and names are preserved. Up Next, activity counts, replay
lists, topic completion, and unit completion all use the same eight-entry sequence.
There is no separate optional Listen & Speak menu. New audio levels always offer Back to Topic.
A passed listening result returns to the topic path with the next level ready. Finishing speaking
shows Topic Complete, with the topic/unit summary available through the completion button.

## Scoring and speaking

Levels 1–7 require 80% mastery. Each listening session uses ten topic-based questions when
available; smaller future banks use available questions. Every submitted answer counts once.
Mistakes show the correct answer, remain in the attempt score, and allow Next. Retrying starts a
fresh session. Audio replay does not affect scoring. Dictation retains the existing accent,
punctuation, and whitespace normalization, including the distinction between ñ and n.

Read & Record uses ten prompts. Next is disabled until the student makes a recording and its
playback finishes. Record Again invalidates the prior playback gate. No minimum capture duration
or pronunciation score is required. The existing 60-second automatic stop remains a resource
limit, not a minimum recording requirement.

If the microphone is missing, blocked, denied, or fails, the student listens to the model,
practices aloud, and checks an explicit confirmation for each prompt. The confirmation is disabled
until the model finishes. When Spanish speech itself is unavailable, the fallback explicitly asks
the student to read and say the prompt aloud, then confirm. Sound Off is not treated as an audio
failure: the student must turn it on before listening. Simply displaying a prompt earns no credit.

Speaking mastery stores `best: null`; reports say “Completed (practice; no pronunciation grade).”
Recordings stay in temporary browser memory. Leaving, advancing, hiding the page, or re-recording
releases audio resources. No recording is stored in localStorage, uploaded, or attached to email.

## Saved progress and rewards

The `racha-progress-v1` storage key and original five mode IDs remain unchanged.
Loading a legacy profile retains mastery records, XP, achievements, personal records, reward
high-water marks, sound/theme preferences, and resume state. Completion is derived from all eight
levels. Therefore 0/5 → 0/8, 2/5 → 2/8, and 5/5 → 5/8, with the appropriate next activity unlocked.

Old topic completion dates are removed from the in-memory profile when all eight requirements
are not met, then persisted on the next normal save. Existing five mastery timestamps remain.
Repeated loading/saving is idempotent and awards nothing. Completing all eight creates the new
completion timestamp. Fully completed Phase 4.4 topics keep their completion dates.

Listening XP follows the existing per-activity improvement cap: 10 XP per correct answer,
20 per finished round, and 25 for mastery. Only the amount above that activity's prior best reward
is awarded. A completed speaking session is capped at 100 XP per course/topic. Replays cannot
farm speaking XP, and duplicate settlement of the same session has no effect. Existing badge IDs
and earned badges are retained; new finishes participate in the existing finish/practice-count
and correct-answer badges. Recording prompts do not count as correctly answered questions.

## Changed files

- `js/progression.js`: eight-level sequence, audio assessment, completion-based speaking record.
- `js/engine.js`: metadata for the three integrated levels; original games unchanged.
- `js/storage.js`: safe derived migration, speaking persistence, capped audio rewards.
- `js/app.js`: integrated entry points, path/replay states, summaries, navigation.
- `js/practice.js`: one official level per session, scoring, retry/results, per-prompt speaking gates.
- `js/practice-audio.js`: model-ended/playback-ended and availability callbacks; existing audio retained.
- `js/unit-completion.js`: all-eight eligibility and accurate speaking report text.
- `styles.css`: touch-friendly confirmation styling.
- `index.html`, `README.md`, `CHANGELOG.md`, `TESTING.md`, and this document: current release information.
- `tests/package.json` and `tests/phase4.4*.mjs`: current reproducible regression gates.

Curriculum, readings, vocabulary, session generation, flashcard code/data, `js/config.js`, and
all previous phase documentation are preserved. The configured teacher email is byte-for-byte
unchanged. The existing mailto draft and copy workflows remain; email sending is still manual.

## Validation performed

`npm test` selects ten current suites, covering:

- All topics and unit/course reviews, original games and 80% boundaries, matching retries,
  Recognition, Typing, In Context, Story Challenge, resume, and saved personal records.
- 6,048 accepted time variants across all 720 hour/minute combinations, wrong-time rejection,
  numeric instructions, accents, ñ, and both-course typing content.
- Twenty randomized sessions per audio mode/selection, ten-item coverage, topic containment,
  answer uniqueness, known synonym exclusions, and no vosotros.
- Realistic legacy 0/5, 2/5, 5/5 records, repeated migration, XP/achievement preservation,
  level locks, speaking persistence without an invented score, and repeated/reloaded reward caps.
- Twenty integrated DOM sessions over Family, Greetings, Time, Adjectives, and Spanish 2 -ER;
  recording/playback/re-record gates, explicit fallback, missing microphone/voice, sound, themes,
  transcript timing, failed/passed listening attempts, summaries, and copied reports.
- All 12 units require every topic/activity; reports, saved student names, configured mailto,
  clipboard fallback, completion dates, and separate-course resume.

`npm run test:browser` passed in Chromium with real MediaRecorder and HTML Audio using a
synthetic microphone. It covered 70%/80% listening attempts, sequential unlocks, all ten recording
prompts and completed playback, denied-microphone completion, reload persistence, no replay XP,
completion summaries/copy, sound/replay, released microphone tracks, and no page errors.

Responsive checks passed at 320, 390, 768, and 1366 pixels in both themes with no horizontal
overflow and at least 48-pixel visible audio-activity buttons. Desktop and phone screenshots
were rendered and inspected.

Historical tests that require the old five-level path, optional practice menu, or active Flashcards
are retained as historical references and are superseded by the current package test scripts.

## Remaining limitations

Speech voices and microphone access depend on the student's browser/device. Speech synthesis
was stubbed for deterministic automation; voice selection and unavailable-voice handling were
unit-tested. Human audio quality and physical Chromebook/tablet/phone microphones still need
an on-device check. Chromium capture/playback used a synthetic input, not a human speaker.

Listening still requires a working Spanish browser voice; no substitute listening score is
invented when speech is unavailable. Speaking has the explicit read-aloud fallback described above.
Browser saved progress remains local to the same website origin and browser. No production
deployment or actual completion email was sent as part of this ZIP delivery.
