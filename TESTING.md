# Phase 4.7.1 verification

```sh
npm ci --prefix tests
npm test --prefix tests
```

All 17 current suites passed under Node 24.19.0 after a fresh dependency install. Captured output: `tests/phase4.7.1-results.txt`. Tests use JSDOM/fake media and do not render CSS or exercise physical devices. Syntax checks covered all runtime modules and new 4.7.1 test scripts.

Browser follow-up on an unrestricted machine:

```sh
cd tests
npx playwright install chromium
npm run test:browser
```

`RACHA_CHROMIUM` optionally specifies an installed binary. The 4.7.1 browser matrix covers 320×568, 375×667, 390×844, 430×932, 1366×768, both courses, both themes and eight activities. Screenshots are written to `/tmp/racha471-qa` when it runs. The environment here blocked Chromium launch (`socket() failed: Operation not permitted`); no rendered result or screenshot is claimed. The updated matrix remains to be executed. Manual long-content, results, backup file picking, keyboard and hardware checks are in the mobile checklist.

The current completion test supersedes old email-draft assertions. Historical tests/reports are retained, but `test:legacy` expects old behavior and is not the release acceptance command. No test-only node_modules or browser binaries are included in the deliverable ZIP.
