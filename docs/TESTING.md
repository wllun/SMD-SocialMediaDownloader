# Testing Strategy

**Status:** Current baseline

## Automated checks

- TypeScript: npm run typecheck
- Web production bundle: npm run export:web
- Unit tests should cover exact/subdomain matching, lookalike-host rejection,
  HTTPS validation, persistence serialization, and {url} encoding.

## Manual Home tests

- Paste each supported platform URL and verify the detected label.
- Verify unknown and malformed URLs are rejected.
- Verify a missing setting produces a Settings instruction.
- Verify the post URL is copied before the in-app downloader opens.
- Verify confirmation displays the external hostname.
- Verify Cancel does not open the downloader.
- Verify plain and {url} settings behave as expected.

## Manual Settings tests

- Enter or paste a valid HTTPS URL, verify automatic-save feedback, and restart
  the app to confirm persistence.
- Reject HTTP and malformed URLs.
- Automatically save a mixture of configured and blank platforms.
- Verify Cancel preserves settings in the clear-all confirmation dialog.
- Confirm Clear all removes every setting and disables social handoff.

## Device tests

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
