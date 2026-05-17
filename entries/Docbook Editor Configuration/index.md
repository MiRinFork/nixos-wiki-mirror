<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Docbook Editor Configuration -->

## For Vim/Neovim

``` nix
(pkgs.neovim.override {
   configure.packages.myplugins.start = with pkgs.vimPlugins; [
     vim-docbk
     vim-docbk-snippets
     syntastic
     UltiSnips
   ];
 })
```

## For Emacs

The following creates an Emacs with a custom module, which configures nXML for the NixOS / Nixpkgs docbook codebase:

``` nix
let
  pkgs = import <nixpkgs> {};
  inherit (pkgs) emacsPackagesNg docbook5 writeText;

  schemas = writeText "schemas.xml" ''
    <locatingRules xmlns="http://thaiopensource.com/ns/locating-rules/1.0">
      <documentElement localName="section" typeId="DocBook"/>
      <documentElement localName="chapter" typeId="DocBook"/>
      <documentElement localName="article" typeId="DocBook"/>
      <documentElement localName="book" typeId="DocBook"/>
      <typeId id="DocBook" uri="${docbook5}/xml/rng/docbook/docbookxi.rnc" />
    </locatingRules>
  '';

in emacsPackagesNg.emacsWithPackages (epkgs: [
  (emacsPackagesNg.trivialBuild {
    pname = "nix-docbook-mode";
    version = "1970-01-01";
    src = writeText "default.el" ''
      (eval-after-load 'rng-loc
        '(add-to-list 'rng-schema-locating-files "${schemas}"))
    '';
  })
])
```

## For IntelliJ IDEA (Community and Ultimate)

First off, the feature set for XML and Docbook editing is the same in both versions. Here's a neat one-liner to start the Community edition

``` console
nix-shell -p jetbrains.idea-community --run idea-community
```

Then, open the `doc/` or root folder of the `<nixpkgs>` project. (Opening a file directly will not allow browsing the directory structure within the IDE.

<figure>
<img src="Docbook-intellij-open.png" title="Docbook-intellij-open.png" />
<figcaption>Docbook-intellij-open.png</figcaption>
</figure>

### Adding the docbook schema

At the root of `<nixpkgs>`, run the following command. It will create a link to docbook, allowing (easier) use of the xsd files. The symlink can be updated instead of having to change the full store path in the editor. The second command will print the full path to the docbook xsd.

``` console
$ nix-build -A docbook5 --out-link docbook
$ echo $PWD/docbook/share/xml/docbook-5.0/xsd/docbook.xsd
```

Open `manual.xml`. After a short while, IntelliJ IDEA will realise it does not know about the schema.

<figure>
<img src="Docbook-intellij-schema-error.png" title="Docbook-intellij-schema-error.png" />
<figcaption>Docbook-intellij-schema-error.png</figcaption>
</figure>

Click on the red light bulb, then <em>Manually setup an external resource</em>.

<figure>
<img src="Docbook-intellij-bulb-menu.png" title="Docbook-intellij-bulb-menu.png" />
<figcaption>Docbook-intellij-bulb-menu.png</figcaption>
</figure>

Paste in the full path to the `xsd` file.

<figure>
<img src="Docbook-intellij-full-path.png" title="Docbook-intellij-full-path.png" />
<figcaption>Docbook-intellij-full-path.png</figcaption>
</figure>

After this is done, IntelliJ will validate.

<figure>
<img src="Docbook-intellij-mistake.png" title="Docbook-intellij-mistake.png" />
<figcaption>Docbook-intellij-mistake.png</figcaption>
</figure>
