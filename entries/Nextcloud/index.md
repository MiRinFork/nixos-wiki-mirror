<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nextcloud -->

[](https://nextcloud.com/) (<a href="wikipedia:en:{{PAGENAME}}" class="wikilink" title="wikipedia:en:{{PAGENAME}}">wikipedia:en:{{PAGENAME}}</a>) is a self-hosted web groupware and cloud software, offering collaboration on files, managing calendar events, contacts and tasks.

This article extends the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-nextcloud).

## Setup

A minimal example to get the latest Nextcloud version (for your specific NixOS release) running on localhost should look like this, replacing `PWD` with a 10+ char password that meets [Nextcloud's default password policy](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/user_password_policy.html).

After that you will be able to login into your Nextcloud instance at `http://localhost` with user `root` and password `PWD` as configured above.

## Configuration

Be sure to read the [Nextcloud module's documentation](https://nixos.org/manual/nixos/stable/index.html#module-services-nextcloud-basic-usage) in the [NixOS Manual](https://nixos.org/manual/nixos/stable/index.html).

### Apps

[Some apps](https://github.com/NixOS/nixpkgs/blob/0d7bf2685cc69bcb51430bbc0493e221f9c21c2d/pkgs/servers/nextcloud/packages/34.json) (use the file named <version>`.json`, where version is the installed Nextcloud version), which are already packaged on NixOS, can be installed directly with the following example configuration:

The apps mail, news and contacts will be installed and enabled in your instance automatically. Note that the Nextcloud version specified in `package` and `extraApps` need to match one of the stable Nextcloud versions available in the NixOS repository.

To manually fetch and install packages, you need to add them via the helper script `fetchNextcloudApp` by specifing the release tarball as url, the correct checksum and the license. Additional apps can be found via [Nextcloud app store](https://apps.nextcloud.com), while the [nc4nix](https://github.com/helsinki-systems/nc4nix) provides an easy reference for the required variables. Note that the declarative specification of apps via this approach requires manual updating of package version (url) and checksum for a new release.

It is even possible to fetch and build an app from source, in this example the development app [hmr_enabler](https://github.com/nextcloud/hmr_enabler).

Alternatively apps can be manually installed via the app store integrated in your Nextcloud instance by navigating in the profile menu to the site "Apps".

### TLS

If you would like to setup Nextcloud with Let's Encrypt TLS certificates (or certs from any other certificate authority) make sure to set `services.nextcloud.https = true;` and to enable it in the nginx-VirtualHost.

### Data storage

Nextcloud stores metadata in the database and files either on a local filesystem, external storage, or in an object storage.

#### Local filesystem

Using a filesystem with snapshot support, such as btrfs or zfs, may be useful for backup purposes

#### External storage

<https://docs.nextcloud.com/server/stable/admin_manual/configuration_files/external_storage_configuration_gui.html>

#### Object store

In this example we'll configure a local S3-compatible object store using Minio and connect it to Nextcloud

We'll need to run two commands to create the bucket `nextcloud` by using the access key `nextcloud` and the secret key `test12345`.

``` bash
mc alias set minio http://localhost:9000 ${accessKey} ${secretKey} --api s3v4
mc mb minio/nextcloud
```

### Mail delivery

Besides various mail delivery options and settings, mail clients like <a href="Msmtp" class="wikilink" title="Msmtp">Msmtp</a> can be used to configure mail delivery for Nextcloud. This can be useful for sending registration mails or system notifications etc. To configure Nextcloud to use a local mail delivery daemon, we configure `mail_smtpmode` to `sendmail` and a further sending mode.

``` nix
services.nextcloud = {
  [...]
  extraOptions = {
    mail_smtpmode = "sendmail";
    mail_sendmailmode = "pipe";
  };
};
```

Test mails can be send via administration interface in the menu section "Basic settings".

### Max upload file size

To increase the maximum upload file size, for example to 1 GB, add following option

### Secrets management

Do not suply passwords, hashes or keys via the settings option, since they will be copied into the world-readable Nix store. Instead reference a JSON file containing secrets using the `secretFile` option.

``` nix
services.nextcloud = {
  [...]
  secretFile = "/etc/nextcloud-secrets.json";
};
```

Consider using a <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secret management tool">secret management tool</a> instead of referencing an unencrypted local secrets file.

### Dynamic configuration

Unfortunately, some options can only be set 'interactively' in the database (either through the nextcloud-occ command line tool or the web UI), and not via the configuration file. One way to manage them "semi-declaratively" is to register a systemd script to reset the options on each redeploy:

``` nix
  systemd.services.nextcloud-custom-config = {
    path = [
      config.services.nextcloud.occ
    ];
    script = ''
      nextcloud-occ theming:config name "My Cloud"
      nextcloud-occ theming:config url "https://cloud.mine.com";
      nextcloud-occ theming:config privacyUrl "https://www.mine.com/privacy";
      nextcloud-occ theming:config color "#3253a5";
      nextcloud-occ theming:config logo ${./logo.png}
    '';
    after = [ "nextcloud-setup.service" ];
    wantedBy = [ "multi-user.target" ];
  };
```

Of course this is not ideal: changes through the web interface or occ client are still possible but will be overwritten the next redeploy, and removing a line from the script will not remove it from the configuration.

## Maintenance

### Upgrade

As you can see on [the package search](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=nextcloud), there is no default nextcloud package. Instead you have to set the current version in [`services.nextcloud.package`](https://search.nixos.org/options?channel=unstable&show=services.nextcloud.package&from=0&size=50&sort=relevance&type=packages&query=nextcloud). As soon a major version of Nextcloud gets unsupported, it will be removed from nixpkgs as well.

Upgrading then consists of these steps:

1.  Increment the version of `services.nextcloud.package` in your config by 1 (leaving out a major version is not supported)
2.  `nixos-rebuild switch`

In theory, your nextcloud has now been upgraded by one version. NixOS attempts `nextcloud-occ upgrade`, if this succeeds without problems you don't need to do anything. Check `journalctl` to make sure nothing horrible happened. Go to the `/settings/admin/overview` page in your nextcloud to see whether it recommends further processing, such as database reindexing or conversion.

### Database

You can access the mysql database, for backup/restore, etc. like this:

`sudo -u nextcloud -- mysql -u nextcloud `<options>

No password is required.

### Migration

If you want to migrate your Nextcloud instance from one place to another, keep in mind:

- Distribution-agnostic instructions are at <https://docs.nextcloud.com/server/stable/admin_manual/maintenance/migrating.html>
- You can use the [services.nextcloud.secretFile](https://search.nixos.org/options?show=services.nextcloud.secretFile) option to set secrets. Notably you'll likely want to inherit the following values from your old to your new instance:
  - [instanceid](https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/config_sample_php_parameters.html#instanceid)
  - [passwordsalt](https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/config_sample_php_parameters.html#passwordsalt)
  - [secret](https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/config_sample_php_parameters.html#secret)
- To be able to configure TLS for your new instance before you've updated your DNS record, you can use <a href="ACME#DNS_challenge" class="wikilink" title="ACME DNS Challenge">ACME DNS Challenge</a>. Don't forget to clear `acmeRoot`:

### Backups

You should make backups of both the database and your storage.

For the database, [services.mysqlBackup](https://search.nixos.org/options?show=services.mysqlBackup) or [services.postgresqlBackup](https://search.nixos.org/options?show=services.postgresqlBackup) may come in handy. For local storage backups, periodically taking a snapshot of a snapshot-enabled filesystem such as btrfs or zfs may be a good first step. Remember to also make off-site copies.

## Clients

### Nextcloudcmd

*nextcloudcmd* is a terminal client performing only a single sync run and then exits. The following example command will synchronize the local folder `/home/myuser/music` with the remote folder `/music` of the Nextcloud server `https://nextcloud.example.org`.

``` console
# nix shell nixpkgs#nextcloud-client -h --user example --password test123 --path /music /home/myuser/music https://nextcloud.example.org
```

The argument `-h` will enable syncing hidden files. For demonstration purpose username and password are supplied as an argument. This is a security risk and shouldn't be used in production.

Using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> we can create a systemd-timer which automatically runs the sync command every hour for the user `myuser`.

The login credentials will be written to a file called `.netrc` used *nextcloudcmd* for authentication to the Nextcloud server.

### Nextcloud Desktop

"nextcloud-client" is a nextcloud themed desktop client. It requires a keyring to store its login token. Without an active keyring, the user will be asked to login on every application startup.

## Tips and tricks

### Change default listening port

In case port 80 is already used by a different application or you're using a different web server than <a href="Nginx" class="wikilink" title="Nginx">Nginx</a>, which is used by the Nextcloud module, you can change the listening port with the following option:

### Enable Two-factor authentication

Two-factor authentication can be enabled for your server via the administration interface in your browser. There is no way to declare this setting via nix configuration, so you should follow the [official documentation](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/two_factor-auth.html) to set up Two-factor authentication.

### Enable HEIC image preview

HEIC image preview needs to be explicitly enabled. This is done by adjusting the `enabledPreviewProviders` option. Beside the default list of supported formats, add an additional line `"OC\\Preview\\HEIC"` for HEIC image support. See also [this list of preview providers](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#enabledpreviewproviders) for additional file types.

### Run Nextcloud in a sub-directory

Say, you don't want to run nextcloud at `your.site/` but in a sub-directory `your.site/nextcloud/`. To do so, we are going to add more configurations to nextcloud and to nginx to <a href="Nginx#TLS_reverse_proxy" class="wikilink" title="make">make</a> it a [reverse-proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).

First, define some overwritings. Nextcloud uses them to write out all URLs as if it runs in a sub-directory (which it is not.)

Make sure your nginx doesn't host nextcloud on your exposed port:

Redirect some well-known URLs which have to be found at your.site/.well-known towards your new nextcloud URL:

Finally, forward `your.site/nextcloud/` (exposed port 80 or 443) to your unexposed nextcloud port 8080 (defined earlier):

Note: If you have TLS (https) enabled, make sure nginx forwards to the correct port and nextcloud overwrites for the correct protocol.

### Use Caddy as webserver

Using a third-party module extension, the webserver <a href="Caddy" class="wikilink" title="Caddy">Caddy</a> can be used as an alternative by adding following options

/nextcloud-extras.nix" \];

services.nextcloud = {

` webserver = "caddy";`

}; </nowiki>}}

### Add users declaratively

Using a third-party module extension, additional users can be automatically configured using the `ensureUsers` option

/nextcloud-extras.nix" \];

environment.etc."nextcloud-user-pass".text = "PWD";

services.nextcloud = {

` ensureUsers = {`  
`   user1 = {`  
`     email = "user1@localhost";`  
`     passwordFile = "/etc/nextcloud-user-pass";`  
`   };`  
`   user2 = {`  
`     email = "user2@localhost";`  
`     passwordFile = "/etc/nextcloud-user-pass";`  
`   };`  
` };`

}; </nowiki>}}

## Troubleshooting

### Reading php logs

The [default Nextcloud setting](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/logging_configuration.html) is to log to *syslog*. To read php logs simply run

``` console
# journalctl -t Nextcloud
```

## App specific configuration

### Whiteboard

The [Whiteboard app](https://github.com/nextcloud/whiteboard) requires a running backend server which is also packaged in NixOS.

``` nix
environment.etc."nextcloud-whiteboard-secret".text = ''
  JWT_SECRET_KEY=test123
'';

services.nextcloud-whiteboard-server = {
  enable = true;
  settings.NEXTCLOUD_URL = "http://localhost";
  secrets = [ /etc/nextcloud-whiteboard-secret ];
};

# Expose whiteboard server in case you don’t operate your Nextcloud on localhost
services.nginx.virtualHosts.${config.services.nextcloud.hostName}.locations."/whiteboard/" = {
  proxyPass = "http://localhost:3002/";
  proxyWebsockets = true;
};
```

After applying the configuration configure the Nextcloud app to use it

``` bash
nextcloud-occ config:app:set whiteboard collabBackendUrl --value="http://localhost:3002" # localhost only
nextcloud-occ config:app:set whiteboard collabBackendUrl --value="http://cloud.example.com/whiteboard" # Public (The domain is your Nextcloud hostname) 
nextcloud-occ config:app:set whiteboard jwt_secret_key --value="test123"
```

### NextCloud Office

The [NextCloud Office app](https://nextcloud.com/office/) provides a Google Docs like online office suite integrated into NextCloud. For this to work it requires a document server that provides the editing functionality as a <a href="wikipedia:Web_Application_Open_Platform_Interface" class="wikilink" title="WOPI">WOPI</a> client.

The main options to use as WOPI client are [ONLYOFFICE](https://www.onlyoffice.com/) and [Collabora Online](https://www.collaboraonline.com). Although the documentation makes it look like Collabora Online is the only option, any document server with WOPI capabilities can be used.

To enable the NextCloud Office app, add the following to your configuration:

``` nixos
services.nextcloud = {
  enable = true;
  extraApps = {
    inherit (config.services.nextcloud.package.packages.apps) richdocuments;
  };
}
```

### ONLYOFFICE

You need to install both a document server and the [ONLYOFFICE Nextcloud plug-in](https://apps.nextcloud.com/apps/onlyoffice). There are several ways to install onlyoffice:

##### services.onlyoffice

Install the onlyoffice documentserver as described in <a href="ONLYOFFICE_DocumentServer" class="wikilink" title="ONLYOFFICE_DocumentServer">ONLYOFFICE_DocumentServer</a>.

Point the app to the document server from within the Nextcloud UI ("Administration Settings" -\> Administration -\> ONLYOFFICE), and make sure the 'services.onlyoffice.jwtSecretFile points to a file containing the same key as entered in the configuration of the Nextcloud app.

##### the documentserver_community Nextcloud app

(not tested)

##### in a docker/podman container

(not tested)

#### Collabora Online

Collabora comes in two flavors:

- Collabora Online For Business / For Enterprise
- Collabora Online Development Edition (aka CODE)

As the name indicates the former two require a license, while the latter is free for evaluation and personal use.

For easy deployment, there's the [richdocumentscode app](https://apps.nextcloud.com/apps/richdocumentscode) which bundles the CODE server. While being less performant than a standalone deployment of the CODE server, this solution does not require an additional service to be deployed and managed externally from NextCloud. Unfortunately the richdocumentscode app bundles the CODE server as an AppImage and therefore does not work out of the box on NixOS. Follow <https://github.com/NixOS/nixpkgs/issues/339798> if you want to get informed about packaging progress. Also CODE standalone is currently not packaged in nixpkgs (https://github.com/NixOS/nixpkgs/issues/218878).

### Memories

To enable hardware acceleration, nextcloud will need access to the graphics card with e.g:

``` nix
  users.users.nextcloud.extraGroups = [ "video" ];
  systemd.services.phpfpm-nextcloud.serviceConfig = {
    DeviceAllow = "/dev/dri/renderD128 rw";
    PrivateDevices = lib.mkForce false;
  };
```

You will still need to enable the relevant app configuration through "Administration Settings \> Memories \> HW Acceleration".

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
