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

    # https://doc.dovecot.org/2.3/configuration_manual/howto/postfix_dovecot_lmtp/
    # https://doc.dovecot.org/2.3/configuration_manual/howto/postfix_and_dovecot_sasl/
    extraConfig = ''
      # force to use full user name plus domain name
      # for disambiguation
      auth_username_format = %Lu

      # Authentication configuration:
      auth_mechanisms = plain
      passdb {
        driver = passwd-file
        args = ${config.age.secrets.dovecot.path}
      }
    ''
  };
```

# Setup virtual users

``` nix
  # /var/spool/mail/vmail needs to be created and owned by vmail
  users.users."vmail" = {
    createHome = true;
    home = "/var/spool/mail/vmail";
  };

  services.dovecot2 = {
    # configure virtual mail user and group
    createMailUser = true;
    mailUser = "vmail";
    mailGroup = "vmail";

    # implement virtual users
    # https://doc.dovecot.org/2.3/configuration_manual/howto/simple_virtual_install/
    # store virtual mail under
    # /var/spool/mail/vmail/<DOMAIN>/<USER>/Maildir/
    mailLocation = "maildir:~/Maildir";

    mailboxes = {
      # use rfc standard https://apple.stackexchange.com/a/201346
      All = { auto = "create"; autoexpunge = null; specialUse = "All"; };
      Archive = { auto = "create"; autoexpunge = null; specialUse = "Archive"; };
      Drafts = { auto = "create"; autoexpunge = null; specialUse = "Drafts"; };
      Flagged = { auto = "create"; autoexpunge = null; specialUse = "Flagged"; };
      Junk = { auto = "create"; autoexpunge = "60d"; specialUse = "Junk"; };
      Sent = { auto = "create"; autoexpunge = null; specialUse = "Sent"; };
      Trash = { auto = "create"; autoexpunge = "60d"; specialUse = "Trash"; };
    };

    extraConfig = ''
      userdb {
        driver = static
        # the full e-mail address inside passwd-file is the username (%u)
        # user@example.com
        # %d for domain_name %n for user_name
        args = uid=vmail gid=vmail username_format=%u home=/var/spool/mail/vmail/%d/%n
      }
    '';
  };
```

# Connect to postfix via lmtp

See <a href="Postfix" class="wikilink" title="Postfix">Postfix</a> for further setup on postfix side.

``` nix
  services.dovecot2 = {
    # connection to postfix
    enableLmtp = true;

    # https://doc.dovecot.org/2.3/configuration_manual/howto/postfix_dovecot_lmtp/
    # https://doc.dovecot.org/2.3/configuration_manual/howto/postfix_and_dovecot_sasl/
    extraConfig = ''
      # connection to postfix via lmtp
      service lmtp {
       unix_listener /var/spool/postfix/dovecot-lmtp {
         mode = 0600
         user = postfix
         group = postfix
        }
      }
      service auth {
        unix_listener /var/spool/postfix/auth {
          mode = 0600
          user = postfix
          group = postfix
        }
      }
    '';
  };

  # postfix connection to dovecot
  services.postfix.config = {
    # https://doc.dovecot.org/2.3/configuration_manual/howto/postfix_dovecot_lmtp/
    mailbox_transport = "lmtp:unix:/var/spool/postfix/dovecot-lmtp";
    virtual_transport = "lmtp:unix:/var/spool/postfix/dovecot-lmtp";

    # https://doc.dovecot.org/2.3/configuration_manual/howto/postfix_and_dovecot_sasl/
    smtpd_sasl_type = "dovecot";
    smtpd_sasl_path = "/var/spool/postfix/auth";
    smtpd_sasl_auth_enable = "yes";
    smtpd_recipient_restrictions = "permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination";
  };

  # create path for dovecot socket
  users.users."postfix" = {
    createHome = true;
    home = "/var/spool/postfix";
  };
```

# Configure SSL Certificates

``` nix
  services.dovecot2 = {
    sslServerCert = "${sslCertDir}/fullchain.pem";
    sslServerKey = "${sslCertDir}/key.pem";
    sslCACert = "${sslCertDir}/chain.pem";
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
