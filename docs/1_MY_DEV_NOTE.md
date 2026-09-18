# Local APK Build Notes

The Expo project lives at the repository root. Run these commands in PowerShell.
The clean prebuild step is required after adding or updating native dependencies
such as react-native-webview.

1. From the original repository, synchronize the latest code to the short build folder:

    ~~~powershell
    cd "C:\Users\User\Desktop\React App\SMD-SocialMediaDownloader"
    .\scripts\sync-apk-source.ps1
    ~~~

    On another laptop, first cd to that laptop's original repository path.
    The script preserves the previous build src under C:\SMDBuild\.source-backups
    and copies a fresh source tree. Do not use a plain robocopy /E alone: it leaves
    deleted routes such as src/app/index.tsx and library.tsx in the build copy,
    causing an index header, duplicate screens, or a missing bottom menu.

2. Update the generated project
    cd C:\SMDBuild
    npm.cmd ci
    npx.cmd expo prebuild --platform android --clean --no-install

3. Build the physical-device APK
    cd C:\SMDBuild\android
    .\gradlew.bat app:assembleRelease -PreactNativeArchitectures=arm64-v8a "-Dorg.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m"
## This build coverage for most modern Android phones: 
    .\gradlew.bat app:assembleRelease "-Dorg.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m"

4. Wait until `BUILD SUCCESSFUL`

# ADB INSTALL
5. Connect and update the app
    adb devices
    adb install -r "C:\SMDBuild\android\app\build\outputs\apk\release\app-release.apk"

# Send APK
5. The APK is located at: `C:\SMDBuild\android\app\build\outputs\apk\release\app-release.apk`. Find it and send to someone to install. May rename it `SMD.apk` to be clearer.

