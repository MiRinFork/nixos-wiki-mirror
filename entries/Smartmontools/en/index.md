<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Smartmontools/en -->

<languages/> **smartmontools** is a package which provides tools for monitoring drives which support the <a href="wikipedia:Self-Monitoring,_Analysis_and_Reporting_Technology" class="wikilink" title="S.M.A.R.T.">S.M.A.R.T.</a> system for monitoring hard drive health.

It includes the **smartd** and **smartctl** programs. smartd can be enabled on NixOS systems with the module.

## Locating devices

It is important to use persistent methods of identification for disks, as device nodes are arbitrary and subject to change. The following command will print a list of storage devices, as well as partitions contained on them. When configuring smartd, you should use entries that are **not** suffixed with "-partX", as they refer to whole disks.

``` bash
ls /dev/disk/by-id/
```

## Example

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
