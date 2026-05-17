<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Installation Guide/zh -->

<languages/> 本指南是官方手册 [1](https://nixos.org/nixos/manual/index.html#ch-installation) 的配套指南。它描述了如何将 <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> 安装为完整的操作系统。有关在现有操作系统中安装 <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> 的说明，请参阅 <a href="Special:MyLanguage/Nix_Installation_Guide" class="wikilink" title="Nix 安装指南">Nix 安装指南</a>。

除了涵盖官方手册中的步骤外，它还提供了针对常见用例的已知有效操作。当官方手册与本指南之间存在差异时，支持用例以手册中描述的为准。

<span id="Installation_target"></span>

## 安装目标

NixOS可以安装在越来越多种类的硬件上:

- 常规(Intel或AMD)台式机, 笔记本电脑, 或是物理可访问的服务器, 该页面包含了它们
- 单板计算机(如树莓派)和其他ARM开发板, 见 <a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a>
- 云服务器和远程服务器, 见 <a href="NixOS_friendly_hosters" class="wikilink" title="NixOS friendly hosters">NixOS friendly hosters</a>

<span id="Installation_method"></span>

## 安装方式

NixOS, 如同绝大部分基于Linux的操作系统一样, 可以通过多种方式进行安装.

1.  传统方式, 通过安装媒介启动.(会在下面讲述.)
2.  <a href="Installing_from_Linux" class="wikilink" title="通过已存在的Linux安装启动媒介">通过已存在的Linux安装启动媒介</a>

<span id="Making_the_installation_media"></span>

## 制作安装媒介

从NixOS 14.11开始, 安装程序ISO(镜像文件)是混合型的. 这意味着它通过CD和USB驱动器都可以启动. 它也可以在EFI系统上启动, 如大多数现代主板和苹果系统. 接下来的指导将假设使用复制镜像文件到USB驱动器的标准方式. 当使用CD或者DVD时, 刻录到光盘的通常方式应当也适用于该iso文件.

<span id="&quot;Burning&quot;_to_USB_drive"></span>

### "刻录"到USB驱动器

首先, 下载一个[NixOS ISO镜像](https://nixos.org/download.html#nixos-iso) 或者 <a href="Creating_a_NixOS_live_CD" class="wikilink" title="创建一个自定义ISO文件">创建一个自定义ISO文件</a>. 接着插入一个空间大到足够容纳镜像的USB. 然后遵循平台的指令:

<span id="From_Linux"></span>

#### 在Linux上

1.  通过 `lsblk` 或 `fdisk -l` 找到正确的设备. 在接下来的步骤中, 把<i>`/dev/sdX`</i> 替换为正确的设备.
2.  复制到设备: `cp nixos-xxx.iso `<em>`/dev/sdX`</em>

也可通过 `dd if=nixos.iso of=/dev/sdX bs=4M status=progress conv=fdatasync` 写入硬盘镜像

<span id="From_macOS"></span>

#### 在macOS上

1.  使用`diskutil list`找到正确的设备, 比如说<i>`diskX`</i>.
2.  使用`diskutil unmountDisk `<i>`diskX`</i>取消挂载.
3.  使用`sudo dd if=`<b>`path_to_nixos.iso`</b>` of=/dev/`<i>`diskX`</i>进行刻录

<span id="From_Windows"></span>

#### 在Windows上

1.  下载USBwriter.
2.  启动USBwriter.
3.  选择下载的ISO文件作为'Source'
4.  选择USB驱动器作为'Target'
5.  点击'Write'
6.  当USBWriter完成写入操作后, 安全拔出USB驱动器

<span id="Alternative_installation_media_instructions"></span>

### 可选的安装媒介指导

之前的方式是制作USB安装媒介的受支持方式.

这些方式也同样有记录, 它们可以使用USB驱动器启动多个发行版. 这种方式不被支持, 结果可能因人而异.

- <a href="NixOS_Installation_Guide/Unetbootin" class="wikilink" title="使用 Unetbootin">使用 Unetbootin</a>
- <a href="NixOS_Installation_Guide/Manual_USB_Creation" class="wikilink" title="手动 USB 创建">手动 USB 创建</a>
- <a href="NixOS_Installation_Guide/multibootusb" class="wikilink" title="multibootusb">multibootusb</a>

## 启动(Boot)安装媒介

由于安装镜像为混合镜像，因此可在传统 BIOS 模式或 <a href="Special:MyLanguage/UEFI" class="wikilink" title="UEFI">UEFI</a> 模式下启动。

无论使用哪种方式启动安装媒介, 你可能需要修改主板或者电脑的配置, 以允许从光盘驱动器(对于CD/DVD)或者从一个外部的USB驱动器启动.

<span id="Legacy_bios_boot"></span>

### Legacy bios启动

这是在没有EFI/UEFI的机器上唯一的启动方式.

<span id="UEFI_boot"></span>

### UEFI启动

安装媒介的EFI引导加载程序未经过签名, 也没有使用经过签名的shim来启动. 这意味着只有禁用了Secure Boot(安全启动)才能启动.

<span id="Connecting_to_the_internet"></span>

## 连接到网络

安装过程**几乎肯定**需要有效的网络连接. 无网络的安装是可行的, 但是可用的软件包集合是受限的.

<span id="Wired"></span>

### 有线网络

对于内核提供的网络接口, DHCP(动态主机配置协议)解析应当在shell可用之前就已经完成.

<span id="Tethered_(Internet_Sharing)"></span>

## 有线连接（网络共享）

如果你无法通过网线或者wifi连接到网络, 你可以使用智能手机的网络共享能力. 依赖于你的手机的能力, 只需要内核自带的驱动就可以提供有效的网络连接.

<span id="Wireless"></span>

### 无线网络

<a href="Special:MyLanguage/NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> 安装在图形化 ISO 镜像上，这意味着可以在命令行上使用 `nmtui` 命令连接到网络。

使用左上方的"Applications(应用)"标签页或者在底部的启动栏, 打开一个终端应用, 在那里启动 `nmtui`. 这可以让你'activate(激活)'一个(无线)连接 - 你应该可以在列表里看到你那里的SSID(无线网络名称), 除此之外你还可以添加一个新的连接. 当无线连接处于活动状态, 并且你已经测试过了时, 一开始就启动的安装程序很可能还没有检测到新的连接. 关掉安装程序, 再重新从屏幕底部的启动栏打开它. 这时它应该会检测到新的网络连接而继续.

在最小化 ISO 镜像上，或者您更熟悉 <a href="Special:MyLanguage/wpa_supplicant" class="wikilink" title="wpa_supplicant">wpa_supplicant</a>，那么您也可以运行 `wpa_passphrase ESSID | sudo tee /etc/wpa_supplicant.conf` 命令，然后输入您的密码并执行 `systemctl restart wpa_supplicant` 命令。

<span id="Partitioning"></span>

## Partitioning(分区操作)

要对持久存储进行分区，请运行 `sudo fdisk /dev/diskX` 并按照 MBR 或 (U)EFI 的说明进行操作。要确定您使用的启动模式，请运行：

``` console
$ [ -d /sys/firmware/efi/efivars ] && echo "UEFI" || echo "Legacy"
```

这里给出了一个非常简单的示例设置。

<span id="Legacy_Boot_(MBR)"></span>

### 传统启动（Legacy Boot, MBR）

- o (dos硬盘标签)
- n new
- p primary (4 primary in total)
- 1 (分区编号\[1/4\])
- 2048 first sector (alignment for performance)
- +500M last sector (引导扇区的大小)
- rm signature (Y), if ex. =\> warning of overwriting existing system, could use wipefs
- n
- p
- 2
- default (填满分区)
- default (填满分区)
- w (写入)

### UEFI

- g (gpt硬盘标签)
- n
- 1 (分区编号\[1/128\])
- 2048 first sector
- +500M last sector (引导扇区的大小)
- t
- 1 (EFI系统)
- n
- 2
- default (填满分区)
- default (填满分区)
- w (写入)

<span id="Format_partitions"></span>

### 格式化分区

以下示例使用 <a href="Special:MyLanguage/ext4" class="wikilink" title="ext4">ext4</a> 文件系统格式。如果您希望使用其他文件系统格式，例如 <a href="Special:MyLanguage/Btrfs" class="wikilink" title="Btrfs">Btrfs</a> 或 <a href="Special:MyLanguage/ZFS" class="wikilink" title="ZFS">ZFS</a>：

- <a href="Special:MyLanguage/Bcachefs#NixOS_installation_on_bcachefs" class="wikilink" title="在 bcachefs 上安装 NixOS">在 bcachefs 上安装 NixOS</a>
- <a href="Special:MyLanguage/Btrfs#Installation_of_NixOS_on_btrfs" class="wikilink" title="在 btrfs 上安装 NixOS">在 btrfs 上安装 NixOS</a>
- <a href="Special:MyLanguage/LVM#Basic_Setup" class="wikilink" title="LVM 基础设置">LVM 基础设置</a>
- <a href="Special:MyLanguage/ZFS#Simple_NixOS_ZFS_on_root_installation" class="wikilink" title="Simple NixOS ZFS on root installation">Simple NixOS ZFS on root installation</a>

这对于有多个分区设置的情况很有用, 使分区更容易处理

``` console
$ lsblk # lists current system block devices
# mkfs.fat -F 32 -n boot /dev/sdX1
# mkfs.ext4 /dev/sdX2 -L nixos
# mount /dev/disk/by-label/nixos /mnt
# mkdir -p /mnt/boot
# mount /dev/disk/by-label/boot /mnt/boot
```

<span id="NixOS_configuration"></span>

## NixOS 配置

NixOS 通过 <a href="Special:MyLanguage/Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="声明式配置">声明式配置</a> 文件进行配置。要生成默认配置文件，请运行 <a href="Special:MyLanguage/nixos-generate-config" class="wikilink" title="Special:MyLanguage/nixos-generate-config">Special:MyLanguage/nixos-generate-config</a>：

``` console
# nixos-generate-config --root /mnt
# nano /mnt/etc/nixos/configuration.nix
```

有关使用系统配置的信息，请参阅 <a href="Special:MyLanguage/NixOS_system_configuration" class="wikilink" title="NixOS 系统配置">NixOS 系统配置</a>。有关特定于桌面的配置，请参阅 <a href="Special:MyLanguage/NixOS_as_a_desktop" class="wikilink" title="桌面设备上的 NixOS">桌面设备上的 NixOS</a>。

最重要的变化：

- 键盘布局（keyboard layout）, 也就是 <a href="Keyboard_Layout_Customization" class="wikilink" title="services.xserver.xkb.layout"><code>services.xserver.xkb.layout</code></a>
- <a href="networking" class="wikilink" title="网络">网络</a> (wifi), 若出现问题, 请参阅下方的修复方法
- 安装 <a href=":Category:Text_Editor" class="wikilink" title="编辑器">编辑器</a> 来编辑配置

具有自我说明性的NixOS选项可以在[NixOS选项搜索](https://search.nixos.org/options)上搜索到.

<span id="Swap_file"></span>

## 交换文件

有关配置交换空间的更多方法，请参阅 <a href="Swap" class="wikilink" title="Swap">Swap</a>。以下示例演示了如何创建和启用一个 <a href="Swap#Swap_file" class="wikilink" title="交换文件">交换文件</a>：

<span id="Bootloader"></span>

### 引导加载程序

NixOS 支持多种 <a href="Bootloader" class="wikilink" title="引导加载程序">引导加载程序</a>，例如 <a href="GNU_GRUB" class="wikilink" title="GNU GRUB">GNU GRUB</a> 和 <a href="Systemd/boot" class="wikilink" title="Systemd/boot">Systemd/boot</a>。

Systemd-boot 是推荐的引导加载程序。以下示例演示了如何在配置中启用 systemd-boot：

您可能还希望配置 <a href="Secure_Boot" class="wikilink" title="安全启动">安全启动</a>。

<span id="Users"></span>

### 用户

有关创建和管理用户的信息，请参阅 <a href="User_management" class="wikilink" title="用户管理">用户管理</a> 和 。请参阅以下示例：

<span id="NixOS_installation"></span>

## 安装 NixOS

``` console
# cd /mnt
# nixos-install
```

安装后：运行`passwd`更改用户密码。

如果网络出现问题, 请尝试下面的一种方法:

``` console
# nixos-rebuild switch --option substitute false # no downloads
# nixos-rebuild switch --option binary-caches "" # no downloads
```

- 设置 wpa_supplicant 标志来连接到 wifi

<hr />

<span id="Additional_notes_for_specific_hardware"></span>

## 有关特定硬件的附加说明

这些是有关特定硬件问题的收集到的说明或链接.

- 博客文章：如何在 [Dell 9560](http://grahamc.com/blog/nixos-on-dell-9560) 上安装 NixOS
- 品牌服务器可能需要在 initrd 中包含额外的内核模块（在 configuration.nix 中配置 `boot.initrd.extraKernelModules`）。例如，HP Proliant 需要“hpsa”模块才能访问磁盘驱动器。

<a href="Category:Guide" class="wikilink" title="分类：指南">分类：指南</a> <a href="Category:Deployment" class="wikilink" title="分类：开发">分类：开发</a> <a href="Category:NixOS" class="wikilink" title="分类：NixOS">分类：NixOS</a>
