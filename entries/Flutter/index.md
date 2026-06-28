<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flutter -->

[Flutter](https://flutter.dev) is an open-source mobile application development framework created by Google. It allows developers to build high-performance, cross-platform apps for iOS and Android using a single codebase.

In order to understand the sections below more for Android development on NixOS, <a href="Android" class="wikilink" title="check out the Android wiki page">check out the Android wiki page</a>.

## Development

### Linux desktop/Web

To build Flutter apps to Linux desktop or Web you only need the `flutter` package from Nixpkgs. Then run `flutter build linux` or `flutter build web`. Ensure that `pkg-config` is installed on your system, either through a development shell or directly on the base system. Not having `pkg-config` available may result in compilation errors.

### Android

The easiest way is to install Android Studio by adding `pkgs.android-studio` to your list of packages in configuration.nix.

If you prefer <a href="Vscode" class="wikilink" title="VSCode">VSCode</a>, you can create a <a href="Development_environment_with_nix-shell" class="wikilink" title="dev-shell">dev-shell</a> with the packages "jdk", "flutter", and a preferred android sdk such as the preconfigured one "androidenv.androidPkgs_9_0.androidsdk" (mentioned in the Android wiki page). Add other packages if missing any. Or you can install Android Studio to get all the Android packages, and install Flutter.

Below is an example <a href="Flakes" class="wikilink" title="flake.nix">flake.nix</a> for creating a dev shell. Create following `flake.nix` in a new project directory

If you don't want to customize the android sdk, you can instead use the predefined packages, as mentioned [in this section on the manual](https://nixos.org/manual/nixpkgs/unstable/#using-predefined-android-package-compositions), such as `androidenv.androidPkgs_9_0.androidsdk`:

Run following commands to start a new demo project and run the "hello world" application

``` console
# nix develop
# flutter create my_app
# cd my_app
# flutter run
```

## Emulators

<a href="Android" class="wikilink" title="View the Android wiki page for more info">View the Android wiki page for more info</a>, but you can set up emulators in Android Studio, run them from there, then target the emulator in VSCode when running your flutter code. Otherwise, you can Nixify or even manually add your emulators as stated in the Android wiki page

## Packaging

Use [buildFlutterApplication from nixpkgs](https://github.com/NixOS/nixpkgs/blob/cfe96dbfce8bd62dcd4a8ad62cb79dec140b1a62/pkgs/development/compilers/flutter/flutter.nix#L168).

## Troubleshooting

- The default Gradle template for android captures the Android and Flutter SDK paths in `android/local.properties` preventing future updates to the SDK from participating in the build. Example:

sdk.dir=/nix/store/m5ygjwkz8brwkw9anx9kbwssymwvlaxl-androidsdk/libexec/android-sdk flutter.sdk=/nix/store/rga4z7r7x705lns431b89gwxx47zs1zp-flutter-wrapped-3.29.3-sdk-links flutter.buildMode=debug flutter.versionName=6.3.2

</syntaxhighlight>

This manifests itself as Gradle failing to install SDK components registered in the shell. To fix, simply delete the properties file and run the build again. NOTE: this assumes that the shell correctly reflects the requirements of the build. If it doesn't correct that first, otherwise deleting `android/local.properties` achieves nothing.

``` shell-session
FAILURE: Build failed with an exception.

* Where:
Build file /xxx/android/build.gradle.kts' line: 16

* What went wrong:
A problem occurred configuring project ':app'.
> com.android.builder.sdk.InstallFailedException: Failed to install the following SDK components:
      ndk;26.3.11579264 NDK (Side by side) 26.3.11579264
  The SDK directory is not writable (/nix/store/1xw5npxd7isrl50pl7y82anhdapnfs6p-androidsdk/libexec/android-sdk)
```

- There might be cases where setting the `ANDROID_HOME` environment variable will have no effect on Flutter's ability to assess the validity of Android SDK's installation. This behavior may be caused by an existing configuration file (`$XDG_CONFIG_HOME/settings` or `$XDG_CONFIG_HOME/flutter/settings`) containing an incorrectly set `"android-sdk"` key-value pair. Once removed, the environment variable should no longer be overridden, and should function correctly.

<a href="Category:_Development" class="wikilink" title="Category: Development">Category: Development</a>
