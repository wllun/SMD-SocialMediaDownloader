# Product Requirements

**Status:** Implemented prototype  
**Product:** SMD in-app downloader launcher

## Problem

Users want one place to paste a social post URL and reach their preferred
platform-specific downloader website without remembering multiple sites.

## Primary journey

1. Configure an HTTPS downloader website for each desired platform.
2. Paste a social post link on Home.
3. SMD identifies the platform from an explicit host list.
4. SMD copies the post link to the clipboard.
5. SMD displays the external destination and asks for confirmation.
6. Android/iOS opens the configured website in an SMD WebView; web opens a tab.
7. SMD intercepts supported native file downloads and opens its device save flow.

## Functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | Validate pasted HTTP/HTTPS URLs. | Must |
| FR-002 | Detect Instagram, TikTok, Facebook, XHS, X, and Douyin. | Must |
| FR-003 | Store one downloader URL per platform locally. | Must |
| FR-004 | Require downloader URLs to use HTTPS. | Must |
| FR-005 | Copy the post URL before opening the downloader. | Must |
| FR-006 | Show the destination hostname and require confirmation. | Must |
| FR-007 | Support optional {url} encoded-link replacement. | Should |
| FR-008 | Continue supporting direct media-file downloads. | Should |
| FR-009 | Let users clear all configured websites. | Must |
| FR-010 | Open configured sites in an in-app WebView on Android/iOS. | Must |
| FR-011 | Keep Close and external-browser fallback controls available. | Must |
| FR-012 | Block insecure HTTP navigation inside the WebView. | Must |

## Non-goals

- Scraping or reverse-engineering social platforms.
- Operating an SMD media-resolution API.
- Supplying or endorsing a third-party downloader service.
- Bypassing DRM, authentication, paywalls, regional restrictions, or access controls.
- Collecting social-platform passwords, cookies, or access tokens.
- Guaranteeing external-site availability, safety, quality, or download success.

## Acceptance criteria

- A recognized link with a configured site copies successfully and opens inside
  SMD on Android/iOS only after confirmation.
- A recognized link without configuration directs the user to Settings.
- Unknown hosts are rejected.
- Invalid or non-HTTPS downloader settings cannot be saved.
- Settings survive an app restart.
- Direct media URLs continue to use the in-app downloader.
- WebView sites that expose supported file URLs use SMD's native save flow.
