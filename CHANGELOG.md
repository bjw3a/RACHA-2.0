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
