# ADR 0001: Maintain compliant-use boundaries

**Status:** Accepted and amended  
**Date:** 2026-08-17  
**Amended:** 2026-08-20

## Context

Media downloading can create copyright, privacy, platform, and store-distribution
risk. The current plan hands social links to user-configured external websites.

## Decision

SMD requires users to download only media they own or may lawfully use. It will
not erase watermarks, bypass access controls, collect credentials or cookies, or
claim that an external website makes an unauthorized action permitted.

SMD discloses the external handoff and shows the destination hostname.

## Consequences

- External-browser use does not remove legal or platform obligations.
- Public distribution still requires legal and store-policy review.
- The app must not endorse unknown services or promise universal downloading.

