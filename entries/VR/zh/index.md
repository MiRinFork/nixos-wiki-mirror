<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: VR/zh -->

## Monado

[Monado](https://monado.freedesktop.org/) 是一个开源的 OpenXR 运行时。它使用内置驱动程序支持各种硬件，使其可以运行任何 OpenXR 程序，并且在 OpenComposite 的帮助下，还可以运行大多数 OpenVR 应用程序。

可以使用其 NixOS 选项 配置 Monado：

为了配置 Monado，您可能需要添加其他环境变量：

配置完成后，Monado 可以在 <a href="Special:MyLanguage/systemd" class="wikilink" title="systemd">systemd</a> 用户会话中启动和停止。

例如，以下命令将启动 Monado，然后打印其日志输出：

<span id="Hand_Tracking"></span>

### 手部追踪

您可能会注意到，由于缺少手部追踪数据，运行 `monado-services` 会失败。有两种方法可以解决这个问题：完全禁用手部追踪，或下载手部追踪数据。

要禁用手部追踪，请修改环境变量以包含 `WMR_HANDTRACKING = "0";`，使其如下所示。

要使手部追踪功能正常工作，您需要启用 `git-lfs`。启用 `git-lfs` 的标准方法是通过以下配置

确保 `git-lfs` 功能启用后，运行以下命令并重新启动 `monado-service`

有关可用环境变量和调整的更多信息，请参阅 [Linux VR Adventures wiki](https://lvra.gitlab.io/docs/fossvr/monado/) 和 [Monado 文档关于环境变量的部分](https://monado.freedesktop.org/getting-started.html#environment-variables)

## OpenComposite

[OpenComposite](https://gitlab.com/znixian/OpenOVR) 是一个兼容层，用于在 Monado 等 OpenXR 运行时上运行 OpenVR 应用程序。它与 DXVK 或 vkd3d 等工具类似，但用于将 OpenVR 调用转换为 OpenXR。

为了在 SteamVR 以外的任何平台上运行 OpenVR 游戏，您需要配置 `~/.config/openvr/openvrpaths.vrpath` 中定义的 OpenVR 运行时路径。一个可靠的方法是使用 <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> 创建此文件。

如果此文件未设置为只读，SteamVR 将添加其运行时路径，因此可以使用 Home Manager。

启用 OpenComposite 的示例配置可能如下所示：

如果您计划在 Steam 上玩任何 OpenVR 游戏或通过 Proton 游玩 OpenXR 游戏，则必须以这种方式使用 OpenComposite。在大多数情况下，您还必须允许 Steam 运行时访问您的 OpenXR 运行时的 Socket 路径，方法是使用以下 Steam 上 XR 应用程序的启动选项：`env PRESSURE_VESSEL_FILESYSTEMS_RW=$XDG_RUNTIME_DIR/monado_comp_ipc %command%`。此示例适用于 Monado，其他 XR 运行时可能有所不同。

## WiVRn

WiVRn 是一款基于 Monado 构建的 OpenXR 流媒体应用程序。它能够将独立的 VR 头戴设备无线连接到 Linux 计算机。如果您的头戴设备不是无线的，请查阅 <a href="Special:MyLanguage/VR#Monado" class="wikilink" title="Monado">Monado</a>。 WiVRn 模块的示例用法：

与 Monado 一样，您还须添加 WiVRn 的启动参数以允许访问 Socket：`PRESSURE_VESSEL_FILESYSTEMS_RW=$XDG_RUNTIME_DIR/wivrn/comp_ipc %command%`

## Envision

Envision 是用于 FOSS VR 程序栈的编排器（Orchestrator）。它负责构建和配置 Monado、WiVRn、OpenComposite 以及 FOSS VR 程序栈的其他实用程序，例如 Lighthouse 驱动程序、OpenHMD、Survive 和 WMR。您可以使用 Envision 模块启用它：

## SteamVR

[SteamVR](https://store.steampowered.com/app/250820/SteamVR/) 是一个专有的 OpenVR 运行时，兼容 OpenXR。它是 <a href="Special:MyLanguage/Steam" class="wikilink" title="Steam">Steam</a> 的一部分，除了启用 Steam 之外，在 NixOS 上无需进行任何其他设置。

通过 Steam 安装 SteamVR 并插入兼容 SteamVR 的耳机后，SteamVR 应该就可以正常工作。

在初始设置时，SteamVR 会请求提升权限，以便为其某个二进制文件设置文件能力（file capability）。这是使异步再投影技术正常工作所必需的。客户端需要拥有 `CAP_SYS_NICE` 授权来获取高优先级环境，这是异步再投影技术的必要条件。

<span id="Patching_AMDGPU_to_allow_high_priority_queues"></span>

### 修补 AMDGPU 以允许高优先级队列

通过应用 [此补丁](https://github.com/Frogging-Family/community-patches/blob/a6a468420c0df18d51342ac6864ecd3f99f7011e/linux61-tkg/cap_sys_nice_begone.mypatch)，AMDGPU 内核驱动程序将忽略进程权限并允许任何应用程序创建高优先级环境（high priority contexts）。

<span id="Applying_as_a_NixOS_kernel_patch"></span>

#### 作为 NixOS 内核补丁进行应用

为了解决 `CAP_SYS_NICE` 要求，我们可以使用以下 NixOS 配置片段应用内核补丁：

也可以只修补 amdgpu 并将其构建为树外模块（out-of-tree module），如 <a href="Special:MyLanguage/Linux_kernel#Patching_a_single_In-tree_kernel_module" class="wikilink" title="Pacthing a single In-tree Kernel Module">Pacthing a single In-tree Kernel Module</a> 中所述

<span id="Patching_bubblewrap_to_allow_capabilities"></span>

### 修补 bubblewrap 以允许启用能力（capabilities）

通过修改用于运行 Steam 的 bubblewrap 二进制文件，您可以允许该 FHS 环境中的进程获取能力。这样就无需直接修补内核了。

作为额外的更改，您可能还需要用指向修改后的 bwrap 二进制文件的符号链接替换 ​​Steam 自己的 bwrap 二进制文件，该链接位于 `~/.local/share/Steam/ubuntu12_32/steam-runtime/usr/libexec/steam-runtime-tools-0/srt-bwrap`。

当 steam-runtime 更新时，Steam 会定期用自己的二进制文件替换此修改，因此您可能需要在功能异常时，重新应用此修改。

## wlx-overlay-s

[wlx-overlay-s](https://github.com/galister/wlx-overlay-s) 是一个轻量级的 OpenXR/OpenVR 覆盖层，适用于 Wayland 和 X11 桌面。它原生兼容 SteamVR 以及 Monado/WiVRn。

<span id="SteamVR_autostart"></span>

#### SteamVR 自动启动

在 SteamVR（或任何 OpenVR 合成器）中启动 wlx-overlay-s 时，它会注册一个自动启动清单。目前，此清单将引用 wlx-overlay-s 的 Nix 存储路径，该路径可能会在重建 NixOS/Nix 配置文件后被垃圾回收。一种解决方法是定期运行以下命令来更新清单的存储路径：

<span id="See_also"></span>

## 另见

- [Linux VR Adventures Wiki](https://lvra.gitlab.io)

<a href="Category:Video/zh" class="wikilink" title="分类：视频">分类：视频</a> <a href="Category:Hardware/zh" class="wikilink" title="分类：硬件">分类：硬件</a> <a href="Category:Desktop/zh" class="wikilink" title="分类：桌面">分类：桌面</a> <a href="Category:Gaming/zh" class="wikilink" title="分类：游戏">分类：游戏</a>
