# Testing Strategy

**Status:** Proposed

## 1. Quality objectives

- Prevent unauthorized media access.
- Save or convert supported media reliably across target devices.
- Recover safely from platform, network, queue, storage, and processing failures.
- Prevent sensitive information from appearing in logs, errors, or analytics.
- Ensure temporary media and revoked credentials are deleted as promised.

## 2. Test levels

### Unit tests

- URL parsing, normalization, hostname allowlists, and redirect policy.
- Platform capability and format mapping.
- Authorization rules and object ownership.
- Job state transitions and retry classification.
- File type, size, duration, and codec validation.
- Retention and deletion scheduling.
- Error-code mapping and user-facing message selection.

### Contract tests

- Adapter behavior against sanitized official API fixtures.
- OAuth token exchange and refresh response handling.
- Schema compatibility between mobile, API, and worker packages.
- Detection of removed, renamed, or unexpectedly nullable provider fields.

Fixtures must not contain real access tokens, private posts, or personal data.

### Integration tests

- Authentication and social connection lifecycle.
- Media resolution through an approved test application.
- Queue delivery, cancellation, retry, timeout, and dead-letter behavior.
- Temporary object creation, signed delivery, expiry, and deletion.
- Database migrations and account deletion propagation.
- Rate limiting and quota accounting.

### End-to-end tests

- Import local media, preview, convert, save, and share.
- Connect and revoke an approved social account.
- Resolve authorized media and complete a download.
- Handle unsupported links and unauthorized media.
- Resume or explain an interrupted job.
- Delete account and verify the user can no longer access previous resources.

### Device tests

- Supported Android and iOS versions.
- Permission denied, limited photo access, and revoked file access.
- Low device storage and large files.
- App backgrounding, termination, and relaunch during a job.
- Wi-Fi to cellular transition, offline state, slow network, and timeouts.
- Screen reader, text scaling, reduced motion, contrast, and keyboard navigation
  where applicable.

## 3. Security tests

- Loopback, private, link-local, IPv6, numeric, encoded, and redirect-based SSRF.
- DNS rebinding and cloud metadata access attempts.
- Cross-user access to connections, previews, jobs, files, and reports.
- Replayed OAuth state, redirect mismatch, expired code, and token revocation.
- Malformed containers, MIME spoofing, oversized media, decompression bombs, and
  unusual codecs.
- Shell metacharacters and path traversal in filenames and metadata.
- Expired or modified signed URLs.
- Rate-limit bypass, duplicate jobs, and idempotency conflicts.
- Token, cookie, signed URL, and personal-data redaction in telemetry.

## 4. Resilience tests

- Social platform returns `429`, `500`, invalid JSON, slow responses, or new fields.
- Media URL expires between preview and processing.
- Worker crashes mid-process.
- Redis, database, or storage is temporarily unavailable.
- Lifecycle deletion fails and later recovers.
- Queue backlog exceeds the normal operating threshold.
- Adapter is disabled while jobs are queued.

## 5. Performance tests

Define targets before MVP implementation. Measure:

- API latency for authentication, listing, and job status.
- Concurrent job creation and status polling.
- Queue wait and processing duration by file size and codec.
- Worker CPU, memory, temporary disk, and network usage.
- Database and storage request volume.
- Mobile responsiveness and memory use during download and save.

## 6. Release gates

A release candidate cannot ship if:

- A critical or high-severity security issue is open.
- Authorization, revocation, or account deletion tests fail.
- Temporary-object lifecycle tests fail.
- Store-critical product behavior differs from its review description.
- A supported adapter lacks current authorization evidence.
- Crash-free, completion, and latency thresholds are below the approved targets.
- Required privacy or copyright support processes are unavailable.

## 7. Production verification

- Synthetic health checks for the API and queue.
- Safe adapter canaries using approved test accounts and media.
- Deletion verification that never exposes media content.
- Alert tests before launch.
- Post-release monitoring of errors, queue depth, storage age, OAuth refresh,
  reports, and platform-specific failures.

