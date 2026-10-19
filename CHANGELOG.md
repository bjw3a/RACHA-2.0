# Phase 4.7.1 — October 19, 2026

Removed school email and email-draft reporting; added validated user-controlled backup/merge; preserved historical Level 7 credit with separate Choose English evidence and optional replay; spaced repeated listening clips. 17 automated suites pass; rendered/mobile hardware QA remains pending due blocked Chromium launch. No deployment or Phase 4.8 changes. See current report/checklist.

# Phase 4.7 — October 19, 2026

Mobile safe areas and touch layouts; VisualViewport keyboard support; consistent unfinished-round guards; in-activity sound control and clearer microphone states; requested eight-activity sequence; taught-only early listening with ten questions; Choose English at level 7 and Mixed Review at level 8 with stable storage IDs. See the Phase 4.7 development report for migration details, 15 passing automated suites, and blocked rendered/device QA. No deployment.

# Phase 4.6.1 — 2026-10-10

- Verified Mixed Review last in all 12 rendered unit lists; preserved the latest ZIP's existing topic IDs and order helper.
- Added prominent Next Topic on completed paths and results, including audio results for older saved progress. It opens the first unfinished topic in displayed order at its next unlocked activity. Completed topics are skipped; legacy gaps remain playable.
- Mixed Review now completes the unit path; unit reports include review performance. Existing mastery, XP, achievements and dates remain intact. Older unit badges/reports wait for unfinished review.
- Added conditional question positioning and compact spacing, keeping readable type and touch targets. Long stories and small screens retain scrolling.
- Replaced full-passage introductory listening with 45 question-specific clips across Spanish 1 Units 1–3. Existing short dictation/speaking vocabulary retained; longer stories and later listening retained.
- Removed duplicate Hear Spanish Again; Hear Spanish remains reusable, alongside Record Again and Play My Recording.
- Kept speech recognition disabled after privacy/compatibility review. Recording/playback measures participation only.
- Preserved teacher email, local progress keys, 80% mastery, eight activities, sounds, themes and forgiving validation.
- Updated regression tests for required final review, Replay Topic, and Back to Topics; added content and real-browser layout/navigation checks.

---

# Phase 4.6

Beginner transcription, shared grading regression coverage, recognition-before-listening order, review-last topics, stable saved progress, cleaner results, gradual Spanish feedback, and recording playback fallback. See PHASE-4.6.md for the audit, QA, and deployment instructions.

# Phase 4.5 — Interleaved Listening and Speaking (October 8, 2026)

- Based on the exact `Racha-2.0-Phase-4.4(2).zip`; no repository changes or new repository.
- Reordered existing activities: Match-Up → Listen & Choose → Recognition → Listen & Type → Typing → Read & Record → In Context → Story Challenge.
- Kept mastery associated with stable activity IDs; no storage rewrite, reward replay, or numbered-level migration is needed.
- Made every mastered activity replayable even when earlier prerequisites are unfinished. Up Next and result continuation target the earliest missing activity and skip already-mastered ones.
- Updated audio level labels, mastery instructions, locked-state hints, and final Story replay. Completion still requires all eight activities.
- Preserved all questions, scoring, reward/storage logic, audio behavior, teacher email, curriculum, styling, and disabled Flashcards.
- Added migration examples A–E, all 256 mastery combinations, fresh journeys in both courses, and updated audio/browser regressions. See PHASE-4.5.md.

# Phase 4.4 — Eight Integrated Activities (October 8, 2026)

- Preserved Match-Up, Recognition, Typing, In Context, and Story Challenge; integrated Listen & Choose, Listen & Type, and Read & Record as Levels 6–8.
- Updated topic paths, locked/replay states, completion indicators, summaries, and email reports for eight activities; removed the optional practice entry/menu.
- Listening attempts use ten questions and an 80% threshold. An incorrect answer remains incorrect in that attempt; unlimited whole-round retries are available.
- Speaking requires a recording and completed playback for every prompt, with an explicit practice-aloud fallback when the microphone is unavailable. No pronunciation score is stored or shown.
- Preserved the storage key, original mastery, XP, achievements, content, and teacher email. Old five-level completion dates are invalidated; new eight-level completion gets its own date.
- Added capped audio activity rewards, migration/regression/UI tests, and PHASE-4.4.md. Current automated and Chromium synthetic-microphone checks passed.

