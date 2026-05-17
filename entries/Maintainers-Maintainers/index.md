<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Maintainers:Maintainers -->

\_\_NOTOC\_\_

# Maintainers portal

This page and wiki section is used to maintain shortcuts to useful stuff for maintaining NixOS and helping out.

## PRs

- [Targeting neither master nor staging](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+-base%3Amaster+-base%3Astaging)
- [Targeting staging](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Astaging)
- [Targeting master](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amaster)

### Packages

- [New packages](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amaster+base%3Astaging+%22init+at%22+in%3Atitle+)
- [EXCLUDE new packages](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amaster+base%3Astaging++NOT+%22init+at%22+in%3Atitle+)
- <em>Note that github search cannot work with "-\>". Updates cannot be filtered for or against.</em>

### WIP

- [WIP title without label](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+WIP+in%3Atitle++-label%3A%222.status%3A+work-in-progress%22+)
- [Labeled, but title does not contain WIP](https://github.com/NixOS/nixpkgs/pulls?q=is%3Apr+is%3Aopen+NOT+WIP+in%3Atitle+label%3A%222.status%3A+work-in-progress%22) (Could mean they renamed)
- [NOT WIP](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+NOT+WIP+in%3Atitle+-label%3A%222.status%3A+work-in-progress%22+)

### Stale PRs

- [Newest with stale label](https://github.com/NixOS/nixpkgs/pulls?q=is%3Apr+is%3Aopen+label%3A%222.status%3A+stale%22+sort%3Acreated-desc)
- [Newest before 2024-01-01](https://github.com/NixOS/nixpkgs/pulls?q=is%3Apr+is%3Aopen+created%3A%3C2024-01-01+sort%3Acreated-desc)<sup>Fix the date in the query if needed</sup>

## Issues

- [Least recently updated issues](https://github.com/NixOS/nixpkgs/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-asc)
- [Not labeled by kind](https://github.com/NixOS/nixpkgs/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Aupdated-asc+-label%3A%220.kind%3A+enhancement%22+-label%3A%220.kind%3A+bug%22+-label%3A%220.kind%3A+question%22+-label%3A%220.kind%3A+regression%22)

<hr />

## Helpful links

- <a href="Nixpkgs/Contributing#Building_all_of_the_packages_you_maintain" class="wikilink" title="Build all your packages">Build all your packages</a>

### Backports

- [What to backport?](https://gist.github.com/grahamc/c60578c6e6928043d29a427361634df6#what-to-backport)
- [nixpkgs manual: Cherry-picking](https://nixos.org/manual/nixpkgs/stable/#submitting-changes-stable-release-branches)

## Infrastructure

<a href="Maintainers:Fastly" class="wikilink" title="Notes about the Fastly implementation details">Notes about the Fastly implementation details</a>

<a href="Category:Community" class="wikilink" title="Category:Community">Category:Community</a>
