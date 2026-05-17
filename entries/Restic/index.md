<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Restic -->

[Restic](https://restic.net/) is a fast and secure backup program. NixOS packages both `restic` client (program used to make backups) and `restic-rest-server` (one of the backends to store the backups remotely, "repositories" in restic parlance).

## Installing

If you want to manually create restic backups, add `restic` to `environment.systemPackages` like so:

``` nix
environment.systemPackages = with pkgs; [
  restic
];
```

## Configuring

### Restic

NixOS provides options to create a systemd timer and a service that will create the backups. See [services.restic.backups options](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=services.restic.backups) and "[Backing up](https://restic.readthedocs.io/en/stable/040_backup.html)" in the restic documentation.

Note that NixOS includes an option to automatically create the repository by specifying    `services.restic.backups.`<name>`.initialize = true;`, as well as a wrapper to run restic in the same environment as the systemd jobs in `services.restic.backups.`<name>`.createWrapper`

### Restic Rest Server

Restic Rest Server is one of the options for a remote repository[^1]. It can be installed by enabling the `services.restic.server.enable` option. By default the server requires either providing it with `htpasswd` file or running it without authentication. If provided, the username and password pairs `htpassd` file will be used to authenticate the restic clients connecting to the server. To run the server without authentication, you can pass the flag using the `extraFlags` option like this: `services.restic.server.extraFlags = [ "--no-auth" ];`

#### Using a htpasswd file

A htpasswd file must be created using the `apacheHttpd` package. Assuming that you do not already have this package, you may run the following to generate the file using nix shell. Note that the file will be hidden due to the "." at the start of the file.

``` console
$ nix shell nixpkgs#apacheHttpd -c htpasswd -B -c .htpasswd YOUR_USER
```

To declaratively use the `htpasswd` file you will need to use a <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secret management method">secret management method</a>. The following example uses [sops-nix](https://github.com/Mic92/sops-nix).

#### Connecting a client

If using a `htpasswd` file, you will need to pass the URL to the configuration in this format:

`rest:https://user:pass@host:port/`

The user will need to be the same user as used when you created the `htpasswd` file. If your password includes special characters you will need to <a href="wikipedia:Percent-encoding" class="wikilink" title="percent-encode">percent-encode</a> the characters within the URL. See additional information in the [restic docs REST server section](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html#rest-server).

Below is an example of a configuration that connects to a remote repository using sops-nix for secrets.

## Security Wrapper

If you want to back up your system [without running restic as root](https://restic.readthedocs.io/en/latest/080_examples.html#backing-up-your-system-without-running-restic-as-root), you can create a user and security wrapper to give restic the capability to read anything on the filesystem as if it were running as root. The following will create the wrapper at `/run/wrappers/bin/restic`:

Note that you will have to set your Restic configuration to use the wrapper using the [services.restic.backups.<name>.package](https://search.nixos.org/options?channel=unstable&show=services.restic.backups.%3Cname%3E.package&from=0&size=50&sort=relevance&type=packages&query=services.restic.backups) option, for example [^2]:

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Backup" class="wikilink" title="Category:Backup">Category:Backup</a>

[^1]: <https://restic.readthedocs.io/en/latest/030_preparing_a_new_repo.html#rest-server>

[^2]: <https://github.com/NixOS/nixpkgs/issues/341999#issuecomment-2558504576>
