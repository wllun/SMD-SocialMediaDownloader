# Project State

**Last updated:** 2026-08-20  
**Lifecycle stage:** Functional prototype  
**Overall status:** External-browser handoff implemented  
**Release:** None

## Implemented

- Root-level Expo Router application for Android, iOS, and web.
- Home URL input, clipboard paste, platform detection, and destination confirmation.
- Local persistent downloader settings for six social platforms.
- HTTPS validation and optional {url} template substitution.
- External default-browser launch.
- Direct media-file downloads with native progress and device saving.
- Home, Library, and Settings tabs.

## Removed or superseded

- The temporary Meta Instagram access-token server and adapter.
- The proposed API, queue, worker, PostgreSQL, Redis, and object-storage MVP.
- Claims that SMD itself downloads normal social post URLs.

## Current limitations

- External websites control social-post resolution and browser downloads.
- Browser download progress and history are not visible to SMD.
- No downloader website is bundled or endorsed.
- Runtime testing is still required across Android and iOS browsers.
- Store eligibility and legal review remain unresolved.

## Next actions

1. Configure trusted test websites on a development device.
2. Test each supported hostname and redirect flow.
3. Add automated tests for detection, templates, and validation.
4. Replace mock Library entries with accurate history or remove them.
5. Decide whether this is a private APK or public store product.

