# ADR 0003: Use private, short-lived storage for server-processed media

**Status:** Accepted  
**Date:** 2026-08-17

## Context

Some authorized workflows may require server-side retrieval or conversion. Long-
term storage increases privacy, copyright, security, and infrastructure cost.

## Decision

Server-processed media will use private object storage with short-lived signed
delivery URLs and automatic lifecycle deletion. The proposed maximum retention is
24 hours after completion, subject to reduction and final product/legal approval.
Partial and failed artifacts should be deleted immediately or within one hour.

## Consequences

- Users must save completed files before expiry.
- The application must clearly display expiration.
- Lifecycle deletion needs metrics, alerts, and periodic verification.
- Reprocessing may be required after expiry.
- History should retain minimal metadata, not the media itself.

## Alternatives considered

### Permanent cloud media library by default

Rejected for the MVP because it expands consent, retention, security, moderation,
copyright, and cost requirements.

### On-device processing only

Preferred where feasible, but not sufficient for every approved social workflow or
large media conversion. The system should still choose local or direct-to-device
processing when it can meet reliability and platform requirements.

