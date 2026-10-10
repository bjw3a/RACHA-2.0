# Racha 2.0 — Phase 4.6

Built from the supplied `Racha-2.0-Phase-4.5(2).zip`. This is an incremental update for the existing `bjw3a/RACHA-2.0` repository. No live deployment was changed.

## What changed

- Eight activities now run in this order: **Match-Up → Recognition → Typing → Listen & Choose → Listen & Type → Read & Record → In Context → Story Challenge**.
- Mixed Review appears last in every unit in both courses. Its existing ID, content scope, and optional status are preserved. Required-topic completion still controls unit completion; moving the review does not impose a new graduation requirement.
- One shared answer comparison handles ordinary typed answers and dictation. Capitalization, vowel accents, repeated/outer whitespace, sentence punctuation, quotation marks, and common straight/curly apostrophe variants do not block correct answers. Explicit accepted alternatives remain supported. Time-specific alternatives remain limited to time questions.
- Words, numbers, word order, negation, verb forms, and ñ remain meaningful. There is no fuzzy matching. A future exercise can explicitly request accented spelling with `accentsRequired:true`.
- Spanish 1 Units 1–3 now use taught vocabulary, rather than passage narration, for Listen & Type and Read & Record. Every prompt in those introductory sessions is 1–5 words. Small banks, such as weekdays, use spaced repetition to retain ten questions. Later units retain the existing sentence progression. Spanish 2 content is preserved.
- The introductory topic screen includes an expandable Spanish/English reference, open before the first activity. The number/time lists scroll within the reference. Early In Context blanks are restricted to vocabulary from the selected topics instead of incidental narrative words.
- Unit 1 reading/context/comprehension passages use familiar greetings and first-person introductions. The premature `se llama`, `tiene`, and third-person narration were removed from those passages.
- Classic results emphasize correct/total, one mastery percentage, personal-best recognition, best streak, review, and the next action. Removed elapsed time, duplicate arcade statistics, and verbose XP explanations. Audio results have a direct **Next Level** button plus Replay and View Levels. XP still accrues under the original caps; totals remain in the existing Your stats area.
- In-activity Continue becomes Continuar beginning in Unit 3, in either course. Primary navigation stays in English. Audio correct-answer feedback uses ¡Correcto!.
- Recording playback failures now expose the existing practice-aloud fallback. Recording remains completion-based, without pronunciation grading. Unlimited audio replay and the existing 0.85 speech rate are retained.

## Validation investigation

Phase 4.5 already normalized most punctuation, capitalization and vowel accents. A punctuation-only failure was **not reproduced from the supplied source**; the reported deployed attempt cannot be reconstructed from this ZIP alone. Its listening bank did contain the long passage sentences described in the feedback, which required transcribing the narration as well as the greeting. Phase 4.6 removes that transcription burden and adds direct regression tests for the teacher's exact formatting examples.

`normalize` applies the same policy to both answer and solution. `answersMatch` centralizes nonempty equality and explicitly accepted alternatives; both ordinary typing and dictation use it. Added Unicode apostrophe variants and an accented-spelling opt-in. Unicode NFC handles decomposed accents. Punctuation becomes a word boundary instead of merging separate words; apostrophes are normalized consistently. `Estoy mal`, `Ellos son`, `Tengo cinco años`, missing negation, joined words, reordered words, and n replacing ñ remain incorrect when they change the expected answer.

## Listening/content audit

Audited all Spanish 1 introductory topics and their unit reviews:

| Unit | Topics | Dictation and speaking policy |
| --- | --- | --- |
| 1 | Greetings; Introductions | Short expressions from the shared vocabulary bank; `Buenos días, profesora.` is also introduced in matching/recognition/typing. |
| 2 | Numbers; Days; Months; Digital time | Familiar words/phrases. Digital times use short spoken forms already accepted in Typing, such as `seis treinta`; the full original time phrase is an explicit accepted alternative. |
| 3 | Colors; Weather; School | Topic vocabulary and familiar short expressions; no passage narration. |

