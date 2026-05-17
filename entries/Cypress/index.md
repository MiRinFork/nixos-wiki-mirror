<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cypress -->

[Cypress](https://www.cypress.io/) is a frontend testing framework for web applications.

## NixOS

You cannot use Cypress directly with <a href="npm" class="wikilink" title="npm">npm</a> while running on <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>.[^1] You can either run it with <a href="steam-run" class="wikilink" title="steam-run"><code>steam-run</code></a> or use the `cypress` package.

For example, put this `shell.nix` in the directory with your Cypress tests:

``` nix
{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    packages = with pkgs; [
      nodejs
      cypress
    ];
}
```

You can then run `nix-shell --run "Cypress"` to open the Cypress UI and select your project.

## References

<references />

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>

[^1]: <https://github.com/cypress-io/cypress/issues/3530>
