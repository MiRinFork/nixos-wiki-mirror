<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SoftMaker Office -->

SoftMaker Office is a proprietary office suite from SoftMaker (https://www.softmaker.com/en).

It consists of programs for word processing (TextMaker); creating and editing spreadsheets (PlanMaker), slideshows (Presentations), and programming with BASIC (BasicMaker)

Users buy a license for a given edition (let's say "2018") and can the install all versions of this edition (usually, each edition has multiple versions). This edition is eventually replaced by a newer one, for which a new license is needed. Users remain able to install older editions for which they acquired a license, but can't use newer editions with their old license.

This guide explains how to install SoftMaker office.

## Installing the latest version (of the latest edition) of SoftMaker Office

### SoftMaker Office 2021; version: 1032

**As of 2021-05-28:** edition: SoftMaker Office 2021; version: 1032

Simply add softmaker-office to your system packages:

``` nix
environment = {
    systemPackages = with pkgs; [
        softmaker-office
    ];
};
```

### SoftMaker Office 2021; version: 1064

``` nix
environment = {
    systemPackages = with pkgs; [
        (softmaker-office.override {
            officeVersion = {
                edition = "2021";
                version = "1064";
                hash = "sha256-UyA/Bl4K9lsvZsDsPPiy31unBnxOG8PVFH/qisQ85NM=";
             };
         })
    ];
};
```

### SoftMaker Office 2021; version: 1060

``` nix
environment = {
    systemPackages = with pkgs; [
        (softmaker-office.override {
            officeVersion = {
                edition = "2021";
                version = "1060";
                hash = "sha256-cS+sDwN2EALxhbm83iTdu9iQe4VEe/4fo6rGH1Z54P0=";
             };
         })
    ];
};
```

## Installing a previous edition of SoftMaker Office

You'll need to override the package configuration.

### Install SoftMaker Office 2018

#### On NixOS 21.05

``` nix
environment = {
    systemPackages = with pkgs; [
        (softmaker-office.override {
            officeVersion = {
                edition = "2018";
                version = "982";
                hash = "sha256-A45q/irWxKTLszyd7Rv56WeqkwHtWg4zY9YVxqA/KmQ=";
             };
         })
    ];
};
```

#### On NixOS 20.09

``` nix
environment = {
    systemPackages = with pkgs; [
        (softmaker-office.override {
            officeVersion = {
                edition = "2018";
                version = "982";
                sha256 = "A45q/irWxKTLszyd7Rv56WeqkwHtWg4zY9YVxqA/KmQ=";
             };
         })
    ];
};
```

### Install other editions (2016)

1\. Go to <https://www.softmaker.com/en/old-versions>, and download the corresponding amd64 file (for Linux). Take note of the edition and version. 2. Generate the sha256 hash (don't forget to fix the path and filename of the .tgz) :

``` sh
nix to-sri --type sha256 $(sha256sum ~/Downloads/softmaker-office-2018-982-amd64.tgz | cut -d ' ' -f1)
```

3\. Add the specification into as for installing the 2018 edition, and adapt the three variables with your values (, and ).

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
