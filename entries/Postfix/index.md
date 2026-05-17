<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Postfix -->

Postfix is mail transfer agent (MTA) that routes and delivers electronic mail. It accepts email from other email servers and relays sent email from a email client.

This page describes a basic virtual user setup with <a href="Dovecot" class="wikilink" title="Dovecot">Dovecot</a>. User authentication is configured in a separate passwd-file and thus decoupled from system users. Authentication is handled by <a href="Dovecot" class="wikilink" title="Dovecot">Dovecot</a>. Refer to that article for details.

Warning: this Postfix configuration is a minimal working example and not hardened. That means, if outgoing traffic on port 25 is not blocked, spammers might hijack your Postfix instance for spamming activities. Refer to internet literature for hardening tips.

# SSL Certificate with ACME

This article assumes a working <a href="ACME" class="wikilink" title="ACME">ACME</a> configuration for certificate renewal.

``` nix
{
  config,
  ...
}:
let
  sslCertDir = config.security.acme.certs."example.org".directory;
  domainName = "example.org";
in
{
  # further postfix configuration goes here
  ...
}
```

# Open firewall ports

Open firewall ports for SMTP and SMTPS traffic.

``` nix
  networking.firewall.allowedTCPPorts = [
    25 # smtp
    465 # smtps
  ];
```

# Domain and SSL setup

``` nix
  services.postfix = {
    enable = true;
    enableSubmission = true;
    enableSubmissions = true;

    # hostname of mail server, should be fqdn
    hostname = "mail.${domainName}";

    # domain of the email address that this postfix is hosting
    domain = "${domainName}";

    sslCert = "${sslCertDir}/fullchain.pem";
    sslKey = "${sslCertDir}/key.pem";
  };
```

You also need to set proper file permissions on the cert directory and key files. See <a href="ACME#Integration_with_service_modules" class="wikilink" title="ACME#Integration_with_service_modules">ACME#Integration_with_service_modules</a>.

# Setup virtual map with regex

``` nix
  services.postfix = {
    # regexp wildcard: redirect every mail to @example.org to my account
    virtualMapType = "regexp";
    virtual = ''/.*@example.org/ admin@example.org'';
  };
```

# Map email addresses to mail boxes

``` nix
  services.postfix = {
    # mapFiles listed here will be processed and hashed, ready for use
    # with postfix. specify hashed maps in "config" section below
    mapFiles = {
      # Maildir/ MUST have trailing slash
      # Example line: maps you@example.com to mailbox path
      # you@example.com example.com/you/Maildir/
      virtual_mailbox_maps = ./virtual_mailbox_maps;
    };

    config = {
      # details see https://www.postfix.org/VIRTUAL_README.html
      # and example etc files below
      virtual_mailbox_base = "/var/spool/mail/vmail/";
      virtual_mailbox_maps = "hash:/etc/postfix/virtual_mailbox_maps";

      # list of all domains configured
      virtual_mailbox_domains = "${domainName}";

      # let postfix use vmail user for accessing virtual_mail_base
      # hardcoded below in users.user option
      virtual_uid_maps = "static:994";
      virtual_gid_maps = "static:993";
    };
  };

  # /var/spool/mail/vmail needs to be created and owned by vmail
  # vmail user is created in dovecot config file
  users.users."vmail" = {
    # used by postfix config virtual uid maps
    uid = 994;
  };
  users.groups."vmail" = {
    # used by postfix config virtual gid maps
    gid = 993;
  };
```

<a href="Category:Mail_Server" class="wikilink" title="Category:Mail Server">Category:Mail Server</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
