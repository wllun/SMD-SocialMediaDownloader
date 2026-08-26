# Architecture

**Status:** Implemented prototype  
**Style:** Local Expo client with an in-app WebView handoff

## Components

### Home

- Validates the pasted URL and detects supported social hosts.
- Reads the matching downloader preference.
- Copies the original post URL.
- Confirms the external destination hostname.
- Opens a modal downloader route inside SMD on Android and iOS.

### Settings

- Stores one HTTPS website URL per platform.
- Uses Expo SQLite persistence on Android/iOS and browser localStorage on web.
- Supports {url} as an encoded-link placeholder.
- Allows all external website preferences to be cleared.

### Direct file downloader

Direct image, video, and audio URLs remain handled by Expo FileSystem. Supported
visual media can be saved to the device library; other files use the native
share/save sheet. Web builds use a browser Blob download.

### In-app downloader

- Uses react-native-webview on Android and iOS.
- Keeps Close, page-back, reload, and external-browser fallback controls visible.
- Blocks insecure HTTP navigation and disables third-party cookies.
- Intercepts common direct media URLs and WebView file-download events, then
  delegates saving to the existing direct file downloader.
- Uses an external browser tab on web, where react-native-webview is unavailable.

## Flow

~~~mermaid
sequenceDiagram
    actor User
    participant App as SMD
    participant Store as Local settings
    participant WebView as In-app WebView
    participant Site as External website
    User->>App: Paste social post URL
    App->>App: Validate and detect hostname
    App->>Store: Read platform downloader URL
    App->>User: Show destination and request confirmation
    App->>App: Copy post URL
    App->>WebView: Open configured HTTPS URL
    WebView->>Site: Load external downloader
    User->>Site: Paste or submit link
    Site-->>WebView: Return file or redirect
    WebView-->>App: Supported download URL/event
    App-->>User: Native device save flow
~~~

## Trust boundaries

SMD controls validation, local settings, clipboard copying, confirmation, and the
initial HTTPS URL and supported native download interception. It does not control
the external site's scripts, redirects, advertisements, files, or site-specific
blob/download behavior.

There is no current SMD backend, social OAuth connection, job queue, or server
media storage.
