<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Calendaring -->

Software for managing your calendars that’s available via Nix.

| Program | Nixpkgs attribute name | Modules | Notes |
|----|----|----|----|
| [Evolution](https://gitlab.gnome.org/GNOME/evolution/-/wikis/home) | evolution | [NixOS](https://nixos.org/manual/nixos/stable/options#opt-programs.evolution.enable) | general PIM suite |
| <a href="GNOME/Calendar" class="wikilink" title="GNOME/Calendar">GNOME/Calendar</a> | gnome-calendar |  |  |
| [khal](https://khal.readthedocs.io/) | khal | [Home Manager](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.khal.enable) | CLI |
| [Kontact](https://kontact.kde.org/) | kdePackages.kontact | [NixOS](https://nixos.org/manual/nixos/stable/options#opt-programs.kde-pim.kontact) | general PIM suite |
| [KOrganizer](https://kontact.kde.org/components/korganizer/) | kdePackages.korganizer |  | component of Kontact |
| [Merkuro](https://invent.kde.org/pim/merkuro#user-content-merkuro) | kdePackages.merkuro | [NixOS](https://nixos.org/manual/nixos/stable/options#opt-programs.kde-pim.merkuro) | formerly Kalendar |
| [qcal](https://github.com/psic4t/qcal#readme) | qcal | [Home Manager](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.qcal.enable) | CLI |
| <a href="Thunderbird" class="wikilink" title="Thunderbird">Thunderbird</a> | thunderbird | [Home Manager](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.thunderbird.enable), [NixOS](https://nixos.org/manual/nixos/stable/options#opt-programs.thunderbird.enable) | primarily an email client; works on darwin |

Home Manager also has [generic calendar account options](https://nix-community.github.io/home-manager/options.xhtml#opt-accounts.calendar.accounts).
