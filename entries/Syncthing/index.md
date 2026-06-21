<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Syncthing -->

<languages/> [Syncthing](https://syncthing.net/) is a free and open-source decentralized file synchronization application that allows for secure, continuous, and private syncing of files between computers. Unlike cloud-based services, Syncthing operates peer-to-peer, so your data remains on your devices unless you choose to share it. It is cross-platform, offering native support for Linux, macOS, Windows, BSD, and mobile devices.[^1]

## Installation

#### Shell

To temporarily use Syncthing in a shell environment without modifying your system configuration, you can run:

``` bash
nix-shell -p syncthing --run syncthing
```

This provides Syncthing in your current shell without adding it to your system configuration. You can open the web interface at <http://127.0.0.1:8384/> to configure and use it.

#### System setup

To install Syncthing as a system service that runs in the background and survives reboots, add the following to your `/etc/nixos/configuration.nix`:

``` nix
# Example for /etc/nixos/configuration.nix
services.syncthing = {
  enable = true;
  openDefaultPorts = true; # Open ports in the firewall for Syncthing. (NOTE: this will not open syncthing gui port)
};
```

Once you've rebuilt your system, Syncthing will be available as a system service. You can visit <http://127.0.0.1:8384/> to configure it through the web interface.

If accessing the web interface from other networked computers you will need to change the gui bind address and open a TCP port:

``` nix
# Example for /etc/nixos/configuration.nix
services.syncthing = {
  enable = true;
  openDefaultPorts = true; # Open ports in the firewall for Syncthing. (NOTE: this will not open syncthing gui port)

  guiAddress = "0.0.0.0:8384"; # By default syncthing only listens to localhost
};

# port 8384  is the default port to allow access from the network.
networking.firewall.allowedTCPPorts = [ 8384 ];
```

## Configuration

#### Basic

Basic Syncthing features can be configured directly within the `services.syncthing` attribute set:

``` nix
services.syncthing = {
  enable = true;
  openDefaultPorts = true;
  # Optional: GUI credentials (can be set in the browser instead)
  settings.gui = {
    user = "myuser";
    password = "mypassword";
  };
};
```

Note: If you want to use <a href="Agenix" class="wikilink" title="Agenix">Agenix</a> to set the GUI password use [services.syncthing.guiPasswordFile](https://search.nixos.org/options?channel=unstable&query=syncthing&show=services.syncthing.guiPasswordFile) instead of setting.gui.password.

#### Advanced

For more advanced configuration with multiple devices and folders, you can declaratively configure devices and shared folders:[^2]

``` nix
services.syncthing = {
  enable = true;
  openDefaultPorts = true;
  guiPasswordFile = "/etc/syncthing-gui-password";
  settings = {
    gui.user = "myuser";
    devices = {
      "device1" = { id = "DEVICE-ID-GOES-HERE"; };
      "device2" = { id = "DEVICE-ID-GOES-HERE"; };
    };
    folders = {
      "Documents" = {
        path = "/home/myusername/Documents";
        devices = [ "device1" "device2" ];
      };
      "Example" = {
        path = "/home/myusername/Example";
        devices = [ "device1" ];
        ignorePerms = false; # Enable file permission syncing
      };
    };
  };
};
```

Note: As per syncthing Device ids are not sensitive and should be okay to keep in your config file.[^3]

## Tips and tricks

### Sync folders and remote hosts

The following configuration will trust the remote hosts `device1` and `device2` by adding their `id`s. The shares `Documents` and `Example` are added to the local node, defined by their local file paths and list of allowed devices.

The share `Sensitive` is shared unencrypted with `device1`, and encrypted with `device2`:

``` nix
services.syncthing = {
  settings = {
    devices = {
      "device1" = { id = "DEVICE-ID-GOES-HERE"; };
      "device2" = { id = "DEVICE-ID-GOES-HERE"; };
    };
    folders = {
      "Documents" = {
        path = "/home/myusername/Documents";
        devices = [ "device1" "device2" ];
      };
      "Example" = {
        path = "/home/myusername/Example";
        devices = [ "device1" ];
        # By default, Syncthing doesn't sync file permissions. This line enables it for this folder.
        ignorePerms = false;
      };
      "Sensitive" = {
        path = "/home/myusername/Sensitive";
        devices = [
          # We trust this device to have access
          # to the decrypted contents of this folder.
          "device1"
          # We do not trust this device, but we want to have another
          # (encrypted) copy of the data for redundancy/backup/sync purposes.
          {
            name = "device2";
            # encryptionPasswordFile is a path to a file containing the encryption password.
            # See below for information about managing secrets on NixOS.
            encryptionPasswordFile = "/run/secrets/st-sensitive-password";
          }
        ];
      };
    };
  };
};
```

### Declarative node IDs

If you set up Syncthing with the above configuration, you will still need to manually accept the connection from your other devices. If you want to make this automatic, you must also set the key.pem and cert.pem options:

``` nix
services.syncthing = {
  key = "/run/secrets/path/to/key.pem";
  cert = "/run/secrets/path/to/cert.pem";
  # ... other configuration
};
```

This will ensure your node has a stable ID. You can optionally include the key.pem and cert.pem files in the NixOS configuration using a tool like sops-nix. See <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Comparison of secret managing schemes">Comparison of secret managing schemes</a>.

To generate a new key.cert and key.pem for a deployment, you can use the -generate argument:

``` bash
$ nix-shell -p syncthing --run "syncthing generate --home myconfig/"
2024/04/23 11:41:17 INFO: Generating ECDSA key and certificate for syncthing...
2024/04/23 11:41:17 INFO: Device ID: DMWVMM6-MKEQVB4-I4UZTRH-5A6E24O-XHQTL3K-AAI5R5L-MXNMUGX-QTGRHQ2
2024/04/23 11:41:17 INFO: Default folder created and/or linked to new config
$ ls myconfig/
cert.pem  config.xml  key.pem
```

### Disable default sync folder

Before version 2.0.0, Syncthing creates a 'Sync' folder in your home directory every time it regenerates a configuration, even if your declarative configuration does not have this folder. You can disable that by using the `--no-default-folder` command-line option[^4]:

``` nix
services.syncthing.extraFlags = [ "--no-default-folder" ]; # Don't create default ~/Sync folder
```

The default folder concept is removed in Syncthing 2.0.0 and this flag is no longer available.[^5]

## Troubleshooting

### Some settings not being applied

Note the [services.syncthing.settings](https://search.nixos.org/options?channel=unstable&show=services.syncthing.settings) option accepts anything that can be parsed into JSON, even if it does not have a corresponding config option. Check the logs of the `syncthing-init` service with `systemctl status syncthing-init.service`to see if some settings are not being applied.

## See also

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – Use Syncthing declaratively at the user level: [Syncthing module in Home Manager](https://github.com/nix-community/home-manager/blob/master/modules/services/syncthing.nix)
- <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Comparison of secret managing schemes">Comparison of secret managing schemes</a> – Compare different ways to manage secrets declaratively on NixOS, including for use with Syncthing.
- [Syncthing in NixOS Manual](https://nixos.org/manual/nixos/stable/index.html#sec-services) – Official documentation for configuring services like Syncthing.
- [Syncthing User Documentation](https://docs.syncthing.net) – In-depth official guide on Syncthing features, configuration, and troubleshooting.
- [Syncthing discussions on Discourse](https://discourse.nixos.org/search?q=syncthing) – Community tips, troubleshooting, and advanced use cases.

## References

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_synchronization" class="wikilink" title="Category:File synchronization">Category:File synchronization</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>

[^1]: <https://syncthing.net/>

[^2]: <https://docs.syncthing.net/users/config.html>

[^3]: [Should I keep my device IDs secret?](https://docs.syncthing.net/users/faq.html#should-i-keep-my-device-ids-secret)

[^4]: <https://docs.syncthing.net/users/syncthing.html#cmdoption-no-default-folder>

[^5]: <https://github.com/syncthing/syncthing/pull/10068>
