<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: SecureW2 JoinNow -->

<a href="{{PAGENAME}}" class="wikilink" title="JoinNow">JoinNow</a> is an application (product) from the SecureW2 company to join enterprise networks (like <a href="eduroam" class="wikilink" title="eduroam">eduroam</a>[^1]) easily form various operating systems.[^2]

## `SecureW2_JoinNow.run`

To run the SecureW2_JoinNow.run script, you require a <a href="Shell.nix" class="wikilink" title="Shell.nix">Shell.nix</a> which uses buildFHSEnv to create an FHS-compliant file system.

Save the following code into a shell.nix file alongside the SecureW2 script and run `nix-shell` to start the script:

``` nix
{
  pkgs ? import <nixpkgs> { },
}:
(pkgs.buildFHSEnv {
  name = "securew2-fhsenv";
  targetPkgs =
    pkgs:
    (with pkgs; [
      (python3.withPackages (ps: [ ps.dbus-python ])) # Run embedded Python code
      coreutils # Needs uname to identify architecture
      gnutar # Needed to extract emebedded archive
      libx11 # for GUI
      openssl # Required during Python import
      simpleTpmPk11 # Unknown use
      which # Used by shell script to find programs
      xdg-utils # Used by Python script to open links
      xwininfo # Unknown use
    ]);
  runScript = ./SecureW2_JoinNow.run;
}).env
```

## References

<references />

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>

[^1]: <https://www.securew2.com/solutions/eduroam>

[^2]: <https://www.securew2.com/multios>
