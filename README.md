# Racha 2.0 — Phase 4.7.1

Stabilization build: generic progress reports, safe progress backup/merge, transparent historical Level 7 credit, and spaced introductory listening. Approved design and eight-activity curriculum retained. No accounts, paid services, telemetry or runtime installation required.

Run from this folder:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Do not double-click index.html; ES modules require a server. Microphone access requires localhost or HTTPS; a plain HTTP LAN address on a phone is insufficient.

- [Development report](Phase-4.7.1-Development-Report.md)
- [Actual phone checklist](Phase-4.7.1-Mobile-Testing-Checklist.md)
- [Automated tests](TESTING.md)

Home → **Progress & backups** downloads/imports a Racha JSON backup. Imports are validated and require confirmation, merge completions without erasing existing credit, and take the higher cumulative totals instead of adding them. Names/recordings/unfinished rounds are excluded. Current device preferences stay in place.

Progress remains at `racha-progress-v1` on the current browser origin. Back up before clearing site data or changing browsers/devices/hosts. Level 7 historical credit stays unlocked, with an optional current-format replay. Reports are generic, optional and manually copied; there is no configured teacher email.

**17 automated suites pass. Rendered browser and actual-device testing remain pending.** This is not an app-store-ready release. Nothing was deployed or changed in the official repository. Earlier included reports describe earlier releases; this release's report is authoritative.
