# ADR 0003: Use ephemeral server media storage

**Status:** Superseded by ADR 0004  
**Date:** 2026-08-17  
**Superseded:** 2026-08-20

## Original decision

Server-processed media would use private object storage, signed URLs, and automatic
deletion.

## Reason for supersession

The current architecture has no SMD server processing or object storage. The
external website and browser control social-media downloads. Direct file URLs are
downloaded by the app without SMD server storage.

This decision must be reconsidered if server processing returns.

