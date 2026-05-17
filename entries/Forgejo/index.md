<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Forgejo -->

[Forgejo](https://forgejo.org/) is a lightweight <a href="wikipedia:Software_forge" class="wikilink" title="software forge">software forge</a>, with a highlight on being completely free software. It's a fork of <a href="Gitea" class="wikilink" title="Gitea">Gitea</a>.

This article extends the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-forgejo).

## Usage

NixOS provides a module for easily setting-up a Forgejo server, here is an example of typical usage with some optional features:

- Use Nginx to enable easy https configuration
- You can choose what database you want to use (postgres in this example)
- Support for [git-lfs](https://git-lfs.com/)
- Disabling registrations for personal servers
- Support for Actions, similar to Github Actions
- Support for sending email notifications
- No exposed secrets in the nix store, see <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Comparison of secret managing schemes">Comparison of secret managing schemes</a> and choose one

``` nixos
{ lib, pkgs, config, ... }:
let
  cfg = config.services.forgejo;
  srv = cfg.settings.server;
in
{
  services.nginx = {
    virtualHosts.${cfg.settings.server.DOMAIN} = {
      forceSSL = true;
      enableACME = true;
      extraConfig = ''
        client_max_body_size 512M;
      '';
      locations."/".proxyPass = "http://localhost:${toString srv.HTTP_PORT}";
    };
  };

  services.forgejo = {
    enable = true;
    database.type = "postgres";
    # Enable support for Git Large File Storage
    lfs.enable = true;
    settings = {
      server = {
        DOMAIN = "git.example.com";
        # You need to specify this to remove the port from URLs in the web UI.
        ROOT_URL = "https://${srv.DOMAIN}/"; 
        HTTP_PORT = 3000;
      };
      # You can temporarily allow registration to create an admin user.
      service.DISABLE_REGISTRATION = true; 
      # Add support for actions, based on act: https://github.com/nektos/act
      actions = {
        ENABLED = true;
        DEFAULT_ACTIONS_URL = "github";
      };
      # Sending emails is completely optional
      # You can send a test email from the web UI at:
      # Profile Picture > Site Administration > Configuration >  Mailer Configuration 
      mailer = {
        ENABLED = true;
        SMTP_ADDR = "mail.example.com";
        FROM = "noreply@${srv.DOMAIN}";
        USER = "noreply@${srv.DOMAIN}";
      };
    };
    secrets = {
      mailer.PASSWD = config.age.secrets.forgejo-mailer-password.path;
    };
  };

  age.secrets.forgejo-mailer-password = {
    file = ../secrets/forgejo-mailer-password.age;
    mode = "400";
    owner = "forgejo";
  };
}
```

## Setting up OpenSSH integration

If you plan to use SSH keys for authenticating your git usage, there's a little extra configuration to be done to set that up:

## Actions Runner

According to the [documentation](https://forgejo.org/docs/latest/admin/actions/#forgejo-runner) the `Forgejo runner` is:

> A daemon that fetches workflows to run from a Forgejo instance, executes them, sends back with the logs and ultimately reports its success or failure.

In order to use Actions, you will need to setup at least one Runner. You can use your server, another machine or both as runners. To register a runners you will need to generate a token. <https://forgejo.org/docs/latest/user/actions/#forgejo-runner>

You can create a server-wide Runner by going to *Profile Picture \> Site Administration \> Actions \> Runners \> Create new Runner.* Store your token in your <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secrets management system">secrets management system</a> of choice, then add the following to the configuration of the machine to be used as a runner:

``` nixos
{ pkgs, config, ... }: {
  services.gitea-actions-runner = {
    package = pkgs.forgejo-runner;
    instances.default = {
      enable = true;
      name = "monolith";
      url = "https://git.example.com";
      # Obtaining the path to the runner token file may differ
      # tokenFile should be in format TOKEN=<secret>, since it's EnvironmentFile for systemd
      tokenFile = config.age.secrets.forgejo-runner-token.path;
      labels = [
        "ubuntu-latest:docker://node:16-bullseye"
        "ubuntu-22.04:docker://node:16-bullseye"
        "ubuntu-20.04:docker://node:16-bullseye"
        "ubuntu-18.04:docker://node:16-buster"     
        ## optionally provide native execution on the host:
        # "native:host"
      ];
    };
  };
}
```

## Ensure users

Using the following snippet, you can declaratively ensure these users will always exist:

``` nixos
sops.secrets.forgejo-admin-password.owner = "forgejo";
systemd.services.forgejo.preStart = let 
  adminCmd = "${lib.getExe cfg.package} admin user";
  pwd = config.sops.secrets.forgejo-admin-password;
  user = "joe"; # Note, Forgejo doesn't allow creation of an account named "admin"
in ''
  ${adminCmd} create --admin --email "root@localhost" --username ${user} --password "$(tr -d '\n' < ${pwd.path})" || true
  ## uncomment this line to change an admin user which was already created
  # ${adminCmd} change-password --username ${user} --password "$(tr -d '\n' < ${pwd.path})" || true
''; 
```

You may remove the `--admin` flag to create only a regular user. The `|| true` is necessary, so the snippet does not fail if the user already exists.

Naturally, instead of sops, you may use any file or secret manager, as explained above.

## Adding a custom theme to Forgejo

Its possible to [customize the CSS styles and HTML templates of Forgejo](https://forgejo.org/docs/latest/contributor/customization/) declaratively using Nix. In this simple example i will show you how to: Create a basic theme, set it as the default theme and modify the home template.

## See also

- <a href="Gitlab" class="wikilink" title="Gitlab">Gitlab</a>, a web application offers git repository management, code reviews, issue tracking, activity feeds and wikis.
- <a href="Gitea" class="wikilink" title="Gitea">Gitea</a>, a web app, Git development repository and project management.

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
