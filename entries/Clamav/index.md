<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Clamav -->

[Clamav](https://search.nixos.org/packages?show=clamav&type=packages) is an antivirus engine designed for detecting Trojans, viruses, malware and other malicious threats.

In order to install it:

``` nix
environment.systemPackages = [
  pkgs.clamav
];
services.clamav.daemon.enable = true;

services.clamav.updater.enable = true;
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
