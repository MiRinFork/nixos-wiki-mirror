<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Krops -->

krops is a lightweight toolkit to deploy NixOS systems, remotely or locally.

### How it works

krops does not deploy systems by itself, it is not a conventional deployment tool. It is a tool to generate scripts which then are able to deploy a system, so it can be thought of as a framework for deploying systems.

A <a href="Overview_of_the_NixOS_Linux_distribution" class="wikilink" title="declarative configuration">declarative configuration</a> can be deployed via krops without modification, only requirement is that the system that is deployed is accessible via a ssh `root` login.

The [in-depth example](https://tech.ingolf-wagner.de/nixos/krops/) by Ingolf Wagner shows how to configure krops for deploying one or multiple remote systems.

# Links

- [Original repo](https://cgit.krebsco.de/krops/about/)
- [Github](https://github.com/krebs/krops/)
- [In-depth example by Ingolf Wagner](https://tech.ingolf-wagner.de/nixos/krops/)

<a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
