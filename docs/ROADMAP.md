# Roadmap

**Status:** Revised for in-app WebView handoff

## Completed

- Root-level Expo project and three-tab UI.
- Direct media-file downloading.
- Detection for Instagram, TikTok, Facebook, XHS, X, and Douyin.
- Persistent platform-specific website settings.
- Clipboard copy, destination confirmation, and in-app WebView launch.
- HTTPS navigation controls, native download interception, and browser fallback.
- Removal of the temporary Instagram API adapter.

## Next

- Add unit tests for hostname detection and {url} generation.
- Perform Android and iOS WebView/device-save testing on configured sites.
- Replace mock Library entries with real history or remove them.
- Improve accessibility and localized error labels.

## Before distribution

- Decide private APK versus public store release.
- Complete legal, copyright, privacy, and store-policy review.
- Add acceptable-use confirmation.
- Ensure store metadata does not promise unsupported downloads.

## Not planned

- SMD-hosted scraping or media extraction.
- Social account password or cookie collection.
- A backend queue, FFmpeg worker, or temporary media bucket.
- DRM, watermark, paywall, or access-control circumvention.
