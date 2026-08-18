# ADR 0002: Isolate platforms behind capability-based adapters

**Status:** Accepted  
**Date:** 2026-08-17

## Context

Social platforms provide different media types, OAuth scopes, API fields, rate
limits, authorization rules, and download permissions. Their APIs can change on
independent schedules.

## Decision

Each platform will implement a shared adapter contract and declare its actual
capabilities. Domain services will depend on the contract rather than provider
payloads. Provider-specific identifiers, errors, and metadata remain inside the
adapter boundary.

## Consequences

- An adapter can be tested, deployed, rate-limited, or disabled independently.
- The UI must render capabilities instead of assuming feature parity.
- Shared contract design requires care to avoid reducing every provider to the
  lowest common denominator.
- Contract tests and sanitized provider fixtures become mandatory.

## Alternatives considered

### Platform logic inside controllers

Rejected because it tightly couples HTTP endpoints to provider behavior and makes
changes difficult to test or isolate.

### Separate service for every platform from day one

Deferred because the operational overhead is unnecessary for the initial scale.
Adapters may later move behind service boundaries without changing the domain
contract.

