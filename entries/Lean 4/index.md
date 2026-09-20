<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Lean 4 -->

[Lean 4](https://lean-lang.org/) is a pure functional programming language and an interactive theorem prover base on dependent type theory[^1].

## Building Lean 4 projects

Use the following

``` nix
leanPackages.buildLakePackage {
  pname = "my-project";
  version = "0.1.0";
  src = ./.;
  leanDeps = with leanPackages; [ mathlib ];
  lakeHash = null; # all deps nix-managed; set to lib.fakeHash for Lake-managed deps
}
```

## Installing Lean 4

Lean4 is available as a package, both on the packages [26.05 channel](https://search.nixos.org/packages?channel=26.05&query=lean4#show=lean4) and the [unstable channel](https://search.nixos.org/packages?channel=unstable&query=lean4#show=lean4), and they may be installed according to their provided instructions. Below is an example of a minimal Lean 4 flake.

``` nix
{
  description = "Minimal Lean 4 flake.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs = { self, nixpkgs }@inputs:
    let
      system = "x86_64-linux";
      pkgs   = nixpkgs.legacyPackages.${system};
    in
      {
        devShells.${system}.default = pkgs.mkShell {
          packages = with pkgs; [
            lean4
          ];
        };
      };
}
```

## Text Editors

Lean provides an official extension for [VS Code](https://github.com/leanprover/vscode-lean4), but community extensions can also be found for other editors such as [emacs](https://github.com/leanprover-community/lean4-mode), [neovim](https://github.com/Julian/lean.nvim), cursor and so on. Please note, that Lean FRO recommends installing Lean through the officially supported VS Code extension[^2].

### Lean4-mode - major mode for Emacs

[leanprover-community](https://github.com/leanprover-community) provides a lean major mode for emacs called ["lean4-mode"](https://github.com/leanprover-community/lean4-mode). However, the provided major mode seems to not be receiving updates, and according to community discussions, it has split up into a number of different forks, with different features and support[^3][^4]. While the version provided by leanprover-community supports [lsp-mode](https://github.com/emacs-lsp/lsp-mode), the fork by GitHub user [bustercopley](https://github.com/bustercopley) supports [eglot](https://github.com/joaotavora/eglot) instead[^5].

## References

[^1]: "The Lean Language Reference", leanprover contributors, <https://lean-lang.org/doc/reference/latest/> (Fetched 2026-09-14)

[^2]: "Install Lean", Lean FRO, <https://lean-lang.org/install/> (Fetched 2026-09-14)

[^3]: "lean4-mode - commits", lean4-mode contributors, <https://github.com/leanprover-community/lean4-mode/commits/master/> (Fetched 2026-09-14)

[^4]: Emacs mode discussions, <https://leanprover.zulipchat.com/#narrow/channel/468104-Emacs/topic/Meta/near/580208083> (Fetched 2026-09-14)

[^5]: "Use Eglot isntead of lsp-mode", bustercopley, <https://github.com/leanprover-community/lean4-mode/commit/b08114632a756e9e2a5b59b89c2b0d79bd6dae6c> (Fetched 2026-09-14)
