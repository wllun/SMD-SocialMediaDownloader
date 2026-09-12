# Learn React Native by Building SMD

This tutorial teaches React Native from the beginning by reading, running, and
changing the SMD project. SMD is an Expo application that accepts social-media
links, stores downloader website preferences, opens websites in an in-app
WebView, and saves supported files to the device.

The course assumes basic computer use but does not assume previous React Native
experience. Work through the lessons in order. Make one small change at a time,
run the app after each change, and keep changes in Git so they are easy to undo.

## What you will learn

By the end, you should understand:

- How JavaScript, TypeScript, React, React Native, and Expo fit together.
- How JSX becomes a native Android or iOS interface.
- Components, props, state, events, effects, memoization, and context.
- Styling with React Native objects and shared design tokens.
- File-based navigation with Expo Router.
- Forms, validation, local persistence, and platform-specific files.
- Async downloads, permissions, error handling, and progress state.
- How SMD embeds an HTTPS website with `react-native-webview`.
- How to debug the project and build an Android APK.

## Before lesson 1

Install these tools:

1. Node.js LTS, which includes npm.
2. Visual Studio Code or another code editor.
3. Git.
4. Expo Go on an Android or iOS phone for ordinary development.
5. Android Studio, a JDK, and the Android SDK only when you are ready to build
   an APK locally.

Open PowerShell in the project root:

~~~powershell
cd "C:\Users\User\Desktop\React App\SMD-SocialMediaDownloader"
npm install
npm start
~~~

The correct folder is the one containing `package.json`, `app.json`, `src`, and
`assets`. Do not run `npm start` from `android` or from a parent folder.

When Expo starts:

- Scan the QR code with Expo Go to run on a phone.
- Press `w` to run the web version.
- Press `a` to open an available Android emulator.
- Press `r` to reload the app.

If Metro has stale cached data, stop it with Ctrl+C and run:

~~~powershell
npx expo start --clear
~~~

## Lesson 1: Understand the technology stack

SMD uses several layers:

| Layer | Purpose in this project |
| --- | --- |
| JavaScript | The language executed by the application. |
| TypeScript | Adds types so mistakes can be found before the app runs. |
| React | Describes UI as reusable components and updates it when state changes. |
| React Native | Converts components such as `View` and `Text` into native UI. |
| Expo | Supplies development tools and native libraries such as Clipboard and FileSystem. |
| Expo Router | Converts files under `src/app` into screens and navigation routes. |

A React Native application does not normally render HTML. Instead of `div`,
`p`, and `button`, it uses components such as:

~~~tsx
import { Pressable, Text, View } from 'react-native';

