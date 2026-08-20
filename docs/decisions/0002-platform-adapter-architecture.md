# ADR 0002: Isolate platforms behind API adapters

**Status:** Superseded by ADR 0004  
**Date:** 2026-08-17  
**Superseded:** 2026-08-20

## Original decision

The proposed backend would isolate official social APIs behind platform adapters.

## Reason for supersession

The product changed to a client-only browser handoff. SMD no longer operates
platform adapters or a media-resolution backend. Platform configuration is now a
local mapping from detected host to user-provided HTTPS website.

This record remains as history and applies again only if an approved backend is
introduced.

