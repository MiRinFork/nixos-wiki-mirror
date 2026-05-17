<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kakoune -->

[Kakoune](https://github.com/mawww/kakoune) is a modal text editor that operates on selections. Unlike Vim's command-motion paradigme, text is first selected, then operated upon (a motion-command paradigme, if you will). This allows Kakoune to provide strong visual feedback and incremental results while requiring keystroke counts similar to that of Vim. More on the design of Kakoune can be found here [1](https://github.com/mawww/kakoune/blob/master/doc/design.asciidoc) and on <https://kakoune.org>.

## Configuration

Kakoune may be configured without use of the nix build system (simply add it to your system environment and see [2](https://github.com/mawww/kakoune#running)), or it may be configured using `kakoune.override` and `pkgs.kakounePlugins`:

``` nix
let
  myKakoune =
  let
    config = pkgs.writeTextFile (rec {
      name = "kakrc.kak";
      destination = "/share/kak/autoload/${name}";
      text = ''
        set global ui_options ncurses_assistant=cat
      '';
    });
  in
  kakoune.override {
    plugins = with kakounePlugins; [ config parinfer-rust ];
  };
in
{
  environment.systemPackages = [ myKakoune ];
}
```

User configuration can simply be added as a plugin as above.

## Plugins

To install a plugin, you can either install it manually without bothering about nix, or install it as shown above in an override like:

``` nix
let
  myKakoune = kakoune.override {
    plugins = with kakounePlugins; [ parinfer-rust ];
  };
in
{
  environment.systemPackages = [ myKakoune ];
}
```

You should be able to search through the list of plugins using for instance nix search (if you don't have flake enabled you may need to add `--experimental-features 'nix-command flakes'` in front of the nix command) :

``` console
$ nix search nixpkgs parinfer
…
* legacyPackages.x86_64-linux.kakounePlugins.parinfer-rust (0.4.3)
  Infer parentheses for Clojure, Lisp, and Scheme
```

If your plugin is not listed, you can add it manually using `pkgs.kakouneUtils.buildKakounePluginFrom2Nix`:

``` nix
let
  myKakoune =
    let
      snippets-kak = pkgs.kakouneUtils.buildKakounePluginFrom2Nix {
        pname = "snippets-kak";
        version = "2021-07-18";
        src = pkgs.fetchFromGitHub {
          owner = "occivink";
          repo = "kakoune-snippets";
          rev = "c0c39eda2e8f9608cbc0372583bf76441a24afd9";
          sha256 = "12q32ahxvmi82f8jlx24xpd61vlnqf14y78ahj1381rv61a386mv";
        };
        meta.homepage = "https://github.com/occivink/kakoune-snippets/";
      };
    in
      kakoune.override {
        plugins = with kakounePlugins; [ parinfer-rust snippets-kak ];
      };
in
{
  environment.systemPackages = [ myKakoune ];
}
```

Other fetchers can be used for source code hosted with different hosting services, as described in the Nixpkgs manual [3](https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers) (see the Nixpkgs repository for examples [4](https://github.com/NixOS/nixpkgs/blob/nixos-22.05/pkgs/applications/editors/kakoune/plugins/overrides.nix)). You can use the command-line tool `nix-prefetch-git $url` to get the SHA-256 of source distributions.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>
