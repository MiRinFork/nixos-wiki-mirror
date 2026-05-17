<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Wil T Nix Guides -->

## About

In early 2021, Wilfred Taylor (*Wil T*), produced a series of eight video guides covering the Nix ecosystem from the ground up. This page is an overview with information about each guide. These guides are perhaps currently the best available video resource for getting an early understanding of Nix, and will step you through getting a working NixOS machine.

The series runs for a total of 3 hours and 32 minutes. It starts with a general overview, progresses to setting up a NixOS desktop, covers managing NixOS config repositories, gives a general overview of the Nix ecosystem and enough hands-on exploration to get oriented, and ends with coverage of Flakes and migration of configurations to a Flake based system.

At the time of production, [NixOS 20.09](https://nixos.org/blog/announcements.html#20.09) was the latest release, so the guides are using it. Currently, i.e. on 21.05 or unstable, not much has changed that would impact following the guides as produced.

## Guide series

For convenience, a page with the playlist in order is available: [Wil T's Nix Guides Playlist](https://enia.cc/r/nixos-linktree)

### Introduction To Nix and NixOS

[Video Link](https://www.youtube.com/watch?v=QKoQ1gKJY5A) Playtime: ~11 minutes

In this introductory video, Wil opens with an overview of Nix, and a slide:

#### What is Nix?

- Package build system
- Reproducible builds
- Build isolation
- Nix Store
- Nixpkgs

Starting at 3:32, he moves on to ...

#### What is NixOS?

- Linux distro built on Nix
- Nix Modules
- Profiles and Generations

... at 5:30 ...

#### So why NixOS?

- Infrastructure as Code
- Easily tinker and recover
- Modify packages and add your own
- Development Shells

### NixOS Installation Guide

[Video Link](https://www.youtube.com/watch?v=axOxLJ4BWmY) Playtime: ~55 minutes

This video opens with an install guide, using a graphical KDE Plasma ISO.

Beginning around 27:22, most of the rest of the guide covers using Home Manager to manage your configuration (e.g. dotfiles).

Remaining marks...

- 48:44, he presents the search tools and documentation on the main [nixos.org](https://nixos.org/) site.
- 51:50, he introduces this NixOS community wiki.
- 52:57, he introduces [Nix Pills](https://nixos.org/guides/nix-pills/) for getting a deeper understanding of Nix.
- 53:38, he begins coverage of the [community resources](https://nixos.org/community/index.html) available.

### How to put NixOS config into a git repository

[Video Link](https://www.youtube.com/watch?v=Dy3KHMuDNS8) Playtime: ~31 minutes

This guide opens with a recap of where all NixOS configurations are managed. After the first minute, it covers initializing a git repo with all the configuration files and some convenience scripts for updates.

At 14:25, he begins coverage of using *git crypt* to manage secrets (e.g. passwords and private keys) in the repository, which spans the rest of the video.

### NixOS Filesystem Overview

[Video Link](https://www.youtube.com/watch?v=jf0nIn2oS8A) Playtime: ~20 minutes

In this video, Wil covers details of where things are stored and how the filesystem is structured.

At 1:22 ...

#### NixOS Filesystem

- Missing directories or very few files
- Can't directly modify files in */etc*
- Where are all the files?
- Path
  - */home/wil/.nix-profile/bin*
  - */run/current-system/sw/bin*

... at 3:34 he moves on to explaining the Nix Store ("store," as in, "a place for things," not as in, "buy things") ...

#### Nix Store

- Located at */nix/store*
- Read only
- Derivations
- Garbage Collection

... from 9:24 ...

#### Nix Profiles

- Located at */nix/profiles*
- System (also at */run/current-system*')
- Per User (also at *~/.nix-profile*)

... from 14:29 ...

#### Nix Configuration

- Located at */etc/nix/nix.conf*
- NixOS configure in configuration.nix
- Non NixOS systems you can modify

... from 17:16 ...

#### Log Files

- *nix log*
- Will give you the command to run when a build fails
- You can run it with *nix log /nix/store/<path to folder>*

### Nix Language Overview

[Video Link](https://www.youtube.com/watch?v=eCapIx9heBw) Playtime: ~31 minutes

Wil presents the <a href="Nix" class="wikilink" title="Nix">Nix</a> language itself. He reiterates early that the language is quite simple and not "scary" ...

#### Scary terms

- Functional
- Lazy Evaluation
- Immutable
- Derivations

... from 6:07 ...

#### Language Structures

- Variables
- Sets
- Lists
- Functions
- Derivations

<!-- -->

- Derivation wrappers
  - mkDerivation
  - runCommand
  - writeScriptBin

... from 14:11 ...

#### Language Special Statements

- **with**
- **import**
- **inherit**
- **if**
- **let**

... from 20:46 ...

#### Helpful Resources

- Repl
- Language Server
- Manuals

... 21:08 ...

#### REPL

- Can open with *nix repl*
- Can close with **ctrl + d**
- Set variables to values and output them to the repl
- import files

... from 22:08, he covers integrating understanding of the Nix language for text editors and IDEs ...

#### Language Server

- <https://github.com/nix-community/rnix-lsp>
- Supports:
  - vim (COC, LSP Client, vim-lsp)
  - Emacs (lsp-mode, eglot)
  - Kakoune (kak-lsp)
  - VSCode (vscode-nix-ide)

... from 23:49 ...

#### Manuals

- <https://nixos.org/learn.html>
- [Nix Manual](https://nixos.org/manual/nix/stable/)
- [Nixpkgs Manual](https://nixos.org/manual/nixpkgs/stable/)

### Nix Shell

[Video Link](https://www.youtube.com/watch?v=SGekN4pDExY) Playtime: ~11 minutes

Wil quickly explains using Nix Shell to create isolated development environments (comparing it to Docker). From 1:40 ...

#### What is a Nix Shell?

- Originally designed to debug nix
- Can be used as a development environment

... from 2:29: "Simple shell" ... from 4:17: "More complicated shell" ... from 7:38: "How to add scripts to shell"

### Intro to Flakes

[Video Link](https://www.youtube.com/watch?v=K54KKAx2wNc) Playtime: ~20 minutes

Wil opens with warning that [Flakes](https://nixos.org/manual/nix/unstable/command-ref/new-cli/nix3-flake.html) are still under heavy development as a relatively new feature, and also iterates that they are very awesome.

From 0:56 ...

#### What are Flakes?

- Project file
- Dependency Management
- Updates

... from 2:52 ...

#### Setup for Flakes

- Nix client update - 2.4 Pre (pkgs.nixFlakes)
- Nix Shell

... from 4:42: "Creating a flake" ... from 8:08: "Nix inputs and registry" ... from 12:16: "Nix outputs" ... from 13:14 ...

#### What can you put in outputs?

- Packages
- Modules
- Applications
- Shells
- Home Manager Configuration
- Nix System Configuration
- Anything else

### Moving NixOS System Configuration into a Flake

[Video Link](https://www.youtube.com/watch?v=mJbQ--iBc1U) Playtime: ~33 minutes

In the last video, Wil explains how to move your NixOS system configuration and Home Manager configuration into a nix flake file. This can help you with control of which versions of packages you are pointing to and make it easier to manage your system changes over time. In the first few minutes he explains how to modify your NixOS system configuration in order to enable the experimental flakes feature.

From 4:22, he does *nix flake init*, and begins setting up the flake file.

From 16:08, he starts *nixos-rebuild build ...* after migrating basic configurations from the previous videos into the flake setup. Most of the rest of the video goes into detail about building out helper scripts and re-integrating setup using the flake structure.

From 28:54, he summarizes the change and outlines examples of how flakes make it more logical and convenient to expand and modularize your system configurations going forward (e.g., by creating roles that apply to different types of systems).

From 30:10, he presents his own [flake-based configuration on Github](https://github.com/wiltaylor/dotfiles).

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a>
