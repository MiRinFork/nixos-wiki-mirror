<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Searching packages -->

There are numerous approaches available for searching substrings within both package names and package descriptions in `nixpkgs`.

## Using `search.nixos.org` website

There is a web service to search with

  
<a href="channel_branches" class="wikilink" title="channel branches">channel branches</a>

- Nix packages at [search.nixos.org/packages](https://search.nixos.org/packages)
- NixOS options at [search.nixos.org/options](https://search.nixos.org/options)

<a href="flakes" class="wikilink" title="flakes">flakes</a>

- packages at [search.nixos.org/flakes?type=packages](https://search.nixos.org/flakes?type=packages)
- options at [search.nixos.org/flakes?type=options](https://search.nixos.org/flakes?type=options)

<!-- -->

pros  

- easy to use
- allows filters
- nice GUI in browser
- browser extensions possible (like @nixpkgs as search engine in Firefox)

cons  

- always requires Internet connection

If you'd like to search with this web service from the command line, you may use [peterldowns/nix-search-cli](https://github.com/peterldowns/nix-search-cli). It provides exactly the same search experience by default.

## Other online sites for searching

These are another possible places to search

- [github.com](https://github.com/search?q=language%3ANix+&type=code) - search for regex/strings in nixpkgs, home-manager, nix-darwin and any other public github repos.
- [mynixos.com](https://mynixos.com) - search for packages in nixpkgs, also nixos, home-manager, nix-darwin options. Not foss and unofficial.
- [home-manager-options.extranix.com](https://home-manager-options.extranix.com) - search for home-manager options. [foss](https://github.com/mipmip/home-manager-option-search)

## Using the `nix search` command

While this command requires <a href="flakes" class="wikilink" title="flakes">flakes</a>, you can use it to search for a package. It may be slow the first time, but further runs will use cached results.

``` bash
nix search nixpkgs firefox
```

pros  

- fast
- possible offline usage

cons  

- requires disk space for caching
- quite long command

There are third party tools that allow searching for packages similarly to `nix search`, namely:

- [diamondburned/nix-search](https://github.com/diamondburned/nix-search): A faster and channel-compatible `nix search` using only stable Nix tools (no <a href="flakes" class="wikilink" title="flakes">flakes</a> required) which creates a local database with a package index.

## Using the `nix-env` command

It's possible to search for a package using `nix-env -qaP`

pros  

- works offline

cons  

- it's very slow and requires a lot of memory

## Using the `nps` command

`nps` caches entire `nix search nixpkgs ^` and `nix-env -qaP --description` results locally and queries the cache.

``` bash
nps firefox
```

pros  

- works offline
- very fast
- easy syntax
- output sorted by relevance

cons  

- [third party program](https://github.com/OleMussmann/nps/blob/main/README.md)
- [cache needs regular refreshing (automatable)](https://github.com/OleMussmann/nps/blob/main/README.md#automatic-cache-refresh-optional-recommended-)

## Using the `nix repl` environment

With the read–eval–print loop (REPL) of nix you can browse packages interactively.

Starting the [nix repl](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-repl.html)

``` bash
nix repl
```

``` console
Welcome to Nix 2.18.2. Type :? for help.

nix-repl> 
```

Loading the repository for nixpkgs

``` console
nix-repl>
```

``` bash
nix-repl> :load <nixpkgs>
Added 21181 variables.
```

Type the first letters of a package

``` bash
nix-repl> neo  
```

Press `Tab ↹` key for auto completion

## Reverse search: searching which package provides a file

There are third party programs that make it easier to determine which package you need to install in order to obtain a specific file or program.

These are most commonly used, and require you to create an index on your computer before you can search for a package:

- [nix-community/nix-index](https://github.com/nix-community/nix-index)
- [replit/rippkgs](https://github.com/replit/rippkgs)

These are online tools which search an index someone else keeps up to date:

- [peterldowns/nix-search-cli](https://github.com/peterldowns/nix-search-cli): `nix-search -p theBinaryIWantToInstall` to search the search.nixos.org elasticsearch index.

<a href="Category:Reference" class="wikilink" title="Category:Reference">Category:Reference</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>
