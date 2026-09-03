# SMD — Social Media Downloader Launcher

**Status:** Functional prototype  
**Platforms:** Android, iOS, and web through Expo

SMD detects supported social-media post links and opens a downloader website
chosen by the user for that platform inside the Android or iOS app. Before the
site opens, SMD copies the post link and displays the external destination domain.

SMD does not scrape social networks, operate a media-resolution backend, or claim
that an external website is safe or authorized. Users must configure only sites
they trust and download only media they own or have permission to use.

## Supported detection

| Platform | Recognized hosts |
| --- | --- |
| Instagram | instagram.com |
| TikTok | tiktok.com and subdomains |
| Facebook | facebook.com, fb.watch, fb.com |
| XHS / Xiaohongshu | xiaohongshu.com, xhslink.com |
| X / Twitter | x.com, twitter.com |
| Douyin | douyin.com, iesdouyin.com |

Direct media-file URLs continue to use SMD's native file download flow.

## Run

~~~powershell
npm install
npm start
~~~

Open **Settings** and enter an HTTPS downloader website for each desired platform.
Valid changes save automatically. A plain site URL opens its home page. A URL
containing {url} has that placeholder replaced with the encoded post link, if the
site supports prefill.

Example format only:

~~~text
https://trusted-downloader.example/?url={url}
~~~

## Current architecture

~~~mermaid
flowchart LR
    U["User pastes post URL"] --> A["SMD detects platform"]
    A --> S["Read locally saved downloader URL"]
    S --> C["Copy post URL and confirm destination"]
    C --> V["Open protected in-app WebView"]
    V --> W["External downloader website"]
    W --> D["Intercept supported file download"]
    V --> B["Optional external-browser fallback"]
~~~

There is no SMD backend in this plan. Downloader preferences are persisted with
Expo SQLite on Android/iOS and browser localStorage on web.

## Important boundaries

- HTTPS downloader URLs are required.
- Social-media credentials, cookies, and access tokens must never be entered into
  SMD or an untrusted downloader website.
- The external website controls its pages, advertisements, redirects, and files.
- Common direct media downloads are handed to SMD's native save flow; site-made
  blob downloads and unusual download mechanisms remain site-dependent.
- Web builds open the configured site in a new browser tab because the embedded
  WebView is native-only.
- Store distribution still requires legal and app-review assessment.

See [docs/README.md](docs/README.md) for the full documentation index.
