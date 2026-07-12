<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Docker -->

<languages/> <translate> [Docker](https://www.docker.com/) is a platform for building, packaging, and distributing applications inside containers. Containers bundle an application's code, configurations, and dependencies into a single object that runs consistently across different computing environments. Docker works well with NixOS through the virtualization module.[^1] </translate>

<translate>

## Installation

</translate>

<translate>

#### Shell

</translate>

<translate> To temporarily use Docker in a shell environment, you can run: </translate>

``` bash
nix-shell -p docker
```

<translate> This will provide a shell with Docker CLI available, but note that the Docker daemon will not be running. For full functionality, you'll need a system-level installation. </translate>

<translate>

#### System setup

</translate>

<translate> To install Docker on NixOS, add the virtualization.docker module to your system configuration at `/etc/nixos/configuration.nix`:[^2] (Note that it may take a restart for the group changes to take effect.) </translate>

``` nix
# In /etc/nixos/configuration.nix
virtualisation.docker = {
  enable = true;
};

# Optional: Add your user to the "docker" group to run docker without sudo
users.users.<username>.extraGroups = [ "docker" ];
```

<translate> For a comprehensive list of configuration options, refer to the module options. </translate>

<translate>

## Configuration

</translate>

<translate>

#### Basic

</translate>

<translate> The basic Docker configuration on NixOS includes several options you can set in your `configuration.nix` file: </translate>

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

<translate>

#### Advanced

</translate>

<translate> For more advanced configuration, you can customize Docker daemon options and networking: </translate>

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

<translate>

## Docker Compose

</translate> <translate> Currently, there are two options to use Docker Compose with NixOS: Arion or Compose2Nix. </translate>

<translate> With Arion, you can specify most Docker Compose options in Nix Syntax, and Arion will generate a `docker-compose.yml` file internally. The result is a systemd service that starts and stops the container. </translate>

<translate> Compose2Nix, generates all necessary configs directly from the `docker-compose.yml`, which is easier when using an already existing Docker Compose project. The result is similar to that from Arion: a systemd service is created that handles starting and stopping the container. </translate>

<translate>

### Arion

</translate> <translate> [Arion](https://docs.hercules-ci.com/arion/) is created for running Nix-based projects in Docker Compose. It uses the NixOS module system for configuration, it can bypass `docker build` and lets you use dockerTools or use the store directly in the containers. The images/containers can be typical dockerTools style images or full NixOS configs. </translate>

<translate> To use Arion, you first need to add its module to your NixOS configuration: </translate>

``` nix
modules = [ arion.nixosModules.arion ];
```

<translate> After that, you can access its options under </translate>

``` nix
virtualisation.arion = {}
```

<translate> A config for a simple container could look like this: </translate>

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

<translate>

### Compose2Nix

</translate> <translate> With [compose2nix](https://github.com/aksiksi/compose2nix) you can generate [oci-containers](https://search.nixos.org/options?query=virtualisation.oci-containers) config from a `docker-compose.yaml`. </translate>

<translate>

#### Install

</translate> <translate> To use `compose2nix` with `nix-shell` you can use </translate>

``` bash
nix shell github:aksiksi/compose2nix
compose2nix -h
```

<translate> To install `compose2nix` to NixOS, add the repo to your flake inputs </translate>

``` nix
compose2nix = {
  url = "github:aksiksi/compose2nix";
  inputs.nixpkgs.follows = "nixpkgs";
};
```

<translate> and add the package to your configuration </translate>

``` nix
environment.systemPackages = [
  inputs.compose2nix.packages.x86_64-linux.default
];
```

<translate>

#### Usage

</translate> <translate> After you have installed `compose2nix`, you can run `compose2nix` in the directory with your `docker-compose.yml`, which will output a `docker-compose.nix`. </translate>

<translate> Alternatively, you can specify the input and output files with the following flags </translate>

``` bash
compose2nix -inputs input.yml -output output.nix -runtime docker
```

<translate> The `-runtime` flag specifies the runtime. Here, we select `docker`. Options are `podman` and `docker`. The default is `podman` </translate>

<translate>

## Tips and tricks

</translate>

<translate>

### Docker on btrfs

</translate>

<translate> If you use the <a href="btrfs" class="wikilink" title="btrfs">btrfs</a> file system, you might need to set the option: </translate>

``` nix
virtualisation.docker.storageDriver = "btrfs";
```

<translate>

### Rootless Docker

</translate>

<translate> [Rootless Docker](https://docs.docker.com/engine/security/rootless/) lets you run the Docker daemon as a non-root user for improved security. To do so, enable . This activates the user-level systemd Docker service. Additionally, the option configures the `DOCKER_HOST` environment variable to point to the rootless Docker instance. </translate>

``` nix
virtualisation.docker = {
  # Consider disabling the system wide Docker daemon
  enable = false;

  rootless = {
    enable = true;
    setSocketVariable = true;
    # Optionally customize rootless Docker daemon settings
    daemon.settings = {
      data-root = "~/.local/docker";
      dns = [ "1.1.1.1" "8.8.8.8" ];
      registry-mirrors = [ "https://mirror.gcr.io" ];
    };
  };
};
```

<translate> A system reboot is required for these changes to take effect. Alternatively, the environment variable can be set manually in the current shell session, and the user Docker service can be started with the following commands: </translate>

``` console
$ export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock
$ systemctl --user start docker
```

<translate> To verify the status of the rootless Docker service: </translate>

``` console
$ systemctl --user status docker
```

To confirm that Docker is running in rootless mode:

``` console
$ docker info -f "{{println .SecurityOptions}}" | grep rootless 
```

### Using Privileged Ports for Rootless Docker

Rootless containers are not able to bind ports from 0 to 1023 as such port can only be used by privileged users. This problem can be solved by using port forwarding.

Assume you'd like a rootless container to make use of ports 53 (DNS; TPC and UDP) and 80 (web; TCP). We may force the container to use port 8000 while the firewall is instructed for forward traffic from port 80 to 8000. Same logic applies for port 53. Refer to the following example:

``` nixos
# Firewall
networking.firewall = {
  enable = true;
  allowedTCPPorts = [ 80 8000 53 5300 ];    
  allowedUDPPorts = [ 53 5300 ];
  extraCommands = ''
    iptables -A PREROUTING -t nat -i eth0 -p TCP --dport 80 -j REDIRECT --to-port 8000
    iptables -A PREROUTING -t nat -i eth0 -p TCP --dport 53 -j REDIRECT --to-port 5300
    iptables -A PREROUTING -t nat -i eth0 -p UDP --dport 53 -j REDIRECT --to-port 5300
  '';
};

boot.kernel.sysctl = {
  "net.ipv4.conf.eth0.forwarding" = 1;    # enable port forwarding
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

<translate>

### Creating images with Nix

</translate>

<translate>

#### Building a docker image with nixpkgs

</translate> <translate> There is an entry for [dockerTools](https://nixos.org/nixpkgs/manual/#sec-pkgs-dockerTools) in the Nixpkgs manual for reference. In the linked page, they give the following example config: </translate>

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

<translate> More examples can be found in the [nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/docker/examples.nix) repo. </translate>

<translate> Also check out the excellent article by [lethalman](https://lucabrunox.github.io/2016/04/cheap-docker-images-with-nix_15.html) about building minimal docker images with nix. </translate>

<translate>

#### Reproducible image dates

</translate>

<translate> The manual advises against using `created = "now"`, as that prevents images from being reproducible. </translate>

<translate> An alternative, if using <a href="flakes" class="wikilink" title="flakes">flakes</a>, is to do `created = "@" + builtins.toString self.lastModified`, which uses the commit date, and is therefore reproducible. </translate>

<translate>

#### Calculating the sha256 for a pulled Docker image

</translate>

<translate> The `sha256` argument of the `dockerTools.pullImage` function is the checksum of the archive generated by Skopeo. Since the archive contains the name and the tag of the image, Skopeo arguments used to fetch the image have to be identical to those used by the `dockerTools.pullImage` function. </translate>

<translate> For instance, the SHA of the following image </translate>

``` nix
pkgs.dockerTools.pullImage{
  imageName = "lnl7/nix";
  finalImageTag = "2.0";
  imageDigest = "sha256:632268d5fd9ca87169c65353db99be8b4e2eb41833b626e09688f484222e860f";
  sha256 = "1x00ks05cz89k3wc460i03iyyjr7wlr28krk7znavfy2qx5a0hfd";
};
```

<translate> can be manually generated with the following shell commands </translate>

``` bash
skopeo copy docker://lnl7/nix@sha256:632268d5fd9ca87169c65353db99be8b4e2eb41833b626e09688f484222e860f docker-archive:///tmp/image.tgz:lnl7/nix:2.0
```

``` bash
nix-hash --base32 --flat --type sha256 /tmp/image.tgz 
```

``` shell
1x00ks05cz89k3wc460i03iyyjr7wlr28krk7znavfy2qx5a0hfd
```

<translate>

#### Directly Using Nix in Image Layers

</translate>

<translate> Instead of copying Nix packages into Docker image layers, Docker can be configured to directly utilize the `nix-store` by integrating with [nix-snapshotter](https://github.com/pdtpartners/nix-snapshotter). </translate>

<translate> This will significantly reduce data duplication and the time it takes to pull images. </translate>

<translate>

### Using Podman as an alternative

</translate>

<translate> Podman is a daemonless container engine that can run Docker containers without elevated privileges. It can be used as a drop-in replacement for Docker in many cases: </translate>

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

<translate>

### Changing Docker Daemon's Data Root

</translate>

<translate> By default, the Docker daemon stores images, containers, and build context on the root file system. To use a different storage location, specify a new `data-root` in your configuration: </translate>

``` nix
virtualisation.docker.daemon.settings = {
  data-root = "/some-place/to-store-the-docker-data";
};
```

<translate>

### Docker Containers as systemd Services

</translate>

<translate> You can run Docker containers as systemd services using the `oci-containers` module: </translate>

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

<translate> A more advanced example: </translate>

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

<translate> See [oci-containers](https://search.nixos.org/options?from=0&size=50&sort=alpha_asc&query=virtualisation.oci-containers) for further options. </translate>

<translate>

#### Usage

</translate> <translate> Unless otherwise specified, NixOS uses Podman to run OCI containers. Note that these are **user-specific**, so running commands with or without sudo can change your output. </translate>

<translate> List containers </translate>

``` console
# podman ps
```

<translate> Update image </translate>

``` console
# podman restart hackagecompare
```

<translate> List images </translate>

``` console
# podman ls
```

<translate> Remove container </translate>

``` console
# podman rm hackagecompare
```

<translate> Remove image </translate>

``` console
# podman rmi c0d9a5f58afe
```

<translate> Update image </translate>

``` console
# podman pull chrissound/hackagecomparestats-webserver:latest
```

<translate> Run interactive shell in running container </translate>

``` console
# podman exec -ti $ContainerId /bin/sh
```

<translate>

##### Exposing ports from the host

</translate> <translate> If you have a service running on the host that you want to connect to from the container, you could try connecting to the hostname `host.containers.internal` (or `host.docker.internal` for podman), but this might require additional networking setup </translate>

<translate>

##### Exposing sockets from the host

</translate> <translate> If you have a service running on the host that exposes a socket, such as mariadb, you can also expose that socket to the container instead. You'll want to expose the folder the socket is in as a volume - so: </translate>

``` bash
      volumes = [
        "/var/run/mysqld:/mysqld"
      ];
```

<translate> to provide access to `/var/run/mysqld/mysqld.sock`. Sadly, this means you'll have to restart the container when /var/run/mysqld is replaced, e.g. on an upgrade.

</translate>

<translate>

### Running the docker daemon from nix-the-package-manager - not NixOS

</translate>

<translate> This is not supported. You're better off installing the docker daemon ["the normal non-nix way"](https://docs.docker.com/engine/install/). </translate>

<translate> See the discourse discussion: [How to run docker daemon from nix (not NixOS)](https://discourse.nixos.org/t/how-to-run-docker-daemon-from-nix-not-nixos/43413) for more. </translate>

<translate>

## Troubleshooting

</translate>

<translate>

### Cannot connect to the Docker daemon

</translate>

<translate> If you encounter errors connecting to the Docker daemon, check that: </translate> <translate> - The Docker service is running: `systemctl status docker` </translate> <translate> - Your user is in the docker <a href="User_management#Adding_User_to_a_group" class="wikilink" title="group">group</a>: `groups | grep docker` </translate> <translate> - You've logged out and back in after adding your user to the docker group </translate>

<translate>

### Storage space issues

</translate>

<translate> When Docker uses too much disk space: </translate>

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

<translate>

### Network conflicts

</translate>

<translate> Docker's default subnet (\`172.17.0.0/16\`) might conflict with your existing network. Configure a different subnet in your \`configuration.nix\`: </translate>

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

<translate>

### Cannot connect to public Wi-Fi, when using Docker

</translate>

<translate> When connecting to a public Wi-Fi, where the login page's IP-Address is within the Docker network range, accessing the Internet might not be possible. This has been reported when trying to connect to the WIFIonICE of the Deutsche Bahn (DB). They use the `172.18.x.x` address range. </translate>

<translate> This can be resolved by changing the default address pool that Docker uses. </translate>

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

<translate> Restarting the container or Docker might be required. </translate>

### NVIDIA Docker Containers

If attempting to pass your nvidia gpu through to docker container(s), you will need to install `nvidia-container-toolkit` and enable cdi.

You may also need to adjust your docker compose file to use cdi instead of the nvidia driver.

<translate>

## References

</translate>

<references/>

## See also

- [Run and Auto-Update Docker Containers on NixOS, Nixcademy](https://nixcademy.com/posts/auto-update-containers/)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>

[^1]: <https://www.docker.com/resources/what-container/>

[^2]: <https://nixos.org/manual/nixos/stable/options#opt-virtualisation.docker.enable>
