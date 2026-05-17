<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Gitlab -->

The [GitLab](https://gitlab.com) web application offers git repository management, code reviews, issue tracking, activity feeds and wikis.

This article is an extension of the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-gitlab).

## Installation

### Generate Secrets

``` bash
sudo install -d -m 0700 /var/lib/gitlab/secrets
sudo sh -c 'openssl rand -hex 32 > /var/lib/gitlab/secrets/activeRecordPrimaryKey'
sudo sh -c 'openssl rand -hex 32 > /var/lib/gitlab/secrets/activeRecordDeterministicKey'
sudo sh -c 'openssl rand -hex 32 > /var/lib/gitlab/secrets/activeRecordSalt'
sudo chown -R gitlab:gitlab /var/lib/gitlab/secrets
sudo chmod 700 /var/lib/gitlab/secrets
sudo chmod 0600 /var/lib/gitlab/secrets/*
```

### Nix Configuration

``` nix
services.gitlab = {
  enable = true;
  databasePasswordFile = pkgs.writeText "dbPassword" "zgvcyfwsxzcwr85l";
  initialRootPasswordFile = pkgs.writeText "rootPassword" "dakqdvp4ovhksxer";
  secrets = {
    secretFile = pkgs.writeText "secret" "Aig5zaic";
    otpFile = pkgs.writeText "otpsecret" "Riew9mue";
    dbFile = pkgs.writeText "dbsecret" "we2quaeZ";
    jwsFile = pkgs.runCommand "oidcKeyBase" {} "${pkgs.openssl}/bin/openssl genrsa 2048 > $out";
    activeRecordPrimaryKeyFile       = "/var/lib/gitlab/secrets/activeRecordPrimaryKey";
    activeRecordDeterministicKeyFile = "/var/lib/gitlab/secrets/activeRecordDeterministicKey";
    activeRecordSaltFile             = "/var/lib/gitlab/secrets/activeRecordSalt";
  };
};

services.nginx = {
  enable = true;
  recommendedProxySettings = true;
  virtualHosts = {
    localhost = {
      locations."/".proxyPass = "http://unix:/run/gitlab/gitlab-workhorse.socket";
    };
  };
};

services.openssh.enable = true;

systemd.services.gitlab-backup.environment.BACKUP = "dump";
```

After applying the configuration head to <http://localhost> and login with username `root` and the password specified in `initialRootPasswordFile`.

Even though it is easy to provide the secrets in the `configuration.nix` with `pkgs.writeText`, keep in mind that it might not be the best method, because they get written to the world readable <a href="Nix_package_manager#Nix_store" class="wikilink" title="nix-store">nix-store</a> this way. A safer solution is to put them somewhere in the file system with the right chmod and owner set and include them using `./`<filename> or to use a <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secret managment tool">secret managment tool</a>

## Maintenance

Query info about your Gitlab instance

``` bash
gitlab-rake gitlab:env:info
```

Check for configuration errors

``` bash
gitlab-rake gitlab:check
```

## Tips and tricks

### Run Gitlab behind reverse proxy

In case your Gitlab instance is running behind a reverse proxy which does offer TLS encryption, you might need to adapt your configuration

``` nix
services.gitlab = {
  [...]
  https = true;
  port = 443;
  host = "git.example.org";
};
```

### Feature Flags

You can declaratively enable [Gitlab Feature Flags](https://gitlab-docs-d6a9bb.gitlab.io/ee/user/feature_flags.html) using `extraGitlabRb`:

``` nix
{
  services.gitlab = {
    enable = true;
    extraGitlabRb = ''
      Feature.enable(:issue_date_filter)
    '';
    # Other configuration...
  };
}
```

### Migrating an existing Gitlab to a Nixos installation

Make a backup on the old installation following the [Gitlab backup guide](https://docs.gitlab.com/administration/backup_restore/backup_gitlab/). It is important to be on the same version and edition that you want to install on your new server.

Then install a Gitlab on the NixOS. Make sure you set the same secrets like on the old installation.

After a successful deploy:

1.  Stop the Gitlab service using `systemctl stop gitlab.service`.
2.  Start Gitaly `systemctl start gitaly.service`
    - It gets stopped when gitlab.service stops.
3.  Then copy the backup \*\_gitlab_backup.tar to the backup folder
    - `cp 1719619965_2024_06_29_16.11.4_gitlab_backup.tar /var/gitlab/state/backup`
4.  Run `sudo -u gitlab gitlab-rake gitlab:backup:restore BACKUP=<name before the _gitlab_backup.tar>` .
    - For example `sudo -u gitlab gitlab-rake gitlab:backup:restore BACKUP=1719619965_2024_06_29_16.11.4`
5.  You will be interactively asked what should be done.
    - You will most likely be saying yes hrtr
6.  Start the Gitlab Service again using `systemctl start gitlab.service`.

You may need to rebuild the system for everything to properly come up.

## Troubleshooting

### Error 422 The change you requested was rejected on login

There might be different reasons for this error to show up after a failing login. One possible issue could be that your Gitlab instance is configured to be served with SSL encryption but running unencrypted behind a reverse proxy

``` nix
services.gitlab = {
  enable = true;
  port = 443;
  https = true;
[...]
```

To solve this, add following http headers to your upstream reverse proxy. In this example for the web server <a href="Caddy" class="wikilink" title="Caddy">Caddy</a> but it can be set for others too

``` nix
caddy = {
  enable = true;
  virtualHosts = {
    "git.example.org".extraConfig = ''
      reverse_proxy http://10.100.0.3 {
        header_up X-Forwarded-Proto https
        header_up X-Forwarded-Ssl on
      }
    '';
  };
};
```

### Login page accessible, but root login fails after fresh install

Apparently, it can happen that no root user is created (or at least not fully created in the database) when building the system with a newly configured Gitlab service.

In this case, it can help to stop the Gitlab service, drop the postgres database and reboot the system. This sequence instantiates the Gitlab root user. With that, it's possible to log in with user "root" and the password configured in "initialRootPasswordFile".

``` bash
# stop the gitlab stack
systemctl stop gitlab.service

# drop the database
sudo -u postgres dropdb gitlab

# reboot (just starting the gitlab service again seems not to be sufficient)
sudo reboot
```

## Notes

Gitlab will add a user "gitlab" to your NixOS, many tutorials online point to using git over ssh with the user "git", which in our case will not match since there is no user "git". If you configure your SSH hosts with ~/.ssh/config this should work:

` Host your.selfhosted.com`  
`   HostName your.selfhosted.com`  
`   User gitlab`  
`   IdentityFile /path/to/your/ssh/private/key`  
`   # The following are optional:`  
`   IdentitiesOnly yes`  
`   PreferredAuthentications publickey`

Note: If you want to just be able to copy the url from the clone Gitlab menu consider changing the git user to the generated "gitlab" user or create some other user yourself. See gitlabs reference [Change the name of the git user or group](https://docs.gitlab.com/omnibus/settings/configuration/#change-the-name-of-the-git-user-or-group)

<references />

## See also

- <a href="Gitea" class="wikilink" title="Gitea">Gitea</a>, a web app, Git development repository and project management.
- <a href="Forgejo" class="wikilink" title="Forgejo">Forgejo</a>, a web application offers Git development repositories and project management. Community fork of Gitea.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
