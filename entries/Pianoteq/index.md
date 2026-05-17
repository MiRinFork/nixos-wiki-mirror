<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Pianoteq -->

[Pianoteq](https://www.pianoteq.com/) is a proprietary, commercial virtual instrument plugin that features physically modelled piano and other instruments.

## Installation

Nixpkgs contains different editions of Pianoteq under `pianoteq` package sets. Since the binary for purchased product can only be downloaded after logging into Modartt's website, you need to pass the credentials to nix environment variables.

Add the following to your system configuration: Trial versions can also be installed, which don't require Modartt credentials:

## Manual Download

If you don't want the password exposed in the configuration file, or if situations don't make the above configuration work, you can manually download the binary from Modartt's website and override the `pianoteq` package to source the locally downloaded archive.

Download `pianoteq_linux_{version}.7z` from [Modartt's website](https://modartt.com). Then, put the downloaded archive into nix store:

``` shell
$ nix store add-file ./pianoteq_linux_v843.7z
```

Then add this to your system configuration: Adjust the version and hash value if necessary.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
