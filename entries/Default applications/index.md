<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Default applications -->

Different programs manage default application associations in unique ways. Command-line applications often use environment variables, whereas graphical applications typically utilize XDG MIME applications via APIs like GIO or Qt, or by calling `xdg-open`.

## Configuration

Using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, this configuration example configures the handling of HTML-files and URLs by opening them with the browser LibreWolf. Replace `myuser` with the name of your low-level user.

``` nix
home-manager.users.myuser = {
  xdg.mimeApps = {
    enable = true;
    defaultApplications = {
      "text/html" = "librewolf.desktop";
      "x-scheme-handler/http" = "librewolf.desktop";
      "x-scheme-handler/https" = "librewolf.desktop";
      "x-scheme-handler/about" = "librewolf.desktop";
      "x-scheme-handler/unknown" = "librewolf.desktop";
    };
  };
};
```

To list all .desktop-files, run

``` nix
ls /run/current-system/sw/share/applications # for global packages
ls /etc/profiles/per-user/$(id -n -u)/share/applications # for user packages
ls ~/.nix-profile/share/applications # for home-manager packages
ls /var/lib/flatpak/exports/share/applications # for global flatpaks
ls ~/.local/share/flatpak/exports/share/applications/ # for user flatpaks
```

In case a program is missing a .desktop-file, the following example adds a `librewolf.desktop` file to the MIME database with the specific binary path.

``` nix
home-manager.users.myuser = {
  xdg.desktopEntries.librewolf = {
    name = "LibreWolf";
    exec = "${pkgs.librewolf}/bin/librewolf";
  };
};
```

If you don't know the exact mime type of a file, you can use the `file` command.

``` shell
file --mime-type -b $file_name
```

## Usage

Try opening a web page with `xdg-open` which is part of the package `xdg-utils`

``` shell
xdg-open "https://nixos.org"
```

<a href="Category:Home_Manager" class="wikilink" title="Category:Home Manager">Category:Home Manager</a>
