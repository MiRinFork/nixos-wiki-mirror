<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/journald -->

`journald` is systemd’s logs collector.

Its main manual page is `systemd-journald.service(8)`. Its configuration options are described in `journald.conf(5)`.

### Namespaces

With journald's namespaces you can both separate and group logs from services, and improve performance.

``` nix
{
   systemd.services = {
    postfix.serviceConfig.LogNamespace = "mail";
    postfix-tlspol.serviceConfig.LogNamespace = "mail";
    dovecot.serviceConfig.LogNamespace = "mail";
    redis-rspamd.serviceConfig.LogNamespace = "mail";
    rspamd.serviceConfig.LogNamespace = "mail";
  };
  
  # If not specified like here, defaults will be used.
  environment.etc."systemd/journald@mail.conf".text = ''
    [Journal]
    Storage=persistent
    SystemMaxUse=2G
    MaxRetentionSec=14day
    Compress=yes
  '';
}
```

This will group the logs for your mailserver's services. Adjust however needed.

Inspect by running `$ journalctl --namespace=mail -f`. Be aware namespaces are excluded unless included like `$ journalctl --namespace='*' -f`.
