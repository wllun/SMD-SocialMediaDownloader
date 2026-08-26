# Development Guide

**Status:** Current

## Project layout

~~~text
assets/                 App icons and splash assets
docs/                   Product and engineering documentation
src/app/                Expo Router routes
src/components/         Shared UI components
src/screens/            Home, Library, Settings, and downloader screens
src/services/           Detection, settings, and direct downloads
src/theme/              Design tokens
app.json                Expo configuration
package.json            Commands and dependencies
~~~

## Commands

~~~powershell
npm install
npm start
npm run typecheck
npm run export:web
~~~

Use Expo Go first for ordinary UI work. Because react-native-webview is a native
dependency, generate a fresh native project/APK after dependency changes as documented in
[1_MY_DEV_NOTE.md](1_MY_DEV_NOTE.md).

## Conventions

- Keep platform hosts centralized in src/services/downloader-settings.ts.
- Match hosts exactly or as real subdomains; never use substring matching.
- Require HTTPS for external downloader settings.
- Display the destination domain before opening the WebView.
- Keep an obvious Close control and external-browser fallback in the WebView.
- Do not allow HTTP pages inside the in-app downloader.
- Never ship a default third-party downloader without review and permission.
- Never store credentials, access tokens, cookies, or passwords in settings.
- Update documentation whenever supported platforms or behavior changes.

## Definition of done

- TypeScript passes.
- The production web export succeeds.
- Android and iOS behavior is checked where relevant.
- URL validation, clipboard, confirmation, WebView navigation, and saving are verified.
- Documentation reflects the implementation.
