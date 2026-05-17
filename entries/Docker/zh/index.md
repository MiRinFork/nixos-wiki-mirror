<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Docker/zh -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

[Docker](https://www.docker.com/) is a platform for building, packaging, and distributing applications inside containers. Containers bundle an application's code, configurations, and dependencies into a single object that runs consistently across different computing environments. Docker works well with NixOS through the virtualization module.[^1]

</div>

<span id="Installation"></span>

## 安装

#### Shell

<div lang="en" dir="ltr" class="mw-content-ltr">

To temporarily use Docker in a shell environment, you can run:

</div>

``` bash
nix-shell -p docker
```

<div lang="en" dir="ltr" class="mw-content-ltr">

This will provide a shell with Docker CLI available, but note that the Docker daemon will not be running. For full functionality, you'll need a system-level installation.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### System setup

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To install Docker on NixOS, add the virtualization.docker module to your system configuration at `/etc/nixos/configuration.nix`:[^2]

</div>

``` nix
# In /etc/nixos/configuration.nix
virtualisation.docker = {
  enable = true;
};

# Optional: Add your user to the "docker" group to run docker without sudo
users.users.<username>.extraGroups = [ "docker" ];
```

<div lang="en" dir="ltr" class="mw-content-ltr">

For a comprehensive list of configuration options, refer to the module options.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Configuration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Basic

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The basic Docker configuration on NixOS includes several options you can set in your `configuration.nix` file:

</div>

``` nix
virtualisation.docker = {
  enable = true;
  # Set up resource limits
  daemon.settings = {
    experimental = true;
    default-address-pools = [
      {
        base = "172.30.0.0/16";
        size = 24;
      }
    ];
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Advanced

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For more advanced configuration, you can customize Docker daemon options and networking:

</div>

``` nix
virtualisation.docker = {
  enable = true;
  # Customize Docker daemon settings using the daemon.settings option
  daemon.settings = {
    dns = [ "1.1.1.1" "8.8.8.8" ];
    log-driver = "journald";
    registry-mirrors = [ "https://mirror.gcr.io" ];
    storage-driver = "overlay2";
  };
  # Use the rootless mode - run Docker daemon as non-root user
  rootless = {
    enable = true;
    setSocketVariable = true;
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

## Docker Compose

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Currently, there are two options to use Docker Compose with NixOS: Arion or Compose2Nix.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

With Arion, you can specify most Docker Compose options in Nix Syntax, and Arion will generate a `docker-compose.yml` file internally. The result is a systemd service that starts and stops the container.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Compose2Nix, generates all necessary configs directly from the `docker-compose.yml`, which is easier when using an already existing Docker Compose project. The result is similar to that from Arion: a systemd service is created that handles starting and stopping the container.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Arion

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

[Arion](https://docs.hercules-ci.com/arion/) is created for running Nix-based projects in Docker Compose. It uses the NixOS module system for configuration, it can bypass `docker build` and lets you use dockerTools or use the store directly in the containers. The images/containers can be typical dockerTools style images or full NixOS configs.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To use Arion, you first need to add its module to your NixOS configuration:

</div>

``` nix
modules = [ arion.nixosModules.arion ];
```

<div lang="en" dir="ltr" class="mw-content-ltr">

After that, you can access its options under

</div>

``` nix
virtualisation.arion = {}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

A config for a simple container could look like this:

</div>

``` nix
virtualisation.arion = {
  backend = "docker";
  projects = {
    "db".settings.services."db".service = {
      image = "";
      restart = "unless-stopped";
      environment = { POSTGRESS_PASSWORD = "password"; };
    };
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Compose2Nix

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

With [compose2nix](https://github.com/aksiksi/compose2nix) you can generate [oci-containers](https://search.nixos.org/options?query=virtualisation.oci-containers) config from a `docker-compose.yaml`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Install

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To use `compose2nix` with `nix-shell` you can use

</div>

``` bash
nix shell github:aksiksi/compose2nix
compose2nix -h
```

<div lang="en" dir="ltr" class="mw-content-ltr">

To install `compose2nix` to NixOS, add the repo to your flake inputs

</div>

``` nix
compose2nix = {
  url = "github:aksiksi/compose2nix";
  inputs.nixpkgs.follows = "nixpkgs";
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

and add the package to your configuration

</div>

``` nix
environment.systemPackages = [
  inputs.compose2nix.packages.x86_64-linux.default
];
```

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Usage

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

After you have installed `compose2nix`, you can run `compose2nix` in the directory with your `docker-compose.yml`, which will output a `docker-compose.nix`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Alternatively, you can specify the input and output files with the following flags

</div>

``` bash
compose2nix -inputs input.yml -output output.nix -runtime docker
```

<div lang="en" dir="ltr" class="mw-content-ltr">

The `-runtime` flag specifies the runtime. Here, we select `docker`. Options are `podman` and `docker`. The default is `podman`

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Tips and tricks

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Docker on btrfs

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you use the <a href="btrfs" class="wikilink" title="btrfs">btrfs</a> file system, you might need to set the option:

</div>

``` nix
virtualisation.docker.storageDriver = "btrfs";
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Rootless Docker

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

[Rootless Docker](https://docs.docker.com/engine/security/rootless/) lets you run the Docker daemon as a non-root user for improved security. To do so, enable . This activates the user-level systemd Docker service. Additionally, the option configures the `DOCKER_HOST` environment variable to point to the rootless Docker instance.

</div>

``` nix
virtualisation.docker = {
  # Consider disabling the system wide Docker daemon
  enable = false;

  rootless = {
    enable = true;
    setSocketVariable = true;
    # Optionally customize rootless Docker daemon settings
    daemon.settings = {
      dns = [ "1.1.1.1" "8.8.8.8" ];
      registry-mirrors = [ "https://mirror.gcr.io" ];
    };
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

A system reboot is required for these changes to take effect. Alternatively, the environment variable can be set manually in the current shell session, and the user Docker service can be started with the following commands:

</div>

``` console
$ export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock
$ systemctl --user start docker
```

<div lang="en" dir="ltr" class="mw-content-ltr">

To verify the status of the rootless Docker service:

</div>

``` console
$ systemctl --user status docker
```

To confirm that Docker is running in rootless mode:

``` console
$ docker info -f "{{println .SecurityOptions}}" | grep rootless 
```

### Using Privileged Ports for Rootless Docker

Rootless containers are not able to ports from 0 to 1023 as such port can only be used by privileged users. This problem can be solved by using port forwarding.

Assume you'd like a rootless container to make use of ports 53 (DNS; TPC and UDP) and 80 (web; TCP). We may force the container to use port 8000 while the firewall is instructed for forward traffic from port 80 to 8000. Same logic applies for port 53. Refer to the following example:

``` nixos
# Firewall
networking.firewall = {
  enable = true;
  allowedTCPPorts = [ 80 8000 53 5300 ];    
  allowedUDPPorts = [ 53 5300 ];
};

boot.kernel.sysctl = {
  "net.ipv4.conf.eth0.forwarding" = 1;    # enable port forwarding
};
    
networking = {
  firewall.extraCommands = ''
    iptables -A PREROUTING -t nat -i eth0 -p TCP --dport 80 -j REDIRECT --to-port 8000
    iptables -A PREROUTING -t nat -i eth0 -p TCP --dport 53 -j REDIRECT --to-port 5300
    iptables -A PREROUTING -t nat -i eth0 -p UDP --dport 53 -j REDIRECT --to-port 5300
  '';
};
```

Whilst the docker-compose.yaml might look like this:

``` dockerfile
services:
  myserver:
    image: ...
    restart: always
    ports:
      - "5300:53/tcp"
      - "5300:53/udp"
      - "8000:80"
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Creating images with Nix

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Building a docker image with nixpkgs

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

There is an entry for [dockerTools](https://nixos.org/nixpkgs/manual/#sec-pkgs-dockerTools) in the Nixpkgs manual for reference. In the linked page, they give the following example config:

</div>

``` nix
buildImage {
  name = "redis";
  tag = "latest";

  fromImage = someBaseImage;
  fromImageName = null;
  fromImageTag = "latest";

  copyToRoot = pkgs.buildEnv {
    name = "image-root";
    paths = [ pkgs.redis ];
    pathsToLink = [ "/bin" ];
  };

  runAsRoot = ''
    #!${pkgs.runtimeShell}
    mkdir -p /data
  '';

  config = {
    Cmd = [ "/bin/redis-server" ];
    WorkingDir = "/data";
    Volumes = { "/data" = { }; };
  };

  diskSize = 1024;
  buildVMMemorySize = 512;
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

More examples can be found in the [nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/docker/examples.nix) repo.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Also check out the excellent article by [lethalman](https://lucabrunox.github.io/2016/04/cheap-docker-images-with-nix_15.html) about building minimal docker images with nix.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Reproducible image dates

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The manual advises against using `created = "now"`, as that prevents images from being reproducible.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

An alternative, if using <a href="flakes" class="wikilink" title="flakes">flakes</a>, is to do `created = builtins.substring 0 8 self.lastModifiedDate`, which uses the commit date, and is therefore reproducible.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Calculating the sha256 for a pulled Docker image

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The `sha256` argument of the `dockerTools.pullImage` function is the checksum of the archive generated by Skopeo. Since the archive contains the name and the tag of the image, Skopeo arguments used to fetch the image have to be identical to those used by the `dockerTools.pullImage` function.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For instance, the SHA of the following image

</div>

``` nix
pkgs.dockerTools.pullImage{
  imageName = "lnl7/nix";
  finalImageTag = "2.0";
  imageDigest = "sha256:632268d5fd9ca87169c65353db99be8b4e2eb41833b626e09688f484222e860f";
  sha256 = "1x00ks05cz89k3wc460i03iyyjr7wlr28krk7znavfy2qx5a0hfd";
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

can be manually generated with the following shell commands

</div>

``` bash
skopeo copy docker://lnl7/nix@sha256:632268d5fd9ca87169c65353db99be8b4e2eb41833b626e09688f484222e860f docker-archive:///tmp/image.tgz:lnl7/nix:2.0
```

``` bash
nix-hash --base32 --flat --type sha256 /tmp/image.tgz 
```

``` shell
1x00ks05cz89k3wc460i03iyyjr7wlr28krk7znavfy2qx5a0hfd
```

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Directly Using Nix in Image Layers

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Instead of copying Nix packages into Docker image layers, Docker can be configured to directly utilize the `nix-store` by integrating with [nix-snapshotter](https://github.com/pdtpartners/nix-snapshotter).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This will significantly reduce data duplication and the time it takes to pull images.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Using Podman as an alternative

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Podman is a daemonless container engine that can run Docker containers without elevated privileges. It can be used as a drop-in replacement for Docker in many cases:

</div>

``` nix
# Enable Podman in configuration.nix
virtualisation.podman = {
  enable = true;
  # Create the default bridge network for podman
  defaultNetwork.settings.dns_enabled = true;
};

# Optionally, create a Docker compatibility alias
programs.zsh.shellAliases = {
  docker = "podman";
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Changing Docker Daemon's Data Root

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

By default, the Docker daemon stores images, containers, and build context on the root file system. To use a different storage location, specify a new `data-root` in your configuration:

</div>

``` nix
virtualisation.docker.daemon.settings = {
  data-root = "/some-place/to-store-the-docker-data";
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Docker Containers as systemd Services

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You can run Docker containers as systemd services using the `oci-containers` module:

</div>

``` nix
virtualisation.oci-containers = {
  # backend defaults to "podman"
  backend = "docker";
  containers = {
    foo = {
      # ...
    };
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

A more advanced example:

</div>

``` nix
{ config, pkgs, ... }:

{
  config.virtualisation.oci-containers.containers = {
    hackagecompare = {
      image = "chrissound/hackagecomparestats-webserver:latest";
      ports = ["127.0.0.1:3010:3010"];
      volumes = [
        "/root/hackagecompare/packageStatistics.json:/root/hackagecompare/packageStatistics.json"
      ];
      cmd = [
        "--base-url"
        "\"/hackagecompare\""
      ];
    };
  };
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

See [oci-containers](https://search.nixos.org/options?from=0&size=50&sort=alpha_asc&query=virtualisation.oci-containers) for further options.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Usage

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Unless otherwise specified, NixOS uses Podman to run OCI containers. Note that these are **user-specific**, so running commands with or without sudo can change your output.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

List containers

</div>

``` console
# podman ps
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Update image

</div>

``` console
# podman restart hackagecompare
```

<div lang="en" dir="ltr" class="mw-content-ltr">

List images

</div>

``` console
# podman ls
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Remove container

</div>

``` console
# podman rm hackagecompare
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Remove image

</div>

``` console
# podman rmi c0d9a5f58afe
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Update image

</div>

``` console
# podman pull chrissound/hackagecomparestats-webserver:latest
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Run interactive shell in running container

</div>

``` console
# podman exec -ti $ContainerId /bin/sh
```

<div lang="en" dir="ltr" class="mw-content-ltr">

##### Exposing ports from the host

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you have a service running on the host that you want to connect to from the container, you could try connecting to the hostname `host.containers.internal` (or `host.docker.internal` for podman), but this might require additional networking setup

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

##### Exposing sockets from the host

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you have a service running on the host that exposes a socket, such as mariadb, you can also expose that socket to the container instead. You'll want to expose the folder the socket is in as a volume - so:

</div>

``` bash
      volumes = [
        "/var/run/mysqld:/mysqld"
      ];
```

<div lang="en" dir="ltr" class="mw-content-ltr">

to provide access to `/var/run/mysqld/mysqld.sock`. Sadly, this means you'll have to restart the container when /var/run/mysqld is replaced, e.g. on an upgrade.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Running the docker daemon from nix-the-package-manager - not NixOS

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This is not supported. You're better off installing the docker daemon ["the normal non-nix way"](https://docs.docker.com/engine/install/).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

See the discourse discussion: [How to run docker daemon from nix (not NixOS)](https://discourse.nixos.org/t/how-to-run-docker-daemon-from-nix-not-nixos/43413) for more.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Troubleshooting

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Cannot connect to the Docker daemon

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you encounter errors connecting to the Docker daemon, check that:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

\- The Docker service is running: `systemctl status docker`

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

\- Your user is in the docker <a href="User_management#Adding_User_to_a_group" class="wikilink" title="group">group</a>: `groups | grep docker`

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

\- You've logged out and back in after adding your user to the docker group

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Storage space issues

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

When Docker uses too much disk space:

</div>

``` bash
# Remove unused containers, networks, images, and volumes
docker system prune -a --volumes

# Configure Docker daemon to automatically prune in configuration.nix
virtualisation.docker.daemon.settings = {
  pruning = {
    enabled = true;
    interval = "24h";
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Network conflicts

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Docker's default subnet (\`172.17.0.0/16\`) might conflict with your existing network. Configure a different subnet in your \`configuration.nix\`:

</div>

``` nix
virtualisation.docker.daemon.settings = {
  default-address-pools = [
    {
      base = "192.168.0.0/16";
      size = 24;
    }
  ];
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Cannot connect to public Wi-Fi, when using Docker

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

When connecting to a public Wi-Fi, where the login page's IP-Address is within the Docker network range, accessing the Internet might not be possible. This has been reported when trying to connect to the WIFIonICE of the Deutsche Bahn (DB). They use the `172.18.x.x` address range.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This can be resolved by changing the default address pool that Docker uses.

</div>

``` nix
virtualisation.docker = {
  enable = true;
  daemon.settings = {
    "default-address-pools" = [
      { "base" = "172.27.0.0/16"; "size" = 24; }
    ];
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Restarting the container or Docker might be required.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## References

</div>

<references/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>

[^1]: <https://www.docker.com/resources/what-container/>

[^2]: <https://nixos.org/manual/nixos/stable/options#opt-virtualisation.docker.enable>