export function Example() {
  return (
    <View>
      <Text>Hello from React Native</Text>
      <Pressable onPress={() => console.log('Pressed')}>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
}
~~~

`View` is a layout container, `Text` displays text, and `Pressable` handles taps.
The same code can render native views on Android and iOS and compatible DOM
elements on web.

### Checkpoint

You should be able to explain why SMD is a React Native app even though it can
also run in a browser.

## Lesson 2: Tour the repository

The most important folders are:

~~~text
assets/                 Images, social logos, app icon, and splash artwork
docs/                   Product, engineering, and learning documentation
src/app/                Expo Router route files
src/components/         Small reusable UI components
src/providers/          Shared React state and actions
src/screens/            Full screen implementations
src/services/           Business logic, persistence, and file downloads
src/theme/              Colors, spacing, type, radius, and size tokens
app.json                Expo app name, identifiers, icons, permissions, plugins
package.json            Dependencies and npm commands
tsconfig.json           TypeScript rules and the @/ import alias
~~~

The separation is intentional. Route files stay small, screens compose the UI,
and services hold logic that does not need to be inside JSX.

For example, `src/app/(tabs)/index.tsx` only connects the `/` route to the Home
screen. The real Home implementation lives in `src/screens/home/index.tsx`.

### Exercise

Open `package.json` and find:

- The `expo` version.
- The `react-native` version.
- The command used by `npm start`.
- The command used by `npm run typecheck`.

Do not manually change dependency versions while learning. Expo libraries need
versions compatible with the installed Expo SDK. Add compatible packages with:

~~~powershell
npx expo install package-name
~~~

### Checkpoint

You should know where to look for a route, screen, shared component, service,
theme value, and application setting.

## Lesson 3: Learn the TypeScript needed for this app

You do not need to master all of TypeScript before learning React Native. Start
with values, functions, arrays, objects, unions, and object types.

~~~ts
const appName = 'SMD';
let isDownloading = false;
const platforms = ['Instagram', 'TikTok', 'Facebook'];

function makeMessage(platform: string): string {
  return `Open ${platform}`;
}
~~~

SMD uses a union to restrict a platform ID to known values:

~~~ts
type SocialPlatformId =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'xhs'
  | 'x'
  | 'douyin'
  | 'youtube_video'
  | 'youtube_mp3';
~~~

This is safer than accepting any string. TypeScript can warn if code tries to
use an unsupported value such as `'snapchat'` before Snapchat has been added.

An object type describes required fields:

~~~ts
type DownloaderWebsite = {
  id: string;
  url: string;
};
~~~

The `?` symbol makes a property optional. The `unknown` type means a value must
be checked before it is used. Both patterns appear in the project's settings
and download queue code.

Run the compiler whenever you make a change:

~~~powershell
npm run typecheck
~~~

### Exercise

Read `src/services/social-platforms.ts`. Find the `SocialPlatformId` union, the
`SocialPlatform` object type, and the `socialPlatforms` array. Follow how the
types prevent a setting from being stored under an unknown platform key.

### Checkpoint

You should understand the difference between a runtime value such as
`'instagram'` and a compile-time type such as `SocialPlatformId`.

## Lesson 4: Components, JSX, and props

A component is a function that returns JSX. JSX looks like markup but is part of
JavaScript and can include expressions inside braces.

SMD's `AppText` component is a good first example:

~~~tsx
export function AppText({
  variant = 'body',
  style,
  ...props
}: TextProps & { variant?: AppTextVariant }) {
  return <Text selectable style={[typography[variant], style]} {...props} />;
}
~~~

Important ideas in this component:

- `variant`, `style`, and `props` are inputs called props.
- `variant = 'body'` supplies a default.
- `typography[variant]` selects a shared text style.
- `[baseStyle, style]` lets the caller override the base style.
- `...props` forwards properties such as `numberOfLines` and accessibility data.

It can then be reused like this:

~~~tsx
<AppText variant="display">Save videos in seconds</AppText>
<AppText variant="body" style={{ color: colors.inkMuted }}>
  Paste a link to get started
</AppText>
~~~

React components must start with a capital letter. Lowercase names are reserved
for platform or host elements.

### Exercise

1. Open `src/screens/home/index.tsx`.
2. Change the subtitle text to another phrase.
3. Save the file and watch Fast Refresh update the app.
4. Restore the original phrase.

### Checkpoint

You should be able to identify a component, its props, its children, and the JSX
it returns.

## Lesson 5: Layout and styling

React Native styles are JavaScript objects. Property names use camelCase:

~~~tsx
<View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
  }}
>
  {/* children */}
</View>
~~~

React Native uses Flexbox. The default direction is vertical (`column`), unlike
CSS on the web. Common properties are:

- `flex: 1`: occupy available space.
- `flexDirection: 'row'`: place children horizontally.
- `justifyContent`: align along the main axis.
- `alignItems`: align along the cross axis.
- `gap`, `padding`, and `margin`: control spacing.

SMD centralizes repeated values in `src/theme/index.ts`. For example,
`spacing.sm` is preferable to inventing a new number in each screen. This keeps
the interface consistent and makes future redesigns easier.

Interactive icons should keep a large tap target even when the image is small.
The Home platform logos demonstrate this: the visible logo is 22 pixels, while
the surrounding `Pressable` is at least 44 points and 48 on Android.

### Exercise

Change `colors.accent` temporarily in `src/theme/index.ts`. Observe how the same
token affects navigation and controls across several screens, then restore it.

### Checkpoint

You should understand why the app uses design tokens and why the visual size of
an icon can be smaller than its touch target.

## Lesson 6: State and events

