<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Qmk -->

## QMK

[QMK](https://qmk.fm/) (Quantum Mechanical Keyboard) is an open-source firmware for mechanical keyboards that enables users to customize and program various aspects of their keyboards. It provides a rich set of features for customization, including keymaps, macros, LED backlighting, and layers.

QMK is built on top of the popular AVR and ARM microcontrollers, making it compatible with a wide range of keyboards, including custom and commercial keyboards. It allows users to create fully programmable keyboard layouts, which can then be saved, shared, and reused across different boards or devices.

## NixOS configuration

To access the keyboard for configuration as a normal non-root user add the following nixos configuration:

After that you can configure keyboard settings using the [Via](https://www.caniusevia.com/) app (if your firmware has enabled support for it).

## VIA

VIA is a feature in QMK that lets you change your keymap on your keyboard without needing to reflash firmware. Your keyboard must support VIA in order for it to work.

### Installation

Install the VIA package, and add the package to udev. The nixpkg disables the prompt to add the udev due to compatibility issues with NixOS, so it's necessary for the app to detect your keyboard.

After updating udev rules a system restart is required for the changes to take effect.

## Flashing custom firmware

The qmk commandline application is fully supported in nixpkgs. After doing `nix-shell -p qmk` you can follow the [upstream documentation](https://docs.qmk.fm/#/newbs_building_firmware) for building, customizing and flashing your keyboard

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
