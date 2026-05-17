<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS as a server -->

<a href="NixOS" class="wikilink" title="NixOS">NixOS</a> is well-suited for server deployments, offering declarative, reproducible system configurations and atomic system upgrades and rollbacks. This page provides an overview of configuring, deploying, and maintaining NixOS systems in server environments.

## Initial setup

Refer to the <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a> for detailed installation instructions.

For setting up NixOS in the cloud, refer to the <a href="NixOS_friendly_hosters" class="wikilink" title="NixOS friendly hosters">NixOS friendly hosters</a>.

For guidance on defining and maintaining your system configuration, consult <a href="NixOS_system_configuration" class="wikilink" title="NixOS system configuration">NixOS system configuration</a>.

## NixOS infrastructure tools

### Deployment orchestration

- <a href="nixos-anywhere" class="wikilink" title="nixos-anywhere">nixos-anywhere</a> - Install NixOS everywhere via SSH

<!-- -->

- [Colmena](https://github.com/zhaofengli/colmena) - A simple, stateless NixOS deployment tool modeled after NixOps and morph, written in Rust

<!-- -->

- <a href="Morph" class="wikilink" title="Morph">Morph</a> - NixOS deployment tool

<!-- -->

- <a href="Clan" class="wikilink" title="Clan">Clan</a> - Peer-to-peer computer management framework for NixOS

<!-- -->

- <a href="Krops" class="wikilink" title="Krops">Krops</a> - Lightweight toolkit to deploy NixOS systems

<!-- -->

- [deploy-rs](https://github.com/serokell/deploy-rs) - A simple, multi-profile Nix-flake deploy tool

<!-- -->

- <a href="NixOps" class="wikilink" title="NixOps">NixOps</a> - Native NixOS deployment tool for cloud and virtual infrastructure (not currently recommended)

### Binary cache and CI

See the main pages, <a href="Binary_Cache" class="wikilink" title="Binary Cache">Binary Cache</a> and <a href="Continuous_Integration_(CI)" class="wikilink" title="Continuous Integration (CI)">Continuous Integration (CI)</a>.

- [Cachix](https://www.cachix.org/) - Share binaries between CI, development and deployment environments

<!-- -->

- [Attic](https://github.com/zhaofengli/attic) - Self-hostable Nix Binary Cache server backed by an S3-compatible storage provider

<!-- -->

- <a href="Hydra" class="wikilink" title="Hydra">Hydra</a> - Tool for continuous integration testing and software release

### Secrets management

- <a href="Agenix" class="wikilink" title="Agenix">Agenix</a> - commandline tool for managing secrets in your Nix configuration
- [sops-nix](https://github.com/Mic92/sops-nix) - Atomic, declarative, and reproducible secret provisioning for NixOS based on sops

Refer to <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Comparison of secret managing schemes">Comparison of secret managing schemes</a> for additional tools and in-depth comparisions

## Common server configurations

### Web servers

- <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> - Web server that can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.
- <a href="Apache_Httpd" class="wikilink" title="Apache Httpd">Apache Httpd</a> - Free and open-source cross-platform web server
- <a href="Caddy" class="wikilink" title="Caddy">Caddy</a> - Extensible, cross-platform, open-source web server written in Go

### File sharing and storage

- <a href="NFS" class="wikilink" title="NFS">NFS</a> - Unix-based network file sharing
- <a href="Samba" class="wikilink" title="Samba">Samba</a> - Windows-compatible file and printer sharing

### Backup and replication

- <a href="ZFS" class="wikilink" title="ZFS">ZFS</a> - With native snapshots and replication
- <a href="Syncthing" class="wikilink" title="Syncthing">Syncthing</a> - Decentralized file synchronization application
- <a href="Restic" class="wikilink" title="Restic">Restic</a> - Fast and secure backup program
- <a href="Borg_backup" class="wikilink" title="Borg backup">Borg backup</a> - Deduplicating incremental backup program for local and remote data
- <a href="Rclone" class="wikilink" title="Rclone">Rclone</a> - Command-line program that synchronizes files and directories between different cloud storage services

### VPN and networking

- <a href="WireGuard" class="wikilink" title="WireGuard">WireGuard</a> - Fast, modern, secure VPN tunnel

<!-- -->

- <a href="OpenVPN" class="wikilink" title="OpenVPN">OpenVPN</a> - Flexible VPN implementation for secure networking

<!-- -->

- <a href="Firewall" class="wikilink" title="Firewall">Firewall</a> - NixOS has an integrated firewall based on iptables or nftables

<!-- -->

- <a href="SSH" class="wikilink" title="SSH">SSH</a> - secure remote administration.

## See Also

- <a href="NixOS_friendly_hosters" class="wikilink" title="NixOS friendly hosters">NixOS friendly hosters</a> - Guides on setting up NixOS with various cloud providers

<!-- -->

- <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a>

<!-- -->

- <a href="NixOS_as_a_desktop" class="wikilink" title="NixOS as a desktop">NixOS as a desktop</a> - Desktop counterpart to this article

<!-- -->

- <a href="NixOS_system_configuration" class="wikilink" title="NixOS system configuration">NixOS system configuration</a>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
