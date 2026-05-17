<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Viber -->

Viber is an instant messaging and Voice over IP (VoIP) app.

## Installation

Install the `viber` package.

## Wayland

### Missing window

The app may not launch properly on Wayland - the tray icon will appear though there will be no way to show the window. To fix this set the `QT_QPA_PLATFORM` environment variable to `xcb`.

### Scaling

If you have a HiDPI screen, you may want to scale the app. You can do this by setting the `QT_SCALE_FACTOR` environment variable to an appropriate number (e.g. `1.75`).

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
