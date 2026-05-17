<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Imapsync -->

[Imapsync](https://imapsync.lamiral.info) is a versatile email migration tool that allows users to easily transfer emails between different IMAP email servers. It supports various features such as incremental sync, folder hierarchy preservation, and SSL encryption, making it a reliable choice for seamless email migration.

## Installation

To install Imapsync system wide add the following line to your system configuration

## Usage

Following example transfers all mails from server `mail1.example.org` to `mail2.example.org` via IMAP protocol using supplied credentials

``` console
imapsync \
  --host1 mail1.example.org --port1 993 --user1 user1 --password1 "secret1" \
  --host2 mail2.example.org --port2 993 --user2 user1 --password2 "secret1" \
  --addheader
```

Adding parameter `--addheader` helps if you want to sync draft and sent messages which usually have no headers to be identified.

### Filter messages and deletion

Additional flags `--delete1` and `--search` can be added to sync all messages before the specified date and to remove them after successfull migration to `host2`

``` console
imapsync \
  [...]
  --delete1 --delete1emptyfolders \
  --search "SENTBEFORE 01-Jan-2008"
```

<a href="Category:Mail_Server" class="wikilink" title="Category:Mail Server">Category:Mail Server</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
