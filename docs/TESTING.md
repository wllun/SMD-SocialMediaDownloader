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
- Verify the post URL is copied before browser launch.
- Verify confirmation displays the external hostname.
- Verify Cancel does not open the browser.
- Verify plain and {url} settings behave as expected.

## Manual Settings tests

- Save valid HTTPS URLs and restart the app to confirm persistence.
- Reject HTTP and malformed URLs.
- Save a mixture of configured and blank platforms.
- Clear all settings and confirm social handoff is disabled.

## Device tests

- Android default-browser behavior and Downloads result.
- iOS default-browser behavior and Files/Photos result.
- Clipboard behavior.
- Offline, redirect, popup, and site-error cases.
- Direct-file download regression on native and web.

## Release gate

Do not claim support unless detection and handoff work. Do not claim that SMD
controls or guarantees a download completed by an external website.

