<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Containers -->

Setup native [systemd-nspawn](https://wiki.archlinux.org/title/systemd-nspawn) containers, which are running NixOS and are configured and managed by NixOS using the `containers` directive.

See <a href="Docker" class="wikilink" title="Docker">Docker</a> page for OCI container (Docker, Podman) configuration.

### Configuration

The following example creates a container called webserver running a httpd web server. It will start automatically at boot and has its private network subnet.

In order to reach the web application on the host system, we have to open <a href="Firewall" class="wikilink" title="Firewall">Firewall</a> port 80 and also configure NAT through `networking.nat`. The web service of the container will be available at <http://192.168.100.11>

#### Networking

By default, if `privateNetwork` is not set, the container shares the network with the host, enabling it to bind any port on any interface. However, when `privateNetwork` is set to `true`, the container gains its private virtual `eth0` and `ve-`<container_name> on the host. This isolation is beneficial when you want the container to have its dedicated networking stack.

**NAT (Network Address Translation)**

In order to allow the container to connect to the internet, you have to configure NAT through `networking.nat`. **Bridge**

Connect a container to a bridge using Network Manager interfaces: **Without privateNetwork (simpler)**

If the service can be accessed by changing its port, the private network is not needed necessarily. Be careful to not use occupied ports. This example runs an <a href="Actual" class="wikilink" title="Actual">Actual</a> server on port 3003. It can be accessed through the host at [`http://localhost:3003`](http://localhost:3003). Since `privateNetwork` is not defined, it defaults to `false`.

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

### Define and create nixos-container from a Flake file

We can define and create a custom container called `container` from a file stored as `flake.nix`. In this case we use the unstable branch of the nixpkgs repository as a source.

To create and run that container, enter following commands. In this example the `flake.nix` file is in the same directory.

``` console
# nixos-container create flake-test --flake .
host IP is 10.233.4.1, container IP is 10.233.4.2

# nixos-container start flake-test
```

### Use agenix secrets in container

To add `agenix` secrets to a container bind mount the `ssh-host.key` and import the `agenix.nixosModule` and set `age.identityPaths` [Source](https://discourse.nixos.org/t/secrets-inside-nixos-containers/34403/6)

### Bridge together two nixos-containers

**Target:**

Create two containers, both with `privateNetwork = true;`:

- `containerA` at 192.168.100.2
  - which will access `containerB`
- `containerB` at 192.168.100.3
  - which runs an httpd server at <http://localhost:80>

They should be connected with a bridge `br0` and both should have internet address.

Assuming Network Manager is used, so the introduction of `systemd.network` should not interfere with the rest of the setup.

**Configuration:**

Create and configure the internet connection and the bridge:

Create and configure `containerA`:

Create and configure `containerB`:

You can test the connection between `containerA` and `containerB` by loggining into `containerA` and pinging `containerB`, curling to `containerB`'s httpd server or pinging an internet website:

``` console
# nixos-container root-login containerA
[root@containerA:~]# ping 192.168.100.3 -c3       # Ping containerB
[root@containerA:~]# curl http://192.168.100.3:80 # Curl to containerB's httpd server
[root@containerA:~]# ping nixos.org -c3           # Ping an internet website
```

You can test the connection between the host machine and `containerA` or `containerB` by pinging `containerA`, pinging `containerB` and curling to `containerB`'s httpd server:

``` console
$ ping 192.168.100.2 -c3       # Ping containerA
$ ping 192.168.100.3 -c3       # Ping containerB
$ curl http://192.168.100.3:80 # Curl to containerB's httpd server
```

Note that with the command `ip address`, even if the interfaces of the containers are displayed (`vb-containerA` and `vb-containerB`), they only have a MAC address assigned, they do not have a separate ip address displayed. For extra configuring, maybe use the option `containers.`<name>`.extraVeths`.

Made with help of the `systemd.network` wiki page[^1] and this discourse post[^2].

## Troubleshooting

### I have changed the host's channel and some services are no longer functional

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

[^1]: <a href="Systemd/networkd" class="wikilink" title="Systemd/networkd">Systemd/networkd</a>

[^2]: <https://discourse.nixos.org/t/how-to-connect-two-or-more-nixos-containers-together-their-internet-ports/77674/9?u=blastboomstrice>
