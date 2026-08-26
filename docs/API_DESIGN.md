# API Design

**Status:** Not applicable to the current release

SMD does not operate a backend API in the in-app WebView plan. The removed
Instagram resolver endpoint and server-held Meta token are no longer part of the
application.

## Current integration contract

The only external handoff is an HTTPS URL saved by the user. If a site documents
a query-string integration, the setting may contain {url}:

~~~text
https://trusted-downloader.example/?url={url}
~~~

SMD replaces every {url} token with encodeURIComponent(postUrl) before opening
the in-app downloader. This is string substitution, not an API guarantee.

## Future API conditions

Any future backend requires a new accepted architecture decision covering user
authentication, authorization, rate limits, secret storage, abuse prevention,
privacy, observability, and deployment ownership.
