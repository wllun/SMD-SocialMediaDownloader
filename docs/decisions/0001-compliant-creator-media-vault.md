# ADR 0001: Position the product as a compliant creator media vault

**Status:** Accepted  
**Date:** 2026-08-17

## Context

A universal downloader for arbitrary social links would likely depend on
unofficial scraping, change frequently, and create platform, copyright, privacy,
and app-store risk. Existing-watermark removal can also erase attribution and
facilitate unauthorized reuse.

## Decision

The product will process only content the user owns or is authorized to use. It
will use official APIs or explicit written authorization for social integrations.
It will not erase watermarks, bypass access controls, collect session cookies, or
offer YouTube-to-MP3 without YouTube's prior written approval.

## Consequences

- The public MVP has a smaller platform set.
- Platform approval is a release dependency.
- Local import and conversion remain useful without social integrations.
- Marketing, onboarding, UI, API errors, and support processes must reflect the
  authorization boundary.
- Some originally requested platforms may remain unsupported.

## Alternatives considered

### Universal public-link scraper

Rejected because it creates fragile dependencies and unacceptable compliance and
store-distribution risk.

### Private sideloaded utility

Not selected as the primary product because private distribution does not remove
platform, copyright, privacy, or security obligations.

