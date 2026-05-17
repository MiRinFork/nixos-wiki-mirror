<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Locales -->

NixOS allows to set the default [locale](https://en.wikipedia.org/wiki/Locale_(computer_software)) as well as individual locales in the system configuration file:

will set the language and the character set systemwide to the desired value. Specifically, defaultLocale will define the `LANG` environment variable.

In addition, with , the system will also support Venezuelan Spanish. The value `"all"` means that all locales supported by Glibc will be installed. A full list of supported locales can be found at <https://sourceware.org/git/?p=glibc.git;a=blob;f=localedata/SUPPORTED>.

And in the , it is possible to set the LC locales individually. This does allow fine-grained adjustments of the used locales. In the above example a mix of American English and Venezuelan Spanish is used. It is also possible to find these settings at [NixOS options](https://search.nixos.org/options). Just search for i18 locale.

## Troubleshooting when using nix on non-NixOS linux distributions

You may need to set the environmental variable LOCALE_ARCHIVE to point to your system's locale-archive. The following can be added to your .zshenv (zsh) or .profile (bash) and applies to Debian, Red Hat, and Arch derivatives:

``` bash
export LOCALE_ARCHIVE=/usr/lib/locale/locale-archive
```

And if that file from the local system is somehow broken:

``` bash
# May require a one-time installation with:
nix profile install nixpkgs#glibcLocales
# Using nix profile
export LOCALE_ARCHIVE="$(nix profile list --json | jq '.elements[] | select(.attrPath? and (.attrPath | type == "string") and (.attrPath | endswith("glibcLocales"))) | .storePaths[0]')/lib/locale/locale-archive"

# Legacy usage with `nix-env`: May require a one-time installation with: nix-env -iA nixpkgs.glibcLocales
export LOCALE_ARCHIVE="$(nix-env --installed --no-name --out-path --query glibc-locales)/lib/locale/locale-archive"
```

## Enable locale support in Nix shell

To support locales within a Nix shell, for example to get localised command output, you need to do something similar:

``` bash
pkgs.mkShell {
  # [other code omitted]
  LOCALE_ARCHIVE = "${pkgs.glibcLocales}/lib/locale/locale-archive";
}
```

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
