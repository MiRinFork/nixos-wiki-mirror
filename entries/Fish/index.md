<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fish -->

fish, the [Friendly Interactive Shell](https://fishshell.com/), is a <a href="Command_Shell" class="wikilink" title="command shell">command shell</a> designed around user-friendliness.

## Installation

### NixOS System Installation

To install fish for a user on a regular nixos system:

Replace `myuser` with the appropriate username.

### Home Manager

For a user-specific installation managed by <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, use the following configuration:

Replace `myuser` with the appropriate username.

You can enable the fish shell and manage fish configuration and plugins with Home Manager, but to enable vendor fish completions provided by Nixpkgs you will also want to enable the fish shell:

## Configuration

Available fish plugins packaged in Nixpkgs can be found via the [fishPlugins package set](https://search.nixos.org/packages?query=fishPlugins).

### NixOS System Configuration

To enable fish plugins system-wide, add your preferred plugins to \`environment.systemPackages\`:

Example of a file containing the definition of a fish plugin.

For a full list of fish module options, refer to [programs.fish](https://search.nixos.org/options?query=programs.fish).

### Home Manager

An example configuration in Home Manager for adding plugins and changing options could look like this:

For the full list of available home-manager options for fish, refer to the [module source](https://github.com/nix-community/home-manager/blob/master/modules/programs/fish.nix).

## Tips and tricks

### Setting fish as default shell

Using fish as the the login shell can cause compatibility issues. For example, certain recovery environments such as systemd's emergency mode to be completely broken when fish was set as the login shell. ArchWiki presents an [alternative solution](https://wiki.archlinux.org/title/Fish#Modify_.bashrc_to_drop_into_fish), keeping bash as the system shell but having it exec fish when run interactively.

Here is one solution, which launches fish unless the parent process is already fish:

For a more detailed explanation, please see the [aforementioned ArchWiki page](https://wiki.archlinux.org/title/Fish#Modify_.bashrc_to_drop_into_fish).

**Setting fish as default for Gnome Console**

It is possible to set fish as the interactive non-login shell for Gnome Console without setting fish as the login shell (the login shell in /etc/passwd for your user will not be fish).

If you still want to set fish as the login shell, see <a href="Command_Shell#Changing_the_default_shell" class="wikilink" title="Command Shell#Changing the default shell">Command Shell#Changing the default shell</a>.

#### Disable man page generation

Some users suffer from slow build due to fish enabling \`documentation.man.generateCaches\`. You may force false.

`documentation.man.generateCaches = false`*`;`*

For home-manager users, man cache need to be disabled in programs

`programs.man.generateCaches = false`*`;`*

#### Running fish interactively with zsh as system shell on darwin

Zsh users on darwin will need to use a modified version of the above snippet. As written, it presents two incompatibilities. First, being BSD-derived, MacOS's `ps` command accepts different options. Second, this is a script intended for bash, not zsh. MacOS uses zsh as its default shell.

``` nix
programs.zsh = {
  initExtra = ''
    if [[ $(ps -o command= -p "$PPID" | awk '{print $1}') != 'fish' ]]
    then
        exec fish -l
    fi
  ''
};
```

### Show that you are in a nix-shell

Add this to the `fish_prompt` function (usually placed in `~/.config/fish/functions/fish_prompt.fish`):

``` fish
set -l nix_shell_info (
  if test -n "$IN_NIX_SHELL"
    echo -n "<nix-shell> "
  end
)
```

and `$nix_shell_info` to the echo in that function, e.g.:

``` fish
echo -n -s "$nix_shell_info ~>"
```

Now your prompt looks like this:

- outside: `~>`
- inside: <nix-shell>` ~>`

You can directly start nix-shell in fish with `nix-shell --run fish`.

### Environments

Here are some examples of helper functions that put you in a nix-shell with the given packages installed.

You can either put these in `programs.fish.functions` with home-manager or in `~/.config/fish/functions/fish_prompt.fish` without.

#### haskellEnv

``` fish
function haskellEnv
  nix-shell -p "haskellPackages.ghcWithPackages (pkgs: with pkgs; [ $argv ])"
end
```

`# Invocation: haskellEnv package1 packages2 .. packageN`

#### pythonEnv

``` fish
function pythonEnv --description 'start a nix-shell with the given python packages' --argument pythonVersion
  if set -q argv[2]
    set argv $argv[2..-1]
  end
 
  for el in $argv
    set ppkgs $ppkgs "python"$pythonVersion"Packages.$el"
  end
 
  nix-shell -p $ppkgs
end

# Invocation: pythonEnv 3 package1 package2 .. packageN
# or:         pythonEnv 2 ..
```

## See also

- <a href="Command_Shell" class="wikilink" title="Command Shell">Command Shell</a>

<a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
