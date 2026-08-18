# Project State

**Last updated:** 2026-08-17  
**Lifecycle stage:** Planning and discovery  
**Overall status:** Not started  
**Release:** None

## Summary

The repository currently contains the product proposal and project documentation.
No React Native application, backend, database, worker, automated test suite, or
deployment configuration has been implemented.

The agreed product direction is a creator media vault for content the user owns
or is authorized to use. The project must not rely on DRM bypass, private-account
access, password or cookie collection, watermark erasure, or unauthorized media
downloading.

## Workstream status

| Workstream | Status | Notes |
| --- | --- | --- |
| Product definition | In progress | MVP and non-goals documented |
| Platform/API feasibility | In progress | Official access and approval requirements still need validation |
| Legal and store compliance | In progress | Requires review for launch countries and final feature set |
| UX/UI design | Not started | User flows and wireframes required |
| Mobile application | Not started | React Native/Expo proposed |
| Backend API | Not started | Node.js service proposed |
| Media worker | Not started | FFmpeg limited to authorized user-supplied media |
| Infrastructure | Not started | PostgreSQL, Redis, and temporary object storage proposed |
| Testing and QA | Not started | Strategy documented; suite not implemented |
| Store release | Not started | Blocked by implementation and platform authorization |

## Accepted decisions

- The product is positioned as a compliant creator media vault.
- Watermark erasure and access-control circumvention are out of scope.
- YouTube-to-MP3 is excluded without YouTube's prior written approval.
- Platform integrations use independent adapters.
- Temporary server media must expire automatically.

See [decisions/](decisions/) for the decision records.

## Open decisions

- Initial launch country or countries.
- Public consumer app versus private/internal distribution.
- Authentication provider.
- Cloud provider and deployment region.
- First officially authorized social integration.
- Maximum media size, duration, and retention time.
- Free and paid usage limits.
- Whether initial conversion runs on-device, server-side, or both.

## Current blockers

1. No official platform developer applications have been approved.
2. Launch geography and legal entity are not confirmed.
3. The first MVP platform integration is not finalized.
4. Store authorization evidence for third-party downloads is not available.

## Immediate next actions

1. Choose the initial market and distribution model.
2. Register the required Meta and X developer applications.
3. Confirm official API permissions and store-review evidence.
4. Produce low-fidelity wireframes for the MVP flows.
5. Scaffold the monorepo and continuous-integration checks.
6. Implement local file import and user-supplied media conversion first.
7. Add one official platform adapter as a proof of feasibility.

## Definition of MVP-ready

The project is ready to enter MVP development when:

- The first supported platform has a documented, authorized API path.
- Product requirements and wireframes are approved.
- Launch countries and privacy requirements are known.
- Architecture and security threat review are accepted.
- Development, staging, and production ownership is assigned.

## Update log

| Date | Change |
| --- | --- |
| 2026-08-17 | Created the project documentation baseline and recorded the planning state. |

