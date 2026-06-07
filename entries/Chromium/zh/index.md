<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Chromium/zh -->

<languages/> <span id="Installation"></span>

## 安装

### NixOS

添加 到 。

<span id="Updating_browser_policies"></span>

## 更新浏览器政策

在 Chromium 中，可以通过 访问政策设置。用户可以使用这些设置更改影响企业政策的各种功能，例如

- 安装浏览器时自动创建 Web 应用
- 自动查找并下载浏览器扩展程序
- 设备离线时启用或禁用恐龙游戏
- 禁用浏览器扩展程序截屏功能
- 阻止浏览器进行所有下载（如果您出于某种原因需要这样做）
- 以及更多！

完整的政策列表可在 [Chrome 企业政策列表和管理](https://chromeenterprise.google/policies/) 中找到。

<span id="Natively_Supported_Policies"></span>

### 原生支持的政策

NixOS 默认提供了一些可以直接启用的政策，下面给出一个简单的示例来理解这些政策的实现方式。

``` nixos
  programs.chromium = {
    enable = true;
    homepageLocation = "https://www.startpage.com/";
    extensions = [
      "eimadpbcbfnmbkopoojfekhnkhdbieeh;https://clients2.google.com/service/update2/crx" # dark reader
      "aapbdbdomjkkjkaonfhkkikfgjllcleb;https://clients2.google.com/service/update2/crx" # google translate
    ];
    extraOpts = {
      "WebAppInstallForceList" = [
        {
          "custom_name" = "Youtube";
          "create_desktop_shortcut" = false;
          "default_launch_container" = "window";
          "url" = "https://youtube.com";
        }
      ];
    };
  };
```

- 选项允许您设置主页打开的网站。

- 允许您通过一个简单的扩展程序 ID 列表直接在浏览器中下载扩展程序。该列表可以从 [Chrome 网上应用商店](https://chromewebstore.google.com/) 获取，通过打开扩展程序页面并复制 URL 的最后一部分。

  - 然而，示例中还有另一个组件，即扩展程序的下载源。
  - 列表中提供的 URL 是 Google 用于管理、检查和更新扩展程序的链接。
  - 因此，只需放置扩展程序 ID 的方法即可工作，如下所示：
  - 但以防该方法无法自动生效，上面显示了第二种方法，您需要放置 ，然后放置 URL ，以明确告诉 NixOS 从哪里安装扩展程序。

- 还有许多其他原生支持的选项，您可以通过 了解它们。

- 但如上所示，还有一个 选项，用于不支持直接设置的政策，例如安装网络应用程序的政策。

<span id="Non-natively_Supported_Policies"></span>

### 非原生支持的政策

基于 Chromium 的浏览器中存在数百种政策，但并非所有政策都有直接的设置方法。 选项允许声明所有其他政策。

虽然没有一个地方可以找到所有 Chromium 政策，但以下是一些可以查找的地方；

- 常用策略已在 下的 中列出并记录。

<!-- -->

- 您可以导航至 并启用“显示未设置值的政策（Show policies with no value set）”以查看所有可用键。点击政策名称即可查看其具体定义和使用详情。

<!-- -->

- Chromium 的最新策略可在该[源码](https://source.chromium.org/chromium/chromium/src/+/main:chrome/common/pref_names.h)中找到。

<span id="Accelerated_video_playback"></span>

## 视频播放加速

请确保系统已正确设置 <a href="Special:MyLanguage/Accelerated_Video_Playback" class="wikilink" title="视频播放加速">视频播放加速</a>。检查 以查看 Chromium 是否已启用硬件加速。

如果视频播放加速不起作用，请检查 中的相关标志，或使用 CLI 启用它们：

在某些情况下， 将显示“视频解码（Video Decode）”已启用，但“视频加速信息（Video Acceleration Information）”为空，此时 使用的是 FFmpeg 视频解码器（软件解码）。如果出现这种情况，请尝试启用以下功能：

<span id="Enabling_native_Wayland_support"></span>

## 启用原生 Wayland 支持

您可以通过将 \`NIXOS_OZONE_WL\` 环境变量设置为 \`1\`，在所有基于 Chromium 的应用程序和大多数 Electron 应用程序中启用原生 Wayland 支持。

<span id="Enabling_DRM_(Widevine_support)"></span>

## 启用 DRM（Widevine 支持）

默认情况下， 不支持播放受 DRM 保护的媒体。但是，可以通过构建时标志来包含来自 Nixpkgs 的专有 Widevine blob：

<span id="KeePassXC_support_in_Flatpak"></span>

## Flatpak 中的 KeePassXC 支持

要在 Flatpak 环境下运行 KeePassXC 和基于 Chromium 的浏览器时启用浏览器集成，请配置以下文件系统访问权限：

``` toml
# NativeMessagingHost directory (browser-specific)
# Brave Browser
xdg-config/BraveSoftware/Brave-Browser/NativeMessagingHosts:ro
# Chromium
xdg-config/chromium/NativeMessagingHosts:ro
# Google Chrome
xdg-config/google-chrome/NativeMessagingHosts:ro

# KeePassXC server socket and Nix store
xdg-run/app/org.keepassxc.KeePassXC/org.keepassxc.KeePassXC.BrowserServer
/nix/store:ro
```

<span id="Using_libc_memory_allocator"></span>

## 使用 libc 内存分配器

当使用诸如 scudo 之类的其他系统级内存分配器时，Chromium 可能无法正常工作。要在 Chromium 上使用 libc，需要以下 firejail 封装：

``` nix
programs.firejail = {
  enable = true;
  wrappedBinaries = {
    chromium = {
      executable = "${pkgs.chromium}/bin/chromium-browser";
      profile = "${pkgs.firejail}/etc/firejail/chromium-browser.profile";
      extraArgs = [
        "--blacklist=/etc/ld-nix.so.preload"
      ];
    };
  };
};
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Browser{{#translation:}}" class="wikilink" title="Category:Web Browser{{#translation:}}">Category:Web Browser{{#translation:}}</a>
