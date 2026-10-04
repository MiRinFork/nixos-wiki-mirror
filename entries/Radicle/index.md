<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Radicle -->

[Radicle](https://radicle.dev) is a distributed code repository with support for Git. Repositories can be shared between several nodes in a P2P network, ensuring availability even one or more nodes go offline.

### Setup

A minimal node can be setup with the following configuration snippet. It will use the name `localhost` and the control api endpoint will listen on <http://0.0.0.0:8080>.

``` nix
services.radicle = {
  enable = true;
  httpd = {
    enable = true;
    listenAddress = "0.0.0.0";
    listenPort = 8080;
  };
  publicKey = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOeF3XkiZrxJAWYBih2KPUdy01hO5raRX+fqbhJwsj/n";
  node.openFirewall = true;
  settings = {
    preferredSeeds = [ ];
    node = {
      alias = "localhost";
      relay = "always";
      seedingPolicy = {
        default = "allow";
        scope = "all";
      };
    };
  };
};
```

The public key needs to get generated using following command

``` bash
nix run nixpkgs#radicle-node -- auth
```

### Configuration

To share a specific repository, for example an unoffical nixpkgs one, add it to the `node.seedingPolicy` section.

``` nix
services.radicle = {
  settings = {
    seedingPolicy = {
      repositories."rad:z3StaJpzQNGhhkPfhCtRxSmNZZpu9" = "all";
    };
  };
};
```