State is data that can change while a component is mounted. Calling its setter
asks React to render the component again.

The Home screen stores the input value and error state:

~~~tsx
const [url, setUrl] = useState('');
const [error, setError] = useState<string>();
~~~

The text field is controlled by that state:

~~~tsx
<TextInput
  value={url}
  onChangeText={(value) => {
    setUrl(value);
    setError(undefined);
  }}
/>
~~~

`value={url}` tells the field what to display. `onChangeText` is an event handler
that stores each edit. This one-way flow makes validation and clearing reliable.

State updates based on existing state should use the callback form:

~~~tsx
setDownloads((current) => current.filter((item) => item.id !== id));
~~~

This avoids reading an outdated value when React batches updates.

### Exercise

Add a temporary character counter below the Home input:

~~~tsx
<AppText variant="caption">{url.length} characters</AppText>
~~~

Type into the field and observe the rerender. Remove the counter after the
exercise.

### Checkpoint

You should be able to explain what causes the Home screen to rerender.

## Lesson 7: Derived values, validation, and forms

Not every value needs its own state. A value calculated from other state is
called derived data.

Home derives every matching workflow from the current URL. Most hosts match one
workflow; YouTube matches both Video and MP3:

~~~tsx
const detectedPlatforms = useMemo(() => detectSocialPlatforms(url), [url]);
~~~

`useMemo` recalculates when `url` changes. For tiny calculations it is often not
necessary, but it documents that the result is derived rather than independently
editable.

URL rules live in service functions so they can be reused and tested without
rendering a screen. `detectSocialPlatforms` parses the URL and compares its host
against explicit platform hosts. It does not use unsafe substring matching.

The Settings screen demonstrates a larger controlled form:

- `downloaders` contains all input values.
- `touchedWebsiteIds` controls when field errors appear.
- `getUrlError` validates HTTPS addresses.
- A 400 ms timer waits briefly before saving valid changes.
- The effect cleanup cancels an outdated timer after another keystroke.

### Exercise

Try these values in Settings and predict the result before leaving the field:

~~~text
https://example.com
http://example.com
not-a-url
https://example.com/?url={url}
~~~

Only use a real downloader website that you trust. `example.com` is suitable for
learning URL validation but not for downloading media.

### Checkpoint

You should understand controlled fields, derived values, validation, and why
debounced auto-save uses an effect cleanup.

## Lesson 8: Effects and local persistence

An effect synchronizes React with something outside rendering, such as storage,
a timer, a subscription, or a native API.

Settings loads persisted data after the screen mounts:

~~~tsx
useEffect(() => {
  const stored = getDownloaderSettings();
  setDownloaders(stored);
  setHasLoaded(true);
}, []);
~~~

An empty dependency array means the effect runs after the first mount. Another
effect watches `downloaders` and saves valid changes after a delay.

SMD uses a browser-like `localStorage` interface on both native and web:

- `src/services/settings-storage.ts` installs Expo SQLite's native localStorage
  adapter.
- `src/services/settings-storage.web.ts` uses the browser's localStorage.

Metro automatically selects `.web.ts` for a web build and the unsuffixed file
for native builds. The rest of the app imports one module name and does not need
platform checks.

Stored data can be missing, outdated, or corrupted. That is why
`getDownloaderSettings` uses `try/catch`, supplies empty defaults, and validates
data before writing it.

### Exercise

1. Add a valid test URL in Settings.
2. Wait for “Changes saved automatically.”
3. close and reopen the app.
4. Confirm the setting remains.
5. Use “Clear all websites” and confirm the destructive dialog works.

### Checkpoint

You should know when an effect is appropriate and how platform-specific files
give one service different native and web implementations.

## Lesson 9: Navigation with Expo Router

Expo Router creates routes from files under `src/app`.

~~~text
src/app/_layout.tsx             Root stack and app-wide providers
src/app/(tabs)/_layout.tsx      Tab navigator layout
src/app/(tabs)/index.tsx        Home route: /
src/app/(tabs)/queue.tsx        Queue route: /queue
src/app/(tabs)/settings.tsx     Settings route: /settings
src/app/downloader.tsx          Downloader modal: /downloader
~~~

