<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Container workgroup -->

We are interested in directly building (minimal) OCI containers from the nixpkgs ecosystem.

## People

- <a href="User:Profpatsch" class="wikilink" title="Profpatsch">Profpatsch</a>
- <a href="User:nlewo" class="wikilink" title="Lewo">Lewo</a>
- <a href="User:moretea" class="wikilink" title="MoreTea">MoreTea</a>

## Tooling

- [opencontainers.org](https://www.opencontainers.org/)
  - [runc](https://github.com/opencontainers/runc): spawn and run OCI containers (nixpkgs: [runc](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/virtualization/runc/default.nix))
  - [image-spec](https://github.com/opencontainers/image-spec): container image specification
  - [runtime-spec](https://github.com/opencontainers/runtime-spec): container runtime specification
  - [image-tools](https://github.com/opencontainers/image-tools): tools for working with the image-spec
  - [runtime-tools](https://github.com/opencontainers/runtime-tools): tools for working with the runtime-spec
  - [umoci](https://github.com/openSUSE/umoci): intends to be a complete manipulation tool for OCI images with a rootless mode
- [projectatomic.io](https://www.projectatomic.io/)
  - [skopeo](https://github.com/projectatomic/skopeo): modify and inspect images on registries (nixpkgs: [skopeo](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/skopeo/default.nix))
  - [buildah](https://github.com/projectatomic/buildah): build/generate OCI images (nixpkgs: [buildah](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/buildah/default.nix))
- [containers Github project](https://github.com/containers): golang libraries for interacting with containers
  - [image](https://github.com/containers/image): library used by skopeo
  - [oci-fetch](https://github.com/containers/oci-fetch): CLI tool for fetching OCI containers over various transports
- awakesecurity
  - [hocker](https://github.com/awakesecurity/hocker): fetch from docker (v2) registry and generate nix derivations

## Nix images

There are a few images that contain Nix with various trade-offs:

- [nixos/nix](https://hub.docker.com/r/nixos/nix/) ([source](https://github.com/NixOS/nix/blob/master/docker.nix)) - 200 MB - Official images based on `pkgs.dockerTools`, updated automatically.
- [u/nixpkgs](https://hub.docker.com/u/nixpkgs) - ([source](https://github.com/nix-community/docker-nixpkgs)) - [various](https://github.com/nix-community/docker-nixpkgs#list-of-images) docker images from nixpkgs, updated daily.
- [lnl7/nix/](https://hub.docker.com/r/lnl7/nix/) ([source](https://github.com/LnL7/nix-docker)) - 57 MB - Images built out of a Nix derivation.

## Interesting threads

- <https://github.com/projectatomic/buildah/issues/386>: about rootless support

## Work In Progress

- Improve image storage in the Nix store

<https://github.com/projectatomic/skopeo/issues/481>

## Projects

### Self-Hosted, Minimal Docker/OSI Images

For our platform at [Techcultivation](https://techcultivation.org/) we want to generate docker images for all parts of our system. Those images should come in two flavors, development (to quickly spin up local test services, with mock data) and deployment (secure/production-ready). We chose to generate these images purely out of nixpkgs code, so no binary (base) images have to be included.

The current version of the deployment code can be found [on our Gitlab](https://gitlab.techcultivation.org/sangha/sangha-deployment).

A basic (pretty messy) [postgres](https://gitlab.techcultivation.org/sangha/sangha-deployment/blob/2f3877e71ea7a9a2c3cf03d4fc88931b90cad6b7/containers/postgres.nix) image is already done, complete with in-build setup of a mock database. The resulting image is smaller than the “official” one in the docker registry, only uses nixpkgs-native dependencies and only contains the most minimal filetree needed to run the postgres binary.

Still to do: [rabbitmq](https://gitlab.techcultivation.org/sangha/sangha-deployment/blob/master/containers/rabbitmq.nix), frontend code, api, refactor, various others.

— <a href="User:Profpatsch" class="wikilink" title="Profpatsch">Profpatsch</a> (<a href="User_talk:Profpatsch" class="wikilink" title="talk">talk</a>) 02:47, 10 February 2018 (UTC)

<a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>
