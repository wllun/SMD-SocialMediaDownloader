# External Downloader Setup

SMD does not include a downloader website. Users choose and configure an HTTPS
website separately for each supported social platform.

## Configure

1. Open the SMD **Settings** tab.
2. Enter an HTTPS website URL under the appropriate platform.
3. Press **Save downloader websites**.
4. Return Home and paste a post link.
5. Review the external destination before opening it inside SMD.

For websites that accept an input URL in their address, use {url}:

~~~text
https://trusted-downloader.example/?url={url}
~~~

SMD replaces {url} with the percent-encoded post link. If the external site does
not document such a parameter, configure only its home page. SMD copies the post
link so it can be pasted there.

## Safety checklist

- Use HTTPS and verify the domain spelling.
- Avoid sites requesting passwords, cookies, tokens, or payment.
- Treat advertisements and download buttons as untrusted.
- Use downloaded material only when you own it or have permission.
- Clear a configured site if its ownership or behavior changes.

On Android and iOS, the site opens in SMD. Use **Browser ↗** if a site refuses to
run in a WebView or its download does not work there. On web, SMD opens a new tab.

SMD does not endorse, monitor, or guarantee user-configured websites.