Parentheses create a route group. `(tabs)` organizes routes without adding that
text to the public URL.

The root layout wraps the entire navigation tree with shared providers and
declares the downloader as a modal:

~~~tsx
<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
<Stack.Screen
  name="downloader"
  options={{ presentation: 'modal', title: 'Downloader' }}
/>
~~~

Code can navigate and pass route parameters:

~~~tsx
router.push({
  pathname: '/downloader',
  params: { platform: platform.label, url: downloaderUrl },
});
~~~

Use `push` when the user should be able to return with Back. Use `back` to close
the current route. Route files read parameters and pass them to screen
components.

The Home platform-icon shortcuts are a useful complete example:

1. A `Pressable` receives the tap.
2. The handler reads that platform's saved default website.
3. Missing configuration offers navigation to `/settings`.
4. Valid configuration is converted to an HTTPS URL.
5. Router pushes `/downloader` with the platform and URL parameters.

### Exercise

Trace one Instagram icon tap from `src/screens/home/index.tsx` to
`src/app/downloader.tsx` and finally to `src/screens/downloader.tsx`.

### Checkpoint

You should be able to draw the route tree and explain the difference between a
tab route and the downloader modal.

## Lesson 10: Shared state with context

State normally belongs in the nearest component that needs it. When several
screens need the same state and actions, context can provide them through a
shared ancestor.

`DownloadQueueProvider` owns:

- The download queue array.
- Whether a download is active.
- The action that begins a direct download.
- The action that removes a failed item.

The root layout places this provider above every route:

~~~tsx
<DownloadQueueProvider>
  <Stack>{/* all screens */}</Stack>
</DownloadQueueProvider>
~~~

A screen accesses its value through `useDownloadQueue`. This React 19 project
uses `use(DownloadQueueContext)`; many older tutorials use
`useContext(DownloadQueueContext)`. Both read context, but follow the version and
style already used by this project.

The provider uses `useMemo` for the shared value so consumers do not receive a
new wrapper object on every unrelated render.

### Exercise

Read `src/providers/download-queue-provider.tsx` and identify:

1. The context value type.
2. Its initial state.
3. Where a pending queue item is inserted.
4. Where successful items are removed.
5. Where failed items receive an error message.

### Checkpoint

You should understand why the queue belongs above the Home and Queue screens
instead of being local state inside either one.

## Lesson 11: Async functions, downloads, and permissions

Network and native operations take time, so their functions return promises.
`async` and `await` make those steps readable:

~~~tsx
try {
  const result = await downloadMedia(downloadUrl, setProgress);
  Alert.alert('Download complete', result.savedTo);
} catch (error) {
  Alert.alert('Could not save this file');
} finally {
  setIsDownloading(false);
}
~~~

- `try` contains work that can fail.
- `catch` turns an exception into user-facing feedback.
- `finally` runs after success or failure and resets loading state.

The native `downloadMedia` service:

1. Creates a safe file name.
2. Downloads into the app cache with Expo FileSystem.
3. Reports byte progress.
4. Requests media-library permission for supported photos and videos.
5. Saves to the device library when allowed.
6. Falls back to the native share/save sheet for other files.

The web implementation lives in `download-media.web.ts` because browsers use a
different download mechanism and security model.

Never assume a URL is a downloadable file merely because a page contains a
video. A normal social post URL is a web page. In SMD, the configured external
website resolves the post; SMD can directly save only supported file URLs or
download events it can observe.

### Exercise

Follow the `onProgress` callback from `download-media.ts` to the provider and then
to the Queue UI. Write down which component owns each piece of state.

### Checkpoint

You should understand promises, loading state, errors, cleanup in `finally`, and
why native permissions are requested only when needed.

## Lesson 12: Native WebView and security boundaries

`react-native-webview` embeds an external website inside the Android or iOS app.
The configured website is not part of SMD, so the WebView screen treats it as an
external trust boundary.

The downloader screen:

