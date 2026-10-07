# Racha 2.0 — Phase 4.3: Listening & Speaking

Built from the latest complete `Racha-2.0-Phase-4.2.4(3).zip`, uploaded October 7, 2026. The original ZIP is unchanged.

## Student experience
Choose a course, unit, and topic, then **Listen & Speak — Optional practice** on the topic's levels screen. Unit and course mixed reviews also support practice.

- **Speak sentences:** hear a short sentence from the existing topic readings, record yourself, play the recording, and hear the model again.
- **Speak words:** practice the existing Spanish vocabulary, phrases, questions, and time expressions with their English meanings.
- **Listening:** hear an existing topic passage and answer a comprehension question. The complete Spanish transcript is hidden until the student chooses to reveal it. Replay and retry freely.
- Next replaces the current recording; Practice Again cycles through the session. Switching practice types, leaving the screen, hiding the tab, or closing the page clears temporary recording resources.

Practice has no pronunciation score, XP penalty, sixth activity, or mastery requirement. Students can listen and practice aloud without granting microphone access.

## Audio and voice choice
`js/practice-audio.js` exports `createPracticeAudio`, whose reusable `speakSpanish(text)` method uses SpeechSynthesis. It prefers es-MX, then es-US, then other Spanish locales, then es-ES/generic Spanish; speech rate is 0.85. Voices are queried on each Listen press, accommodating asynchronously loaded voice lists. If no Spanish voice is currently available, the student can retry or read aloud; the app does not substitute an English voice.

The existing profile.sound preference controls model speech and recording playback. Nothing autoplays. Turning Sound off cancels speech and pauses playback immediately; recording remains an explicit separate action. Existing sound effects retain their prior behavior. No new global sound setting or localStorage key was added.

Speech is browser-native: no external MP3s, API keys, paid APIs, or app-level TTS service. Installed voices and browser/OS voice services vary; some system voices may need connectivity. Offline voice availability is not guaranteed.

## Recording and privacy
Explicit Record requests `getUserMedia({audio:true})`; MediaRecorder chooses a supported audio MIME type or uses the browser default. Stop releases microphone tracks. Recordings are limited to 60 seconds to bound memory. Playback uses an in-memory Blob/object URL. Record Again replaces the previous recording; disposal revokes URLs and stops tracks, including streams granted after navigation.

Racha never uploads, emails, sends to an API, or persistently stores student recordings. There are no recording downloads, accounts, speech recognition, or automatic pronunciation grades. Completion email content is unchanged and contains no recording.

## Compatibility and fallbacks
Serve through HTTPS or localhost for microphone support. Use the existing static hosting workflow; opening ES modules by double-clicking index.html is not a supported substitute for serving the app. This release does not create a PWA or bypass district filtering.

Denied/blocked/missing microphone, missing MediaRecorder, missing SpeechSynthesis, unavailable Spanish voices, empty/interrupted recordings, and failed playback display brief messages without blocking navigation or unit completion. Controls are at least 48px tall in the new practice screens. Inline SVG icons avoid dependence on emoji fonts.

## Preservation and implementation
No changes to curriculum, vocabulary, questions, readings, storage, progression, achievements, XP, unit completion, teacher email/configuration, or Flashcards files. Flashcards remain disabled with `FLASHCARDS_ENABLED=false`; only their existing data catalog is reused. Existing audio properties are preserved.

Saved progress uses the original keys and schemas. Deploy to the same origin and use the same browser profile to retain browser-local progress. A new hosting origin has separate browser storage.

New files:
- `js/practice-data.js`: derives vocabulary from the preserved catalog and sentences/listening questions from existing readings. The mixed `verbs` topic combines ar/er/ir readings.
- `js/practice-audio.js`: voice selection, synthesis, recording, playback, error handling, cleanup.
- `js/practice.js`: isolated optional practice interface and inline icons.
- `tests/phase4.3.mjs`, `tests/phase4.3-browser.mjs`: new regression coverage.
- `PHASE-4.3.md`: this documentation.

Modified files: `js/app.js` (entry button, cleanup, sound notification), `styles.css` (scoped additions), `index.html` (version title), and `CHANGELOG.md`. All previous documentation and tests remain included.

## Adding future content
Continue adding curriculum topics, catalog vocabulary, and keyed passages/questions in the existing data files. Practice derives its content automatically. For aggregate topics, extend the small topic-to-reading mapping in practice-data.js. Keep sentence difficulty aligned with the topic. The audio session API can also support Flashcards in a future release without reactivating them now.

## Verification performed
Passed existing Phase 4 core, 4.1 word-bank, 4.2.4 time/typing, DOM progression, completion/email, navigation, and Chromium persistence/mobile suites. This includes five-activity mastery, failures/retries, XP/achievements, completion summaries/checkmarks, configured email preparation, and unchanged stored records. No email was sent.

Passed new data and audio tests for every topic/unit/course review, voice ranking and absent voices, sound gating, repeated recording, late permission cleanup, denied/missing mic, missing recorder/synthesis, empty/interrupted recordings, and rejected playback.

Passed Chromium UI tests with the real MediaRecorder and a synthetic microphone: start, stop, playback, re-record, navigation cleanup, listening answers/hidden transcript, sound changes, both courses, failure fallbacks, refresh persistence, and an existing mastery activity. No page errors. Checked 320px, 390px, and 1366px layouts and inspected screenshots.

Test boundary: Spanish speech API wiring and voice selection were tested with simulated voices; audible Spanish voice quality and a physical microphone were not verified. Other browsers and school-managed devices require device testing. The tests do not claim that browser permission/settings or installed voices are identical across devices.

Run from the project root:
```
cd tests
npm ci
npx playwright install chromium
node phase4.3.mjs
node phase4.3-browser.mjs
node phase4.2.4.mjs
node phase4.2.4-dom.mjs
node phase4.2.4-completion.mjs
node phase4.2.4-navigation.mjs
node phase4.2.4-browser.mjs
```

## Deployment
The complete ZIP has index.html at its root. Extract and deploy the complete contents using the existing static hosting workflow. No code/configuration edits are required for this upgrade. This ZIP has not been deployed automatically.