# Phase 4.3.1 — Structured Listening & Speaking (October 7, 2026)

- Moved optional Listen & Speak above the required Up Next card.
- Added clear Listen & Choose, Listen & Type, and Read & Record activity menus.
- Added ten-prompt topic-based sessions, Check/retry feedback, delayed transcripts, forgiving dictation, and completion/restart/back screens.
- Preserved working Phase 4.3 audio/recording, private temporary recordings, disabled Flashcards, five mastery activities, and saved progress.
- Added data/DOM/browser regression scripts and PHASE-4.3.1.md. Data and DOM tests passed; browser startup was blocked by the execution environment, so fresh visual/device checks remain outstanding.

# Phase 4.3 — Listening & Speaking (October 7, 2026)

- Added optional topic-based sentence, vocabulary, and listening practice for both courses.
- Added Spanish browser speech with Latin American voice preference and the existing Sound toggle.
- Added private temporary microphone recording, playback, re-record, and safe cleanup/fallbacks.
- Preserved all five mastery activities, questions, progress storage, XP, achievements, completion/email, and disabled Flashcards.
- Added reusable audio/data/UI modules, regression tests, and PHASE-4.3.md with compatibility and validation details.

# Phase 4.2.2

Simplified course-specific Learn navigation; clear Next Card action; optional whole-unit email/copy reports with editable saved student names. See PHASE-4.2.2.md.

# Phase 4.2.1 — Flashcards refinement

- Review Everything now samples 30 cards balanced across units for both courses.
- Retained all 465 Spanish 1 and 406 Spanish 2 course-review cards.
- Clarified PRACTICE MISSED CARDS / START OVER / NEW 30-CARD REVIEW labels.
- START OVER restores the entire original topic/unit set after missed-card rounds.
- Corrected buenas noches to good evening / good night in Flashcards only.
- Preserved approved visuals, Learn, curriculum, and local storage unchanged.

# Phase 4.2 — Flashcards

- Added course → Learn / Flashcards navigation with a compact home.
- Added topic, unit, and shuffled course review for Spanish 1 and 2.
- Added reveal, Know it, Again, missed-card practice, and unanswered-card shuffle.
- Centralized derived card data with future audio fields; no learning progress writes.
- Preserved Phase 4.1 activities, mastery, word-bank boxes, content, and saved progress.
- Standardized reading quotation marks without changing reading difficulty.
- Added and ran regression, Flashcards, and responsive Chromium tests.

# Racha 2.0 — Phase 4

- Five required activities: Match-Up → Recognition → Typing → In Context → Story Challenge. Each requires at least 80%; matching uses five of six first attempts. Replay remains available.
- Speed Round and 60-Second Challenge removed from the required path. Their underlying engine code and historical records remain. Three Lives becomes ten untimed typing questions; Streak becomes five sentence completions with a word bank drawn from the selected topic’s existing passage.
- Recognition always uses choices. Typing always uses an input. Directions match the answer language. Context uses Spanish sentence completion; the final challenge retains reading comprehension.
- Case, vowel accents, apostrophe variants and sentence punctuation are optional in typed answers. Unicode normalization handles decomposed accents; ñ remains distinct. Answers require exact normalized matches; wrong conjugations remain wrong.
- English sentence translations inherit appropriate punctuation from their Spanish originals. Questions display question marks. Vocabulary labels remain labels.
- Homepage emphasizes Continue Learning and course selection. Stats and achievements are collapsed. Units and topics remain freely accessible.
- Continue Learning saves the last started topic and opens its next unmastered activity. Completed topics open their summary and replay list. Old Phase 3 data did not record a last-used topic; start one activity to establish a resume location.
- Topic completion includes course, unit, topic, date and best mastery for every required activity. Optional name is used only in the current summary. Copy button includes a manual selection fallback for restricted clipboard access. Schoology submission and screenshots remain student actions.
- Existing localStorage key, XP, badges, personal records and valid earned mastery are retained. Old mastery of the retained activities is honored without requiring students to repeat them. Retired activity mastery is also retained. Dates are recorded on new completion; earlier undated completions are labeled date unavailable.
- Removed Spain plural pronouns and conjugations from both courses and all generated choice pools. Formal singular SER examples use “usted ___ profesor.”
- No accounts, services, database, build step, or deployment URL changes.
