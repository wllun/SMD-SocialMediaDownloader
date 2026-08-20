# ADR 0004: Use configurable external-browser handoff

**Status:** Accepted  
**Date:** 2026-08-20

## Context

The user prefers third-party downloader websites instead of configuring official
social API tokens or operating an SMD backend.

## Decision

SMD detects supported social hosts, reads the matching user-configured HTTPS URL,
copies the post link, discloses the destination hostname, and opens the system
browser after confirmation. An optional {url} placeholder may prefill sites that
explicitly support URL parameters.

SMD will not embed the external website in a WebView or intercept its download.

## Consequences

- Configuration is simple and stays on-device.
- The browser provides isolation and owns file downloads.
- SMD cannot guarantee site availability, safety, or download success.
- Browser download status is unavailable to SMD.
- Public distribution still carries copyright and store-policy risk.

## Alternatives considered

### Embedded WebView

Rejected because download behavior differs by platform and embedding an untrusted
site increases phishing, popup, cookie, and native download-handling risk.

### Official API backend

Superseded for the current plan because it requires approval, tokens, server
infrastructure, and per-platform work.

