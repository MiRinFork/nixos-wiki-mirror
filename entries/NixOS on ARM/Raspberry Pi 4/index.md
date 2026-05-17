<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Raspberry Pi 4 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Raspberry Pi 4 Family</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Raspberry_Pi_4,_2_GB_RAM_version_4.jpg" title="A Raspberry Pi 4." width="256" />
<figcaption>A Raspberry Pi 4.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Raspberry Pi Foundation</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Custom or U-Boot</p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>Configurable; SD, USB, Netboot</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi 4B</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>BCM2711</p></td>
</tr>
</tbody>
</table>

</div>

The Raspberry Pi family of devices is a series of single-board computers made by the Raspberry Pi Foundation. They are all based on Broadcom System-on-a-chip (SoCs).

## Status

The Raspberry Pi 4 Family is only supported as **AArch64**. Use as armv7 is community supported.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image and install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

The Raspberry Pi 4B works with the [generic SD image](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.sd_image.aarch64-linux).

Sample instructions for [installing NixOS on a Raspberry Pi](https://nix.dev/tutorials/installing-nixos-on-a-raspberry-pi) are available at nix.dev.

### Configuration

Using `nixos-generate-config` will generate the required minimal configuration.

Raspberry Pi 4 is well-supported on modern kernels. However, if you encounter issues with GPU support or other deviceTree quirks, you may wish to add the nixos-hardware channel:

<code> nix-channel --add <https://github.com/NixOS/nixos-hardware/archive/master.tar.gz> nixos-hardware

nix-channel --update </code>

### `config.txt`

To edit options only available through `config.txt`, as of May 12, 2025, you can only do so non-declaratively:

For example, [overclocking](https://www.raspberrypi-spy.co.uk/2020/11/overclocking-the-raspberry-pi-400/) the Raspberry Pi 400 can be done by adding the following:

### USB boot

For USB booting to work properly, a firmware update might be needed:

Now reboot the device so it can update the firmware from the boot partition.

### GPU support

The following configuration samples are built on the assumption that they are added to an already working configuration. They are not complete configurations.

#### Without GPU

#### With GPU

In [nixos-hardware#261](https://github.com/NixOS/nixos-hardware/pull/261) an option has been added to use the `fkms-3d` ([modesetting](https://wiki.archlinux.org/title/Kernel_mode_setting)) overlay which uses the [V3D renderer](https://www.raspberrypi.com/news/vc4-and-v3d-opengl-drivers-for-raspberry-pi-an-update/). This will only work with the vendor kernel, which is the default in NixOS.

### Tools

The raspberry tools are available in the `libraspberrypi` package and include commands like `vcgencmd` to measure temperature and CPU frequency.

### Audio

In addition to the usual config, you will need to enable hardware audio support:

If you're running headless, you can also disable HDMI audio and force use of the headphones jack by adding `hdmi_ignore_edid_audio=1` on a line below `dtparam=audio=on`.

### Networking

Ethernet and wifi interfaces should work out of the box. In addition to normal network configuration, consider disabling wifi powersaving if you experience slowness or issues with the host becoming unreachable on the network shortly after boot. For NetworkManager, the following configuration is sufficient:

### Using GPIO pins as non-root

By default, the GPIO pins are enabled, but can only be accessed by the root user. This can be addressed by adding a [udev](https://wiki.archlinux.org/title/Udev) rule to your configuration that changes the ownership of `/dev/gpiomem` and the other required devices.

The following code adds a group `gpio` and adds the user `mygpiouser` to that group. You probably want to put your own user name here.

The `extraRules` changes the owner of `gpiomem` and all other files needed for GPIO to work to `root:gpio` and changes the permissions to `0660`. Therefore, the root user and anyone in the gpio group can now access the GPIO pins. Permissions on the `/dev/gpiochip*` devices are needed to support access through the newer **GPIO character device** interface (see [libgpiod](https://libgpiod.readthedocs.io/en/latest/)).

``` nix
  # Create gpio group
  users.groups.gpio = {};

  # Change permissions gpio devices
  services.udev.extraRules = ''
    SUBSYSTEM=="bcm2835-gpiomem", KERNEL=="gpiomem", GROUP="gpio",MODE="0660"
    SUBSYSTEM=="gpio", KERNEL=="gpiochip*", ACTION=="add", RUN+="${pkgs.bash}/bin/bash -c 'chown root:gpio /sys/class/gpio/export /sys/class/gpio/unexport ; chmod 220 /sys/class/gpio/export /sys/class/gpio/unexport'"
    SUBSYSTEM=="gpio", KERNEL=="gpio*", ACTION=="add",RUN+="${pkgs.bash}/bin/bash -c 'chown root:gpio /sys%p/active_low /sys%p/direction /sys%p/edge /sys%p/value ; chmod 660 /sys%p/active_low /sys%p/direction /sys%p/edge /sys%p/value'"
    SUBSYSTEM=="gpio", KERNEL=="gpiochip*", ACTION=="add", RUN+="${pkgs.bash}/bin/bash -c 'chown root:gpio /dev/gpiochip* && chmod 0660 /dev/gpiochip*'"
  '';

  # Add user to group
  users = {
    users.mygpiouser = {
      extraGroups = [ "gpio" ... ];
      ....
    };
  };
```

### Enabling the SPI

To enable the SPI, you would normally add `dtparam=spi=on` to `/boot/config.txt`. This is not possible on NixOS, and instead you have to apply a device tree overlay. For this we use the `hardware.deviceTree.overlays` option. After applying the overlay, we add an `spi` group and change the owner of the `spidev` device to it, similarly to <a href="#Using_GPIO_pins_as_non_root" class="wikilink" title="GPIO">GPIO</a>.

``` nix
hardware.raspberry-pi."4".apply-overlays-dtmerge.enable = true;
hardware.deviceTree = {
  enable = true;
  filter = "*-rpi-*.dtb";
  overlays = [
    {
      name = "spi";
      dtboFile = ./spi0-0cs.dtbo;
    }
  ];
};

users.groups.spi = {};

services.udev.extraRules = ''
  SUBSYSTEM=="spidev", KERNEL=="spidev0.0", GROUP="spi", MODE="0660"
'';
```

The the `spi0-0cs.dtso` file can be downloaded [here](https://github.com/raspberrypi/firmware/blob/master/boot/overlays/spi0-0cs.dtbo). You might have to change the `compatible` field to "raspberrypi" in the dtbo file.

### HDMI-CEC

A few bits and pieces for using HDMI-CEC on the Pi4:

### Enabling Bluetooth

One might get bluetooth to work with this in the configuration file:

## Customizing & Generating SD image without installation step

There's a nix-community project to support fine-grained kernel & config.txt, and generate the image directly:

[nix-community/raspberry-pi-nix](https://github.com/nix-community/raspberry-pi-nix/)

For a minimal flake-based image that boots directly into Wi-Fi with Tailscale preconfigured and no Ethernet required, see [nixos-rpi-headless](https://gitlab.com/hunorg/nixos-rpi-headless). It also includes workarounds for brcmfmac Wi-Fi driver quirks..

## Notes about the boot process

Unless using an extremely early WIP image, the Raspberry Pi 4B boots using the U-Boot platform firmware.

### Updating U-Boot/Firmware

[source](https://nix.dev/tutorials/installing-nixos-on-a-raspberry-pi#updating-firmware)

## Troubleshooting

### Audio not playing and Bluetooth: no controller available

On the Raspberry Pi kernel, the jack may never play audio, and no Bluetooth devices may ever be found. To get this to work, it is recommended to switch to the mainline kernel. See [nixpkgs#123725](https://github.com/NixOS/nixpkgs/issues/123725) for more info.

### Touch screen not working

You have to declare this in your `configuration.nix`[^1]:

``` nix
hardware.raspberry-pi."4" = {
  touch-ft5406.enable = true;
};
```

[^1]: <https://discourse.nixos.org/t/cant-get-nixos-x-to-work-on-a-raspberry-pi-with-dsi-display/44532/3>