`Mucho gusto.`, `Hasta mañana.`, and `Buenos días, profesora.` replace the need to transcribe “Luis presenta…”, “Al salir…”, and “Por la mañana Ana dice…”. Introductions practice uses `Me llamo Ana`, `Soy de México`, `Tengo quince años`, and other phrases already in its shared bank. Longer comprehension recordings remain distinct from transcription. Later reading challenges can still include contextual language; this update does not claim a complete rewrite of the entire curriculum.

## Progress and configuration

No storage-key or activity-ID migration is necessary: mastery is keyed by stable mode IDs, not displayed level numbers. Completed activities remain replayable, including activities now beyond a missing prerequisite. The earliest incomplete activity becomes the next activity. No reset is performed. XP, achievements, personal records, last topics, theme, sound, completion dates, and teacher email configuration remain preserved. `js/config.js` is byte-for-byte unchanged.

## Automated testing

**PASS:** current `npm test` suite and Chromium `npm run test:browser`.

| Check | Result |
| --- | --- |
| Formatting variants, accents, Unicode, explicit alternatives; meaningful errors rejected | PASS |
| 6,048 time-answer variants, wrong times and hour agreement | PASS |
| Introductory 1–5-word sessions, bank membership, repetition, topic containment | PASS |
| All topics/unit reviews in both courses; eight-level order; 80% boundary | PASS |
| All 256 completed-activity combinations; reload, stable IDs, replay and earliest gap | PASS |
| Complete Spanish 1 and Spanish 2 eight-activity DOM journeys | PASS |
| XP caps/idempotence, achievements, bests, completion dates | PASS |
| Review-last DOM ordering in all 12 units; references; results and direct Next Level | PASS |
| Unit reports, configured email-draft link/encoding, clipboard and fallback | PASS (no email sent) |
| Chromium recording and playback for ten prompts with a synthetic microphone | PASS |
| Denied/missing microphone, missing voice, sound toggles, replay, track cleanup | PASS (browser and/or mocked APIs) |
| Chromium 320/390/768/1366 widths, light/dark themes, audio touch targets, no page errors | PASS |

Earlier phase tests/documents remain as historical files. Tests that encode the previous activity order or prohibit the now-intentional small-bank repetition have Phase 4.6 successors selected by `tests/package.json`. A test cleanup issue from closing a DOM while its toast timer was pending was corrected in the test harness; the current checks have no outstanding failures.

## Manual checks still required

- Real Spanish speech quality on the teacher's and students' browsers/devices (automated browser speech was mocked).
- Physical microphone permission, actual recorded speech, and playback on school computers and phones. Chromium automation used synthetic microphone audio.
- Opening and sending a completion draft through the actual school email client; delivery was not tested or sent.
- Live GitHub Pages deployment, school network access, and browser refresh after deployment.
- Quick student/teacher review of the introductory difficulty and remaining later reading content.

## Deploy to the existing repository

1. Extract `Racha-2.0-Phase-4.6.zip`.
2. In the existing `bjw3a/RACHA-2.0` checkout, replace the application files with the ZIP contents. Keep the repository and its `.git` folder. Keep `index.html`, `styles.css`, `favicon.svg`, and `js/` at the repository root, not inside a new enclosing folder.
3. Commit and push using your existing deployment process. Keep the current Pages configuration and URL. No email reconfiguration is needed.
4. After Pages finishes, refresh the page (hard refresh if the old version persists). Confirm the tab title says Phase 4.6, the activity order changed, and Mixed Review is last.
5. Check the same browser/profile still shows its existing progress. Do not clear site data; progress remains local to the browser and hosting origin.

No build command or new runtime dependency is required. `tests/` and documentation are optional for hosting. To rerun QA: `cd tests`, `npm ci`, `npm test`, `npx playwright install chromium`, and `npm run test:browser`.
