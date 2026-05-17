<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Postfix for Gmail -->

This is how to setup Postfix to use Gmail as a relay host, so it can send email via Gmail, e.g. for output of cronjobs etc.

## Option: use msmtp instead of postfix

Msmtp seems to be easier to configure, see <a href="ZFS#Mail_notifications_(ZFS_Event_Daemon)" class="wikilink" title="ZFS#Mail_notifications_(ZFS_Event_Daemon)">ZFS#Mail_notifications_(ZFS_Event_Daemon)</a>

## Secrets Configuration

This page follows the configuration defined in [`sops-nix`](https://github.com/Mic92/sops-nix), but you can use any <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secret managing scheme">secret managing scheme</a>.

## Add a "postfix/sasl_passwd" secret

Create an app password specifically for this postfix installation at <https://myaccount.google.com/apppasswords> (logged in as you).

You end up with a 16 character string separated by spaces. Put that in a sops secret:

` nix-shell -p sops --run "sops /etc/nixos/sops-secrets.yaml"`

Create this entry, using the 16 character string without spaces (*Don't use the "abcdefghjklmnopq" string below. It won't work :-)* ):

` postfix:`  
`     sasl_passwd: '[smtp.gmail.com]:587 you@gmail.com:abcdefghjklmnopq'`

## Configure Postfix

` sops.secrets."postfix/sasl_passwd".owner = config.services.postfix.user;`

` services.postfix = {`  
`   enable = true;`  
`   relayHost = "smtp.gmail.com";`  
`   relayPort = 587;`  
`   config = {`  
`     smtp_use_tls = "yes";`  
`     smtp_sasl_auth_enable = "yes";`  
`     smtp_sasl_security_options = "";`  
`     smtp_sasl_password_maps = "texthash:${config.sops.secrets."postfix/sasl_passwd".path}";`  
`     # optional: Forward mails to root (e.g. from cron jobs, smartd)`  
`     # to me privately and to my work email:`  
`     virtual_alias_maps = "inline:{ {root=you@work.example, you@home.example} }";`  
`   };`  
` };`

## Profit

` sudo nixos-rebuild switch`

Send an email explicitly to you@gmail.com

` nix-shell -p mailutils --run \`  
`   'echo "This is a test email." | mail -s "Test Email from NixOS" you@gmail.com'`

Send an email explicitly to root that gets sent to you@gmail.com and you@work.com (if you opted in for virtual_alias_maps)

` nix-shell -p mailutils --run \`  
`   'echo "This is a test email." | mail -s "Test Email from NixOS to root" root'`

## References

[Porting my postfix gmail smtp to nixos](https://discourse.nixos.org/t/porting-my-postfix-gmail-smtp-to-nixos/30286) on the NixOS Discourse.

<a href="Category:Mail_Server" class="wikilink" title="Category:Mail Server">Category:Mail Server</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
