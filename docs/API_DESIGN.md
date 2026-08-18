# API Design

**Status:** Proposed  
**Base path:** `/v1`

## 1. Conventions

- JSON request and response bodies unless transferring a file directly.
- UTC timestamps formatted as RFC 3339.
- Opaque string identifiers; clients must not infer database structure.
- Bearer authentication on protected endpoints.
- `Idempotency-Key` required for job-creation endpoints.
- Cursor pagination for growing collections.
- Stable machine-readable error codes with safe user-facing messages.
- API versioning in the path for breaking changes.

## 2. Core resources

### Social connection

```json
{
  "id": "scn_123",
  "platform": "instagram",
  "displayName": "creator-account",
  "status": "active",
  "capabilities": ["list_media", "download_authorized_media"],
  "connectedAt": "2026-08-17T08:00:00Z"
}
```

### Media preview

```json
{
  "requestId": "mrq_123",
  "platform": "x",
  "mediaType": "video",
  "title": "Example post",
  "thumbnailUrl": "https://api.example.com/v1/previews/mrq_123/thumbnail",
  "durationMs": 42000,
  "authorization": "verified",
  "formats": [
    {
      "id": "fmt_720p_mp4",
      "container": "mp4",
      "height": 720,
      "estimatedBytes": 18500000
    }
  ]
}
```

### Download job

```json
{
  "id": "job_123",
  "state": "processing",
  "progress": 42,
  "createdAt": "2026-08-17T08:10:00Z",
  "expiresAt": null,
  "error": null
}
```

## 3. Proposed endpoints

### Session and user

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v1/me` | Return the current user and entitlements |
| `DELETE` | `/v1/me` | Request account and personal-data deletion |
| `GET` | `/v1/me/export` | Request or retrieve a personal-data export |

### Platform connections

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v1/platforms` | Return enabled capabilities and availability |
| `POST` | `/v1/connections/{platform}/authorize` | Create an OAuth authorization request |
| `POST` | `/v1/connections/{platform}/callback` | Exchange a validated authorization code |
| `GET` | `/v1/connections` | List the user's connections without token material |
| `DELETE` | `/v1/connections/{connectionId}` | Revoke and delete a connection |

### Media resolution

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/media/resolve` | Validate a link and return authorized metadata |
| `GET` | `/v1/connections/{connectionId}/media` | List media exposed by an approved integration |
| `GET` | `/v1/media-requests/{requestId}` | Refresh metadata and authorization state |

Example request:

```json
{
  "url": "https://supported.example/post/123"
}
```

The server performs URL normalization, hostname allowlisting, redirect validation,
platform resolution, and authorization checks. The response never exposes source
credentials, platform tokens, cookies, or unrestricted internal media URLs.

### Jobs

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/download-jobs` | Create an authorized download job |
| `GET` | `/v1/download-jobs/{jobId}` | Return job state and safe progress |
| `GET` | `/v1/download-jobs` | List the current user's job history |
| `POST` | `/v1/download-jobs/{jobId}/cancel` | Request cancellation |
| `POST` | `/v1/download-jobs/{jobId}/retry` | Retry an eligible terminal job |
| `POST` | `/v1/download-jobs/{jobId}/delivery` | Create a short-lived delivery URL |
| `DELETE` | `/v1/download-jobs/{jobId}` | Remove history and eligible temporary objects |

Job creation:

```json
{
  "mediaRequestId": "mrq_123",
  "formatId": "fmt_720p_mp4",
  "rightsConfirmation": true
}
```

### Abuse and support

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/reports` | Submit an abuse or copyright concern |
| `GET` | `/v1/policies/current` | Return current policy versions and links |

## 4. Error envelope

```json
{
  "error": {
    "code": "MEDIA_NOT_AUTHORIZED",
    "message": "This media is not available for authorized download.",
    "requestId": "req_123",
    "retryable": false,
    "details": {}
  }
}
```

Proposed error codes:

- `AUTHENTICATION_REQUIRED`
- `CONNECTION_EXPIRED`
- `PLATFORM_DISABLED`
- `UNSUPPORTED_URL`
- `MEDIA_NOT_FOUND`
- `MEDIA_NOT_AUTHORIZED`
- `FORMAT_NOT_AVAILABLE`
- `FILE_TOO_LARGE`
- `RATE_LIMITED`
- `PLATFORM_RATE_LIMITED`
- `PLATFORM_TEMPORARILY_UNAVAILABLE`
- `JOB_NOT_RETRYABLE`
- `DELIVERY_EXPIRED`
- `POLICY_RESTRICTED`
- `INTERNAL_ERROR`

## 5. HTTP status usage

- `200` successful read or action.
- `201` resource created.
- `202` asynchronous deletion or processing accepted.
- `204` successful deletion without a response body.
- `400` malformed request.
- `401` authentication required or invalid.
- `403` authenticated but not permitted.
- `404` resource absent or not visible to the caller.
- `409` state conflict or duplicate idempotency key with different input.
- `413` request or media exceeds the permitted size.
- `422` semantically invalid or unsupported media request.
- `429` user, service, or platform rate limit reached.
- `502` approved upstream platform returned an invalid response.
- `503` temporary service or platform unavailability.

## 6. Security requirements

- Never accept arbitrary fetch headers, cookies, or credentials from clients.
- Never return platform tokens or permanent source URLs.
- Bind every resource query to the authenticated user or authorized team.
- Apply schema validation and reject unknown security-sensitive properties.
- Use replay-resistant OAuth state and PKCE where supported.
- Require recent authentication for account deletion and sensitive connection changes.

