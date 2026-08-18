# Roadmap

**Status:** Proposed  
**Planning assumption:** Two engineers with part-time product design and QA

Dates will be assigned after platform feasibility and team availability are
confirmed. Estimates do not include unpredictable external review time.

## Phase 0: Discovery and approval — 1 to 2 weeks

### Objectives

- Confirm target users, launch countries, distribution model, and business model.
- Validate one official platform integration end to end.
- Register developer applications and identify approval lead times.
- Approve product requirements, compliance boundaries, and initial wireframes.

### Deliverables

- Approved requirements and non-goals.
- Platform feasibility matrix with evidence.
- Low-fidelity user flows.
- Initial threat model and privacy data inventory.
- Selected first integration and documented fallback scope.

### Exit gate

At least one official integration can support the proposed behavior without
unofficial scraping or hidden functionality.

## Phase 1: Engineering foundation — 2 to 3 weeks

### Objectives

- Scaffold the monorepo, mobile app, API, and worker.
- Establish local, staging, and production configuration boundaries.
- Implement authentication, user profile, consent, and deletion foundations.
- Add continuous integration, linting, type checking, tests, and secret scanning.

### Deliverables

- Mobile application launches on supported Android and iOS test devices.
- Health-checked API and worker deployment in staging.
- Database migrations and environment configuration.
- Adapter contract and feature-capability registry.
- Monitoring and structured logging baseline.

## Phase 2: Local-media MVP — 3 to 4 weeks

### Objectives

- Import supported local photos and videos.
- Preview metadata and validate media.
- Extract audio from user-supplied video.
- Save, share, cancel, retry, and display local history.

### Exit gate

All local-media acceptance criteria pass without requiring a social integration.

## Phase 3: Authorized social integration — 3 to 5 weeks

### Objectives

- Implement OAuth and token lifecycle for the approved platform.
- Resolve authorized media and formats.
- Add asynchronous download jobs, temporary storage, and signed delivery.
- Implement rate limits, upstream error mapping, and adapter disable controls.

### Exit gate

- Integration permissions are approved.
- Authorization and object-level access tests pass.
- Temporary object deletion is monitored.
- Store-review evidence is assembled.

## Phase 4: Quality and store readiness — 2 to 3 weeks

### Objectives

- Complete device, accessibility, security, privacy, and resilience testing.
- Test low storage, network interruption, app backgrounding, and large files.
- Finalize terms, privacy disclosures, copyright process, and support channels.
- Prepare accurate store metadata and review notes.

### Deliverables

- TestFlight build.
- Google Play closed-testing build.
- Release checklist and rollback plan.
- Production dashboards and alerts.

## Phase 5: Controlled launch and learning

- Release to a limited country or tester cohort.
- Monitor completion rate, platform errors, deletion, abuse, and cost.
- Fix reliability and policy issues before adding platforms.
- Add a second platform only through a separate release gate.

## Future candidates

These are not commitments:

- Additional approved Instagram or X capabilities.
- Facebook Page media after Meta approval.
- TikTok creator export assistance through official products.
- Douyin or XHS integrations through formal partnerships.
- Batch creator workflows, team libraries, and approved cloud backup.
- Paid plans after unit economics and platform terms are validated.

## Explicit exclusions

- YouTube-to-MP3 without written approval.
- Watermark erasure.
- Private-account access or cookie-based scraping.
- DRM, CAPTCHA, signature, paywall, or geographic-control circumvention.
- Unapproved public-link download adapters.

