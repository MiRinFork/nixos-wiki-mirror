<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flatpak -->

[Flatpak](https://www.flatpak.org/) is a Linux application sandboxing and distribution framework.

This article extends the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-flatpak).

## Installation

### Global

Using this configuration, `flatpak` will be installed and ready to use globally for all users:

### Per-User

If you'd rather make Flatpak available to a specific user, add `flatpak` to that user's packages

### Window Managers / Compositors Patches

After adding the desired solution to your configuration file, Flatpak will be installed, but it is not always added to your path directly, e.g. when you are using Sway.

To manually add it to the path while using the <a href="Greetd" class="wikilink" title="Greetd">Greetd</a> login manager and <a href="Sway" class="wikilink" title="Sway">Sway</a>, create a `.profile` file with an override for your `XDG_DATA_DIRS` path, e.g.: This is also required when installing `flatpak` on a per-user basis.

### With Impermanence

If you're using <a href="Impermanence" class="wikilink" title="Impermanence">Impermanence</a>, you'll need to make sure you persist the directories that flatpak will be using

- `/var/lib/flatpak` (for system configuration, repositories, etc.)
- `~/.var/app` (for app data)
- `~/.local/share/flatpak` (for user-specific configuration)

The directories in your home (starting with `~`) will need to be persisted for every user who will use flatpak

## Usage

### Declarative

To manage Flatpak declaratively, you can either use [nix-flatpak](https://github.com/gmodena/nix-flatpak) or [declarative-flatpak](https://github.com/in-a-dil-emma/declarative-flatpak)

In the event of a Nix rollback, both modules will reinstall the previously declared Flatpak packages

#### [nix-flatpak](https://github.com/gmodena/nix-flatpak)

A convergent approach to Flatpak management where refs are managed in place

Flatpak packages are not cached in the Nix store

It supports flakes or <a href="Home_Manager" class="wikilink" title="home-manager">home-manager</a>, but doesn't support non-flakes only

<small>For more details, see [nix-flatpak/discussions/168](https://github.com/gmodena/nix-flatpak/discussions/168)</small>

#### [declarative-flatpak](https://github.com/in-a-dil-emma/declarative-flatpak)

A congruent approach to Flatpak management where changes are designed to be atomic, ensuring that either they succeed or nothing happens. This module uses a temporary installation and then overwrites the current one.

It supports non-flake, flakes, and <a href="Home_Manager" class="wikilink" title="home-manager">home-manager</a>

<small>For more details, see [declarative-flatpak/issues/44](https://github.com/in-a-dil-emma/declarative-flatpak/issues/44)</small>

### Imperative

#### Terminal User Interface

To manage Flatpak imperatively, you can use [the `flatpak` command](https://docs.flatpak.org/en/latest/using-flatpak.html) ([`flatpak` Command Reference Documentation](https://docs.flatpak.org/en/latest/flatpak-command-reference.html))

##### Example

``` console
$ flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
$ flatpak update
$ flatpak search Flatseal
$ flatpak install flathub com.github.tchx84.Flatseal
$ flatpak run com.github.tchx84.Flatseal
```

#### Graphical User Interface

To install Flatpaks graphically, you can use [the GNOME Software Application](https://apps.gnome.org/en-GB/Software/) ([`gnome-software` in nixpkgs](https://search.nixos.org/packages?show=gnome-software))

<small>**Note**: installing Flatpaks through it is imperative</small>

#### Configure Repositories Globally

To automatically configure Flatpak repositories for all users, one can add this snippet to `configuration.nix`:

## Development

### Build a Flatpak project

The following example builds a demo app of the [libadwaita](https://github.com/GNOME/libadwaita) repository using `flatpak-builder`, installs it locally in the user space and runs it. First install `flatpak` and `flatpak-builder` on your system

Clone, build and run the example project.

``` console
$ flatpak remote-add --if-not-exists gnome-nightly https://nightly.gnome.org/gnome-nightly.flatpakrepo
$ flatpak install gnome-nightly org.gnome.Sdk org.gnome.Platform
$ git clone https://gitlab.gnome.org/GNOME/libadwaita.git
$ cd libadwaita
$ nix shell nixpkgs#appstream
$ flatpak-builder --disable-tests --user --install build demo/org.gnome.Adwaita1.Demo.json
$ flatpak run org.gnome.Adwaita1.Demo.json
```

Note that the `gnome-nightly` repository and the `appstream` dependency are especially required for this specific project and might be different for other Flatpak projects.

## Tips and tricks

### Emulate Flatpaks of different architecture

It is possible to install and run Flatpaks which were compiled for a different platform.

In this example we imperatively install the application "Metronome" `aarch64` Flatpak package and run it (regardless of the architecture of the host, but in that case, it was `x86_64`):

``` console
$ flatpak install flathub com.adrienplazas.Metronome --arch=aarch64
$ flatpak run com.adrienplazas.Metronome
```

To support emulation with Qemu, <a href="QEMU#Run_binaries_of_different_architecture" class="wikilink" title="following Binfmt configuration">following Binfmt configuration</a> is required.

## Troubleshooting

### Missing themes and cursors

If you have issues with cursors or themes in general, take a look at <a href="Fonts#Flatpak_applications_can&#39;t_find_system_fonts" class="wikilink" title="Fonts#Flatpak_applications_can&#39;t_find_system_fonts">Fonts#Flatpak_applications_can't_find_system_fonts</a>

### Uninstalling an application and wiping its data

Sometimes, flatpak applications may glitch (like fonts in Flatseal[^1]) and wiping their data may solve the issue. To do so, you have two options.

#### Option 1: Delete application and its data in a single command

This is useful if you have installed the flatpak application **imperatively**. Use the `--delete-data` flag when uninstalling the offending application, (like `flatpak uninstall `<application>` --delete-data` ). Then re-install the offending application (like `flatpak install `<application> ).

#### Option 2: Delete application and then delete its data

This is useful if you have set up flatpak **declaratively**[^2]. First remove the application from your configuration and rebuild. Then run `flatpak uninstall --unused --delete-data` to both delete **all** leftover applications and wipe the data of anything previously deleted. This will ask you to delete the data of each application individually, delete only the data of the offending application. Then re-add the offending application in your configuration and rebuild.

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>

[^1]: <https://github.com/tchx84/Flatseal/issues/501>

[^2]: <a href="Flatpak#Declarative" class="wikilink" title="Flatpak#Declarative">Flatpak#Declarative</a>
