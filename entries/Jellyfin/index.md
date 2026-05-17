<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Jellyfin -->

<languages/>

<translate> <strong>[Jellyfin](https://jellyfin.org/)</strong>[^1] is a free and open-source media server that enables users to manage and stream their personal media libraries across various devices. It consists of the Jellyfin Server and multiple client applications including Jellyfin Media Player and a web interface.

## Client Installation

Jellyfin is available both via the web interface, and through a desktop application.

If you would like to install the desktop application, use the following:

Alternatively, you can use the Jellyfin web client by using your preferred web browser to visit the server directly. See below on how to install the Jellyfin server.

## Server Installation

To enable Jellyfin on NixOS, add the service configuration to your `/etc/nixos/configuration.nix` file: </translate>

<translate> For more advanced configuration options, refer to the [NixOS options documentation](https://search.nixos.org/options?query=jellyfin):[^2] </translate>

<translate> After configuring Jellyfin, rebuild your system for the changes to take effect: </translate>

<translate> After the rebuild completes, verify that Jellyfin is running: </translate>

<translate> If Jellyfin is not running, you can start it manually: </translate>

<translate> Once Jellyfin is running, you can access the web interface:

- The Jellyfin server runs on port 8096 by default.[^3]
- Navigate to [`http://localhost:8096`](http://localhost:8096) for local access.
- For remote access, replace `localhost` with the server's IP address.

## Configuration

### Allowing access to external drives

Desktop environments typically mount external drives for the current user, while Jellyfin runs as the system user `jellyfin` by default. This can cause permission issues when accessing external media.

The simplest solution is to change the service user: </translate>

<translate> If you change the user after Jellyfin is already installed, update the ownership of the data and cache directories: </translate>

<translate> Then restart the service: </translate>

<translate> Alternatively, configure explicit mounts via <a href="Filesystems" class="wikilink" title="Filesystems">Filesystems</a>. This approach requires more setup and each drive must be declared, but provides finer control over what Jellyfin can access.

### Hardware transcoding

Modern hardware often includes video acceleration capabilities that can significantly reduce CPU usage during transcoding. For detailed information, see the [official Jellyfin documentation](https://jellyfin.org/docs/general/post-install/transcoding/hardware-acceleration/).[^4]

#### VAAPI and Intel QSV

Intel GPUs support Video Acceleration API (VAAPI) and Quick Sync Video (QSV). The required packages must be added to `hardware.graphics.extraPackages`.

Choose the appropriate driver based on your CPU generation:

- `intel-vaapi-driver` for pre-Broadwell CPUs
- `intel-media-driver` for Broadwell and newer
- `intel-compute-runtime` for newer processors

</translate>

<translate>

#### Troubleshooting VAAPI and Intel QSV

Check supported VAAPI profiles: </translate>

<translate> Verify OpenCL availability: </translate>

<translate> If `clinfo` shows `Number of platforms 0`, OpenCL is not enabled or available.

Monitor Intel GPU status: </translate>

<translate> On Intel N100 CPUs, enable firmware loading to prevent GuC errors: </translate>

<translate> Without this option, you may see errors like: </translate>

<translate>

#### VAAPI and Intel QSV on Arc GPU

Arc GPUs require Jellyfin to use FFmpeg compiled with `vpl` support. Use <a href="Overlays" class="wikilink" title="an overlay">an overlay</a> to override the FFmpeg configuration: </translate>

<translate> This triggers a rebuild of the Jellyfin package. After applying, select "Intel QuickSync (QSV)" in the Jellyfin settings for hardware-accelerated transcoding with minimal CPU load.

On NixOS 25.11 and newer (specifically since [this PR](https://github.com/NixOS/nixpkgs/pull/424061)), `vpl` support in FFmpeg is enabled by default, so there is no need to use an overlay.

If your system has both integrated and discrete GPUs, manually select the QSV device in the Playback settings to avoid random device selection. Use `intel_gpu_top -L` to list available devices.

#### VAAPI with Jellyfin in a NixOS container

Containers do not inherit graphics drivers from the host system. When running Jellyfin in a NixOS container, replicate the `hardware.graphics` configuration and pass through the GPU devices (typically `/dev/dri/card0` and `/dev/dri/renderD128`): </translate>

<translate> Verify the configuration by adding `libva-utils` to the container's `environment.systemPackages`, logging in with `machinectl shell container-name`, and running `vainfo`. Successful output looks like: </translate>

<translate> With correct configuration, FFmpeg and Jellyfin can use hardware transcoding.

## Tips and tricks

### Intro Skipper plugin

The latest version of the Intro Skipper plugin from [GitHub](https://github.com/intro-skipper/intro-skipper)[^5] works without manual patches on Jellyfin web, Jellyfin Media Player, and Android TV clients.

If you need to manually patch the web interface for older versions, use an overlay: </translate>

<translate>

## Troubleshooting

### Service not starting

If Jellyfin fails to start, check the service status: </translate>

<translate> Review the service logs for error messages: </translate>

<translate>

### Cannot access media files

Verify that the Jellyfin user has read permissions for your media directories. Check file ownership and permissions: </translate>

<translate> If using a custom user for the Jellyfin service, ensure the data directories have correct ownership as described in the configuration section.

## See also

- <a href="Filesystems" class="wikilink" title="Filesystems">Filesystems</a> – Declarative filesystem mounting on NixOS
- <a href="Accelerated_Video_Playback" class="wikilink" title="Accelerated Video Playback">Accelerated Video Playback</a> – GPU acceleration configuration
- <a href="Intel_Graphics" class="wikilink" title="Intel Graphics">Intel Graphics</a> – Intel GPU driver setup
- <a href="Overlays" class="wikilink" title="Overlays">Overlays</a> – Customizing packages with overlays
- [NixOS options search](https://search.nixos.org/options?query=jellyfin) – Jellyfin module options
- [Jellyfin documentation](https://jellyfin.org/docs/) – Official Jellyfin documentation

## References

</translate>

<references/>

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>

[^1]: Jellyfin Project, "Jellyfin: The Free Software Media System", Official Website, Accessed October 2025. <https://jellyfin.org/>

[^2]: NixOS Wiki contributors, "Jellyfin NixOS module options", NixOS Search, Accessed October 2025. <https://search.nixos.org/options?query=jellyfin>

[^3]: Jellyfin Documentation Team, "Networking", Jellyfin Documentation, Accessed October 2025. <https://jellyfin.org/docs/general/networking/>

[^4]: Jellyfin Documentation Team, "Hardware acceleration", Jellyfin Documentation, Accessed October 2025. <https://jellyfin.org/docs/general/post-install/transcoding/hardware-acceleration/>

[^5]: Intro Skipper contributors, "Intro Skipper Jellyfin plugin", GitHub, Accessed October 2025. <https://github.com/intro-skipper/intro-skipper>
