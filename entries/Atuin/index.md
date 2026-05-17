<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Atuin -->

[Atuin](https://atuin.sh/) replaces your existing shell history with a SQLite database, and records additional context for your commands. Additionally, Atuin (optionally) syncs your shell history between all of your machines.

## Enable in your terminal

Atuin can be enabled using home-manager. Documentation for all settings can be found at <https://docs.atuin.sh/configuration/config/> .

### Disable up-arrow / Ctrl+R keybindings

Key bindings are not part of Atuin settings and need to be passed as flags instead.

### Enable synchronization with atuin.sh

#### Imperatively

To synchronize your history with atuin.sh you first need to register an account or login with the cli utility. Doing that will create a key and a session token in `~/.local/share/atuin`

``` bash
atuin register -u <YOUR_USERNAME> -e <YOUR EMAIL>
```

To backfill your existing shell history run

``` bash
atuin import auto
atuin sync # Optionally sync your history to the server
```

#### Declaratively

You can manage your atuin session declaratively by setting the `session_path` and `key_path` options to files containing a session token and a key. You can obtain these two files by registering as described above and copying them from `~/.local/share/atuin/key` and `~/.local/share/atuin/session`. The example below uses agenix

### zsh autosuggestions

If zsh autosuggestions is enabled, atuin automatically adds itself as the first autosuggestion strategy; see [atuin docs](https://docs.atuin.sh/integrations/#zsh-autosuggestions)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
