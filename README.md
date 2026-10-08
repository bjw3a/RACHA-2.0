# Racha 2.0 — Phase 4.5

Complete static application, upgraded incrementally from `Racha-2.0-Phase-4.4(2).zip`.
See **PHASE-4.5.md** for changes, migration, validation, and limitations.

Each existing topic has eight interleaved activities: Match-Up, Listen & Choose, Recognition,
Listen & Type, Typing, Read & Record, In Context, and Story Challenge. Listening uses 80% mastery;
speaking uses explicit practice completion without a pronunciation score.
Existing same-browser mastery, XP, achievements, and teacher email configuration are preserved.

## Upload

Extract the ZIP and upload its contents to the existing `bjw3a/RACHA-2.0` repository root.
Keep `index.html` at the repository root alongside `js` and `styles.css`.
Replace the existing files, including every changed JavaScript file. Do not nest the application
inside another folder. This ZIP has not been deployed for you.

Keep the existing website address to retain access to students' browser-stored progress.
Progress does not transfer automatically to a different browser or hosting origin.
The configured address in `js/config.js` is preserved; no reconfiguration is needed.

## Tests

In `tests`, run `npm ci`, then `npm test`.
For browser checks, run `npx playwright install chromium` and `npm run test:browser`.
Optionally set `RACHA_CHROMIUM` to a Chromium executable and `RACHA_QA_DIR` for screenshots.
Development dependencies and tests are not needed to run the static application.
Historical phase tests and documentation are retained; the package scripts select the current Phase 4.5 gates.
