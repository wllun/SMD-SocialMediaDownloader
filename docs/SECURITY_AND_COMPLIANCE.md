# Security and Compliance

**Status:** Proposed baseline  
**Scope:** Mobile app, API, workers, data stores, platform integrations, and operations

This document defines engineering requirements, not legal advice. Obtain qualified
legal review for launch countries, platform agreements, copyright processes, and
privacy notices.

## 1. Product boundaries

The service may process only media the user owns or is authorized to use. It must
not:

- Erase an existing watermark from somebody else's media.
- Circumvent DRM, signatures, CAPTCHAs, paywalls, geographic controls, or privacy.
- Ask for platform passwords, browser cookies, or session exports.
- Access private accounts without an approved authorization flow.
- Download or extract YouTube audio without YouTube's prior written approval.
- Hide unsupported functionality from app reviewers or activate it after review.

Primary policy references:

- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Intellectual Property policy](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en)
- [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
- [TikTok Display API](https://developers.tiktok.com/doc/display-api-overview/)
- [X API media documentation](https://docs.x.com/x-api/fundamentals/data-dictionary)
- [Meta Instagram API documentation](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api)

## 2. Threat model

### Important assets

- User identity and account information.
- OAuth access and refresh tokens.
- Authorized media and temporary outputs.
- Signed delivery URLs.
- Audit, consent, report, and deletion records.
- Platform client secrets and infrastructure credentials.

### Principal threats

- Server-side request forgery through submitted URLs or redirects.
- OAuth code, state, token, or redirect theft.
- Broken object-level authorization between users.
- Malicious or malformed media exploiting processing libraries.
- Token, URL, or personal-data leakage through logs and analytics.
- Queue abuse, denial of service, and resource exhaustion.
- Copyright abuse and automated bulk downloading.
- Privileged internal access to media or secrets.
- Temporary objects surviving beyond their stated retention period.

## 3. Required controls

### URL retrieval and SSRF

- Match submitted URLs to explicit platform host allowlists.
- Use a dedicated normalization and parsing library; never validate with substring matching.
- Resolve DNS and reject loopback, private, link-local, multicast, reserved, and
  cloud metadata destinations for IPv4 and IPv6.
- Revalidate every redirect target and limit redirect count.
- Prevent DNS rebinding by controlling resolution and connection behavior.
- Restrict outbound worker traffic with network policy.
- Apply response size, connection, read, and total-processing limits.

### OAuth and social connections

- Use authorization code flow and PKCE when the platform supports it.
- Validate exact redirect URIs and cryptographically random, single-use state.
- Encrypt tokens using a managed key service or envelope encryption.
- Scope tokens to the minimum required permissions.
- Redact tokens and authorization codes from logs, traces, errors, and analytics.
- Revoke upstream access where supported when a user disconnects.
- Delete local token material after revocation or account deletion.

### Media processing

- Treat every input as hostile.
- Verify magic bytes, codecs, container structure, duration, dimensions, and size.
- Keep FFmpeg and image libraries patched.
- Run workers without root, with read-only images and strict CPU, memory, disk,
  process, and execution-time limits.
- Do not invoke a shell with user-controlled filenames or options.
- Use isolated temporary directories and delete partial files after every outcome.
- Scan or reject unsupported active-content formats before delivery.

### Authentication and authorization

- Enforce object ownership on every request.
- Use short-lived application sessions and rotate refresh credentials.
- Require recent authentication for sensitive actions.
- Protect administrative tools with strong MFA and separate identities.
- Maintain least-privilege service accounts per environment and component.

### Storage and delivery

- Keep buckets private and block public ACLs.
- Use short-lived, single-purpose signed URLs.
- Encrypt databases, queues, backups, and object storage.
- Separate development, staging, and production data.
- Monitor object lifecycle deletion and alert on failures.
- Do not include personal filenames or tokens in object keys.

## 4. Privacy baseline

Collect only data needed to provide the service. Before launch, publish:

- Privacy policy.
- Terms of service and acceptable-use policy.
- Media and temporary-file retention schedule.
- Account deletion and data export process.
- Connected-account permission explanation.
- Copyright complaint and appeal process.
- Contact information for privacy and abuse requests.

Users must be told whether media processing is local or server-side before upload.
Do not use downloaded media for model training, advertising profiles, or unrelated
analytics without a separate lawful basis and explicit disclosure.

## 5. Proposed retention schedule

Exact periods require product and legal approval.

| Data | Proposed retention |
| --- | --- |
| Temporary input and output media | No more than 24 hours after completion; shorter where practical |
| Partial and failed media | Delete immediately or within 1 hour |
| OAuth tokens | Until revocation, expiry without renewal, or account deletion |
| Download history metadata | User-controlled, with a short default retention |
| Security audit events | Defined period based on legal and operational need |
| Abuse and copyright reports | As required to investigate and meet legal obligations |
| Backups | Documented rolling period with deletion propagation |

## 6. Abuse prevention

- Require authenticated users for server-side processing.
- Apply per-user, per-IP, per-platform, and per-plan quotas.
- Limit media size, duration, job concurrency, and daily bandwidth.
- Detect repeated denied requests, automated enumeration, and credential sharing.
- Provide reporting, review, appeal, and repeat-infringer procedures.
- Preserve minimal evidence needed to investigate abuse without retaining the media
  longer than necessary.

## 7. Incident response

1. Detect and classify the event.
2. Contain affected tokens, workers, buckets, accounts, or adapters.
3. Preserve safe forensic evidence.
4. Rotate exposed credentials and revoke platform access.
5. Assess notification duties and platform-reporting obligations.
6. Restore service from verified artifacts.
7. Document root cause, corrective actions, owners, and deadlines.

Security contacts, severity definitions, notification templates, and an on-call
rotation must be established before production.

## 8. Release compliance gate

A social integration cannot ship until:

- The official API or written authorization covers the exact feature.
- Required developer review and permissions are approved.
- Store descriptions accurately explain the feature.
- Authorization evidence is ready for Apple or Google review.
- Data collection and retention appear in the privacy disclosures.
- Takedown and support processes are operational.
- Security tests for the adapter and its remote URLs pass.

