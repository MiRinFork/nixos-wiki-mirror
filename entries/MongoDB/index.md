<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: MongoDB -->

<a href="wikipedia:MongoDB" class="wikilink" title="MongoDB">MongoDB</a> is a NoSQL database program.

## Installation

If no extra configuration is needed, you'll only use the following line to install and enable MongoDB. This will give you a mongodb with ***authentication disabled***, ***listening on* *127.0.0.1**'' and the database path to store the data is***/var/db/mongodb**''.

``` nix
...
services.mongodb.enable = true;
...
```

## Configuration

Here's an example with multiple options. Beware that putting your password in cleartext into the config should not be done. Please check <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Comparison of secret managing schemes">Comparison of secret managing schemes</a> for that matter.

``` nix
services.mongodb = {
  enable = true;
  package = pkgs.mongodb-7_0;
  enableAuth = true;
  initialRootPasswordFile = /path/to/secure/passwordFile;
  bind_ip = "10.5.0.2";
};
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Database" class="wikilink" title="Category:Database">Category:Database</a>
