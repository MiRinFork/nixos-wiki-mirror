<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/Automatic Updates -->

[nixpkgs-update](https://github.com/nix-community/nixpkgs-update) is used by <a href="r-ryantm" class="wikilink" title="r-ryantm">r-ryantm</a> for automated updates (through creating [update pull requests](https://github.com/NixOS/nixpkgs/issues?q=is%3Apr%20author%3Ar-ryantm)).  
It uses package repository information from Repology.org (though that requires other projects to detect the update), the GitHub releases API, and, if available, the package `passthru.updateScript`. For more information, see the [official documentation](https://nix-community.github.io/nixpkgs-update/).

If you're wondering why your package isn't receiving automated updates, it can be useful to check the [r-ryantm logs](https://r.ryantm.com/log/).

## Disabling nixpkgs-update for individual packages

Put the following comment somewhere in the package file:

``` nix
# nixpkgs-update: no auto update
```

## Update Scripts

Update Scripts can be added to packages by setting `passthru.updateScript`. This is then executed by <a href="r-ryantm" class="wikilink" title="r-ryantm">r-ryantm</a> to create an update pull request. It can be manually invoked via `nix-shell maintainers/scripts/update.nix --argstr package `<packagename>.

List of prepackaged update scripts:

### nix-update by Mic92

[nix-update](https://github.com/Mic92/nix-update) works for a range of different sources and will do the right thing most of the time.

``` nix
passthru.updateScript = nix-update-script { };
```

If you want functionality similar to that of unstableGitUpdater but with the additional handlers offered by nix-update, use:

``` nix
passthru.updateScript = nix-update-script { extraArgs = [ "--version=branch" ]; };
```

#### Setting a custom for prefixed releases

`nix-updater` expects an all-numeric version such as `1.2.3` and fails when there's a prefix (`v1.2.3`). When that happens, you'll need to set a custom regex:

``` nix
passthru.updateScript = nix-update-script {
  extraArgs = [ "--version-regex=v([\\d.]+)" ];
};
```

Note there's only one capturing group (in parentheses). Due to a quirk in the updater, nesting capturing groups won't give the results you expect. The regex implicitly matches the whole line.

### Git Updater

Updates to the latest git tag. This updater only regenerates the source hash and is therefore unsuitable for package definitions with more than one FOD hash (e.g. Rust's `cargoHash`).

``` nix
passthru.updateScript = gitUpdater {
  ignoredVersions = ""; # Optional - (grep -E) Filter to ignore versions
  allowedVersions = ""; # Optional - (grep -E) Filter to ignore versions
  rev-prefix = "v";     # Optional - set if tags have a prefix before the version number
  odd-unstable = false; # Optional - Ignore odd numberd versions
  patchlevel-unstable = false; # Optional - Ignore patchlevel versions
  url = null;           #  Optional - Set this to a git url when the src is not a git repo
};
```

Source: <https://github.com/NixOS/nixpkgs/blob/master/pkgs/common-updater/git-updater.nix>

### Unstable Git Updater

Updates to the latest git commit. This updater only regenerates the source hash and is therefore unsuitable for package definitions with more than one FOD hash (e.g. Rust's `cargoHash`).

``` nix
passthru.updateScript = unstableGitUpdater {
  branch = null; # Optional - Which branch should be updated from
  url = null; # Optional - The git url, if empty it will be set to src.gitRepoUrl
  tagPrefix = "v"; # Optional - strip this prefix from a tag name
  hardcodeZeroVersion = false; # Optional - Use a made-up version "0" instead of latest tag. Use when the project's tagging system is incompatible with what we expect from versions
  tagFormat = "*"; # Optional - A `git describe --tags --match '<format>'` pattern that tags must match to be considered
  tagConverter = null; # Optional - command to convert more complex tag formats. It receives the git tag via stdin and should convert it into x.y.z format to stdout. Example: https://github.com/NixOS/nixpkgs/blob/c0d71ad01729bf1acca3200ab418301ff2f9ee81/pkgs/by-name/ch/chirp/package.nix#L69-L73
  shallowClone = true; # Optional - do not perform a complete clone
};
```

Source: <https://github.com/NixOS/nixpkgs/blob/master/pkgs/common-updater/unstable-updater.nix>

## Working with Monorepos

A monorepo contains multiple packages that are released individually. You will need to define `passthru.updateScript` and add a version regex (`nix-update-script`) or a prefix (git updaters).

### When automatic updates fail

Updates can fail with "no matching tag found" when the repo pushes out a large number of packages. `nix-update-script` examines approximately the last 20 releases. In this case, you can switch to the git updater with `rev-prefix`.

The git updaters also look at a limited window of changes. You still need to verify periodically that your package has updated to the latest version and make the edits by hand if it's behind.

### A special note for Python monorepos

The committers run a fast bulk python update script several times a year. This script ignores `passthru.updateScript` and use the latest git tag. That often breaks monorepo-based packages by setting the wrong `src.version` expression and/or version number.

Set `passthru.skipBulkUpdate = true;` to have the special updater skip your package.

## Additional Resources

- [Contributing to nixpkgs - Automatic Package Updates (github.com/nixos/nixpkgs)](https://github.com/NixOS/nixpkgs/blob/master/pkgs/README.md#automatic-package-updates)
- [R. RyanTM nixpkgs-update bot information](https://nix-community.org/update-bot/)

<a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>
