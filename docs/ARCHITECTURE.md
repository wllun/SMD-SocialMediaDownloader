# Architecture

**Status:** Implemented prototype  
**Style:** Local Expo client with external-browser handoff

## Components

### Home

- Validates the pasted URL and detects supported social hosts.
- Reads the matching downloader preference.
- Copies the original post URL.
- Confirms the external destination hostname.
- Opens the system browser through React Native Linking.

### Settings

- Stores one HTTPS website URL per platform.
- Uses Expo SQLite's localStorage polyfill for device persistence.
- Supports {url} as an encoded-link placeholder.
- Allows all external website preferences to be cleared.

### Direct file downloader

Direct image, video, and audio URLs remain handled by Expo FileSystem. Supported
visual media can be saved to the device library; other files use the native
share/save sheet. Web builds use a browser Blob download.

## Flow

~~~mermaid
sequenceDiagram
    actor User
    participant App as SMD
    participant Store as Local settings
    participant Browser as Default browser
    participant Site as External website
    User->>App: Paste social post URL
    App->>App: Validate and detect hostname
    App->>Store: Read platform downloader URL
    App->>User: Show destination and request confirmation
    App->>App: Copy post URL
    App->>Browser: Open configured HTTPS URL
    Browser->>Site: Load external downloader
    User->>Site: Paste or submit link
    Site-->>Browser: Return file or redirect
    Browser-->>User: Browser-managed download
~~~

## Trust boundaries

SMD controls validation, local settings, clipboard copying, confirmation, and the
initial HTTPS URL. It does not control the external site's scripts, redirects,
advertisements, cookies, files, or final download behavior.

There is no current SMD backend, social OAuth connection, job queue, or server
media storage.

