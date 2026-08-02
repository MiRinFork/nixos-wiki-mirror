<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Printing -->

Printing in NixOS is done via the module, to configure the local printing services which is provided by the software [CUPS](https://openprinting.github.io/projects/00-cups). Setting up physical printer devices is done using option.

## Installation

To enable the local print service on your machine, simply add following lines to your configuration

``` nix
services.printing.enable = true;
```

## Configuration

### Enable auto-discovery of network printers

Most printers manufactured after 2013 support the [IPP Everywhere](https://www.pwg.org/ipp/everywhere.html) protocol, i.e. printing without installing drivers. This is notably the case of all WiFi printers marketed as Apple AirPrint-compatible ([list](https://support.apple.com/en-ca/HT201311)).

To detect these printers, add the following to your system configuration:

``` nix
services.avahi = {
  enable = true;
  nssmdns4 = true;
  openFirewall = true;
};

services.printing = {
  enable = true;
  drivers = with pkgs; [
    cups-filters
    cups-browsed
  ];
};
```

Discovery is done via the opened UDP port `5353`. Printers should get automatically detected and visible in your printer configuration client.

### Enable auto-discovery of USB printers

Some printers can be automatically discovered with IPP-over-USB. To discover these printers as a locally accessible network printer/scanner, add the following to your system configuration:

``` nix
services.ipp-usb.enable = true;
```

### Adding printers

Beside manually adding printers with client tools, it is possible to permanently add printers to your system configuration (but be aware of [this bug](https://github.com/NixOS/nixpkgs/issues/78535) that sometimes expect the printer to be plugged in your system). The following example configures a network printer called `Dell_1250c` to your local system, reachable via IPP at `http://192.168.178.2:631/printers/Dell_1250c`

``` nix
hardware.printers = {
  ensurePrinters = [
    {
      name = "Dell_1250c";
      location = "Home";
      deviceUri = "http://192.168.178.2:631/printers/Dell_1250c";
      model = "drv:///sample.drv/generic.ppd";
      ppdOptions = {
        PageSize = "A4";
      };
    }
  ];
  ensureDefaultPrinter = "Dell_1250c";
};
```

A similar network based, driverless approach using the very widely supported [IPP Everywhere](https://www.pwg.org/ipp/everywhere.html) protocol (thanks to [this](https://discourse.nixos.org/t/brother-dcp-572dw-wrapper/8113/3) Discourse post), would look something like:

``` nix
hardware.printers = {
  ensureDefaultPrinter = "Brother_HL-L2340D";
  ensurePrinters = [
    {
      deviceUri = "ipp://192.168.1.20/ipp";
      location = "home";
      name = "Brother_HL-L2340D";
      model = "everywhere";
    }
  ];
};
```

You can run `lpinfo -m` to ensure you have the `everywhere` driver currently available.

To add a local printer, connected via USB, change the `deviceUri` to a USB address and optionally define which driver to use by adding the `model` option.

``` nix
hardware.printers.ensurePrinters = [
  {
    name = "Dell_1250c";
    location = "Home";
    deviceUri = "usb://Dell/1250c%20Color%20Printer?serial=YNP023240";
    model = "Dell-1250c.ppd.gz";
    ppdOptions = {
      PageSize = "A4";
    };
  }
];
```

To add a printer over the smb protocol, <a href="Samba" class="wikilink" title="Samba">Samba</a> needs to be enabled:

``` nix
hardware.printers.ensurePrinters = [
  {
    # (other stuff...)
    deviceUri = "smb://print-server.com/printername";
  }
];

services.samba.enable = true;
```

Some local or network printers might need additional drivers. You can add them using the `drivers` option:

``` nix
services.printing.drivers = [ YOUR_DRIVER ];
```

where `YOUR_DRIVER` is the driver package appropriate for your printer. Commonly used driver packages include:

- `pkgs.gutenprint` — Drivers for many different printers from many different vendors.
- `pkgs.gutenprintBin` — Additional, binary-only drivers for some printers.
- `pkgs.hplip` — Drivers for HP printers.
- `pkgs.hplipWithPlugin` — Drivers for HP printers, with the proprietary plugin, see also <a href="Printing#Setting_up_HP_printers_with_proprietary_drivers" class="wikilink" title="Setting up HP printers with proprietary drivers">Setting up HP printers with proprietary drivers</a>.
- `pkgs.postscript-lexmark` — Postscript drivers for Lexmark
- `pkgs.samsung-unified-linux-driver` — Proprietary Samsung Drivers
- `pkgs.splix` — Drivers for printers supporting SPL (Samsung Printer Language).
- `pkgs.brlaser` — Drivers for some Brother printers
- `pkgs.brgenml1lpr` and `pkgs.brgenml1cupswrapper` — Generic drivers for more Brother printers (Proprietary drivers) [1](https://support.brother.com/g/s/id/linux/en/instruction_prn1a.html)
- `pkgs.cnijfilter2` — Drivers for some Canon Pixma devices (Proprietary driver)
- `pkgs.epson-escpr2` — Drivers for newer Epson devices.
- `pkgs.epson-escpr` — Drivers for some other Epson devices.

Search for other printer drivers in the NixOS package directory: the official list of packages is [here](https://search.nixos.org/packages). Add the driver to , **not** .

To get the specific string for `model`, run `lpinfo -m` which will produce output similar to

    ...
    samsung/SCX-3200.ppd Samsung SCX-3200 Series
    samsung/SCX-3400.ppd Samsung SCX-3400 Series
    samsung/SCX-4100.ppd Samsung SCX-4100 Series
    samsung/SCX-4200.ppd Samsung SCX-4200 Series
    samsung/SCX-4300.ppd Samsung SCX-4300 Series
    samsung/SCX-4500.ppd Samsung SCX-4500 Series
    samsung/SCX-4500W.ppd Samsung SCX-4500W Series
    samsung/SCX-4600.ppd Samsung SCX-4600 Series
    samsung/SCX-4623.ppd Samsung SCX-4623 Series
    ...

The `model` string is the first column. For example, for the Samsung SCX-4300 series, set

``` nix
model = "samsung/SCX-4300.ppd";
```

.

### Allowing printer administration for users

Users in **wheel** or **lpadmin** group can administer printers. This can be useful to allow non-admin users access to modify printers in their desktop environment settings. To allow user **snowflake** to administer printers you would doː

``` nixos
  users.users.snowflake = {
    isNormalUser = true;
    extraGroups = [
      "lpadmin"    
    ];
    ...
  };
```

### Printer sharing

Enable network sharing of the default local printer, also known as "AirPrinting". Note that

``` nix
listenAddresses = [ "*:631" ];
```

,

``` nix
allowFrom = [ "all" ];
```

and

``` nix
openFirewall = true;
```

will enable anonymous access to your printer on all interfaces, you might want to restrict this.

``` nix
services.avahi = {
  enable = true;
  nssmdns4 = true;        # for IPv4 (use nssmdns6 for IPv6)
  openFirewall = true;
  publish = {
    enable = true;
    userServices = true;
  };
};
services.printing = {
  listenAddresses = [ "*:631" ];
  allowFrom = [ "all" ];
  browsing = true;
  defaultShared = true;
  openFirewall = true;
};
```

Once printer sharing is enabled, it could be additionally advertised in the home network via the Samba protocol, see <a href="Samba#Printer_sharing" class="wikilink" title="Samba#Printer_sharing">Samba#Printer_sharing</a>.

## Usage

After enabling the printing service you'll be able to configure and add network printers via <http://localhost:631>. You may need to authenticate with your local user when you add the printer.

Depending on your desktop environment, there are several graphical tools available which will connect to this backend service and allow you a more convenient printer management, for example .

### Command line

List printers

``` bash
lpstat -p
```

Print test page for printer called `HP-LaserJet-1020`

``` bash
lp -o job-sheets=standard,none -d HP-LaserJet-1020 /dev/null
```

List jobs

``` bash
lpstat
```

Cancel job

``` bash
cancel 1
```

## Tips and tricks

#### Manually supplying printer driver

##### Provide the PPD imperatively

If no driver is found for your printer, even when is correctly populated (see above), you can try to give cups a PPD file.

- Download the required PPD file, for example from [openprinting.org](https://openprinting.org/printers)
- Open the PPD as a text file, and check that it does not mention FHS paths like `/usr/bin`. If it does, this method is unlikely to work, as the PPD file depends on executables not present on your system. You can certainly install the binaries yourself and point to the new binary, but it is certainly easier to patch the executables in a derivation (see below) to avoid garbage collection of your binaries.
- add the printer with `system-config-printer` (for example) and at the 'choose driver' screen choose 'provide PPD file'

##### Provide the PPD declaratively

You can also declaratively add the PPD as a new driver by creating a simple derivation. You just need to create a derivation that puts the PPD file in `$out/share/cups/model/yourfile.ppd` (you can also put it in a subfolder like `$out/share/cups/model/HP/yourfile.ppd` to limit conflicts between ppd having the same name). Note that the name of the file does not change the way cups will list it as the model/manufacturer is written inside the (text) ppd.

As in the imperative method, first check that your file does not contain any reference to binaries outside the store like `/bin/` or `/usr/`. If it does not contain any reference then you should be able to simply do this:

``` nix
{
  ...
  services.printing.enable = true;
  services.printing.drivers = [
    (writeTextDir "share/cups/model/yourppd.ppd" (builtins.readFile ./yourppd.ppd))
  ];
  ...
}
```

If your ppd contains links to external binaries, you can instead patch the file using for instance `substituteInPlace`. For that, create a file, say, `myPrinter.nix` containing something like:

``` nix
{ stdenv }:
stdenv.mkDerivation rec {
  name = "myprinter-${version}";
  version = "1.0";

  src = ./.;

  installPhase = ''
    mkdir -p $out/share/cups/model/
    cp myprinter.ppd $out/share/cups/model/
    # If you need to patch the path to files outside the nix store, you can do it this way
    # (if the ppd also comes with executables you may need to also patch the executables)
    substituteInPlace $out/share/cups/model/myprinter.ppd \
      --replace "/usr/yourProgram/" "${yourProgram}/bin/yourProgram"
  '';
}
```

Of course update the name of the files and adapt the substituteInPlace command to your needs. Then add your driver as:

``` nix
{
  ...
  services.printing.enable = true;
  services.printing.drivers = [
    (pkgs.callPackage ./myPrinter.nix {})
  ];
  ...
}
```

Your PPD file should now appear next to the other PPD files installed on your system when you add a new printer.

For debugging purpose, it may be interesting to note that the data folder used by cups (containing the drivers and more) can be obtained by looking in the environment `$CUPS_DATADIR` (the contents of `$out/share/cups/` contained in your drivers are linked in this folder).

## Troubleshooting

### Upgrade required

Described in: [Github issue 23993](https://github.com/NixOS/nixpkgs/issues/23993)

**Problem**  
Using the cups web interface, the page tells you "Upgrade Required" and then redirects you to a page that fails to load.  
**Cause**  
When you are using http and cups wants authentication it will redirect you to a https version by default.  
In order to use https it needs ssl keys. However it is possible that cups fails to generate these keys, and then the page will fail to load.  
**Solution**  
Either we can help cups to get ssl keys, or we can tell it to not use https at all.

*Generating ssl keys:*  
First make sure the directory `/etc/cups/ssl` exists:

``` bash
sudo mkdir -p /etc/cups/ssl
```

Try restarting cups and using the web interface again. This might be enough to get it working. If this didn't help, then check if cups has generated ssl keys in `/etc/cups/ssl`.

*Disabling ssl:*  
Edit your `/etc/nixos/configuration.nix` and add the following lines:  

``` nix
services.printing.extraConf = ''
  DefaultEncryption Never
'';
```

### Unable to launch Ghostscript: gs: No such file or directory

Described in: [Github issue 20806](https://github.com/NixOS/nixpkgs/issues/20806) and [issues 22062](https://github.com/NixOS/nixpkgs/issues/22062)  
**Problem**  
When printing, cups will report an error: `Unable to launch Ghostscript: gs: No such file or directory`  
**Cause**  
Some drivers use the ghostscript binary.  
Cups will look for the binary path in it's config file: `cupsd.conf`  
This file is normally a link. But it can be overwritten, and consequentially become outdated.  
**Solution**  
You could try to manually fix the path variable in `/var/lib/cups/cupsd.conf`  
Alternatively you could try to delete the file and run `sudo nixos-rebuild switch`

### File is missing (Gnome 3)

When you add an printer in Gnome (using `gnome-control-center printers`) you create a profile for your printer.

**Problem**  
But, later you may experience an error like `/nix/store/.../lib/cups/filter/pstospl not available: No such file or directory`.

**Cause**  
When you create a printer profile you get a freeze version of cups filter and when cups is updated, because you have upgraded your system, and garbage collected this version is gone.

**Solution**  
Go into the `gnome-control-center printers` settings, remove the printer and recreate it.

### Debugging a broken printer driver

Add to `/etc/nixos/configuration.nix`:

``` nix
services.printing.logLevel = "debug";
```

Rebuild

``` bash
sudo nixos-rebuild switch
```

Watch the cups logs

``` bash
journalctl --follow --unit=cups
```

or

``` bash
journalctl --follow --unit=cups | grep -C10 --color=always -i -e 'No such file or directory' -e 'error:'
```

Start a print job

Now watch the cups logs for errors like `No such file or directory`

### Setting up Panasonic printers

See [this blog post](https://prince213.top/blog/2025/01/16/nixos-mccgdi/).

### Setting up HP printers with proprietary drivers

**Problem**  
Regular CUPS UI may not be able to add HP printers with proprietary drivers.

**Solution**  
Use

``` bash
NIXPKGS_ALLOW_UNFREE=1 nix-shell -p hplipWithPlugin --run 'sudo -E hp-setup'
```

to add the printer.

### Setting up Brother HL-1212W laser printer over the network

Install the cups-brother-hl1210w package.

Enable auto discovery as <a href="Printing#Enable_auto-discovery_of_network_printers" class="wikilink" title="above">above</a>

Now you should be able to add the printer to your system. If asked to select make and model or PPD, use the PPD for the HL-1250 from <https://www.openprinting.org/driver/hl1250>

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