- Accepts only an initial HTTPS URL.
- Allows HTTPS, `about:blank`, and site-generated blob/data content.
- Blocks ordinary HTTP navigation.
- Sends non-web schemes to the operating system when possible.
- Disables third-party cookies and extra windows.
- Keeps Close, Back, Reload, and external Browser controls visible.
- Intercepts recognizable direct media URLs and file-download events.

WebView behavior is native-only. `src/screens/downloader.web.tsx` provides a web
fallback because a browser build cannot use the native WebView component.

Do not remove the HTTPS checks merely to make a site work. Do not enter social
passwords, cookies, access tokens, or payment details into an unknown downloader
website. SMD does not make a third-party website safe.

### Exercise

Read `handleShouldStart` in `src/screens/downloader.tsx`. For each URL below,
predict whether SMD permits the WebView, blocks it, or sends it elsewhere:

~~~text
https://example.com
http://example.com
mailto:help@example.com
https://files.example.com/video.mp4
~~~

### Checkpoint

You should understand that embedding a website does not give SMD control over
the site's scripts, redirects, advertisements, or download implementation.

## Lesson 13: Accessibility and native interaction

Mobile UI must work for touch, keyboard users on web, and screen readers.
SMD's icon shortcuts use this pattern:

~~~tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Open Instagram downloader"
  accessibilityHint="Opens the configured downloader website inside SMD"
  onPress={handlePress}
>
  <Image accessible={false} source={icon} />
</Pressable>
~~~

The button has a readable name even though no platform name is visible. The
image is hidden from accessibility because the parent already communicates the
meaning. The pressed state changes color and opacity without moving the layout.

General rules:

- Give icon-only controls an accessibility label.
- Keep touch targets at least 44 points and preferably 48 dp on Android.
- Do not communicate errors with color alone; include text.
- Mark errors with `accessibilityRole="alert"` when appropriate.
- Preserve system Back behavior and familiar gestures.
- Test large text and screen-reader focus order.

### Exercise

Turn on TalkBack on Android or VoiceOver on iOS. Move through the Home platform
icons and confirm that each button announces the correct platform and action.

### Checkpoint

You should understand the difference between a decorative image and an
interactive icon button.

## Lesson 14: Add a small feature safely

Use this practice feature to combine props, state, events, and conditional JSX:
show a temporary “Ready” caption when the Home input contains a valid HTTP or
HTTPS URL.

1. Reuse the existing `isSupportedUrl` helper.
2. Derive a Boolean from `url` instead of creating new independent state.
3. Render the caption only when the Boolean is true.
4. Use an existing text and color token.
5. Run TypeScript and test valid, invalid, and empty values.

One possible implementation is:

~~~tsx
const isReady = isSupportedUrl(url);

{isReady ? (
  <AppText variant="caption" style={{ color: colors.success }}>
    Ready
  </AppText>
) : null}
~~~

After learning from the exercise, decide whether the feature improves the real
product. Remove it if it duplicates the existing platform-detection feedback.
Learning changes do not all need to become production features.

### Checkpoint

You should be able to add a small visual behavior without modifying storage,
navigation, or native download code.

## Lesson 15: Debug common problems

### `npm start` fails

Confirm the current folder:

~~~powershell
Get-Location
Test-Path .\package.json
~~~

`Test-Path` must return `True`. Then install dependencies and clear Metro:

~~~powershell
npm install
npx expo start --clear
~~~

### “Unable to resolve module”

First check whether the package is declared in `package.json` and installed in
`node_modules`. Do not copy random package files into the project. For Expo
packages, install the compatible version with `npx expo install`.

After a native dependency or Expo config plugin changes, Expo Go may not be
enough and an old generated `android` folder may be stale. Regenerate the native
project before the next local APK build as described in `1_MY_DEV_NOTE.md`.

### `gradlew.bat` is not recognized

