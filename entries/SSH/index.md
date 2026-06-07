<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SSH -->

[SSH (Secure Shell)](https://en.wikipedia.org/wiki/Secure_Shell) is a protocol for securely accessing remote machines over an unsecured network. It is commonly used for remote administration, file transfers, and secure tunneling.

This page covers the setup and management of SSH on NixOS systems. NixOS primarily uses [OpenSSH](https://www.openssh.com/) for both server and client functionality.

For more manual-level information, refer to the .

## Server

### Setup

To enable a SSH service, add the following to your system configuration:

The example restricts authentication only to the user defined in `settings.AllowUsers` by using <a href="SSH_public_key_authentication" class="wikilink" title="public key authentication">public key authentication</a>. By default, the server listens on port 22. For further security, the default listenig port should be changed using the `ports` option.

For more SSH server configuration options, refer to the module options.

## Client

### Configuration

The OpenSSH client is available by default on NixOS and can be configured using the module options.

This allows you to connect using:

``` console
$ ssh myhost
```

For per-user SSH configuration, consider using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> with the [programs.ssh](https://home-manager-options.extranix.com/?query=programs.ssh) options, which allow for more flexible, user-level SSH client settings.

Alternatively, you can manually manage SSH client configuration by placing entries in the user-specific `~/.ssh/config` file.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
