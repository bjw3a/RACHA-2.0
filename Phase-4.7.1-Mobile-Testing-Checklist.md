# Racha 4.7.1 — Actual Phone Testing Checklist

**Status:** Not yet performed on actual devices. Automated DOM tests passed; rendered browser launch was blocked. Use this checklist to record acceptance rather than assuming the interface is verified.

## Setup

- [ ] Keep the original ZIP and any existing progress backup.
- [ ] Use a trusted HTTPS test address prepared separately, or a secure local development setup. This release was not deployed. Opening index.html directly is not supported. Ordinary HTTP access over a phone's LAN IP generally cannot use the microphone.
- [ ] Record device, OS version, browser/version, date, theme and tester.
- [ ] Use iPhone Safari and Android Chrome. Include the smallest available phone; emulate missing sizes on desktop but label those as emulation.
- [ ] Check 320×568, 375×667, 390×844 and 430×932 in portrait, plus Chromebook/desktop 1366×768. Try larger system text/zoom. Real hardware is still needed for keyboards, permission prompts and audio.
- [ ] Use both light and dark themes, and both Spanish courses. Keep real progress intact; use a separate browser profile or test device for destructive failure checks.

## Navigation and layout

- [ ] Home → Spanish 1/2 → unit → topic → activity works. Current course/topic/activity are clear.
- [ ] No horizontal page scrolling, overlapping text/buttons, clipped labels or content hidden behind notches/home indicators.
- [ ] Back/Topics/Home are usable. Canceling a leave warning keeps the current round. Confirming leaves safely and stops audio/recording.
- [ ] Long questions and readings remain readable with normal vertical scrolling; no content is cut off to force a one-screen layout.
- [ ] Four answer choices, feedback and Next are easy to reach on short screens. Check both correct and incorrect answers.
- [ ] Results show readable mastery, Replay, View Levels, Next Level and Next Topic where appropriate. Unit Mixed Review is last.

## All eight activities — repeat in both courses

| Activity | Practical check | iPhone | Android |
|---|---|---|---|
| Match-Up | Match all six pairs; try one mismatch; verify first-attempt mastery and results | ☐ | ☐ |
| Listen & Choose | Turn sound on inside the activity; replay; select/check ten answers; review feedback | ☐ | ☐ |
| Recognition | Answer ten choices; verify 8/10 passes and 7/10 does not on a fresh level | ☐ | ☐ |
| Listen & Type | Replay audio; enter accents/punctuation variants; use keyboard Done and Check | ☐ | ☐ |
| Typing | Type ten answers; test accent keys, numeric/time prompts and incorrect answers | ☐ | ☐ |
| Read & Record | Hear → record → stop → play fully; Next stays gated until playback finishes | ☐ | ☐ |
| Choose English | Answer five Spanish-to-English choices; confirm 4/5 passes | ☐ | ☐ |
| Mixed Review | Read the passage, answer five questions, check results and next-topic flow | ☐ | ☐ |

## Keyboard and scrolling

- [ ] Open/close the keyboard repeatedly in both typing activities.
- [ ] Input and Submit remain reachable; no repeated scroll jumps or focus moving to a discarded question.
- [ ] Submit with keyboard Done without manually dismissing the keyboard. Try the on-screen Check button too.
- [ ] Insert á/é/í/ó/ú/ñ/ü at the cursor without losing the answer. Vowel accents/punctuation remain optional; ñ still matters.
- [ ] After feedback, Next opens the next question predictably. Rotate and return to portrait as a robustness check.
- [ ] Try long Spanish 2 text, short phone heights, and browser address bar expanding/collapsing.

## Audio and microphone

- [ ] Test device speaker and headphones/Bluetooth; replay several times quickly.
- [ ] Verify Sound Off, then the in-activity Turn Sound On control.
- [ ] First microphone request is understandable; Allow captures a recording and plays it back.
- [ ] Deny permission, then check the helpful message and practice-aloud option. Re-enable permission in site settings and retry.
- [ ] Try record-again: prior playback no longer completes the new recording automatically.
- [ ] Next does not claim pronunciation correctness. Confirm the “no pronunciation grade” wording.
- [ ] Leave a recording screen or background the app; microphone capture stops. Return and retry without stuck controls.
- [ ] Test a phone call/audio interruption and unavailable microphone if practical.
- [ ] Check early listening variety: repetitions may occur to keep ten questions, but identical clips should not be adjacent.
- [ ] Try airplane mode and record exactly what works. Offline launch/speech are **not promised**; do not mark them supported from one successful cached run.

## Progress, backup and Level 7

- [ ] Finish a level; refresh/reopen the browser; mastery, achievements and resume remain.
- [ ] Home → Progress & backups → Download backup. Find and retain the JSON in Files/Downloads. The download message alone is not proof it was saved.
- [ ] Import that backup into a separate test browser/profile. Verify the preview, Cancel and Merge actions.
- [ ] Confirm existing completions and achievements remain; reimporting does not add duplicate XP. Totals take the higher value rather than summing device histories.
- [ ] Confirm current theme/sound/resume preferences remain on the receiving browser where already present.
- [ ] On test data only, try invalid JSON, a different app's JSON, version 2 and a file over 1 MB. Each must reject without changing progress.
- [ ] If storage is blocked/full, import should report failure without pretending it saved.
- [ ] On an older Level 7 completion, see the retained-credit explanation and optional Practice Choose English button.
- [ ] Fail a replay: historical completion stays unlocked. Pass a replay: current Choose English score appears separately from historical best.
- [ ] Check reports contain no teacher email/send control or school submission instructions; optional names and copy fallback still work.

## Record defects and acceptance

For each failure record: device/browser, screen size, course/unit/topic/activity, theme, steps, expected behavior, actual behavior, and screenshot or short recording. Omit names/private progress from shared evidence.

| Device / browser | Checks completed | Defects / evidence | Pass / pending |
|---|---|---|---|
| iPhone Safari | | | Pending |
| Android Chrome | | | Pending |
| Chromebook / desktop | | | Pending |

Do not accept a public beta while controls are hidden, completed progress is lost, imported files overwrite achievements, or recording/permission flows get stuck. Passing this checklist does not itself establish app-store readiness.
