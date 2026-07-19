<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dovecot -->

Dovecot is a mail storage server. It handles the storage of e-mail messages and their retrieval by a e-mail client (mail user agent) via authenticated IMAP.

This article describes a basic Dovecot setup with <a href="Postfix" class="wikilink" title="Postfix">Postfix</a> and virtual users, i.e., e-mail users are configured separately in Dovecot passdb, and are independent from system users.

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
  # further dovecot configuration goes here
  ...
}
```

# Dovecot passwd database

Create a plaintext virtual user password database in the following format

``` nix
  # authenticate via Passwd-file
  #
  # bill@example.org:{PLAIN}your_plain_password
  # alice@example.org:{PLAIN-MD5}1a1dc91c907325c69271ddf0c944bc72::::::
  # This file need to have correct permissions.

  age.secrets.dovecot = {
    file = "./dovecot-secret.age";
    # -rw-------
    mode = "600";
    owner = "dovecot2";
    group = "dovecot2";
  };
```

# Open firewall port

Open firewall port for IMAPS clients.

``` nix
  networking.firewall.allowedTCPPorts = [ 993 ]; # dovecot imaps
```

# Setup auth via passwd-file

``` nix
  services.dovecot2 = {
    enable = true;

    # use my own passwd file for auth, see below
    enablePAM = false;

    # https://doc.dovecot.org/2.4.4/howto/lmtp/postfix.html
    # https://doc.dovecot.org/2.4.4/howto/sasl/postfix.html
    settings = {
      # dovecot_config_version and dovecot_storage_version must be explicitly set
      # to retain compatibility with future updates.
      dovecot_config_version = "2.4.2";
      dovecot_storage_version = "2.4.0";

      auth_username_format = "%{user | lower}";
      auth_mechanisms = [ "plain" ];
      "passdb passwd-file" = {
        driver = "passwd-file";
        passwd_file_path = config.age.secrets.dovecot.path;
      };
    };
  };
```

# Setup virtual users

``` nix
# /var/spool/mail/vmail needs to be created and owned by vmail
  systemd.tmpfiles.rules = [
    "d /var/spool/mail/vmail 0700 vmail vmail -"
  ];

  services.dovecot2 = {
    settings = {
      # dovecot_config_version and dovecot_storage_version must be explicitly set
      # to retain compatibility with future updates.
      dovecot_config_version = "2.4.2";
      dovecot_config_version = "2.4.0";

      # If config.services.dovecot2.createMailUser is true (which is the default),
      # the user defined in mail_uid and mail_gid will be automatically created.
      mail_uid = "vmail";
      mail_gid = "vmail";

      # implement virtual users
      # https://doc.dovecot.org/2.4.4/howto/virtual/simple_install.html
      # store virtual mail under /var/spool/mail/vmail/<DOMAIN>/<USER>/Maildir
      mail_driver = "maildir";
      mail_path = "~/Maildir";

      "namespace inbox" = {
        "mailbox All" = { auto = "create"; special_use = "\\All"; };
        "mailbox Archive" = { auto = "create"; special_use = "\\Archive"; };
        "mailbox Drafts" = { auto = "create"; special_use = "\\Drafts"; };
        "mailbox Flagged" = { auto = "create"; special_use = "\\Flagged"; };
        "mailbox Junk" = { auto = "create"; special_use = "\\Junk"; autoexpunge = "60d"; };
        "mailbox Sent" = { auto = "create"; special_use = "\\Sent"; };
        "mailbox Trash" = { auto = "create"; special_use = "\\Trash"; autoexpunge = "60d"; };
      };

      "userdb static" = {
        fields = {
          uid = "vmail";
          gid = "vmail";
          username_format = "%u";
          home = "/var/spool/mail/vmail/%d/%n";
        };
      };
    };
  };
