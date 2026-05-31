<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Channel branches -->

Nix channels provide a structured and reliable way to access package collections and <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> configurations from the <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> repository. Unlike directly accessing the frequently updated `master` branch of Nixpkgs which receives new commits before extensive testing, a channel branch is a curated, tested snapshot of Nixpkgs. These branches only advance after builds and tests for a given commit have successfully passed on the <a href="Hydra" class="wikilink" title="Hydra">Hydra</a> continuous integration system and are made available via [channels.nixos.org](https://channels.nixos.org).

Each channel branch follows a corresponding development branch to which new commits are first added. These new commits are then "verified" using the <a href="Hydra" class="wikilink" title="Hydra">Hydra</a> continuous integration system, where each channel branch corresponds to building any new or updated packages for that branch and perform the associated tests. A channel branch is updated once its builds succeeds for a new commit. Contrary to users of the development branches, channel branch users will benefit from both "verified" commits and pre-built packages from the [official public binary cache](https://cache.nixos.org).

## The official channels

There are several types of channel branches, each with its own use case and verification phase. Channels can be broadly categorized into *stable* and *unstable* channels, and *large* and *small* channels. To view the current official channels, see the [channel status webpage](https://status.nixos.org).

- Stable vs unstable:
  - **Stable channels** (e.g. `nixos-26.05`) only provide conservative updates for fixing bugs and security vulnerabilities, but do not receive major updates after the initial release. New stable channels are released every six months.
  - **Unstable channels** (e.g. `nixos-unstable`, `nixpkgs-unstable`) follow the `master` branch of Nixpkgs, delivering the latest tested updates on a rolling basis.

<!-- -->

- Large vs small:
  - **Large channels** (e.g. `nixos-26.05`, `nixos-unstable`) are updated only after Hydra has finished building the full breadth of Nixpkgs.
  - **Small channels** (e.g. `nixos-26.05-small`, `nixos-unstable-small`) are identical to large channels, but are updated as soon as Hydra has finished building a defined set of commonly-used packages. Thus, users following these channels will get faster updates but may need to build any packages they use from outside the defined set themselves. These channels are intended to be used for server setups, for example.

For most users, a stable/large channel is recommended.

## The nix-channel command

Nix channels are maintained separately for each user account, including the root user. Each user, including root, has their own list of subscribed channels and local copies of those channel definitions. In NixOS, the channels configured for root control system-level operations such as nixos-rebuild, while channels for other users only affect their personal environments and package installations through tools like nix-env or nix-shell. If you wish to change the channel used by the system-level configuration (`/etc/nixos/configuration.nix`), ensure you run the correct `nix-channel` command as root:

|  |  |
|----|----|
| Listing current channels | `nix-channel --list` |
| Adding a primary channel | `nix-channel --add https://channels.nixos.org/channel-name nixos` |
| Adding other channels | `nix-channel --add https://some.channel/url my-alias` |
| Remove a channel | `nix-channel --remove channel-alias` |
| Updating a channel | `nix-channel --update channel-alias` |
| Updating all channels | `nix-channel --update` |
| Rollback the last update (useful if the last update breaks the `nixos-rebuild`) | `nix-channel --rollback` |

Common nix-channel commands

## Channel usage in NixOS

Note that updating channels won't cause a rebuild in itself; if you want to update channels and rebuild, you can run `nixos-rebuild --upgrade switch` to do both in one step. See <a href="Updating_NixOS" class="wikilink" title="Updating NixOS">Updating NixOS</a> for more in-depth information on changing/updating channels in NixOS.

## Using channel branches with flakes

Although <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> do not make use of traditional Nix channels, they can still reference the same channel branches by specifying them in the flake’s inputs. These branches, such as `nixos-26.05` or `nixos-unstable`, correspond to named references within the Nixpkgs repository and serve a similar role in selecting which version of Nixpkgs or other inputs to use.

A simple example of defining channel branches in a flake:

In this way, flakes offer fine-grained, declarative control over which versions of inputs are used, while no longer depending on the global Nix channel system.

## Internal channel update process

This section details the inner workings of how channels get generated from the Nixpkgs repository into channel branches. The channel update process begins when anyone with commit access pushes changes to either `master` or one of the `release-XX.XX` branches.

### Hydra Build

Then, for each **unstable** channel (see above), a particular job at [hydra.nixos.org](https://hydra.nixos.org) is started which must succeed:

- For NixOS: the [nixos/unstable/tested](http://hydra.nixos.org/job/nixos/unstable/tested) job, which includes some automated NixOS tests.
- For nixos-small: the [nixos/unstable-small/tested](http://hydra.nixos.org/job/nixos/unstable-small/tested) job.
- For nixpkgs: the [nixpkgs/unstable/unstable](http://hydra.nixos.org/job/nixpkgs/unstable/unstable) job, which contains some critical release packages.

### Success Conditions

For a channel update to succeed, two conditions need to be satisfied:

- Particular jobset evaluation needs to be completely built ie. no more queued jobs, even if some jobs may fail
- Particular jobset evaluation's tested/unstable job needs to be built succesfully

The nixos.org server has a cronjob for which [nixos-channel-scripts](https://github.com/nixOS/nixos-channel-scripts) are executed and poll for the newest jobset that satisfies the above two conditions and trigger a channel update.

### Channel Update

Once the job succeeds at a particular nixpkgs commit, cache.nixos.org will download binaries from [hydra.nixos.org](https://hydra.nixos.org). When the download completes, the channel updates.

For the `NixOS` channel command-not-found index is generated, which can take some time since it has to fetch all packages. `nixpkgs` is quickly updated since none of the above needs to happen once a channel update is triggered.

Updates for the -unstable channels typically take a few days after commits land in the master branch.

To find out when a channel was last updated, check [<https://status.nixos.org/>](https://status.nixos.org/). The progress of a particular pull request can be tracked via the (third-party) [Nixpkgs Pull Request Tracker](https://nixpk.gs/pr-tracker.html).

### Check build status

[hydra-check](https://github.com/nix-community/hydra-check)

``` sh
$ hydra-check --channel unstable bash
Build Status for nixpkgs.bash.x86_64-linux on unstable
✔ bash-4.4-p23 from 2021-05-23 - https://hydra.nixos.org/build/143785213
```

also useful for finding build logs

## Tips and tricks

### When unstable lags behind master

As <https://status.nixos.org> shows, a downside of nixos-unstable is that when the channel is blocked due to hydra failures, other (security) fixes will also not get in. While of course we try to keep hydra green, it is expected that this happens every once in a while. When you want to upgrade or downgrade a single package while leaving the rest of your system on nixos-unstable, you could use <a href="User:Raboof#using_a_fork_of_a_packaged_project" class="wikilink" title="this approach">this approach</a>.

## See also

- <a href="Updating_NixOS" class="wikilink" title="Updating NixOS">Updating NixOS</a> - For changing branches in NixOS
- <a href="Binary_Cache" class="wikilink" title="Binary Cache">Binary Cache</a>
- [nix.dev](https://nix.dev/concepts/faq#which-channel-branch-should-i-use) FAQ: Which channel branch should I use?
- [It's not about “Flakes vs. Channels”](https://samuel.dionne-riel.com/blog/2024/05/07/its-not-flakes-vs-channels.html) by samueldr

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Hydra" class="wikilink" title="Category:Hydra">Category:Hydra</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
