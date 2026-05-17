<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: GNS3 -->

[GNS3](https://www.gns3.com/) is used by network engineers worldwide to emulate, configure, test and troubleshoot virtual and real networks. GNS3 allows to run a small topology consisting of only a few devices on laptop, to those that have many devices hosted on multiple servers or even hosted in the cloud.

## Installation

##### Graphical interface for user.

##### Server instaltation

## Configuration

In order to use appliances, e.g. VirtualBox appliances, you need to specify the path to specific executables such as VBoxManage in the GNS3 preferences (Ctrl+Shift+P). For example, specify following under Preferences \> VirtualBox, for VBoxManage :

``` shell
/run/current-system/sw/bin/VBoxManage
```

The same applies for VMware, Dynamips, …

Configuration files can be found at the home file under:

## See also

- [1](https://github.com/GNS3/gns3-server)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