PowerShell does not run files from the current directory without `./` or `.\`.
The wrapper also exists only inside the generated `android` folder:

~~~powershell
cd C:\SMDBuild\android
.\gradlew.bat app:assembleRelease
~~~

### The release app closes immediately

Capture the Android crash instead of guessing:

~~~powershell
adb devices
adb logcat -c
adb logcat AndroidRuntime:E ReactNativeJS:E *:S
~~~

Open SMD on the phone, wait for the crash, and copy the exception. A release-only
crash may be caused by stale generated native files, a missing native package,
configuration, or JavaScript initialization. The log identifies which one.

### TypeScript reports an error

Read the first error first. Later messages are often consequences of it. The
message normally includes a file, line number, expected type, and received type.

~~~powershell
npm run typecheck
~~~

### Checkpoint

You should know how to distinguish a dependency problem, Metro cache problem,
TypeScript problem, and native Android crash.

## Lesson 16: Test before building

Use this short loop for every change:

1. Run the screen on web or Expo Go.
2. Test the success case.
3. Test empty, invalid, canceled, offline, and permission-denied cases.
4. Check Back navigation and app restart behavior.
5. Run static checks.

~~~powershell
npm run typecheck
npm run export:web
~~~

For downloader changes, also test on a physical Android or iOS device. A web
export cannot prove that a native WebView, media permission, or device save flow
works.

The full project checklist is in `docs/TESTING.md`.

## Lesson 17: Build an Android APK

An APK contains a compiled Android application that can be sent directly to a
compatible Android phone. This project keeps generated native code out of the
main working folder, so the documented build uses `C:\SMDBuild`.

The abbreviated process is:

1. Copy the project without old generated or dependency folders.
2. Install exact dependencies with `npm ci`.
3. Generate a clean Android project with Expo prebuild.
4. Run Gradle from `C:\SMDBuild\android`.
5. Install the APK with ADB or send the file to another person.

For a modern 64-bit Android phone:

~~~powershell
cd C:\SMDBuild\android
.\gradlew.bat app:assembleRelease -PreactNativeArchitectures=arm64-v8a "-Dorg.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m"
~~~

For an APK containing all architectures configured by the project:

~~~powershell
.\gradlew.bat app:assembleRelease "-Dorg.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m"
~~~

The output is normally:

~~~text
C:\SMDBuild\android\app\build\outputs\apk\release\app-release.apk
~~~

Follow `docs/1_MY_DEV_NOTE.md` for the current exact copy, prebuild, build, and
installation commands. Rebuild after code or native configuration changes; do
not send an older APK by mistake.

### Checkpoint

You should understand why `npm start` runs a development server while Gradle
produces an installable Android application.

## Lesson 18: Your next practice projects

Build knowledge in this order:

1. Add a harmless text or style change on Home.
2. Extract a repeated visual pattern into a component with props.
3. Add local state to show and hide a small section.
4. Add a new setting that persists locally.
5. Add a new route and navigate to it.
6. Write unit tests for URL detection and template replacement.
7. Add a new platform only after updating its type, hosts, icon, settings,
   documentation, and manual tests together.

For each practice task, answer these questions before coding:

- Which component should own the state?
- Is the value state, a prop, or derived data?
- Does the logic belong in a screen, component, provider, or service?
- Does native behavior differ from web behavior?
- What can fail, and what message should the user see?
- Does this change require permission or expose external content?
- How will I verify it on a real device?

## Final project map

Use this map when you forget where a behavior begins:

| Behavior | Start reading here |
| --- | --- |
| App startup and global navigation | `src/app/_layout.tsx` |
| Bottom tabs | `src/components/app-tabs.tsx` |
| Paste, detect, and open downloader | `src/screens/home/index.tsx` |
| Platform definitions and URL rules | `src/services/social-platforms.ts` |
| Settings screen and auto-save | `src/screens/settings.tsx` |
| Settings serialization and migration | `src/services/downloader-settings.ts` |
| Native/web key-value storage | `src/services/settings-storage.ts` and `.web.ts` |
| Shared download state | `src/providers/download-queue-provider.tsx` |
| Native direct-file download | `src/services/download-media.ts` |
| In-app external website | `src/screens/downloader.tsx` |
| Colors, type, spacing, and sizes | `src/theme/index.ts` |
| Expo name, icon, package, and plugins | `app.json` |
| APK commands | `docs/1_MY_DEV_NOTE.md` |

The best way to learn React Native is to keep the app running, predict what a
small change will do, make that change, and compare the result with your
prediction. Read errors as information, not as failure.
