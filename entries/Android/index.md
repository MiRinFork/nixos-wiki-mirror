<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Android -->

## Using the Android SDK

NixOS uses the androidenv package for building android SDKs and manually creating emulators without the use of Android Studio. Example android sdk is `androidenv.androidPkgs.androidsdk`. They also include all of the SDK tools such as sdkmanager and avdmanager needed to create emulators.

The first link provides a guide for creating a custom android SDK, using a predefined SDK, and how to nixify an emulator. The second link is an extra guide that might have some helpful tips for improving your workflow.

1.  [Official Android SDK guide from NixOS.org](https://nixos.org/manual/nixpkgs/unstable/#android)
2.  [Reproducing Android app deployments](https://sandervanderburg.blogspot.de/2014/02/reproducing-android-app-deployments-or.html)

When creating emulators with Nix's emulateApp function as mentioned in the first link, your IDE should now be able to recognize the emulator but you won't be able to run the code. To run it, view the first link on how to run the apk file in the emulator.

To run emulateApp, build it with `nix-build fileName.nix`. It'll build in the folder `result`. run it with `./result/bin/run-test-emulator`

## Creating emulators without Nix

If you don't want to nixify your emulators, you can use Android Studio and set up emulators there like a regular system.

Using `sdkmanager` and `avdmanager` from the Android SDK may not work given how Nix stores its files. You can use them from the Android Studio GUI.

When using machine images from the SDK, you will need to run them with `steam-run`, and possibly pass extra flags, e.g.:

`steam-run ~/Android/Sdk/emulator/emulator -feature -Vulkan @Pixel_5_API_33`

### hardware acceleration

NOTE: Whether this here is effective needs more research and confirmation. My colleague and I have seen the emulator using around 800% CPU. So far, the following has improved that on my side.

See also the [nixpkgs issue](https://github.com/NixOS/nixpkgs/issues/41703) where people tried to trace issues.

Add your user to the `kvm` group:

``` nix
{
  users.users.<your-user>.extraGroups = [ "kvm" ];
}
```

## ADB setup

To use `adb`, you can just <a href="Adding_programs_to_PATH" class="wikilink" title="run it from">run it from</a> the `android-tools` package.

### Use Older Platform Version

If you would like to get older platform version, you can write the following.

``` nix
{ pkgs ? import <nixpkgs> { 
  config.android_sdk.accept_license = true;
  overlays = [
    (self: super: {
      androidPkgs_8_0 = super.androidenv.composeAndroidPackages {
        platformVersions = [ "26" ];
        abiVersions = [ "x86" "x86_64"];
      };
    })
  ];
} }:

(pkgs.buildFHSUserEnv {
  name = "android-sdk-env";
  targetPkgs = pkgs: (with pkgs;
    [
      androidPkgs_8_0.androidsdk
      glibc
    ]);
  runScript = "bash";
}).env
```

## Interaction with your Android device

### adb shell on device

First open a nix-shell with the platform tools and connect your device:

``` console
$ # For nixos < 19.03
$ # nix-shell -p androidenv.platformTools
$ # for nixos <= 24.05
$ nix-shell -p androidenv.androidPkgs_9_0.platform-tools
$ # For nixos >= 24.11
$ nix-shell -p androidenv.androidPkgs.platform-tools
% adb devices
List of devices attached
* daemon not running; starting now at tcp:5037
* daemon started successfully
BH90272JCU  unauthorized
```

Troubleshooting: [no device is listed](https://stackoverflow.com/a/28211161)

A popup appears on your phone to allow your computer access to it. After allowing, you can:

``` console
% adb devices
List of devices attached
BH90272JCU  device
% adb shell
```

You can also connect to an already-running adb server:

``` console
$ nix-shell -p androidenv.androidPkgs.platform-tools
% adb connect 192.168.1.10
% adb shell
```

### Transferring files from/to an Android device

There are two main methods for newer devices:

- `adb push` and `adb pull`: see above.
- via <a href="MTP" class="wikilink" title="MTP">MTP</a>, see <a href="MTP" class="wikilink" title="the corresponding page">the corresponding page</a>

## Android Development

### Android Studio

To develop apps using [Android Studio](https://developer.android.com/studio/), install it to your system.

``` nix
environment.systemPackages = [
  pkgs.android-studio
];
```

By default, Android Studio has a FHS environment and by using `pkgs.android-studio-full` you get the predefined Android SDK composition including (as of nixos-unstable on 2024-11-02) platforms 28-34, an emulator, many system images and the NDK.

Notice: to install Android Studio, you have to indicate accepting the EULA. If you don't, the rebuild fails and prints the EULA. The simplest way to acknowledge it is to add this line to your config:

``` nix
nixpkgs.config.android_sdk.accept_license = true;
```

To use the Android Emulator, you need to enable KVM virtualization (in your BIOS) and make sure your user has permission to use KVM (add yourself to the `kvm` group).

### gradlew

It's possible to create a build environment (shell.nix) to use with gradlew as a FHS environment:

``` nix
{ pkgs ? import <nixpkgs> {config.android_sdk.accept_license = true;} }:

(pkgs.buildFHSUserEnv {
  name = "android-sdk-env";
  targetPkgs = pkgs: (with pkgs;
    [
      androidenv.androidPkgs.androidsdk
      glibc
    ]);
  runScript = "bash";
}).env
```

As an alternative, it's often enough to override just the aapt2 binary for the gradle build process:

``` nix
{ pkgs ? import <nixpkgs> {config.android_sdk.accept_license = true;} }:

let
  androidSdk = pkgs.androidenv.androidPkgs.androidsdk;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    androidSdk
    glibc
  ];
  # override the aapt2 that gradle uses with the nix-shipped version
  GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${androidSdk}/libexec/android-sdk/build-tools/28.0.3/aapt2";
}
```

See the [androidenv documentation](https://nixos.org/manual/nixpkgs/unstable/#android) for full examples.

### Building Android on NixOS

It's possible to use nix-shell with buildFHSEnv to set up an environment in which it's viable to build Android without huge amounts of editing. This is an example shell.nix file.

``` nix
{ pkgs ? import <nixpkgs> {} }:
 
let fhs = pkgs.buildFHSEnv {
  name = "android-env";
  targetPkgs = pkgs: with pkgs;
    [
      git
      gitRepo
      gnupg
      python2
      curl
      procps
      openssl
      gnumake
      nettools
      androidenv.androidPkgs.platform-tools
      jdk
      schedtool
      util-linux
      m4
      gperf
      perl
      libxml2
      zip
      unzip
      bison
      flex
      lzop
      python3
    ];
  multiPkgs = pkgs: with pkgs;
    [ zlib
      ncurses5
    ];
  runScript = "bash";
  profile = ''
    export ALLOW_NINJA_ENV=true
    export USE_CCACHE=1
    export ANDROID_JAVA_HOME=${pkgs.jdk.home}sdkmanager install avd
    export LD_LIBRARY_PATH=/usr/lib:/usr/lib32
  '';
};
in pkgs.stdenv.mkDerivation {
  name = "android-env-shell";
  nativeBuildInputs = [ fhs ];
  shellHook = "exec android-env";

}
```

### Android Debug Bridge

Run `nix-shell -p usbutils --run "lsusb"` on your terminal to get the list of USB devices connected to your computer. Sample output:

    ...
    Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
    Bus 002 Device 007: ID 0fce:320d Sony Ericsson Mobile Communications AB Xperia 5 III
    Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
    ...

`ID 0fce:320d` can be seen as: `idVendor = 0fce` and `idProduct = 320d`.

``` nix
{
  programs.adb.enable = true;
  services.udev.extraRules =
    let
      # nix-shell -p usbutils --run "lsusb"
      idVendor = "0fce"; # Change according to the guide above
      idProduct = "320d"; # Change according to the guide above
    in
    ''
      SUBSYSTEM=="usb", ATTR{idVendor}=="${idVendor}", MODE="[]", GROUP="adbusers", TAG+="uaccess"
      SUBSYSTEM=="usb", ATTR{idVendor}=="${idVendor}", ATTR{idProduct}=="${idProduct}", SYMLINK+="android_adb"
      SUBSYSTEM=="usb", ATTR{idVendor}=="${idVendor}", ATTR{idProduct}=="${idProduct}", SYMLINK+="android_fastboot"
    '';

  # add user to adbusers group
  users.users.myUser = {
   isNormalUser = true;
   extraGroups = [ "adbusers" ];
  };
}
```

1.  [more information on that snippet](https://nixos.org/nix-dev/2015-April/016881.html)
2.  [A shell.nix to build LineageOS](https://gist.github.com/Nadrieril/d006c0d9784ba7eff0b092796d78eb2a)
3.  [robotnix](https://github.com/danielfullmer/robotnix), building aosp roms (e.g. LineageOS) with nix.
4.  [LineageOS build setup using terranix and hcloud](https://github.com/mrVanDalo/LineagoOS-build), based on the [shell.nix to build LineageOS](https://gist.github.com/Nadrieril/d006c0d9784ba7eff0b092796d78eb2a). Useful if you are in a rush and don't have to much CPU power on your hand.
5.  [Archlinux Wiki to Android_Debug_Bridge](https://wiki.archlinux.org/title/Android_Debug_Bridge)

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>
