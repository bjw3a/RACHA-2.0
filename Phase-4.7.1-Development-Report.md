# Racha 2.0 — Phase 4.7.1 Development Report

October 19, 2026

## Status and source

Stabilization implementation complete; **17 automated logic/DOM suites pass**. Rendered-browser and physical-device acceptance remain outstanding. This is not an app-store-ready or publicly accepted release.

The entire attached independent audit was read before code edits. Source: `Racha-2.0-Phase-4.7(2).zip`, SHA-256 `6c01dfb86945da13b8c6fc4e3f5c71096c04cf32f3ad6e759ead18e7843783b9`. The original ZIP was not overwritten. No official repository changes, deployment, native packaging, paid services, accounts, telemetry, or new dependencies were introduced. Phase 4.8 was not started.

## Audit dispositions

| Finding | Cause | Phase 4.7.1 action | Remaining acceptance |
|---|---|---|---|
| High: school-specific reporting | Configured teacher email and email-draft UI in completion module | Removed email destination, send control, mailto generator and school-specific submission wording. Completion reports remain copyable with an optional name. | Check copy/share workflow on actual phones; sharing is manual. |
| High: mobile visual/hardware QA | Prior environment could not launch Chromium; DOM does not render CSS | Retained approved layout and keyboard handling; reviewed source and updated browser matrix to short phone heights and both courses/themes. Retried browser launch. | Still blocked before page rendering by environment permissions. No screenshots or device results claimed. |
| Medium: progress durability | Origin-bound localStorage has no cross-device transfer | Added user-controlled JSON export/import with validation, preview, explicit merge/cancel and no-loss merge rules. | Verify real file download/picking on iOS and Android. OS termination and automatic backups are not solved. |
| Medium: Level 7 meaning changed | `streak` storage ID reused for In Context and Choose English | Retained old completion/achievements; added transparent optional replay and separate current-format score/pass evidence. Reports no longer attribute an unmarked historical score to Choose English. | Earlier Phase 4.7 and pre-4.7 scores cannot be reliably distinguished. Both are treated conservatively as retained credit until replay. |
| Medium: repetitive introductory listening | Small taught banks need repetition to retain ten questions | Spaced repeated listening clips apart with a count-aware ordering pass; no new vocabulary or question-count reduction. | Judge variety, pace and learning value by listening on devices. |
| Medium: offline/mobile speech | Browser TTS, voices, MediaRecorder and WebView permissions vary | Kept working audio module, privacy behavior, fallback and honest no-pronunciation-grade wording; reran simulated audio regressions. | Actual speech, microphone, offline behavior and future native permission forwarding remain unverified. No offline claim. |

## Public-facing reporting

`js/config.js` now contains no email address. The public app no longer constructs mailto links or exposes SEND COMPLETION TO MR. WALSH. Schoology instructions and teacher-verification phrasing are replaced with generic copy/report text. Reports describe self-reported practice results. Names are optional, stay in the existing local name key, and are excluded from progress backups. Curriculum references to teachers/students, such as “Good morning, teacher,” remain because they are learning content, not configuration.

Reports are copied only when requested, with a selectable-text fallback if the clipboard API fails. No reports are automatically sent. A runtime source scan found no MNPS email/domain, school submission text, or mailto handler.

## Backup workflow and validation

On the home/course-selection screen open **Progress & backups**.

1. **Download backup** exports a JSON envelope containing app=`racha`, version=1, export time, and progress.
2. Select a previously exported Racha `.json` file. Validation occurs before any storage write; the app previews its activity count and XP.
3. Choose **Merge this backup**, or **Cancel import**. A failed save leaves the current in-memory progress unchanged and displays an error.

Validation rejects malformed JSON, files larger than 1 MB, unsupported versions, foreign/empty envelopes, unknown fields/topics/modes/badges, unsafe object keys, invalid numeric ranges, impossible completed-score combinations, invalid dates and invalid resume destinations. The import accepts the new backup envelope, not an arbitrary raw localStorage dump. This validates structure and compatibility; backups are editable self-reported data, not authenticated academic records.

Merge behavior:

- Completed activities are combined; nothing is deliberately uncompleted.
- Best mastery, XP bests and high-score records use the higher value. Match-Up elapsed-time records keep the lower value.
- XP, games, correct totals and streak totals use the higher value, not a sum, preventing duplicate imports from inflating totals. Independent history across devices is not reconstructed; some combined counts may be undercounted.
- Achievements are combined without duplicates. Available earlier completion dates are retained.
- The current browser's sound/theme preferences and resume position stay in place; missing resume positions can be filled from the backup. These are merge semantics, not a byte-for-byte settings restoration.
- Reimporting the same backup is idempotent. Backups exclude separately stored names, temporary recordings and unfinished rounds.

The storage key remains `racha-progress-v1`. There is no reset or destructive migration. Keep a backup before changing host/browser/device or moving to a future native app. Browser eviction, clearing data, private browsing, lost devices, or uninstall can still lose unbacked-up progress. No automatic sync or interrupted-round checkpoints were added.

