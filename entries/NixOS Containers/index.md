<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Containers -->

Setup native [systemd-nspawn](https://wiki.archlinux.org/title/systemd-nspawn) containers, which are running NixOS and are configured and managed by NixOS using the `containers` directive.

See <a href="Docker" class="wikilink" title="Docker">Docker</a> page for OCI container (Docker, Podman) configuration.

### Host Configuration

For all of the examples below to work, you'll have to enable virtualization and the use of containers in your host systems nix configuration.

### Configuration

The following example creates a container called webserver running a httpd web server. It will start automatically at boot and has its private network subnet.

In order to reach the web application on the host system, we have to open <a href="Firewall" class="wikilink" title="Firewall">Firewall</a> port 80 and also configure NAT through `networking.nat`. The web service of the container will be available at <http://192.168.100.11>

#### Networking

By default, if `privateNetwork` is not set, the container shares the network with the host, enabling it to bind any port on any interface. However, when `privateNetwork` is set to `true`, the container gains its private virtual `eth0` and `ve-`<container_name> on the host. This isolation is beneficial when you want the container to have its dedicated networking stack.

**NAT (Network Address Translation)**

``` nix
```

**Bridge**

``` nix
networking = {
  bridges.br0.interfaces = [ "eth0s31f6" ]; # Adjust interface accordingly
  
  # Get bridge-ip with DHCP
  useDHCP = false;
  interfaces."br0".useDHCP = true;

  # Set bridge-ip static
  interfaces."br0".ipv4.addresses = [{
    address = "192.168.100.3";
    prefixLength = 24;
  }];
  defaultGateway = "192.168.100.1";
  nameservers = [ "192.168.100.1" ];
};

containers.<name> = {
  privateNetwork = true;
  hostBridge = "br0"; # Specify the bridge name
  localAddress = "192.168.100.5/24";
  config = { };
};
```

#### Without privateNetwork (simpler)

If the service can be accessed by changing its port, the private network is not needed necessarily. Be careful to not use occupied ports. This example runs an <a href="Actual" class="wikilink" title="Actual">Actual</a> server on port 3003. It can be accessed through the host at [`http://localhost:3003`](http://localhost:3003). Since `privateNetwork` is not defined, it defaults to `false`.

``` nix
containers.actualContainer = {
  autoStart = true;
  config = {...}: {
    services.actual = {
      enable = true;
      settings.port = 3003;
    };
  };
};
```

### Usage

List containers

``` console
# machinectl list
```

Checking the status of the container

``` console
# systemctl status container@webserver
```

Login into the container

``` console
# nixos-container root-login webserver
```

Start or stop a container

``` console
# nixos-container start webserver
# nixos-container stop webserver
```

Destroy a container including its file system

``` console
# nixos-container destroy webserver
```

View log for container

``` console
# journalctl -M webserver
```

Further informations are available in the .

## Tips and tricks

#### Define and create nixos-container from a Flake file

We can define and create a custom container called `container` from a file stored as `flake.nix`. In this case we use the unstable branch of the nixpkgs repository as a source.

``` nix
{
  inputs.nixpkgs.url = "nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: {

    nixosConfigurations.container = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules =
        [ ({ pkgs, ... }: {
            boot.isContainer = true;

            networking.firewall.allowedTCPPorts = [ 80 ];

            services.httpd = {
              enable = true;
              adminAddr = "morty@example.org";
            };
          })
        ];
    };

  };
}
```

To create and run that container, enter following commands. In this example the `flake.nix` file is in the same directory.

``` console
# nixos-container create flake-test --flake .
host IP is 10.233.4.1, container IP is 10.233.4.2

# nixos-container start flake-test
```

#### Use agenix secrets in container

To add `agenix` secrets to a container bind mount the `ssh-host.key` and import the `agenix.nixosModule` and set `age.identityPaths` [Source](https://discourse.nixos.org/t/secrets-inside-nixos-containers/34403/6)

``` nix
{ agenix, ... }:
{

  containers."withSecret" = {

    # pass the private key to the container for agenix to decrypt the secret
    bindMounts."/etc/ssh/ssh_host_ed25519_key".isReadOnly = true;

    config =
      {
        config,
        lib,
        pkgs,
        ...
      }:
      {
        imports = [ agenix.nixosModules.default ]; # import agenix-module into the nixos-container

        age.identityPaths = [ "/etc/ssh/ssh_host_ed25519_key" ]; # isn't set automatically when openssh is not setup
        # import the secret
        age.secrets."secret-name" = {
          file = ../secrets/secret.age;
        };
      };
  };
}
```

## Troubleshooting

#### I have changed the host's channel and some services are no longer functional

**Symptoms:**

- Lost data in PostgreSQL database
- MySQL has changed its path, where it creates the database

**Solution**

If you did not have a option set inside your declarative container configuration, it will use the default one for the channel. Your data might be safe, if you did nothing meanwhile. Add the missing to your container, rebuild, and possibly stop/start the container.

## See also

- 

- [Blog Article - Declarative NixOS Containers](https://blog.beardhatcode.be/2020/12/Declarative-Nixos-Containers.html)

- [NixOS Discourse - Extra-container: Run declarative containers without full system rebuilds](https://discourse.nixos.org/t/extra-container-run-declarative-containers-without-full-system-rebuilds/511)

- [Nixpkgs - nixos-container.pl](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/ni/nixos-container/nixos-container.pl)

- [Nixpkgs - nixos-containers.nix](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/virtualisation/nixos-containers.nix)

- [nixos-nspawn](https://nixcademy.com/2023/08/29/nixos-nspawn/)

- [tfc/nspawn-nixos](https://github.com/tfc/nspawn-nixos)

- MicroVMs as a more isolated alternative, e.g. with <https://github.com/astro/microvm.nix>

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>
