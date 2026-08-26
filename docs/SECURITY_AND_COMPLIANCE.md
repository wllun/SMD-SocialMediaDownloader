# Security and Compliance

**Status:** Implemented baseline for in-app WebView handoff

## Product boundary

SMD detects a social hostname, copies the supplied post URL, and opens a website
configured by the user in a native WebView. It does not resolve social media or
inspect external content. It can hand supported download URLs/events to its native
save flow but cannot guarantee every site's download mechanism.

Users must download only media they own or are authorized to use. The app must not
be marketed as bypassing DRM, private access, paywalls, regional restrictions, or
watermarks.

## Required controls

- Accept only HTTP/HTTPS post inputs and HTTPS downloader destinations.
- Match supported hostnames exactly or by valid subdomain suffix.
- Show the destination hostname and require confirmation before opening it.
- Keep a visible Close control and external-browser fallback.
- Block HTTP navigation in the WebView and disable third-party cookies.
- Copy only the post URL; never copy credentials or session data.
- Store downloader preferences locally and provide a clear-all control.
- Do not bundle default third-party sites without security and legal review.
- Never request social passwords, cookies, tokens, or browser sessions.

## External-site risks

External websites may contain malicious advertisements, tracking, deceptive
buttons, redirects, unsafe files, or credential phishing. SMD cannot verify or
guarantee their content. Settings warns users to configure only sites they trust,
and Home displays the destination before handoff. The in-app screen warns users
not to enter social credentials, cookies, or payment details.

## Privacy

SMD does not need an account or backend for this plan. Downloader preferences stay
on the device. Once the WebView opens, the external site's privacy policy and data
practices apply. SMD does not share stored downloader settings with a backend.

## Distribution

In-app WebView handoff does not remove copyright or app-store obligations.
Before public release, review the exact behavior against
[Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
and [Google Play intellectual-property policy](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en).
