<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: BOINC -->

[BOINC](http://boinc.berkeley.edu/) lets you contribute computing power on your home PC to projects doing research in many scientific areas. You can contribute to a single project, or to any combination of them. To install and enable BOINC on NixOS, add this to your `configuration.nix`:

``` nix
services.boinc.enable = true;
services.boinc.extraEnvPackages = [ pkgs.libglvnd pkgs.brotli ]; #Rosetta Beta 6.05 needs libGL.so.1 and libbrotlidec.so.1
users.users.YourUserNameHere.extraGroups = [ "boinc" ]; # Needed for boincmgr to read /var/lib/boinc/gui_rpc_auth.cfg
```

Then to open the [BOINC Manager](https://boinc.berkeley.edu/wiki/BOINC_Manager), you can run the command `boincmgr`.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