## Level 7 compatibility policy

Keep earned completion, dates, XP, badges and historical `best` under the existing `streak` ID. If a completed record has no current-format evidence, the topic screen explains that it may come from In Context and offers **Practice Choose English**. Replay is optional and cannot revoke mastery.

New completed Choose English attempts record `englishChoiceBest`, separately from historical best, and set `englishChoicePassed` when at least 80% is achieved. For example, an old 100% In Context record followed by an 80% Choose English replay keeps historical best=100 internally but reports **80% in Choose English**. A failed replay keeps old completion and explicitly labels earlier credit as retained. Both fields survive load/save and backup merging. Ordinary legacy records remain compatible without the new fields.

This avoids inventing evidence about which format an earlier student completed. It does not retroactively require eight new activities or erase achievements.

## Preserved behavior and mobile scope

All eight activity types and their Phase 4.7 order remain: Match-Up; Listen & Choose; Recognition; Listen & Type; Typing; Read & Record; Choose English; Mixed Review. Scored mastery stays 80%, with 5/6 first tries for matching. Round sizes are unchanged. Speaking remains practice-completion-based with the existing fallback. Unit Mixed Review remains last. Accent/punctuation tolerance, meaningful ñ/grammar checks, existing curriculum, both themes, rewards and desktop structure remain.

Mobile source review covered normal-flow question/answer controls, safe areas, touch targets, typing form submission, viewport resizing, audio state controls, long text, results and navigation. This is source review, not visual proof. Only the new backup and compatibility panels add scoped styling; colors, typography and existing layout were not redesigned.

## Automated verification

Freshly ran `npm ci --prefix tests --ignore-scripts`, then `npm test --prefix tests` under Node 24.19.0. All **17 suites passed**; capture is in `tests/phase4.7.1-results.txt`. JavaScript syntax checks passed for 21 runtime/new test files.

- Two-course full eight-activity DOM journeys; course/unit navigation, results, next actions, completion gates and achievements.
- All 256 existing mastery combinations, stable IDs, repeat load/save, earliest-missing progression, retained completion and idempotent rewards.
- 3,400 generated English-choice checks across courses/reviews and 6,048 time variants with positive/negative validation.
- Randomized ten-prompt session coverage; 900 extra early listening rounds with no adjacent identical clips and no untaught vocabulary introduced.
- Simulated speech, microphone, record/stop/play/re-record gates, denied/missing APIs/voices, cleanup, sound states, and fallback. These do not capture real audio.
- Keyboard geometry simulations, long-content positioning, and unfinished-round exit guards. These are not rendered-browser tests.
- Backup round trip; non-destructive/idempotent merge; historical/current Level 7 scores; malformed, oversized, foreign, incompatible and unsafe input; preview/cancel/confirm; storage write failure; stale asynchronous reads; download cleanup; exclusion of names/recordings.
- Generic completion reports, optional names, clipboard fallback, runtime removal of school destination, and optional Level 7 replay/disclosure.

The former email-specific completion test was replaced in the current command by `phase4.7.1-completion.mjs`, retaining unit gates/report/copy assertions while testing the authorized removal of email. Historical tests/reports remain as historical evidence; they are not the current acceptance criteria.

## Browser attempt and unresolved checks

Chromium 134 launch was attempted using the installed binary. It failed before rendering with `socket() failed: Operation not permitted`. Environment restrictions were not bypassed. Therefore **no rendered layouts, screenshots, physical keyboards, audible speech, real recordings, iPhone or Android tests passed here**.

The supplied `phase4.7.1-browser.mjs` matrix uses 320×568, 375×667, 390×844, 430×932 and 1366×768; both courses; all eight modes; both themes. It includes navigation, overflow/question-fit assertions and screenshot capture when run in a functioning browser environment. This updated matrix remains unexecuted here; it is not a substitute for manual long-content, keyboard, backup-file, results and hardware checks.

Remaining limits: no cold-start offline support, no guaranteed browser voice, no native storage integration, no recording upload/pronunciation scoring, no resumable unfinished rounds. A missing Spanish voice can still prevent scored listening. Public beta acceptance remains conditional on the accompanying mobile checklist and desktop/browser QA.

## Files

Modified runtime: `index.html`, `styles.css`, `js/app.js`, `js/config.js`, `js/practice-sessions.js`, `js/progression.js`, `js/storage.js`, `js/unit-completion.js`.

Added runtime: `js/backup.js`.

Updated documentation/config: `README.md`, `TESTING.md`, `CHANGELOG.md`, `tests/package.json`.

Added tests: `tests/phase4.7.1-completion.mjs`, `tests/phase4.7.1-backup.mjs`, `tests/phase4.7.1-stabilization.mjs`, `tests/phase4.7.1-browser.mjs`, and captured results.

Deliverables: complete separate `Racha-2.0-Phase-4.7.1.zip`, this report, and `Phase-4.7.1-Mobile-Testing-Checklist.md` (both reports also inside ZIP).
