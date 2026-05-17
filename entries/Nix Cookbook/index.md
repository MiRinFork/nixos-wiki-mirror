<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix Cookbook -->

## Managing storage

### Reclaim space on Nix install?

#### Remove old generations

When you make changes to your system, Nix creates a new system <a href="generation" class="wikilink" title="generation">generation</a>. All of the changes to the system since the previous generation are stored there. Old generations can add up and will not be removed automatically by default. You can see your saved system generations with:

``` shell-session
  # nix-env --profile /nix/var/nix/profiles/system --list-generations
```

To keep just your current generation and the two older than it:

``` shell-session
  # nix-env --profile … --delete-generations +3
```

To remove all but your current generation:

``` shell-session
  # nix-env --profile … --delete-generations old
```

Apart from the system profile in `/nix/var/nix/profiles/system`, every user has profiles for their user environment and channels. The operations above may be repeated for those profiles. By default, they are located at `~/.nix-profile` and `~/.nix-defexpr/channels`. For more information on profile locations, see [Nix Manual - nix-env - Files](https://nix.dev/manual/nix/stable/command-ref/nix-env#files).

##### Generation trimmer script

For a smart interactive script which can handle all the normally available profile types across NixOS and be more conservative and safe than the built-in Nix generations deletion commands, see <a href="NixOS_Generations_Trimmer" class="wikilink" title="NixOS Generations Trimmer">NixOS Generations Trimmer</a>.

#### Garbage collection

As you work with your system (installs, uninstalls, upgrades), files in the <a href="Nix_store" class="wikilink" title="Nix store">Nix store</a> are not automatically removed, even when no longer needed. Nix instead has a garbage collector which must be run periodically (you could set up, e.g., a cron to do this).

``` shell
  $ nix-collect-garbage
```

This is safe so long as everything you need is listed in an existing *generation* or garbage collector root (**gcroot**).

If you are sure you only need your current generation, this will delete all old generations and then do garbage collection:

``` shell
  $ nix-collect-garbage -d
```

On NixOS, you can enable a service to automatically do daily garbage collection:

#### Deduplication

You may wind up with duplicate files in your Nix store. [Data deduplication](https://en.wikipedia.org/wiki/Data_deduplication) is a resource intense process while running, so is not done automatically by default. Often you can save about 25-35% of your store space by optimizing the store though. This will perform a deduplication process on your Nix store (hard link duplicates together):

``` shell
  $ nix store optimise
```

With standalone Nix, you can set the `nix.conf` option below to set this to happen periodically:

For NixOS, the option to set this is:

NixOS will update `nix.conf` for you, with that setting.

#### Nix manual references

- [Nix Manual - Quick Start](https://nix.dev/manual/nix/stable/quick-start)
- [Nix Manual - Garbage Collection](https://nix.dev/manual/nix/stable/package-management/garbage-collection.html)
- [Nix Manual - nix-store --optimize](https://nix.dev/manual/nix/stable/command-ref/nix-store/optimise)
- [NixOS Manual - Cleaning the Nix store](https://nixos.org/manual/nixos/#sec-nix-gc)

#### Deeper cleaning

- <a href="Storage_optimization" class="wikilink" title="Storage optimization">Storage optimization</a> goes into more depth on these options
- <a href="Cleaning_the_nix_store" class="wikilink" title="Cleaning the nix store">Cleaning the nix store</a> has more specialized tips and further links to helper tools.

## Environment tasks

### Creating shell scripts

Arbitrary system shell scripts can be created with [pkgs.writeShellScriptBin](https://github.com/NixOS/nixpkgs/blob/808125fff694e4eb4c73952d501e975778ffdacd/pkgs/build-support/trivial-builders.nix#L225-L250). It creates a derivation which you add to [environment.systemPackages](https://nixos.org/nixos/manual/#sec-declarative-package-mgmt).

``` nix
{ pkgs, ... }:

let
  helloWorld = pkgs.writeShellScriptBin "helloWorld" ''
    echo Hello World
  '';

in {
  environment.systemPackages = [ helloWorld ];
}
```

### Creating periodic services

Using the [systemd support](https://nixos.org/nixos/manual/#sec-systemctl) periodic services can be defined. In this case a service named `simple-timer` writes out the current time to `/tmp/simple-timer.log` every minute. \<syntaxHighlight lang="nix\> { pkgs, ... }:

{

` systemd = {`  
`   timers.simple-timer = {`  
`     wantedBy = [ "timers.target" ];`  
`     partOf = [ "simple-timer.service" ];`  
`     timerConfig.OnCalendar = "minutely";`  
`   };`  
`   services.simple-timer = {`  
`     serviceConfig.Type = "oneshot";`  
`     script = ''`  
`       echo "Time: $(date)." >> /tmp/simple-timer.log`  
`     '';`  
`   };`  
` };`

}

</syntaxHighlight>

## Deprecating a specific input parameter in mkDerivation-style packages

Sometimes we want to rename some input parameter in .

E.G. an option \`withX\` that enables the X11 GUI for a certain app:

``` nix
{
  /*. . .*/
  withX ? true,
  /*. . .*/
}:

stdenv.mkDerivation { /* . . . */}
```

Suppose that a new version of this package features a more agnostic GUI that can be linked to X11, GTK, Qt etc. Because of it, \`withX\` is no longer a descriptive name for this functionality.

However, renaming the parameter is dangerous, because other functions that call this function expect this parameter. The problem becomes more pronounced when in conjunction with custom, third-party overlays.

The solution is, roughly, to emit a warning about the old parameter being used, reporting the user to the new parameter:

``` nix
{
  /*. . .*/
  withX ? null,
  withGui ?
  if (withX != null) then
    lib.warn ''
      withX is deprecated and will be removed in the next release;
      use withGui instead.
    '' withX
  else
    true
  /*. . .*/
}
```

With this warning, consumers will have time to patch their codes.

## Bulk pre-download all dependencies of a package

Sometimes we need to download all source dependencies of a package. E.G. a long build is being planned, so we first download all needed files, so that after that we only need to worry about local (non-Internet) issues.

Here is a one-liner for downloading all the source dependencies of a package (thanks Eelco Dolstra!):

``` shell

$> nix-store -r $(grep -l outputHash $(nix-store -qR $(nix-instantiate '<nixpkgs>' -A bochs) | grep '.drv$'))
```

Let's dissect this:

``` sh
## instantiate bochs into `.drv` files and print the filenames;
instantiate=$(nix-instantiate '<nixpkgs>' -A bochs)

## print all references/requirements, filtering the .drv files (which is where static derivations live)
requirements=$(nix-store -qR $instantiate | grep '.drv$')

## keep only the source derivations, since those will have a predefined hash of the output 
sources=$(grep -l outputHash $requirements)

## realize those derivations, downloading all sources and storing them in the nix store 
nix-store -r $sources
```

After that, all sources will be locally stored!

Source: [nix-dev thread](https://web.archive.org/web/20160829181620/http://lists.science.uu.nl/pipermail/nix-dev/2013-January/010438.html)

## Wrapping packages

If you need to wrap a binary of a package (or a non-binary), there are a few ways of doing it. The simplest of which is just creating a new binary that calls the old one:

``` nix
pkgs.writeShellScriptBin "hello" ''
  # Call hello with a traditional greeting 
  exec ${pkgs.hello}/bin/hello -t
''
```

The disadvantage of this way is that it doesn't propagate man pages and other paths from the old derivation. There are multiple ways of solving that:

``` nix
let
  wrapped = pkgs.writeShellScriptBin "hello" ''
    exec ${pkgs.hello}/bin/hello -t
  '';
in

pkgs.symlinkJoin {
  name = "hello";
  paths = [
    wrapped
    pkgs.hello
  ];
}
```

Similarly the following works too:

``` nix
pkgs.symlinkJoin {
  name = "hello";
  paths = [ pkgs.hello ];
  buildInputs = [ pkgs.makeWrapper ];
  postBuild = ''
    wrapProgram $out/bin/hello \
      --add-flags "-t"
  '';
}
```

If you prefer not to have every file symlinked and have a cleaner result, the following is also possible:

``` nix
pkgs.runCommand "hello" {
  buildInputs = [ pkgs.makeWrapper ];
} ''
  mkdir $out
  # Link every top-level folder from pkgs.hello to our new target
  ln -s ${pkgs.hello}/* $out
  # Except the bin folder
  rm $out/bin
  mkdir $out/bin
  # We create the bin folder ourselves and link every binary in it
  ln -s ${pkgs.hello}/bin/* $out/bin
  # Except the hello binary
  rm $out/bin/hello
  # Because we create this ourself, by creating a wrapper
  makeWrapper ${pkgs.hello}/bin/hello $out/bin/hello \
    --add-flags "-t"
''
```

And lastly, there is the possibility of wrapping things right inside the derivation you want to wrap, this is however discouraged and impractical in most cases, as it requires recompilation of it:

``` nix
pkgs.hello.overrideAttrs (oldAttrs: {
  buildInputs = oldAttrs.buildInputs or [] ++ [ pkgs.makeWrapper ];
  postInstall = oldAttrs.postInstall or "" + ''
    wrapProgram $out/bin/hello \
      --add-flags "-t"
  '';
})
```

## Securing Nix

See <a href="Security" class="wikilink" title="Security">Security</a>

## Debugging

### Common errors

#### Bad configuration option: gssapikexalgorithms

Found when using an SSH binary from Nix on typically RPM-based distros like CentOS, Fedora, Scientific Linux, Redhat, etc. Possible fixes, from least to most invasive:

1.  **The quick fix:** Just comment out the configuration option in the ssh config file
2.  If you want to keep the option in but don't need it to work (e.g., you're sharing a config across systems, but only use GSSAPI/Kerberos on another system): add to your ssh configuration
3.  Install the package instead of . This will fix ssh used directly, but some dependencies may still use the non-GSSAPI package.
4.  Force specific other packages to build with the GSSAPI version: for example, you might add `(git-repo.override { openssh = openssh_gssapi; })` to your list (if git-repo is the problematic package), or use <a href="overlays" class="wikilink" title="overlays">overlays</a> like:

` nixpkgs.overlays = [`  
`   (final: prev: {`  
`     mosh = prev.mosh.override { openssh = prev.openssh_gssapi; };`  
`   })`  
` ];`

</syntaxhighlight>

(which will fix <a href="mosh" class="wikilink" title="mosh">mosh</a> used as a dependency too)

1.  Force all packages that depend on openssh to use openssh_gssapi instead:

`nixpkgs.overlays = [`  
`  (final: prev: { openssh = prev.openssh_gssapi; } )`  
`];`

</syntaxhighlight>

#### Desktop environment does not find .desktop files

IF your DE does not look in `$HOME/.nix-profile/share` for .desktop files. You need to add that path to the `XDG_DATA_DIRS`, the position reflects precedence so files in earlier directories shadow files in later directories. This can be accomplished in various ways depending on your login manager, see [Arch wiki: Xprofile](https://wiki.archlinux.org/index.php/Xprofile) for more information. For example using `~/.xprofile` as follows:

``` console
$ export XDG_DATA_DIRS=$HOME/.nix-profile/share:/usr/local/share:/usr/share
```

Notice that you have to include the default locations on your system, otherwise they will be overwritten. Find out the proper paths using `echo $XDG_DATA_DIRS`. (Note: `export XDG_DATA_DIRS=$HOME/.nix-profile/share:$XDG_DATA_DIRS` did not work, XDG_DATA_DIRS ended up containing only `$HOME/.nix-profile/share:` which isn't even a valid path.)

NOTE: The above fix will make your programs installed by nix visible in your application menu, but you still will not be able to run them, because they are symlinked outside your XDG_DATA_DIRS paths, and are not executable (one or the other criteria must be met to run the program from a menu). This impacts KDE users, and potentially others. I noticed that on native NixOS with KDE, NixOS adds all these paths for each application to one's XDG_DATA_DIRS variable.

#### Error: the option has conflicting definitions

If while doing a

``` console
nixos-rebuild switch
```

you see an error like:

``` console
building Nix...
building the system configuration...
error: The option `systemd.services.postfix.serviceConfig.PIDFile' has conflicting definitions, in `/nix/var/nix/profiles/per-user/root/channels/nixos/nixos/modules/
services/mail/postfix.nix' and `/etc/nixos/configuration.nix'.
(use '--show-trace' to show detailed location information)
```

This means exactly what it says, but how to fix it? Assuming one of the nix files is your configuration file, then you want your version to stick, and not the version from some maintainer somewhere, you can use

``` nix
mkOverride 
```

, which is a nix property defined in lib. so in the example above, the option in conflict is 'systemd.services.postfix.serviceConfig.PIDFile', so to override it you would do something like:

``` nix
systemd.services.postfix.serviceConfig.PIDFile = pkgs.lib.mkOverride 0 "mynewvalue";
```

which will override the other value, and force yours to have priority.

## Auditing

### License stance

Example on how to check if a given list of packages (as returned by the *pkgs.nix* derivation) conforms to permitted licenses criteria:

``` nix
with rec {
  # Incomplete list, customize to your policies.
  permissiveLicense = v: v.license == "bsd3" || v.license == "mit" || v.license == "bsd2" || v.license == "publicDomain" || v.license == "asl20" || v.license == "zlib" || v.license == "bsdOriginal" || v.license == "openssl";

  # Omit some false-positive buildInputs like bash and perl.. those should be nativeBuildInputs rather?
  saneDep = d: d ? meta.license
      && builtins.substring 0 5 d.name != "bash-"
      && builtins.substring 0 5 d.name != "perl-";

  # Keep if the license is not allowed, or if has any (transitive) dep with a license that is not allowed.
  keepBadDeps = ds: builtins.filter (n: !(permissiveLicense n) || n.baddeps != []) (map derivToNode (builtins.filter saneDep ds));

  derivToNode = d: 
    { license = if builtins.typeOf d.meta.license == "string" 
                then d.meta.license
                else if builtins.typeOf d.meta.license == "list"  # can happen sometimes, could concat.. but have a look rather
                     then "MULTI"
                     else d.meta.license.shortName;
      name = d.name;
      baddeps = keepBadDeps (builtins.filter saneDep d.buildInputs);
    };
};
let ps = import ./pkgs.nix;  # pkgs.nix should result in a list of derivations to check
in keepBadDeps ps
```

Then exercise it in **nix repl**, using :p to force the result so we can actually see it:

``` nix
nix-repl> xs = import ./lic.nix
nix-repl> :p xs 
```

This will print a (somewhat unreadable) nested tree of derivation names and their licences, where (at least) at the roots there are not-allowed licenses.

Be sure to manually check them for being false positives - navigate to the derivation in the nixpkgs repo and eyeball the license info (it is updated every now and then), also cross-check with the original source to make sure.

### Vulnerabilities

See [vulnix](https://github.com/nix-community/vulnix).

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
