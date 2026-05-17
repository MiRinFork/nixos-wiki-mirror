<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: IPFS -->

[IPFS](https://ipfs.tech/) (InterPlanetary File System) is a protocol, hypermedia and file sharing peer-to-peer network for storing and sharing data in a distributed file system. IPFS aims to make the web more efficient, resilient, and open by using content-addressing to uniquely identify each file in a global namespace. IPFS also enables persistent availability of data with or without internet backbone connectivity, and complements HTTP.

## Installation

Install and enable *kubo* (which is the recommended IPFS implementation) and add your user to the correct group

``` nix
services.kubo = {
  enable = true;
};
users.users.alice.extraGroups = [ config.services.kubo.group ];
```

Note that after enabling this option and rebuilding your system, you need to log out and back in for the "IPFS_PATH" environment variable to be present in your shell and for your user to become part of the ipfs group. Until you do that, the CLI tools won't be able to talk to the daemon by default.

## Usage

Publish a file and read it afterwards

``` console
# echo "hello world" > hello
# ipfs add hello
This should output a hash string that looks something like:
QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o
# ipfs cat <that hash>
```

Download a file given a hash

``` console
# ipfs get <hash>
```

Publish and print directory content. For the *ls* command, use the hash of the root directory.

``` console
# ipfs add -r folder
# ipfs ls <hash>
# ipfs ls <hash>/subdirectory
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
