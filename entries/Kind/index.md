<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kind -->

[Kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker) is a tool for running local <a href="Kubernetes" class="wikilink" title="Kubernetes">Kubernetes</a> clusters using <a href="Docker" class="wikilink" title="Docker">Docker</a> containers as nodes. It is commonly used for development, testing, and CI environments.

# Installation

Kind is available in nixpkgs:

# Container runtime configuration

Enable <a href="Docker" class="wikilink" title="Docker">Docker</a> in the NixOS Configuration:

Log out and back in for group membership to take effect.

# Managing clusters

To create a default cluster:

``` console
$ kind create cluster
```

This creates a single node Kubernetes cluster running inside a Docker container.

To list existing Kind clusters:

``` console
$ kind get clusters
```

To delete the cluster:

``` console
$ kind delete cluster
```

# See Also

- <a href="Kubernetes" class="wikilink" title="Kubernetes">Kubernetes</a>
- <a href="Docker" class="wikilink" title="Docker">Docker</a>
- <a href="k3s" class="wikilink" title="k3s">k3s</a>

\[\[Category:Container\]

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