```

# Connect to postfix via lmtp

See <a href="Postfix" class="wikilink" title="Postfix">Postfix</a> for further setup on postfix side.

``` nix
  # create path for dovecot socket
  systemd.tmpfiles.rules = [
    "d /var/spool/postfix 0700 postfix postfix -";
  ];

  services.dovecot2 = {
    settings = {
      # dovecot_config_version and dovecot_storage_version must be explicitly set
      # to retain compatibility with future updates.
      dovecot_config_version = "2.4.2";
      dovecot_config_version = "2.4.0";

      protocols = [ "imap" "lmtp" ];

      # https://doc.dovecot.org/2.4.4/howto/lmtp/postfix.html
      "service lmtp" = {
        # Note that the socket needs to be placed here because Postfix access is limited to this directory
        "unix_listener /var/spool/postfix/dovecot-lmtp" = {
          user = "postfix";
          group = "postfix";
          mode = "0600";
        };
      };

      # https://doc.dovecot.org/2.4.4/howto/sasl/postfix.html
      "service auth" = {
        "unix_listener /var/spool/postfix/auth" = {
          user = "postfix";
          group = "postfix";
          mode = "0600";
        };
      };
    };

  # postfix connection to dovecot
  services.postfix.config = {
    # https://doc.dovecot.org/2.4.4/howto/lmtp/postfix.html
    mailbox_transport = "lmtp:unix:/var/spool/postfix/dovecot-lmtp";
    virtual_transport = "lmtp:unix:/var/spool/postfix/dovecot-lmtp";

    # https://doc.dovecot.org/2.4.4/howto/sasl/postfix.html
    smtpd_sasl_type = "dovecot";
    smtpd_sasl_path = "/var/spool/postfix/auth";
    smtpd_sasl_auth_enable = "yes";
    smtpd_recipient_restrictions = "permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination";
  };
```

# Configure SSL Certificates

``` nix
  services.dovecot2 = {
    settings = {
      # dovecot_config_version and dovecot_storage_version must be explicitly set
      # to retain compatibility with future updates.
      dovecot_config_version = "2.4.2";
      dovecot_config_version = "2.4.0";

      # https://doc.dovecot.org/2.4.4/core/config/ssl.html
      ssl = true; # see also "required"
      ssl_server_cert_file = "${sslCertDir}/fullchain.pem";
      ssl_server_key_file = "${sslCertDir}/key.pem";
      ssl_server_ca_file = "${sslCertDir}/chain.pem";
    }; 
  };
```

You also need to set proper file permissions on the cert directory and key files. See <a href="ACME#Integration_with_service_modules" class="wikilink" title="ACME#Integration_with_service_modules">ACME#Integration_with_service_modules</a>.

# Using sieve plugins

The following is required to use Sieve plugins (`imap_sieve`, ManageSieve, etc):

``` nix
environment.systemPackages = with pkgs; [
  dovecot_pigeonhole
];
```

# mail_crypt plugin (encryption at rest)

The following seems to make mail_crypt work in its per-user/per-folder mode (note that this mode is still described as 'not production quality' in the dovecot docs):

    security.pam.services.dovecot2 = { }; # needed as we disable PAM below

    services.dovecot2 = {
      enable = true;
      enablePAM = false; # need to disable this as we redefine passdb
      mailPlugins.globally.enable = [ "mail_crypt" ]; 
      pluginSettings = {
        mail_crypt_curve = "secp521r1";
        mail_crypt_save_version = "2";
        mail_crypt_require_encrypted_user_key = "yes";
      }; 
      extraConfig = '' 
        mail_attribute_dict = file:%h/.attributes
        userdb {
          driver = passwd
        }  
        passdb {
          driver = pam
          override_fields = userdb_mail_crypt_private_password=%{sha256:password} userdb_mail_crypt_save_version=2
          args = failure_show_msg=yes dovecot2
        }  
      '';
    }; 

# Troubleshooting

## sievec fails to compile basic sieve scripts

Sieve commands such as *fileinto* need to be enabled explicitly with:

``` nix
services.dovecot2.sieve.globalExtensions = ["fileinto"];
```

Otherwise, the *sievec* command will fail to compile sieve scripts with `fileinto` statements and as a result the Dovecot service itself will fail to start if the configuration contains `services.dovecot2.sieve.scripts`.

<a href="Category:Mail_Server" class="wikilink" title="Category:Mail Server">Category:Mail Server</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
