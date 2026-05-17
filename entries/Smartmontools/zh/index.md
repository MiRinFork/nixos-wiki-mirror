<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Smartmontools/zh -->

<languages/> **smartmontools** 是一个提供了用于监控硬盘驱动器的工具的软件包，它支持 <a href="wikipedia:Self-Monitoring,_Analysis_and_Reporting_Technology" class="wikilink" title="S.M.A.R.T.">S.M.A.R.T.</a> 系统来监控硬盘驱动器的健康状况。

它包括 **smartd** 和 **smartctl** 程序。可以使用 模块在 NixOS 系统上启用 smartd。

<span id="Locating_devices"></span>

## 定位设备

由于设备节点是任意的且可能会发生变化，因此使用持久的磁盘标识方法非常重要。以下命令将打印存储设备及其所包含的分区列表。配置 smartd 时，应使用**不带**“-partX”后缀的条目，因为它们指的是整个磁盘。

``` bash
ls /dev/disk/by-id/
```

<span id="Example"></span>

## 示例

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
