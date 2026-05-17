<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nushell -->

[Nushell](https://www.nushell.sh/) is a powerful and modern non-POSIX <a href="Command_Shell" class="wikilink" title="shell">shell</a> written in Rust

## Installation

Using nushell as a login shell is not recommended. Since nushell is not a POSIX shell, it cannot execute the global shell rcfiles, which means that various environment variables that the general NixOS configuration expects to be set will not be set. To avoid these problems use the default bash interactive shell as a login shell and launch nushell from there: The <a href="Command_Shell" class="wikilink" title="Command Shell">Command Shell</a> page explains the process for setting shells as login shells if this is still desired.

## Configuration

Nushell can be configured with <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

#### Example

A configuration with [Starship](https://starship.rs/) prompt and autosuggestion support with [carapace](https://carapace.sh/) or [fish shell](https://fishshell.com/):

## See also

- <a href="Command_Shell" class="wikilink" title="Command Shell">Command Shell</a>

<a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
