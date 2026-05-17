<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Biome -->

[Biome](https://github.com/biomejs/biome) is a fast formatter and performant linter for <a href="JavaScript" class="wikilink" title="JavaScript">JavaScript</a>, TypeScript, JSX, JSON, CSS and GraphQL.

## Troubleshooting

#### Issue: Biome LSP in Neovim failed on NixOS due to dynamic linking error.

Logged in `/home/incogshift/.local/state/nvim/lsp.log`:

``` text
[ERROR] Could not start dynamically linked executable [...] NixOS cannot run dynamically linked executables intended for generic\nlinux environments out of the box [...]
```

#### Fix

Edit: `~/.local/share/nvim/mason/bin/biome`

Look for a section like this:

``` javascript
const PLATFORMS = {
    ...
    darwin: {
        x64: "@biomejs/cli-darwin-x64/biome",
        arm64: "@biomejs/cli-darwin-arm64/biome",
    },
    linux: {
        x64: "@biomejs/cli-linux-x64/biome",
        arm64: "@biomejs/cli-linux-arm64/biome",
    },
    ...
};
```

Replace the architecture path of your OS with the absolute path to `biome` in your system. Find it using:

``` bash
$ which biome
/etc/profiles/per-user/<user>/bin/biome
```

Then update the block (assuming `x64` Linux as the platform):

``` javascript
const PLATFORMS = {
    ...
    darwin: {
        x64: "@biomejs/cli-darwin-x64/biome",
        arm64: "@biomejs/cli-darwin-arm64/biome",
    },
    linux: {
        x64: "/etc/profiles/per-user/<user>/bin/biome",
        arm64: "@biomejs/cli-linux-arm64/biome",
    },
    ...
};
```

Reference for similar issues: [Stack Overflow](https://stackoverflow.com/a/78215911/27134695)

<a href="Category:JavaScript" class="wikilink" title="Category:JavaScript">Category:JavaScript</a>
