# Product Requirements

**Status:** Proposed  
**Product:** Social Media Downloader / Creator Media Vault

## 1. Problem statement

Creators often lose track of original media published across multiple platforms.
They need a simple way to back up, organize, download, share, and convert content
they own without managing several separate tools.

## 2. Product principle

The product handles only media the user owns or is authorized to use. It does not
remove existing watermarks, circumvent platform controls, access private media
without permission, or download protected third-party content without explicit
authorization.

## 3. Target users

### Primary

- Independent creators managing their own social accounts.
- Social media managers operating accounts with documented authorization.
- Small teams maintaining an approved brand media library.

### Not targeted

- Users bulk-downloading third-party copyrighted media.
- Users attempting to access private accounts or bypass geographic restrictions.
- Users seeking a YouTube-to-MP3 piracy service.

## 4. MVP user journeys

### Import local media

1. User chooses a photo or video from the device.
2. App displays metadata and permitted actions.
3. User saves it to the library or extracts audio from their own video.
4. App saves or shares the result.

### Connect a social account

1. User selects a supported platform.
2. App starts the platform's official OAuth flow.
3. User grants the minimum required permissions.
4. App lists only media available through the approved integration.
5. User selects authorized media and an available format.

### Process a supported link

1. User pastes a link.
2. App detects the platform and validates the URL.
3. Backend verifies support and authorization.
4. App shows metadata, available formats, and estimated size.
5. User confirms rights and starts the job.
6. App displays progress and saves the completed result.

## 5. Functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | Users can create an account, sign in, sign out, and delete their account. | Must |
| FR-002 | Users can import supported photos and videos from device storage. | Must |
| FR-003 | The app validates and normalizes pasted URLs before sending them to the backend. | Must |
| FR-004 | Users can connect and revoke supported social accounts using official OAuth. | Must |
| FR-005 | The app displays media metadata before download or conversion. | Must |
| FR-006 | The backend verifies authorization before preparing a social-media download. | Must |
| FR-007 | Users can select from formats explicitly available for the authorized asset. | Must |
| FR-008 | Users can view job progress and cancel or retry eligible jobs. | Must |
| FR-009 | Users can save completed files using platform-approved device storage APIs. | Must |
| FR-010 | Users can extract MP3 or M4A audio from a video they supplied locally. | Must |
| FR-011 | Users can view and clear local download history. | Should |
| FR-012 | Users can share completed files through the system share sheet. | Should |
| FR-013 | Users receive actionable messages for unsupported, unauthorized, or expired media. | Must |
| FR-014 | Temporary server files expire automatically. | Must |
| FR-015 | Users can report abuse or copyright concerns. | Must before public launch |

## 6. Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-001 | API requests use TLS and authenticated endpoints enforce least privilege. |
| NFR-002 | OAuth tokens are encrypted and excluded from logs and analytics. |
| NFR-003 | URL retrieval prevents server-side request forgery and validates redirects. |
| NFR-004 | The API is idempotent where repeated requests could create duplicate jobs. |
| NFR-005 | Temporary media deletion is monitored and auditable. |
| NFR-006 | Core flows support screen readers, dynamic text, and sufficient contrast. |
| NFR-007 | Failures expose a stable error code and a user-friendly explanation. |
| NFR-008 | Platform adapters can be disabled without deploying a new mobile binary. |
| NFR-009 | Feature availability is accurately disclosed to users and app reviewers. |
| NFR-010 | The service records minimal data and applies documented retention limits. |

## 7. MVP platform scope

### Included

- Local photo and video import.
- Audio extraction from user-supplied local video.
- One approved official social platform integration.
- A second integration only if authorization and testing complete on schedule.
- Download queue, progress, history, retry, cancel, save, and share.

### Excluded until separately approved

- Arbitrary public-link scraping.
- Private posts, disappearing media without authorized API access, or paywalled media.
- Existing-watermark removal.
- YouTube media download or YouTube-to-MP3.
- Bulk downloading and automated account crawling.
- XHS, Douyin, TikTok, or Facebook support without an official permitted path.

## 8. Core acceptance criteria

- An unsupported URL is rejected without fetching arbitrary network resources.
- A supported link cannot start a job until authorization is verified.
- Revoking a social connection prevents subsequent access and removes stored tokens.
- A completed file can be saved and opened on supported Android and iOS versions.
- Interrupted jobs produce a recoverable state or a clear terminal error.
- Temporary media is inaccessible after its retention period.
- Local audio conversion never sends the file to a server unless the user is told
  and explicitly agrees.
- Account deletion removes or schedules deletion of all personal data within the
  published retention period.

## 9. Product success metrics

- Authorized media resolution success rate.
- Download completion rate by platform.
- Median time from submission to saved file.
- Retry, cancellation, and terminal failure rates.
- Seven-day and thirty-day active creator retention.
- Temporary-object deletion success rate.
- OAuth connection and revocation success rate.
- Copyright complaints and store-review incidents.

