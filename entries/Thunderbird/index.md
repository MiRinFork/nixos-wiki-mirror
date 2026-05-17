<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Thunderbird -->

[Thunderbird](https://www.thunderbird.net/) is an open-source e-mail client for desktop environments, which also functions as a full personal information manager with a calendar and address book, as well as an RSS feed reader, chat client (IRC/XMPP/Matrix), and news client.

## Install Thunderbird

Set `programs.thunderbird.enable = true`.

## Configuration of Thunderbird

Thunderbird stores configuration and data in the hidden .thunderbird folder in the home directories. There are the following solutions:

- Use Nixpkgs, currently setting policies and preferences is supported.
- Use <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>.
- Manual configuration with the Thunderbird GUI and backup (and move to others PCs) of the .thunderbird folder. Using IMAP with server-side storage will enable to have several instances of Thunderbird with the same settings and e-mail content.

## Troubleshooting

### Change to Betterbird

Currently the Thunderbird fork [Betterbird](https://www.betterbird.eu) is not in nixpkgs - its possible to run as flatpak though.

## References

- Thunderbird website: <https://www.thunderbird.net/>
- Thunderbird source code: <https://hg.mozilla.org/comm-central>
- [List of Nixpkgs' Thunderbird options](https://search.nixos.org/options?query=programs.thunderbird)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
