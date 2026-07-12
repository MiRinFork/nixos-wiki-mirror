<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Emacs -->

<strong>Emacs</strong> is a free and open-source text editor known for its exceptional extensibility and adaptability. It can be customized into anything from a simple editor to a full development environment or productivity tool. Emacs features built-in self-documentation, syntax-aware editing, and a vast ecosystem of community-developed packages.[^1]

For an easier introduction, [Doom Emacs](https://doomemacs.org) offers a pre-configured Emacs framework with modern defaults and features like IDE tools, note-taking, and task management. You can also deploy Doom Emacs natively on Nix with [nix-doom-emacs-unstraightened](https://github.com/marienz/nix-doom-emacs-unstraightened).

There is an official Matrix room for Nix/Emacs: [\#emacs:nixos.org](https://matrix.to/#/#emacs:nixos.org), as well as another one for Doom Emacs on Nix: [https://matrix.to/#/#doom-emacs:nixos.org](https://matrix.to/#/#doom-emacs:nixos.org).

## Installation

#### Shell

To temporarily use Emacs in a shell environment without modifying your system configuration, you can run:

``` console
$ nix-shell -p emacs
```

This makes the Emacs editor available in your current shell. You can then launch Emacs by typing `emacs`.

#### System setup

To install Emacs system-wide, making it available to all users, add the following to your configuration:

Alternatively, Emacs can be installed specific to a user via <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

After rebuilding your system with `nixos-rebuild switch` or `home-manager switch`, Emacs will be installed and accessible.

## Configuration

#### NixOS System Configuration

System wide configuration of Emacs is limited to only the [Emacs daemon](https://www.gnu.org/software/emacs/manual/html_node/emacs/Emacs-Server.html). To enable Emacs daemon user services system-wide and set as default editor:

Use `emacsclient` to connect to the daemon. For a full list of module configuration options, see .

#### Home Manager

<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> provides a larger set of user-specific configuration options for Emacs.

A minimal configuration that installs Emacs alongside `nix-mode` and `nixfmt` packages:

To search for Emacs plugins within the package set, see . A full list of Home Manager configuration module options can be found [here](https://home-manager-options.extranix.com/?query=programs.emacs).

Home Manager also provides a configuration module for enabling the Emacs daemon:

See [the module options](https://home-manager-options.extranix.com/?query=services.emacs) for `services.emacs` configurations options.

## Tips and Tricks

#### Installing Packages

One can mix and match whether Emacs packages are installed by Nix or Emacs. This can be particularly useful for Emacs packages that need to be built, such as vterm. One way to install Emacs packages through Nix is by the following, replacing with the variant in use:

Note that if the expression `(emacsPackagesFor emacs-pgtk)` is present, `emacs-pgtk` need not be listed separately in the list `environment.systemPackages`. Indeed, if one does that, `nixos-rebuild` will warn about link collisions when the configuration is rebuilt.

###### Alternative way of installation to ensuring consistent package management for emacs and emacsclient

If you plan to use the same packages for both emacs and emacsclient, you can define a custom emacs like this:

You may then reference it twice:

Using this approach, there is no need to keep two lists of emacsPackages in sync.

#### Tree-sitter

<a href="Emacs" class="wikilink" title="Emacs">Emacs</a> 29 <a href="emacswiki:Tree-sitter" class="wikilink" title="supports Tree-sitter parsers">supports Tree-sitter parsers</a> when built with the `--with-tree-sitter` option. The `emacsPackages.treesit-grammars` fake package makes them accessible to Emacs when using `emacs29.pkgs.withPackages`:[^2]

``` nix
{
  pkgs ? import <nixpkgs> { },
}:
pkgs.emacs29.pkgs.withPackages (epkgs: [
  (epkgs.treesit-grammars.with-grammars (grammars: [ grammars.tree-sitter-bash ]))
])
```

When using Emacs with tree-sitter support, it's recommended to install both `epkgs.tree-sitter-langs` and `epkgs.treesit-grammars`. While `treesit-grammars` handles the registration of grammars with Emacs's native tree-sitter interface, the actual grammar files will come from `tree-sitter-langs`. `tree-sitter-langs` being a MELPA package means it receives regular updates when new grammar versions are released, whereas the grammars in the tree-sitter-grammars package may lag behind in nixpkgs. The combination ensures you get both up-to-date grammars and proper integration with Emacs's built-in tree-sitter support.

<b>Bonus Tip:</b>

`emacs.pkgs.pretty-sha-path` is quality of life improvement for Nix, Guix users.

Allows toggling Guix/Nix store paths by replacing SHA-sequences with ellipsis, i.e.:

``` bash
/gnu/store/72f54nfp6g1hz873w8z3gfcah0h4nl9p-foo-0.1  →  /gnu/store/…-foo-0.1
/nix/store/nh4n4yzb1bx7nss2rg342dz44g14m06x-bar-0.2  →  /nix/store/…-bar-0.2
```

located at <https://github.com/alezost/pretty-sha-path.el>

#### Automatic Package Management

If you use `use-package` or `leaf` in your configuration, the community overlay can manage your Emacs packages automatically by using `emacsWithPackagesFromUsePackage`. First, install the overlay (instructions above), then add the following to your `configuration.nix`:

See the [overlay README](https://github.com/nix-community/emacs-overlay#extra-library-functionality) for a full list of options.

#### Adding packages from outside ELPA/MELPA

Some packages may require more sophisticated derivation, but the following is a good starting point for adding external packages:

You can then use the new package with automatic package management like so:

or manual package management like so:

#### Packaging and testing Emacs nixpkgs

Emacs packages can be defined and tested like other nixpkgs. They can be obtained from melpa, elpa or other sources such as github.

They are located at `pkgs/applications/editors/emacs/elisp-packages/manual-packages/` [1](https://github.com/NixOS/nixpkgs/tree/master/pkgs/applications/editors/emacs/elisp-packages/manual-packages) and a new pkg must be added under `pkgs/applications/editors/elisp-packages/manual-packages.nix` [2](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/editors/emacs/elisp-packages/manual-packages.nix). Once the nixpkg is ready, it can be tested using the following command. This inserts the nixpkg into the load-path of Emacs.

``` console
$ nix-shell -I nixpkgs=<path_to_nixpkgs_copy> -p \
    "(emacsPackagesFor pkgs.emacs28).emacsWithPackages (epkgs: [ epkgs.<package> ])"
```

}}

#### Window Manager Integration

Out of the box, non-"Mac Port" versions of Emacs will not be picked up properly by window managers like [Yabai](https://github.com/koekeishiya/yabai) because [Emacs does not set the correct macOS window role](https://github.com/koekeishiya/yabai/issues/86#issuecomment-507537023). This can be fixed with a patch (e.g. the first patch in the example above). However, even with the patch, Yabai may not correctly pick up Emacs if you invoke the `emacs` binary directly from a shell. For Emacs to work properly with window managers you must invoke it by running the macOS app that is generated when you install Emacs with nix. You can setup an alias to do this like so (replace `pkgs.emacs` with the package you are using):

``` nix
programs.zsh = {
  enable = true;
  shellAliases = {
    emacs = "${pkgs.emacs}/Applications/Emacs.app/Contents/MacOS/Emacs";
  };
};
```

#### Available Emacs Variants

##### Stable (nixpkgs)

Emacs is available in nixpkgs under the names `emacs` and `emacs-gtk`.

[Since 2022-09](https://github.com/NixOS/nixpkgs/pull/189543), the package called `emacs` now installs the lucid toolkit instead of gtk. The reason is that Emacs is less stable with gtk especially in daemon mode. However, the lucid flavor of Emacs will not take into account the GTK theme (since it is not even GTK) and looks quite… ugly (see comparisons [here](https://emacs.stackexchange.com/questions/33065/on-linux-why-should-one-choose-lucid-over-gtk-gui-for-emacs)). If you still prefer the GTK version of Emacs, you can instead install `emacs-gtk` (before 2022-09 this package does not exist and Emacs defaults to the gtk version).

##### Unstable (community overlay)

The [community overlay](https://github.com/nix-community/emacs-overlay) provides nightly versions of the Emacs unstable branches, ELPA/MELPA packages, and [EXWM](https://github.com/ch11ng/exwm) + its dependencies. **To use these, first apply the overlay (instructions below), which will make the packages available in nixpkgs.** Then you can follow the normal nixpkgs installation instructions (above), but use your package of choice from the overlay (e.g. `pkgs.emacsGit`) in place of `pkgs.emacs`. See the [README](https://github.com/nix-community/emacs-overlay#emacs-overlay) for a complete list of packages provided, and their differences.

###### With flakes

Using a system flake, one can specify the specific revision of the overlay as a flake input, for example:

``` nix
inputs.emacs-overlay.url = "github:nix-community/emacs-overlay/da2f552d133497abd434006e0cae996c0a282394";
```

This can then be used in the system configuration by using the argument:

``` nix
nixpkgs.overlays = [ (import self.inputs.emacs-overlay) ];
```

###### Without flakes

For installing one of the unstable branches of Emacs, add the following lines to your configuration file:

##### Darwin (macOS)

Nixpkgs provides several of the "Mac Port" versions of Emacs, which have been patched to provide better integration with macOS (see the [NixOS manual entry for a full list of packages](https://nixos.org/manual/nixos/stable/index.html#module-services-emacs-releases)). However, those packages typically track the stable releases of Emacs.

If you would like to use the latest version of Emacs on Darwin, one option is to use a package like `emacsPgkt` from the community overlay (see above), and apply patches yourself via an override. For example, here is a derivation that applies the patches from the [`emacs-plus` homebrew formula](https://github.com/d12frosted/homebrew-emacs-plus):

``` nix
pkgs.emacsPgtk.overrideAttrs (old: {
  patches = (old.patches or [ ]) ++ [
    # Fix OS window role (needed for window managers like yabai)
    (fetchpatch {
      url = "https://raw.githubusercontent.com/d12frosted/homebrew-emacs-plus/master/patches/emacs-28/fix-window-role.patch";
      sha256 = "0c41rgpi19vr9ai740g09lka3nkjk48ppqyqdnncjrkfgvm2710z";
    })
    # Enable rounded window with no decoration
    (fetchpatch {
      url = "https://raw.githubusercontent.com/d12frosted/homebrew-emacs-plus/master/patches/emacs-29/round-undecorated-frame.patch";
      sha256 = "111i0r3ahs0f52z15aaa3chlq7ardqnzpwp8r57kfsmnmg6c2nhf";
    })
    # Make Emacs aware of OS-level light/dark mode
    (fetchpatch {
      url = "https://raw.githubusercontent.com/d12frosted/homebrew-emacs-plus/master/patches/emacs-28/system-appearance.patch";
      sha256 = "14ndp2fqqc95s70fwhpxq58y8qqj4gzvvffp77snm2xk76c1bvnn";
    })
  ];
})
```

#### Running xwidgets

Currently, the xwidgets feature is available for Emacs, but will have some issues with the PGTK build. Indeed, when create a webkit xwidget, the widget will initially show a blank page, for some seconds (usually 4/5 seconds), no matter whether you actually try to load a web page.

A workaround to this is to way that delay, and then try to load the page. You can do so programmatically by waiting 5 seconds, or from within a webkit widget by waiting for 5 seconds, then pressing `g`, then `RET`.

Otherwise, you can fix the issue by building Emacs with the following patch

``` diff
--- a/src/xwidget.c
+++ b/src/xwidget.c
@@ -362,8 +362,12 @@
                "download-started",
                G_CALLBACK (webkit_download_cb), xw);

+#if !defined HAVE_PGTK
+              /* when using pgtk, the about:blank workaround is not needed
+                 would in fact make the initial load fail.  */
          webkit_web_view_load_uri (WEBKIT_WEB_VIEW (xw->widget_osr),
                    "about:blank");
+#endif
          /* webkitgtk uses GSubprocess which sets sigaction causing
         Emacs to not catch SIGCHLD with its usual handle setup in
         'catch_child_signal'.  This resets the SIGCHLD sigaction.  */
```

Say you saved this file in `xwidget.patch`, then you can override emacs with

``` nix
pkgs.emacs-pgtk.overrideAttrs (old: {
  patches = (old.patches or []) ++ [ ./xwidget.patch ];
}
```

Beware, this will trigger a full Emacs compilation whenever you update it, because it will not match any cached binary.

## Troubleshooting

#### Plasma taskbar grouping

To fix/workaround <a href="KDE" class="wikilink" title="Plasma">Plasma</a> grouping Emacs incorrectly (confusing emacs.desktop with emacsclient.desktop), perform the following:

- Open Emacs
- Right click title bar
- More Actions \> Configure Special Window Settings
- Add Property \> Desktop File Name
- Set desktop file name to "/home/<USERNAME>/.nix-profile/share/applications/emacs.desktop"
- Apply the changes
- Restart Emacs if need

All Emacs instances should now be grouped together, allowing you to pin it and reliably switch to it with Super+<number>

#### Spell checking

Because Emacs expects the dictionaries to be on the same directory as aspell, they won't be picked up. To fix it install the `aspellWithDicts` package, specifying the dictionaries you want to use:

A list of official dictionaries for aspell can be found on [Aspell Website](https://ftp.gnu.org/gnu/aspell/dict/0index.html)

## See also

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – For declarative Emacs configuration at the user level: [Emacs module in Home Manager](https://nix-community.github.io/home-manager/options.html#opt-programs.emacs.enable)
- [Emacs Manuals](https://www.gnu.org/software/emacs/manual/) – Official Emacs documentation.
- [NixOS options for Emacs services](https://search.nixos.org/options?channel=unstable&query=services.emacs) – System-level Emacs configuration.
- [Emacs discussions on NixOS Discourse](https://discourse.nixos.org/search?q=emacs) – Community tips, troubleshooting, and use cases.
- [Doom Emacs](https://doomemacs.org) – A popular Emacs configuration framework.
- [Emacs Overlay on Nixpkgs](https://github.com/nix-community/emacs-overlay) – For nightly builds and additional Emacs packages.

## References

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>

[^1]: <https://www.gnu.org/software/emacs/>

[^2]: <https://github.com/NixOS/nixpkgs/pull/230751>
