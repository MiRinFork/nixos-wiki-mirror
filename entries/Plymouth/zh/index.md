<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Plymouth/zh -->

<languages/> [Plymouth](https://www.freedesktop.org/wiki/Software/Plymouth) 是一个源自 Fedora 的项目，现已列入 [freedesktop.org 官方资源](https://www.freedesktop.org/wiki/Software/#graphicsdriverswindowsystemsandsupportinglibraries)；它旨在提供无闪烁的图形化启动过程。该项目利用 [内核模式设置](https://wiki.archlinux.org/title/Kernel_mode_setting) (KMS) 尽早设定显示器的原生分辨率，随后呈现美观的启动画面，直至进入登录管理器。

<span id="Preparation"></span>

## 准备工作

*Plymouth* 主要使用 KMS 来显示图形，但在 UEFI 系统上，它也可以利用 EFI 帧缓冲区。

如果没有 KMS 或帧缓冲（framebuffer），*Plymouth* 将回退到文本模式。[^1]

<span id="Installation"></span>

## 安装

<span id="Basic_Config"></span>

### 基础配置

``` nix
{
  boot = {
    plymouth = {
      enable = true;
    };

    # Enable "Silent boot"
    consoleLogLevel = 3;
    initrd.verbose = false;
    kernelParams = [
      "quiet"
      "rd.udev.log_level=3"
      "rd.systemd.show_status=auto"
    ];

    # Hide the OS choice for bootloaders.
    # It's still possible to open the bootloader list by pressing any key
    # It will just not appear on screen unless a key is pressed
    loader.timeout = 0;
  };
}
```

<span id="Configuration"></span>

## 配置

<span id="Changing_the_theme"></span>

### 改变主题

Plymouth 附带了一系列主题：

1.  **BGRT**: Spinner 的变体，若可用则保留 OEM 徽标（BGRT 代表 Boot Graphics Resource Table，即启动图形资源表）
2.  **Fade-in**: “简约主题，伴随闪烁星光进行淡入淡出效果”
3.  **Glow**: “商务风格主题，包含饼图形式的启动进度显示，随后呈现发光的浮现徽标”
4.  **Script**: “脚本示例插件”（尽管描述如此，但这实际上是一个相当不错的 Arch 徽标主题）
5.  **Solar**: “太空主题，包含一颗剧烈耀斑喷发的蓝色恒星”
6.  **Spinner**: “简约主题，包含一个加载旋转动画”
7.  **Spinfinity**: “简约主题，在屏幕中央显示一个旋转的无穷大符号”
8.  **Tribar**: “文本模式主题，包含三色进度条”
9.  **Text**: “文本模式主题，包含三色进度条”
10. **Details**: “显示详细信息的备用主题”

NixOS 将默认主题设置为 **bgrt**[^2]。您可以使用 \`boot.plymouth.theme\` 更改主题：

``` nix
{
  boot = {
    plymouth = {
      enable = true;
      theme = "solar";
    };
  };
}
```

<span id="Install_new_themes"></span>

### 安装新主题

例如，您可以通过以下代码使用 [adi1090x 的合集](https://github.com/adi1090x/plymouth-themes) 中的启动动画：

### HiDPI

编辑配置文件：

``` nix
{
  boot = {
    plymouth = {
      enable = true;
      extraConfig = ''
        [Daemon]
        DeviceScale=an-integer-scaling-factor
      '';
    };
  };
}
```

<span id="Tips_and_tricks"></span>

## 提示和技巧

<span id="Show_boot_messages"></span>

### 显示启动信息

在图形化引导过程中，可以通过按下 Esc 键在文本模式与图形模式之间切换。

<span id="Troubleshooting"></span>

## 故障排除

<span id="LUKS_Encryption"></span>

### LUKS 加密

如果您使用 LUKS 加密，密码提示可能会回退到文本模式。虽然默认的 `bgrt` 主题支持图形化密码输入，但并非所有主题都支持此功能。

<span id="See_Also"></span>

## 另见

- [Arch 维基](https://wiki.archlinux.org/title/Plymouth)

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>

[^1]: <https://wiki.archlinux.org/title/Plymouth>

[^2]: <https://github.com/NixOS/nixpkgs/blob/8c91a71d13451abc40eb9dae8910f972f979852f/nixos/modules/system/boot/plymouth.nix>
