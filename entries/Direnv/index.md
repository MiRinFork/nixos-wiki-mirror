<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Direnv -->

**[Direnv](https://direnv.net)** is an automatic environment setup utility, loading the specified project environment automatically when you enter your project directory, and reporting the loaded variables to you.

After installing from Nixpkgs using your preferred method of installation, you can set up the `.envrc` file at the root of your directory. Refer to the [Direnv Wiki](https://github.com/direnv/direnv/wiki) for some examples. For Nix projects, you will probably want to use the special `use_nix` keyword, that automatically loads the `shell.nix` file for your repository.

At the root of your repository, Direnv can start by allowing the recently-created `.envrc` file to execute:

``` console
$ direnv allow .
direnv: loading .envrc
direnv: using nix
[...]
 +SIZE +SOURCE_DATE_EPOCH +STRINGS +STRIP +TEMP +TEMPDIR +TMP +TMPDIR +_PATH +buildInputs +builder +checkPhase +cmakeFlags +configureFlags +doCheck +enableParallelBuilding +name +nativeBuildInputs +out +postCheck +preCheck +preConfigure +propagatedBuildInputs +propagatedNativeBuildInputs +shell +src +stdenv +system +testInputs +version ~PATH
```

Once Direnv detects that the current working directory is no longer inside the repository with a `.envrc` file, it will automatically unload the environment:

``` console
$ cd ..
direnv: unloading
```

## State

Direnv stores files in `$XDG_DATA_HOME/direnv`. It contains the information required to persist all allowed and denied `.envrc` files across the filesystem.

Keeping that directory means that an `.envrc` file only needs to be allowed once in order to run automatically.

## `nix-direnv` & `lorri`

While Direnv has [full support for Nix](https://github.com/direnv/direnv/wiki/Nix) development environments, third-party developers have improved upon Direnv's default implementation of the special `use_nix` keyword, resulting in the development of [`nix-direnv`](https://github.com/nix-community/nix-direnv) and [`lorri`](https://github.com/nix-community/lorri).

## Configuring on NixOS

There is a <a href="Overview_of_the_NixOS_Linux_distribution" class="wikilink" title="NixOS">NixOS</a> Module for Direnv (and `nix-direnv`) which automatically sets everything up in a given NixOS machine. The following line of code is everything that's necessary for NixOS to automatically install and hook Direnv to the available <a href="Command_Shell" class="wikilink" title="shells">shells</a> in the system:

For a full list of Direnv module options, see .

The NixOS module uses `nix-direnv` by default when Direnv is enabled. This behavior can be overridden by setting the option.

## User Customization & Repositories

Direnv is meant to be used as a personalized environment file so each user can set any necessary environment variables and/or run some setup scripts. As every user can have different environment needs (such as changing ports, location of `$TMPDIR`, project-specific VCS/PGP/SSH credentials) it’s recommended <strong>not</strong> to track or commit the `.envrc` so users may make adjustments for themselves. In fact, it’s best to add both to your ignorefile

    .direnv
    .envrc

to avoid accidentally checking in your personal setup (as seen in Nixpkgs’s repository). If you have a complex `.envrc` you wish to share, create a `.envrc.example` file that users can copy, symlink, or source depending on what works for them.

## Troubleshooting

### Hooking Shells

Depending on the shell you are using, you need to add a line in your shell configuration file. See the [*Hook* section of the Direnv Documentation](https://direnv.net/docs/hook.html) for more information.

Setting Direnv up using the NixOS module should do this by default. If direnv is not hooked, after having setup the NixOS module as described above please ensure, that you have no unmanaged shell configuration files, e.g. `.bashrc`, `.zshrc`, `.profile`, etc.. To determine whether a configuration file is unmanged, use the *list directory contents* command with the *long listing format* flag as shown below; if the file points to the nix store, it is managed, otherwise, it is unmanaged. If the appropriate configuration files are managed, and direnv is still not hooked, please ensure that your shell session has been reloaded after your latest rebuild.

``` shell-session
# Supposing managed .bashrc
$ ls -l ~/.bashrc
lrwxrwxrwx 1 ghb users 70 sep  1 11:41 /home/user/.bashrc -> /nix/store/wfzbf11b0mff8d1isp3lx5pr4ainbc7p-home-manager-files/.bashrc
```

## See Also

- [direnv.net](https://direnv.net/).
- The [Direnv Wiki](https://github.com/direnv/direnv/wiki/Nix).

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
