# Racha — Future App Store Readiness Assessment

October 19, 2026. This is a technical roadmap, not a claim that Phase 4.7 is packaged or approved for either store. No native dependencies were added.

## Foundation and Capacitor integration

Keep the current HTML/CSS/ES-module app. Stage only runtime files (`index.html`, `styles.css`, `favicon.svg`, `js/`) into a dedicated web assets directory, excluding tests/reports. Later initialize Capacitor with a stable app ID/name and that directory as `webDir`, add Android/iOS projects, and sync assets. Select supported SDK/tool versions at implementation time. No GitHub Pages URL is required: current imports and assets are relative. The source is static and requires no app backend or learner accounts.

Existing module boundaries provide useful integration points: `practice-audio.js` owns recording/speech resources; `storage.js` owns progress persistence; `viewport.js` owns keyboard positioning. A future native build needs explicit asynchronous platform adapters and initialization rather than adding scattered native calls to question rendering. The existing storage methods are synchronous and will need an awaited startup/save design for native Preferences. This phase deliberately does not create a fake/native adapter without a native implementation.

## Android

Use Android Studio and the JDK/SDK versions supported by the chosen Capacitor release. Build and sign an Android App Bundle with securely maintained signing credentials; establish a Play Console developer account when ready. Configure microphone permissions and native/WebView permission handling. Test Android hardware Back, keyboard resizing, audio interruptions, app resume, safe areas and low-memory termination. Complete internal/closed testing and verify the then-current target API and publishing requirements before release.

## iOS

Use a Mac with a supported Xcode toolchain; create the iOS project, bundle identifier, signing/provisioning and developer account. Configure a clear microphone usage purpose string. Test WKWebView speech/recording, supported recording MIME types (including MP4), audio-session behavior, interrupted playback, keyboard/safe-area handling, and app lifecycle. Distribute a test build through TestFlight before submission. Include required privacy declarations/manifests for the APIs/plugins actually used.

## Browser APIs needing device review

| Current API | Native/mobile consideration |
|---|---|
| speechSynthesis / SpeechSynthesisUtterance | Verify Spanish voice availability, delayed voice lists, replay and offline operation in each WebView. Use native TTS or bundled licensed clips if browser support is inadequate. Some voices may be network-backed. |
| getUserMedia / MediaRecorder / Blob URLs / Audio | Verify permission forwarding, recording codecs, playback, interruptions and resource disposal. Add a maintained native recording integration only if needed; preserve temporary local recording behavior. |
| AudioContext | Resume from user gestures and test mute/interruption behavior. |
| VisualViewport | Test actual keyboard and browser chrome changes; evaluate Capacitor Keyboard configuration later. Avoid competing resize/scroll handlers. |
| localStorage | Remains browser/origin-specific and vulnerable to clearing/eviction. See persistence below. |
| clipboard / mailto | Clipboard fallback remains available. Native Share may be preferable for completion reports; remove school-specific public-release defaults. |
| beforeunload / pagehide / visibilitychange | Mobile termination is not reliably signaled; add native app lifecycle integration and resumable checkpoints. |

## Offline support

Native packaging can bundle the app shell and curriculum for cold-start use without a network. For a web/PWA version, add a versioned service worker, explicit cache update/rollback strategy, and an offline launch test; current HTTP caching is not an offline guarantee. Speech requires installed offline voices or bundled audio. Test airplane-mode cold launches, all activities, and upgrade cache invalidation before claiming offline support.

## Progress persistence

Retain stable topic/activity IDs and a versioned progress schema. Migrate browser progress deliberately, ideally with user-controlled export/import before moving to a new host/native origin. For lightweight native progress use Capacitor Preferences with error handling; its documentation recommends it over mobile localStorage. Preferences data can still be removed on uninstall. Add validated backup/restore, interrupted-write recovery, and in-progress round checkpoints. Cloud sync is optional future work, not a requirement to introduce accounts. Never claim guaranteed recovery from uninstall or lost devices without a backup design.

## Privacy and public release

Audit the actual packaged app's data flow, including speech providers and any future SDKs. The current app does not intentionally upload microphone recordings: they are temporary in-memory blobs and are released during cleanup. Do not equate this with a verified device-wide no-network claim. Preserve clear optional permission explanations, the practice-aloud fallback, and honest “no pronunciation grade” language.

Provide an accessible privacy policy and accurate Apple App Privacy / Google Play Data safety disclosures; include required privacy manifests and permissions for the chosen native build. Review intended audience/age ratings, accessibility, support contact, public branding/assets and content rights. Remove the configured teacher email and school-specific submission wording before a public release. Recheck applicable child-audience requirements if the audience expands beyond the present high-school/general-public positioning. Any payments later require a separate billing/store-policy design. No account, analytics or advertising service is needed for the current scope.

## Recommended next gate

First finish the visual and real-device acceptance checklist in the development report. Then build a small Capacitor proof of concept covering keyboard input, Spanish TTS, record/playback and persistent progress on one real iPhone and one real Android phone. Only after those work reliably should release packaging, store metadata and submission begin.

## Primary references checked

These are current reference points, not fixed promises about future release requirements:

- [Capacitor installation](https://capacitorjs.com/docs/getting-started)
- [Capacitor environment setup](https://capacitorjs.com/docs/getting-started/environment-setup)
- [Capacitor Preferences and privacy manifest guidance](https://capacitorjs.com/docs/apis/preferences)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple microphone purpose strings](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-purpose-strings)
- [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311)
- [Google Play Data safety form](https://support.google.com/googleplay/android-developer/answer/10787469)
