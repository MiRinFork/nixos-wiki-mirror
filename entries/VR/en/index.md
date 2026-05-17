<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: VR/en -->

## Monado

[Monado](https://monado.freedesktop.org/) is an open source OpenXR runtime. It offers support for a variety of hardware using its built-in drivers and can be used to run any OpenXR and, with the help of OpenComposite, most OpenVR applications.

Monado can be configured using its NixOS options :

In order to configure Monado, you might want to add additional environment variables:

Once configured, Monado can be started and stopped in a <a href="systemd" class="wikilink" title="systemd">systemd</a> user session.

For example, the following commands will start Monado and then follow its log output:

### Hand Tracking

You may notice that running `monado-services` will fail due to the lack of hand tracking data. There are 2 ways to remedy this, either disable hand tracking altogether, or download the hand tracking data.

To disable hand tracking, modify the environment variable to include `WMR_HANDTRACKING = "0";`, so that it will look like this.

To get hand tracking to work, you require `git-lfs` to be enabled. The standard way of enabling `git-lfs` is through the configuration below

After making sure `git-lfs` is enabled, run these commands and restart `monado-service`

For further information about available environment variables and tweaks, read the [Linux VR Adventures wiki](https://lvra.gitlab.io/docs/fossvr/monado/) and the [Monado documentation about environment variables](https://monado.freedesktop.org/getting-started.html#environment-variables)

## OpenComposite

[OpenComposite](https://gitlab.com/znixian/OpenOVR) is a compatibility layer for running OpenVR applications on an OpenXR runtime like Monado. It is comparable to tools like DXVK or vkd3d, but for translating OpenVR calls to OpenXR.

In order to run OpenVR games on anything other than SteamVR, you need to configure the OpenVR runtime path defined in `~/.config/openvr/openvrpaths.vrpath`. A reliable way to do this is to use <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> to create this file.

If this file is not set to read-only, SteamVR will add its runtime path back, hence the use for Home Manager.

An example configuration for enabling OpenComposite may look like this:

If you are planning to play any OpenVR game on Steam or OpenXR games through Proton, you will have to use OpenComposite in this manner. In most cases you also have to allow access to the socket path of your OpenXR runtime to Steam's runtime, by using the following launch options for XR applications on Steam: `env PRESSURE_VESSEL_FILESYSTEMS_RW=$XDG_RUNTIME_DIR/monado_comp_ipc %command%`. This example is for Monado, while other XR runtimes might differ.

## WiVRn

WiVRn is an OpenXR streaming application built around Monado. It wirelessly connects a standalone VR headset to a Linux computer. If your headset is not wireless, look at <a href="VR#Monado" class="wikilink" title="Monado">Monado</a> instead. Example usage of the WiVRn module:

Like Monado, you will also have to add the launch argument for WiVRn to allow access to the socket: `PRESSURE_VESSEL_FILESYSTEMS_RW=$XDG_RUNTIME_DIR/wivrn/comp_ipc %command%`

## Envision

Envision is an orchestrator for the FOSS VR stack. It handles the building and configuration of Monado, WiVRn, OpenComposite, and other utilities of the FOSS VR stack such as the Lighthouse driver, OpenHMD, Survive, and WMR. You can enable it with the Envision module:

## SteamVR

[SteamVR](https://store.steampowered.com/app/250820/SteamVR/) is a proprietary OpenVR runtime with compatibility for OpenXR. It is part of <a href="Steam" class="wikilink" title="Steam">Steam</a> and doesn't need any additional setup on NixOS apart from enabling Steam.

After installing SteamVR through Steam and plugging in a SteamVR-compatible headset, SteamVR should work for the most part.

On initial setup, SteamVR will ask for elevated permissions, to set up a file capability for one of its binaries. This is needed to allow asynchronous reprojection to work. Clients need the `CAP_SYS_NICE` capability to acquire a high-priority context, which is a requirement for asynchronous reprojection.

### Patching AMDGPU to allow high priority queues

By applying [this patch](https://github.com/Frogging-Family/community-patches/blob/a6a468420c0df18d51342ac6864ecd3f99f7011e/linux61-tkg/cap_sys_nice_begone.mypatch), the AMDGPU kernel driver will ignore process privileges and allow any application to create high priority contexts.

#### Applying as a NixOS kernel patch

To workaround the `CAP_SYS_NICE` requirement, we can apply a kernel patch using the following NixOS configuration snippet:

It is also possible to just patch amdgpu and build it as an out-of-tree module, as described in <a href="Linux_kernel#Patching_a_single_In-tree_kernel_module" class="wikilink" title="Linux_kernel#Patching_a_single_In-tree_kernel_module">Linux_kernel#Patching_a_single_In-tree_kernel_module</a>

### Patching bubblewrap to allow capabilities

By modifying the bubblewrap binary used for running Steam, you can allow processes in that FHS environment to acquire capabilities. This removes the need for patching the kernel directly.

as an additional change, you may also need to replace Steam's own bwrap binary with a symbolic link to this modified bwrap binary, found at `~/.local/share/Steam/ubuntu12_32/steam-runtime/usr/libexec/steam-runtime-tools-0/srt-bwrap`.

Steam will periodically replace this modification with its own binary when steam-runtime updates, so you may need to re-apply this change if it breaks.

## wlx-overlay-s

[wlx-overlay-s](https://github.com/galister/wlx-overlay-s) is a lightweight OpenXR/OpenVR overlay for Wayland and X11 desktops. It works with SteamVR as well as Monado/WiVRn natively.

#### SteamVR autostart

When launching wlx-overlay-s in SteamVR (or any OpenVR compositor) it will register an autostart manifest. Currently, this manifest will reference a Nix store path of wlx-overlay-s, which might get garbage collected after rebuilds of your NixOS/Nix profile. A workaround is to regularly run the following command to update the manifest's store path:

## See also

- [Linux VR Adventures Wiki](https://lvra.gitlab.io)

<a href="Category:Video" class="wikilink" title="Category:Video">Category:Video</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
