<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Chromium -->

<languages/> <translate>

## Installation

### NixOS

Add <tvar name="chromium_package"></tvar> to <tvar name="systemPackages"></tvar>.

## Updating browser policies

In Chromium, policy settings are accessible via <tvar name="chrome_policy_link"></tvar>. They allow the user to change enterprise policies affecting things like

- Creating webapps when the browser is installed
- Finding and downloading browser extensions automatically
- Enabling or disabling the dinosaur game when the device is offline
- Disable screenshots to be taken with browser extensions
- Block all downloads from the browser (if you want to do that for some reason)
- and more!

A full list of policies can be found at \[<tvar name=1><https://chromeenterprise.google/policies/></tvar> Chrome Enterprise Policy List & Management\].

### Natively Supported Policies

By default NixOS provides a few policies that can be enabled directly, a simple example is given below to understand how these are implemented </translate>

``` nixos
  programs.chromium = {
    enable = true;
    homepageLocation = "https://www.startpage.com/";
    extensions = [
      "eimadpbcbfnmbkopoojfekhnkhdbieeh;https://clients2.google.com/service/update2/crx" # dark reader
      "aapbdbdomjkkjkaonfhkkikfgjllcleb;https://clients2.google.com/service/update2/crx" # google translate
    ];
    extraOpts = {
      "WebAppInstallForceList" = [
        {
          "custom_name" = "Youtube";
          "create_desktop_shortcut" = false;
          "default_launch_container" = "window";
          "url" = "https://youtube.com";
        }
      ];
    };
  };
```

<translate>

- <tvar name="homepageLocation"></tvar> option allows you to set the site that the homepage will open on
- <tvar name="extensions"></tvar> allows for the download of extensions directly in the browser through a simple list of the extension ID's that can be obtained from the \[<tvar name="1"><https://chromewebstore.google.com/></tvar> Chrome Web Store\] by opening an extension page and copying the last part of the URL
  - In the example however there is another component, the download source from which the extensions will be downloaded
  - The URL provided in the list is the link that is used by google for managing, checking and updating extensions
  - So the method of just placing the extension ID can work like this: <tvar name="ext_id"></tvar>
  - But just in case that method does not automatically function the second method is shown above, where you place <tvar name="symbol"></tvar> and then the URL <tvar name="url"></tvar> to explicitly tell NixOS where to install the extension from
- There are many more options that are natively supported and you can learn about them through <tvar name="command"></tvar>
- But as shown above there is also an <tvar name="extraOpts"></tvar> option and that is used for policies that are not supported for direct setup, such as the policy to install web-apps

### Non-natively Supported Policies

There are hundreds of policies in Chromium based browsers, and not all have direct methods to set them. The <tvar name="extraOpts"></tvar> option allows for the declaration of all the other policies.

There is no single place to find all Chromium policies, but these are some places to look;

- Commonly used policies are present and documented within under .
- You can navigate to <tvar name="chrome_policy_link"></tvar> and enable "Show policies with no value set" to see all available keys. Clicking a policy name opens its specific definition and usage details.
- The most up to date policies for Chromium are available in the \[<tvar name="1"><https://source.chromium.org/chromium/chromium/src/+/main:chrome/common/pref_names.h></tvar> source code.\]

## Accelerated video playback

Make sure <a href="&lt;tvar_name=&quot;1&quot;&gt;Special:MyLanguage/Accelerated_Video_Playback&lt;/tvar&gt;" class="wikilink" title="Accelerated Video Playback">Accelerated Video Playback</a> is setup on the system properly. Check <tvar name="chrome_gpu_link"></tvar> to see if Chromium has enabled hardware acceleration.

If accelerated video playback is not working, check relevant flags at <tvar name="chrome_flags_link"></tvar>, or enable them using the CLI: </translate>

<translate> In some cases, <tvar name="chrome_gpu_link"></tvar> will show Video Decode as enabled, but Video Acceleration Information as blank, with <tvar name="chrome_media_link"></tvar> using the FFmpeg Video Decoder (software decoding). If this happens, try to enable the following features: </translate>

<translate>

## Enabling native Wayland support

You can enable native Wayland support in all Chromium based and most Electron apps by setting the \`NIXOS_OZONE_WL\` environment variable to \`1\`.

## Enabling DRM (Widevine support)

By default, <tvar name="chromium_package"></tvar> does not support playing DRM protected media. However, there is a build time flag to include the proprietary Widevine blob from Nixpkgs: </translate>

<translate>

## KeePassXC support in Flatpak

To enable browser integration between KeePassXC and Chromium-based browsers when running in Flatpak, configure the following filesystem access: </translate>

``` toml
# NativeMessagingHost directory (browser-specific)
# Brave Browser
xdg-config/BraveSoftware/Brave-Browser/NativeMessagingHosts:ro
# Chromium
xdg-config/chromium/NativeMessagingHosts:ro
# Google Chrome
xdg-config/google-chrome/NativeMessagingHosts:ro

# KeePassXC server socket and Nix store
xdg-run/app/org.keepassxc.KeePassXC/org.keepassxc.KeePassXC.BrowserServer
/nix/store:ro
```

<translate>

## Using libc memory allocator

Chromium may not work when an alternative system-wide memory allocator like scudo is used. To use libc on Chromium, the following firejail wrap is required: </translate>

``` nix
programs.firejail = {
  enable = true;
  wrappedBinaries = {
    chromium = {
      executable = "${pkgs.chromium}/bin/chromium-browser";
      profile = "${pkgs.firejail}/etc/firejail/chromium-browser.profile";
      extraArgs = [
        "--blacklist=/etc/ld-nix.so.preload"
      ];
    };
  };
};
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Browser{{#translation:}}" class="wikilink" title="Category:Web Browser{{#translation:}}">Category:Web Browser{{#translation:}}</a>
