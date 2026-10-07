# Racha 2.0 — Phase 4.2.2

Starting package: Racha-2.0-Phase-4.2.1(1).zip (approved Phase 4.2.1).
This is the complete static GitHub Pages application. index.html is at ZIP root.

## Before deployment

Open js/config.js and put your school email between the empty quotes:

```js
export const TEACHER_EMAIL = '';
```

This is the single teacher email setting. With it blank, the email button is disabled and Copy Completion remains available. No password is needed. Students must press Send in their configured email app; Racha never claims the message was sent. If an email app does not open, students can copy the report into Schoology or email.

Extract this ZIP and upload its contents, including js/config.js and js/unit-completion.js, to the existing TEST repository root. Keep index.html at root. No deletion of the repository is needed. The teacher email must be set to enable email submission; the application otherwise works with it blank. This package has not been deployed to either repository.

## Changes

- Learn shows only the selected course's units. Removed its duplicate course switcher, breadcrumb label, and topic-count/mixed-review card metadata. Existing unit cards/icons remain. Stats and achievements are still available below the cards.
- Continue Learning within Learn stays in the selected course. The homepage retains its global resume action. Existing last-topic data still loads; a small optional per-course resume map remembers each course as students continue.
- Flashcards: NEXT CARD → with the small label “I know it” keeps the original known-card action. REVIEW LATER keeps the original missed-card action. Reveal is still required first.
- UNIT COMPLETE appears when every named topic in a unit has all five existing activities mastered. Mixed review alone cannot complete a unit. It remains separate optional practice, as before. For single-topic units, mastering that topic also completes the unit.
- The unit panel appears on the completed unit's topic-selection page and its completed-topic result/progress screens. Individual activities/topics never enable submission unless the entire unit is also complete. Existing individual-topic summaries remain available.
- Unit reports contain the saved student name, course, unit, all mastered topics, best mastery percentages for each activity, and the actual latest required completion timestamp. Old progress without reliable dates says the date is unavailable; it is not assigned today's date.
- Student name is saved separately as racha-student-name-v1, stays editable in each unit panel, and does not alter progress. A name is required only when preparing a report, never to learn.
- Copy Completion uses the same report as the email body. If clipboard access fails, a selected text box permits manual copy.
- Reporting is optional and does not award XP, gate progression, or change mastery.

## Preserved

Curriculum, readings, engine, mastery rules and flashcard data are byte-for-byte unchanged from Phase 4.2.1. Homepage layout, the five-activity progression, 80% requirements, vocabulary/difficulty, typing/word banks, 465 Spanish 1 and 406 Spanish 2 flashcards, balanced 30-card reviews, missed-card behavior, XP, achievements, records, existing topic summaries, sounds and themes remain. The existing racha-progress-v1 key is retained. No backend, API, authentication, credentials or paid service was added.

Progress remains on the same browser and site address. An email report is editable by the student and is not an authenticated teacher record.

## Verification

- Existing Node/DOM regression suite, with navigation tests updated for the removed course switcher.
- 1,000 balanced, deduplicated 30-card reviews and unchanged full vocabulary counts.
- New unit-completion tests across all 12 units: missing activity/topic blocks reporting; mixed review alone does not qualify; final activity unlocks reporting; scores/dates come from progress.
- Stored name/edit, empty-name handling, configured mailto click and special-character encoding, identical email/copy reports, successful clipboard and manual fallback, old progress, course-specific resume, and optional submission.
- Real Chromium desktop/mobile tests at 320×568, 390×844, 768×1024 and 1366×768 for existing learning/flashcard flows. New Learn/completion/Next Card layout tests at 320, 390 and 1366 pixels, both courses and themes; screenshot inspection.
- JavaScript syntax, unchanged-source comparison, ZIP integrity and root-level index.html.

A real school-device email send was not performed; mailto behavior depends on that device's configured email application. Test the configured email button on a school laptop before assigning submission.
