# Testing Strategy

**Status:** Current baseline

## Automated checks

- TypeScript: npm run typecheck
- Web production bundle: npm run export:web
- Unit tests should cover exact/subdomain matching, lookalike-host rejection,
  HTTPS validation, persistence serialization, and {url} encoding.

## Manual Home tests

- Paste each supported platform URL and verify the detected label.
- Paste a YouTube URL, switch between Video and MP3, and verify each choice opens
  its own configured default downloader.
- Verify unknown and malformed URLs are rejected.
- Verify a missing setting produces a Settings instruction.
- Verify the post URL is copied before the in-app downloader opens.
- Verify confirmation displays the external hostname.
- Verify Cancel does not open the downloader.
- Verify plain and {url} settings behave as expected.
- Tap every configured platform icon and verify it opens the matching default
  downloader in the in-app route.
- Tap an unconfigured platform icon and verify the Settings prompt and navigation.
- Verify each icon has a visible pressed state and a screen-reader button label.

## Manual Settings tests

- Enter or paste a valid HTTPS URL, verify automatic-save feedback, and restart
  the app to confirm persistence.
- Reject HTTP and malformed URLs.
- Automatically save a mixture of configured and blank platforms.
- Verify Cancel preserves settings in the clear-all confirmation dialog.
- Confirm Clear all removes every setting and disables social handoff.

## Device tests

- Verify Home, Queue, and Settings tabs remain visible and tappable above gesture
  navigation and three-button navigation areas.
- Open and close the keyboard on Home and Settings and verify the tab bar returns
  to the correct safe-area position.
- Android WebView navigation, download interception, and device save result.
- iOS WebView navigation, file-download event, and Files/Photos result.
- Close, page-back, reload, and Browser fallback controls.
- HTTP navigation blocking and HTTPS redirect behavior.
- Web external-tab fallback.
- Clipboard behavior.
- Offline, redirect, popup, and site-error cases.
- Direct-file download regression on native and web.

## Release gate

Do not claim support unless detection and handoff work. Do not claim that SMD
controls or guarantees every download mechanism used by an external website.
