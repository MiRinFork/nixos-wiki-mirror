<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Laptop -->

# Closing the lid

These three options can be used to configure how a laptop should behave when the lid is closed. In this example, it normally shuts down. If power is connected, only the screen is locked. If another screen is connected instead, nothing happens.

# Power management

NixOS has several tools to help you manage the power on your system and it also has a stock feature for power management. To enable the stock NixOS power management tool which allows for managing hibernate and suspend states you can write `powerManagement.enable = true;`. This tool is compatible with the other tools mentioned, but the other tools may overwrite this setting.

## CPU performance scaling

### thermald

Thermald proactively prevents overheating on Intel CPUs and works well with other tools. Enabled by: `services.thermald.enable = true;`

### TLP

A common tool used to save power on laptops is [TLP](https://linrunner.de/tlp/index.html), which has sensible defaults for most laptops. To enable TLP you simply just write `services.tlp.enable = true;` in your `configuration.nix`. However, if you need a specific configuration, you can do as shown in the example below.

This example enables TLP and sets the minimum and maximum frequencies for the CPU based on whether it is plugged into power or not. It also changes the CPU scaling governor based on this.

### auto-cpufreq

Another tool used for power management is [auto-cpufreq](https://github.com/AdnanHodzic/auto-cpufreq) which aims to replace TLP. When using auto-cpufreq it is therefore recommended to disable TLP as these tools are conflicting with each other. However, NixOS does allow for using both at the same time, and you can therefore run them in tandem at your own risk. To enable the service, add `services.auto-cpufreq.enable = true;` to your `configuration.nix`.

Example of how to configure auto-cpufreq: Alternatively, if you have <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> enabled you can also use the flake directly provided by the auto-cpufreq authors to get a more up-to-date version. They offer a detailed explanation how to add it to your system on their [GitHub page](https://github.com/AdnanHodzic/auto-cpufreq?tab=readme-ov-file#nixos).

To summarize:</br> 1) add the flake as an input to your `flake.nix` file and enable the module: 2) Then enable it in your `configuration.nix` file: Since v2.0 auto-cpufreq also includes a GUI that lets you temporarily override the CPU frequency governor setting.

### Powertop

Powertop is a power analysis tool, but it also has a feature called auto-tune which will enable power saving settings on your device. These power saving settings should be almost the same as those enabled by tlp, although Powertop enables USB auto-suspend by default. This can make your input devices such as the keyboard unresponsive for some time when it has been suspended.

To enable Powertop: `powerManagement.powertop.enable = true;`.

This also enables the auto-tune feature of Powertop.

# Hardware support

## Hybrid graphics

Many laptops have both a dedicated and a discrete GPU. To use your laptop effectively you have to manage both GPUs. For guidance on how to configure the GPUs, refer to the dedicated wiki-pages for your configuration. If you want to have the option to run your laptop with and without the discrete GPU to save power, you can either disable it in the bios (if possible) or you can use Nix's feature to define specialisations to give you two boot entries on each rebuild of your system.

Example of a Nvidia specialisation:

``` nix
specialisation = {
  nvidia.configuration = {
    # Nvidia Configuration
    services.xserver.videoDrivers = [ "nvidia" ];
    hardware.graphics.enable = true;

    # Optionally, you may need to select the appropriate driver version for your specific GPU.
    hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.stable;

    # nvidia-drm.modeset=1 is required for some wayland compositors, e.g. sway
    hardware.nvidia.modesetting.enable = true;

    hardware.nvidia.prime = {
      sync.enable = true;

      # Bus ID of the NVIDIA GPU. You can find it using lspci, either under 3D or VGA
      nvidiaBusId = "PCI:1:0:0";

      # Bus ID of the Intel GPU. You can find it using lspci, either under 3D or VGA
      intelBusId = "PCI:0:2:0";
    };
  };
};
```

# Troubleshooting

### Laptop runs hot when on power, but not on battery

If you use tlp and experience this issue a solution can be to tell tlp to always run in battery mode.

``` nix
services.tlp = {
  enable = true;
  settings = {
    TLP_DEFAULT_MODE = "BAT";
    TLP_PERSISTENT_DEFAULT = 1;
  };
};
```

# See also

- <a href="Power_Management" class="wikilink" title="Power Management">Power Management</a>

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
