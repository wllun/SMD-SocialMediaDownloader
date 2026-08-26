# Project State

**Last updated:** 2026-08-26
**Lifecycle stage:** Functional prototype
**Overall status:** In-app WebView handoff implemented
**Release:** None

## Implemented

- Root-level Expo Router application for Android, iOS, and web.
- Home URL input, clipboard paste, platform detection, and destination confirmation.
- Local persistent downloader settings for six social platforms.
- HTTPS validation and optional {url} template substitution.
- Modal in-app downloader WebView on Android/iOS.
- Close, page-back, reload, and external-browser fallback controls.
- HTTPS-only navigation and supported native file-download interception.
- Direct media-file downloads with native progress and device saving.
- Home, Library, and Settings tabs.

## Removed or superseded

- The temporary Meta Instagram access-token server and adapter.
- The proposed API, queue, worker, PostgreSQL, Redis, and object-storage MVP.
- Claims that SMD itself downloads normal social post URLs.

## Current limitations

- External websites control social-post resolution and site behavior.
- Blob URLs, script-generated downloads, authentication-dependent files, and
  sites that block WebViews may require the external-browser fallback.
- Web uses a new browser tab rather than an embedded WebView.
- No downloader website is bundled or endorsed.
- Runtime testing is still required across Android and iOS browsers.
- Store eligibility and legal review remain unresolved.

## Next actions

1. Configure trusted test websites on a development device.
2. Test each supported hostname, redirect flow, and actual device save result.
3. Add automated tests for detection, templates, and validation.
4. Replace mock Library entries with accurate history or remove them.
5. Decide whether this is a private APK or public store product.
