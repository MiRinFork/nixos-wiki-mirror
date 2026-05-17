<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ZSA Keyboards -->

[ZSA](https://www.zsa.io/) offers a variety of ergonomic keyboards, such as the Ergodox EZ and the Moonlander Mark I.

The use of ZSA's keyboards does not require any change to the NixOS configuration, but flashing firmware onto them does.

# Configuring a keyboard

ZSA's keyboards can be configured using their online [Oryx configurator tool](https://configure.zsa.io). You will then need to flash the firmware onto the keyboard, which can be done in three ways, all necessitating a common change in the NixOS configuration, as seen in the following section.

# Flashing firmware

## Pre-requirement

Some udev rules are necessary for the connection before flashing any firmware onto the keyboard. You have to activate them in your NixOS configuration first: Once the new configuration is applied, you may flash ZSA's keyboards with one of the three following methods.

## Flashing via a Chromium-based web browser (Chrome, Chromium...)

In ZSA's [Oryx configurator tool](https://configure.zsa.io), you can click “Save to my keyboard” to flash the keyboard.

## Flashing via wally-cli (command line tool)

ZSA's [`wally-cli`](https://github.com/zsa/wally-cli) command-line tool can be used to flash the keyboard. You will need to install it:

Then, you may use the following command to flash the keyboard, replacing the path with the location of the downloaded firmware:

## Flashing via Keymapp (graphical tool)

ZSA's [`keymapp`](https://blog.zsa.io/keymapp/) graphical tool can be used to flash the keyboard. It is user-friendly, and has other features, such as live layout viewing, key presses heatmap, and links to various tools offered by ZSA's online Oryx configurator. You will need to install it:

<a href="Category:_Hardware" class="wikilink" title="Category: Hardware">Category: Hardware</a>
