# ADR 0005: Use an in-app WebView handoff

**Status:** Accepted
**Date:** 2026-08-26

## Context

The product requirement changed from launching the device browser to keeping the
configured downloader website inside SMD on Android and iOS.

## Decision

SMD opens configured HTTPS downloader URLs in a modal react-native-webview route.
The route keeps Close, page-back, reload, and external-browser fallback controls
visible. It blocks HTTP navigation, disables third-party cookies, intercepts
common direct media URLs and WebView file-download events, and delegates supported
files to the existing native save service. Web builds open a new browser tab.

The original post URL is still copied before navigation. A {url} placeholder is
still replaced with the encoded post URL when the configured site supports it.

## Consequences

- Android/iOS users stay inside SMD for the normal handoff flow.
- SMD can save supported download responses through its native file service.
- Site-generated blob downloads and websites that reject embedding may not work.
- The Browser fallback remains necessary for incompatible sites.
- External content remains untrusted and must not receive credentials or payment details.
- Public distribution still requires copyright, privacy, security, and store-policy review.
