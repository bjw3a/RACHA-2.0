# Racha 2.0 Phase 4.1

Based on the complete Racha-2.0-Phase-4(1).zip application.

Only production files changed: js/app.js, js/data.js, styles.css.

In Context now displays a bordered word bank directly below each sentence, with individual non-interactive word chips. Banks deduplicate case-insensitively while preserving Spanish accents. Every answer is represented; all words come from the existing selected-topic passage questions. Students still type their answers. Chips wrap on narrow screens and use existing light/dark theme colors.

All other original application files are byte-for-byte unchanged, including curriculum, readings, progression, scoring and storage. The racha-progress-v1 key is unchanged.

Deploy: extract this ZIP and upload its contents to the existing GitHub Pages repository root, with index.html at the root. Use the same site and browser to retain existing browser-based progress.

Validation passed: original Phase 4 logic and DOM suites; new Phase 4.1 tests covering both courses, all-topic answer coverage, deduplication, DOM placement, typing, correct/incorrect answers and unchanged saved profiles.

Real-browser desktop/mobile visual verification could not run in this environment because Chromium launch was blocked by a socket permission restriction. Responsive CSS was inspected; browser tests are provided for running elsewhere.

Tests: cd tests; npm ci; npm test; node phase4.1.mjs
Browser checks: npx playwright install chromium; node phase4.1-browser.mjs
