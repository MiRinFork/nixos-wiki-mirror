<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SSH -->

[SSH (Secure Shell)](https://en.wikipedia.org/wiki/Secure_Shell) is a protocol for securely accessing remote machines over an unsecured network. It is commonly used for remote administration, file transfers, and secure tunneling.

This page covers the setup and management of SSH on NixOS systems. NixOS primarily uses [OpenSSH](https://www.openssh.com/) for both server and client functionality.

For more manual-level information, refer to the .

# OpenSSH Server

To enable a SSH service, add the following to your system configuration:

By default, the server listens on port 22 and allows password authentication. Note that the port defined in the `openssh` config is opened automatically in the <a href="Firewall" class="wikilink" title="firewall">firewall</a>.

For more SSH server configuration options, refer to the module options.

## Security hardening

To improve the security of your SSH server, it is recommended to apply the following measures:

- Disable password-based login

<!-- -->

- Disable root login

<!-- -->

- Restrict allowed users

<!-- -->

- Change the default port

These options can be configured declaratively in your system configuration:

In addition to these settings, consider enabling <a href="#Fail2Ban" class="wikilink" title="Fail2Ban">Fail2Ban</a> as a recommended baseline for security. Alternatively, you can make use of **PerSourcePenalties** introduced with OpenSSH 9.8[^1]:

# SSH client configuration

The OpenSSH client is available by default on NixOS and can be configured using the module options.

This allows you to connect using:

``` console
$ ssh myhost
```

For per-user SSH configuration, consider using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> with the [programs.ssh](https://home-manager-options.extranix.com/?query=programs.ssh) options, which allow for more flexible, user-level SSH client settings.

Alternatively, you can manually manage SSH client configuration by placing entries in the user-specific `~/.ssh/config` file.

# SSH public key authentication

For details on configuring public key authentication, managing SSH keys, and setting up SSH agents, see the dedicated page: <a href="SSH_public_key_authentication" class="wikilink" title="SSH public key authentication">SSH public key authentication</a>.

# Tips and tricks

## Fail2Ban

[Fail2Ban](http://www.fail2ban.org/) is a service that bans hosts that cause multiple authentication errors.

To enable Fail2Ban, add the following to your system configuration:

## Endlessh

[Endlessh](https://github.com/skeeto/endlessh) is a SSH tarpit that slows down malicious or automated SSH connection attempts by indefinitely delaying connections.

To enable Endlessh, add the following to your system configuration:

For additional configuration options, see the module documentation.

# See also

- <a href="SSH_public_key_authentication" class="wikilink" title="SSH public key authentication">SSH public key authentication</a>
- <a href="Fail2ban" class="wikilink" title="Fail2ban">Fail2ban</a>

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>

[^1]: <https://text.tchncs.de/senioradmin/are-you-still-banning-or-do-you-already-penalize>
