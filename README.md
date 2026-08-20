# SMD — Social Media Downloader Launcher

**Status:** Functional prototype  
**Platforms:** Android, iOS, and web through Expo

SMD detects supported social-media post links and opens a downloader website
chosen by the user for that platform. Before leaving SMD, it copies the post link
to the clipboard and displays the external destination domain.

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

Open **Settings**, enter an HTTPS downloader website for each desired platform,
and save. A plain site URL opens its home page. A URL containing {url} has that
placeholder replaced with the encoded post link, if the site supports prefill.

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
    C --> B["Open default browser"]
    B --> W["External downloader website"]
    W --> D["Browser-managed device download"]
~~~

There is no SMD backend in this plan. Downloader preferences are persisted with
Expo SQLite on Android/iOS and browser localStorage on web.

## Important boundaries

- HTTPS downloader URLs are required.
- Social-media credentials, cookies, and access tokens must never be entered into
  SMD or an untrusted downloader website.
- The external website controls its pages, advertisements, redirects, and files.
- Browser downloads do not appear in SMD's internal queue or library.
- Store distribution still requires legal and app-review assessment.

See [docs/README.md](docs/README.md) for the full documentation index.
