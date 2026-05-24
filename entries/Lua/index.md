<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Lua -->

## \#! nix-shell with lua interpreter

To use a nix-shell shebang with lua you will need to use following structure:

``` lua
#!/usr/bin/env nix-shell
--[[
#!nix-shell -i lua -p lua
]]

print("this is from lua")
```

Some background by <a href="User:Samueldr" class="wikilink" title="samueldr">samueldr</a>[^1]:

> Two inter-twined fun facts.
>
> - Lua only skips one shebang line.
> - nix-shell doesn't require its magic lines to be right after the first line.

## Override a Lua package for all available Lua interpreters

The nixpkgs reference manual suggests using the following overlay template:

``` nix
final: prev: {
  lua = prev.lua.override {
    packageOverrides = luafinal: luaprev: {
      luarocks-nix = luaprev.luarocks-nix.overrideAttrs (oa: {
        pname = "my-custom-name";
      });
    };
  };

  luaPackages = final.lua.pkgs;
}
```

However, this approach only overrides the default Lua interpreter.

The following template applies the overlay for all available Lua interpreters in nixpkgs:

``` nix
final: prev: let
  inherit (final.lib.attrsets) filterAttrs mapAttrs;
  isLua = pkg-name: pkg: pkg ? luaversion;

  # I can just add my modifications by using `mapAttrs` on `luaInterpreters`.
  # However, after doing this, calling `luaInterpreters.override` will undo my
  # modifications. This is due to the way `lib.makeOverridable` works. It
  # keeps a reference to the original function and calls it with modified
  # arguments.
  mkExtendedLuaInterpreters = {...} @ args: let
    # Support overrides
    interpreters = prev.luaInterpreters.override args;
  in
    mapAttrs (k: v:
      v.override {
        packageOverrides = luafinal: luaprev: {
          luarocks-nix = luaprev.luarocks-nix.overrideAttrs (oa: {
            pname = "my-custom-name";
          });
        };
      }) (filterAttrs isLua interpreters);

  extendedLuaInterpreters = final.lib.makeOverridable mkExtendedLuaInterpreters {};
in {
  # Override all available Lua interpreters
  luaInterpreters = extendedLuaInterpreters;
}
```

## See Also

- [Lua user guide in the nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#users-guide-to-lua-infrastructure)

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>

[^1]: <https://reddit.com/r/NixOS/comments/q7ns3l/interpreter_with_lua/>
