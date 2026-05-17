<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Command Shell -->

A [shell](https://en.wikipedia.org/wiki/Unix_shell) is a program that translates text commands (like , , etc) into instructions for your computer. The default shell on NixOS is <a href="bash" class="wikilink" title="bash">bash</a>, but it can be easily changed.

## Enable

When adding a new shell, always enable the shell system-wide, even if it's already enabled in your <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> configuration, otherwise it won't source the necessary files.

For example, for <a href="Zsh" class="wikilink" title="Zsh">Zsh</a>:

## Changing the default shell

### For all users

To set a command shell as the default for all users, use the [`defaultUserShell`](https://search.nixos.org/options?query=defaultUserShell) option.

For example, to set Zsh as the default user shell for all users(including root):

### For a specific user

To set a command shell as the default for a particular user, use the [`<name>.shell`](https://search.nixos.org/options?query=%3Cname%3E.shell) option.

For example, to set user "myuser"'s shell to <a href="fish" class="wikilink" title="fish">fish</a>:

You can also choose whether or not a user should use the default shell:

## Using a different shell in nix-shell and nix develop

By default, both `nix develop` and `nix-shell` launch an interactive bash shell. However, it is possible to configure these environments to use an alternative shell.

There are multiple approaches available:

### nix-your-shell

Refer to [nix-your-shell](https://github.com/MercuryTechnologies/nix-your-shell) for installation and usage instructions.

### any-nix-shell

Refer to [any-nix-shell](https://github.com/haslersn/any-nix-shell) for installation and usage instructions.

### Aliasing command

A simple, lightweight method is to alias the relevant commands to invoke the shell directly. For example:

There are some caveats with this approach:

- Nested shells will require you to type `exit` twice, once to leave the inner shell and once to exit the Nix shell environment itself.
- Potential for alias conflicts as overriding commands can introduce unintended side effects in scripts or other tooling that expects the standard behavior.

## Using Flakes

If you are using <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> with fish, the 'command-not-found' error message will not work correctly, but can be fixed by disabling the builtin Nix `command-not-found` program:[^1]

## See also

- <a href="Fish" class="wikilink" title="Fish">Fish</a>
- <a href="Nushell" class="wikilink" title="Nushell">Nushell</a>
- <a href="Zsh" class="wikilink" title="Zsh">Zsh</a>
- <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>

## References

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>

[^1]: <https://github.com/NixOS/nixpkgs/issues/425613#issuecomment-3076081921>
