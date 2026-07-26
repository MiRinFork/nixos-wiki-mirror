<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Razer -->

## OpenRazer

OpenRazer is an open-source project to support Razer peripherals, including those found in their laptops. To enable the OpenRazer you need to add the following to your system configuration:

``` nix
hardware.openrazer.enable = true;
environment.systemPackages = with pkgs; [
  openrazer-daemon
];
```

To run the `openrazer-daemon`, you need to be in the `openrazer` group.

``` nix
users.users.<username>.extraGroups = [ "openrazer" ];
```

To enable a front-end to control the peripherals, add the following to your system configuration:

``` nix
environment.systemPackages = with pkgs; [
  polychromatic
];
```

## Razer Blade 15 Advanced (Early 2020 model)

### Lid reopen hybernate issue

Upon closing the lid to the laptop and reopening, an issue occurs where the device will intermittently go back into hybernate mode after around 10-30 seconds. Setting the kernel parameter `button.lid_init_state=open` fixes this issue. The following is an example configuration (working in NixOS 22.05):

``` nix
boot.kernelParams = [ "button.lid_init_state=open" ];
```

### Getting the Nvidia card to work properly with external displays

In order to get both the laptop display and external displays working, in the BIOS settings set Chipset \> GPU MODE to "Dedicated GPU only".

After setting the GPU MODE to "Dedicated GPU only" in the BIOS, enabling <a href="NVIDIA#Sync_mode" class="wikilink" title="NVIDIA#Sync mode">NVIDIA#Sync mode</a> is necessary in order for both the laptop's display and external display/ports to work properly. Here is an example configuration snippet for NixOS 22.05:

``` nix
services.xserver.videoDrivers = [ "nvidia" ];
hardware.opengl.enable = true;

hardware.nvidia = {
  package = config.boot.kernelPackages.nvidiaPackages.beta;
  powerManagement.enable = true;
  modesetting.enable = true;
  prime = {
    sync.enable = true;
    nvidiaBusId = "PCI:1:0:0";
    intelBusId = "PCI:0:2:0";
  };
};
```

### Additional Resources

<https://discourse.nixos.org/t/razer-blade-15-nvidia-integrated-graphics-on-nixos-issues/23576/6>

<https://www.reddit.com/r/NixOS/comments/nuclde/how_to_properly_set_up_lidclose_behaviour_on_a/>

<https://wiki.archlinux.org/title/Razer_Blade>

## Updating your system to use the unstable drivers and daemon

If you are using a new model from Razer, it probably is not available in the stable packages. But it might be available in the unstable ones.

Add the below to your system configuration:

``` nix
nixpkgs.config = {
  allowUnfree = true;

  packageOverrides = pkgs: {
    stable = import <nixos-stable> { config = config.nixpkgs.config; };
    unstable = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") { config = config.nixpkgs.config; };
  };
};

# updates the whole kernel to unstable so you have the correct drivers.
boot.kernelPackages = pkgs.unstable.linuxPackages;

# overrides the openrazer-daemon that the harware.openrazer.enable starts
nixpkgs.overlays = [
  (final: prev: {
    openrazer-daemon = pkgs.unstable.openrazer-daemon;
  })
];

environment.systemPackages = with pkgs; [
  unstable.polychromatic
  # alternatively:
  # unstable.razergenie
];
```

## USB disable Issues

If you are encountering issues that your Razer keyboard does light up on boot shortly and then can not be found by the open-razer-daemon until you unplug your USB cable and re-plug it. Then you might want to reset your USB on startup so that after login the daemon finds it again.

``` nix
# Razer usb reset. Since it disables somehow on boot.
systemd.services."usb-reset" = {
  enable = true;

  description = "Resets usb port for my Razer Keyboard";
  after = ["multi-user.target"];
  serviceConfig = {
      User = "root";
      Type = "simple";
      ExecStart=pkgs.writeShellScript "unit-restart-usb7_3" ''
        echo '7-3' |tee /sys/bus/usb/drivers/usb/unbind
        echo '7-3' |tee /sys/bus/usb/drivers/usb/bind
      '';
      KillMode = "process";
      Restart = "on-failure";
  };
  wantedBy = [ "graphical.target" ];
};
    
```

The text `7-3` is composed of the bus number (7) and the port (device?) number (3).

To find the bus and port numbers, read this post: [1](https://superuser.com/questions/1707773/how-to-turn-usb-connected-device-on-and-off-in-linux)

If that does not work, you can reset all USB controllers instead [^1]:

``` nix
# Razer usb reset. Since it disables somehow on boot.
systemd.services."usb-reset" = {
  enable = true;

  description = "Resets usb port for my Razer Keyboard";
  after = ["multi-user.target"];
  serviceConfig = {
      User = "root";
      Type = "simple";
      ExecStart = pkgs.writeShellScript "unit-restart-usb-controller" ''
        #!/usr/bin/env bash
        # Resets all USB host controllers of the system.
        # This is useful in case one stopped working
        # due to a faulty device having been connected to it.

        base="/sys/bus/pci/drivers"
        sleep_secs="1"

        # This might find a sub-set of these:
        # * 'ohci_hcd' - USB 3.0
        # * 'ehci-pci' - USB 2.0
        # * 'xhci_hcd' - USB 3.0
        echo "Looking for USB standards ..."
        for usb_std in "$base/"?hci[-_]?c*
        do
            echo "* USB standard '$usb_std' ..."
            for dev_path in "$usb_std/"*:*
            do
                dev="$(basename "$dev_path")"
                echo "  - Resetting device '$dev' ..."
                printf '%s' "$dev" | tee "$usb_std/unbind" > /dev/null
                sleep "$sleep_secs"
                printf '%s' "$dev" | tee "$usb_std/bind" > /dev/null
                echo "    done."
            done
            echo "  done."
        done
        echo "done."
      '';
      KillMode = "process";
      Restart = "on-failure";
  };
  wantedBy = [ "graphical.target" ];
};
```

## References

<references />

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>

[^1]: <https://unix.stackexchange.com/questions/704341/how-to-reset-usb-controllers>
