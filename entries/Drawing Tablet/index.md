<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Drawing Tablet -->

Drawing / Graphics Tablets are external devices used for drawing and creating art on a computer.

## Drivers

Most tablets are supported by existing official and unofficial drivers. <a href="OpenTabletDriver" class="wikilink" title="OpenTabletDriver">OpenTabletDriver</a>

## Configuring unsupported tablets

Some tablets or features of tablets may not be supported by existing drivers. Bluetooth is missing support in a lot of existing drivers.

### Pairing Bluetooth Tablets

See <a href="Bluetooth" class="wikilink" title="Bluetooth">Bluetooth</a> and manufacturer guides on pairing the tablet with the computer.

### Configure tablet drivers using DIGImend

Using [DIGImend](https://digimend.github.io/) to configure which drivers are used to handle the drawing tablet.

#### Installing DIGImend Driver

Add the specific Kernel package module , or by auto-selection with `config.boot.kernelPackages`.

Then enable the service.

`{`  
  
`  services.xserver.digimend.enable = true;`  
  
`  environment.systemPackages = [`  
`    ``config.boot.kernelPackages.digimend`  
`  ];`  
  
`}`

- DIGImend already has many tablets pre-configured [DIGImend tablet status](https://digimend.github.io/tablets/), [DIGImend xorg.conf](https://github.com/DIGImend/digimend-kernel-drivers/blob/master/xorg.conf), no additional setup required.

#### Custom Driver configuration

First device information needs to be obtained, .

Select the device in the list. A tablet may have several listings such as a stylus, keyboard, and mouse.

`sudo evemu-describe | grep -i "Input device"`

Information required: input device name, input device vendor ID, and product ID.

Fill the information in the input class sections configuration.

- Replace the name
- <VID> replace with vendor ID
- <PID> replace with product ID
- For the pen / stylus device fill in as "wacom" for the driver.
- For hotkeys / keyboard on the tablet use "libinput" for the driver.
- `MatchIsTablet "on"` will be the the stylus / pen configuration.
- `MatchIsKeyboard "on"` is used for the hotkeys / keyboard configuration.

`{`  
  
`  services.xserver.inputClassSections = [`  
`    ''`  
`      Identifier "`<stylus-device-name>`"`  
`      MatchUSBID "`<VID>`:`<PID>`"`  
`      MatchDevicePath "/dev/input/event*"`  
`      MatchIsTablet "on"`  
`      Driver "wacom"`  
`    ''`  
`    ''`  
`      Identifier "`<keyboard-device-name>`"`  
`      MatchUSBID "`<VID>`:`<PID>`"`  
`      MatchDevicePath "/dev/input/event*"`  
`      MatchIsKeyboard "on"`  
`      Driver "libinput"`  
`    ''`  
`  ];`  
  
`}`

**Other Device Matches**

`MatchIsPointer`  
`MatchIsKeyboard`  
`MatchIsTouchpad`  
`MatchIsTablet`  
`MatchIsTouchscreen`

They can be set to either `"off"` or `"on"`.

### Custom hotkey button mapping using udev

The hotkeys on the tablet can be remapped to other key presses.

The udev service must be enabled in the configuration for key remapping to work.

`{`  
  
`  services.udev.enable = true;`  
  
`  services.udev.extraHwdb =''`  
`    evdev:input:b`*<BUS-ID>*`v`*<VID>*`p`*<PID>`*`*  
`      KEYBOARD_KEY_`<HOTKEY-ID>`=`<KEY-SCAN-CODE>  
`      KEYBOARD_KEY_70005=h`  
`      KEYBOARD_KEY_700e0=0x1d`  
`      KEYBOARD_KEY_70057=a`  
`      KEYBOARD_KEY_70056=z`  
`  '';`  
  
`}`

#### Making the udev device string

First device information needs to be obtained, .

Select the device in the list. A tablet may have several listings such as a stylus, keyboard, and mouse.

`sudo evemu-describe | grep -i "Input device"`

Information required: bus ID, input device vendor ID, and product ID, and version.

- The tablet may have the same set of IDs for the stylus, and keyboard.
- The Bus ID will be different for wired USB and Bluetooth.
- Bus ID is typically 0x03 for USB, and 0x05 for Bluetooth.

The general format for the device string is [(Arch Linux Wiki)](https://wiki.archlinux.org/title/Map_scancodes_to_keycodes#Using_udev):

`evdev:input:b`*<BUS-ID>*`v`*<VID>*`p`*<PID>*`e`*<VERSION>*`-`*<INPUT-MODALIAS>*

This can be shortened with globing / wildcard

`evdev:input:b`*<BUS-ID>*`v`*<VID>*`p`*<PID>`*`*

- Each part of the IDs are 4 characters long. Fill in with leading zeros.

Example device strings:

`evdev:input:b0005v28BDp0935e0001-e0*`  
`evdev:input:b0005v28BDp0935*`

#### Getting `KEYBOARD_KEY` IDs

We must now run in order to find the hotkey IDs.

`sudo evtest `

- The stylus / pen may have buttons which can be in a different event ID from the tablet hotkeys / keyboard.
- The stylus / pen drawing / writing tip may also have a keyboard key ID.
- When multiple keys are listed for a single hotkey press that signifies a key combo.
- Key combos are only possible if the hotkey was configured as a key combo from the manufacturer.
- Some hotkeys may share the same `KEYBOARD_KEY` ID.

At the end of `(EV_MSC)` / `(MSC_SCAN)` lines, the value is the keyboard key ID.

`Event: time 1719736502.701574, type 4 (EV_MSC), code 4 (MSC_SCAN), value 700e0`

For the Stylus / Pen buttons it may be ideal to use grep to reduce the amount of information seen as the pen position moves causing many events per second.

` sudo evtest | grep -i "MSC"`

#### Key Scan Codes

Key press events can be remapped, they can be listed in hexadecimal or by key map name.

Hexadecimal:

- <https://kbdlayout.info/KBDFR/scancodes>
- <https://www.win.tue.nl/~aeb/linux/kbd/scancodes-1.html>

Key map name:

- <https://hal.freedesktop.org/quirk/quirk-keymap-list.txt>

## See Also

- [XP-Pen On Linux Guide (David Revoy Blog)](https://www.davidrevoy.com/article842/review-xp-pen-artist-24-pro-on-linux)
- [Hacking my XP Pen drawing tablets (nek0.eu blog)](https://nek0.eu/posts/2021-06-27-Hacking-my-XP-Pen-drawing-tablets.html)
- [DIGImend](https://digimend.github.io/)
- [Using Udev (Arch Linux Wiki)](https://wiki.archlinux.org/title/Map_scancodes_to_keycodes#Using_udev)

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
