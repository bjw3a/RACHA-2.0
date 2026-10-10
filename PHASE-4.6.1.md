# Racha 2.0 Phase 4.6.1

## Beginner content
The supplied Phase 4.6 ZIP already had short vocabulary-only Listen & Type and Read & Record in Spanish 1 Units 1–3. Those banks remain intact (generally 1–5 familiar words). The issue still present was whole-passage audio for each Listen & Choose comprehension question.

This release gives each of those 45 questions an authored clip of at most 10 words. Examples: “Me llamo Ana.”, “Tengo quince años.”, “Hay treinta estudiantes.”, “El lunes estudio español.” and “Mi mochila es azul.” The time clips retain enough context to answer which class/activity is at a given time. Questions and answer keys stay paired. Mixed Review uses exactly the constituent topic banks. Longer readings remain in Story Challenge; later Spanish 1 and Spanish 2 retain longer listening and speaking sentences.

The reported “Él es Ecuador…” phrase and original Ana/Luis narration were absent from this exact ZIP. Existing origin expressions include “Soy de México” and “Mi amigo Luis es de Ecuador.” No fabricated correction was applied. The source vocabulary, readings, generators, answer keys and newly authored clips were reviewed; automated checks cover answer consistency, meaningful grammar distinctions, topic containment and forbidden vosotros forms. This is not a claim that every possible random curriculum sentence has been linguistically certified.

## Speaking and privacy
No SpeechRecognition service is instantiated and no new recording transmission is introduced. Record, Stop, Play My Recording and Record Again keep their original local temporary recording lifecycle. Playback completion remains required; microphone/voice failures keep the explicit practice-aloud fallback. Saying unrelated words can still count as completed practice: this release does not verify recognized words or pronunciation.

MDN documents limited SpeechRecognition support and server processing in some browsers. On-device recognition needs supported APIs and language packs, which cannot be assumed on district Chromebooks. Therefore recognition was deferred under the prompt's permitted fallback, without adding services, keys or dependencies. The existing model voice uses the browser's speech synthesis, whose implementation depends on the device.

References reviewed 2026-10-10:
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

## Progress compatibility
No storage key or topic ID changes. Next Topic follows displayed order and selects the first unfinished topic, including an older gap. It opens that topic's first unfinished activity; existing activity unlocking and replay rules remain unchanged. Unit completion now requires individual topics plus final Mixed Review. Students with previously completed topic records retain them and only complete missing review. Unit reports include the review and still offer student name, copy, and the configured teacher email. The mailto button opens a draft; the student must send it.

## Deploy to the existing repository
1. Back up the current checkout of bjw3a/RACHA-2.0.
2. Extract this ZIP. Its index.html, styles.css, favicon.svg and js folder belong at the repository root, replacing the existing versions. Include the entire js folder: viewport.js is new. Preserve .git and any repository-specific workflow or domain files outside the archive.
3. Confirm js/config.js still contains the intended teacher address (preserved from the supplied ZIP).
4. Commit and push through your usual VS Code/GitHub workflow to the branch already used by GitHub Pages. Do not create another repository or change Pages configuration.
5. After Pages finishes, hard-refresh https://bjw3a.github.io/RACHA-2.0/ and confirm the browser title says Phase 4.6.1. If a tab shows older content, close/reopen or hard-refresh; do not clear student site data.
6. Run the remaining manual checks in TESTING.md on a district Chromebook before class.

This package was tested locally. No live deployment, repository change or email send was performed.
