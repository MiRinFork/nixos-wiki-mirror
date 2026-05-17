<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fingerprint scanner -->

Fingerprint scanners (on laptop computers) can be used to unlock devices instead of using passwords.

## Install

## Enroll fingerprint

Fingerprint enrollment can be done via the <a href="Command_Shell" class="wikilink" title="CLI">CLI</a> or the UI in the Desktop Environment if available.

### CLI

``` bash
$ fprintd-enroll
```

### Gnome

In <a href="GNOME" class="wikilink" title="Gnome">Gnome</a>, the the fingerprints can be configured through the Settings application.

1.  Open Gnome Settings
2.  Scroll down to *System*
3.  Enter the *Users* menu
4.  Enter *Fingerprint Login* and add fingerprints

**Note:** If the *Fingerprint Login* item is not available, the `fprintd` driver might not be configured correctly.

### KDE Plasma

In <a href="KDE" class="wikilink" title="KDE Plasma">KDE Plasma</a>, the fingerprints can be configured through the Settings application.

1.  Open System Monitor
2.  On the menu on the left, scroll down to *Users* and enter it
3.  Select your user
4.  Enter *Configure Fingerprint Authentication* and follow the instructions to add your fingerprints

**Note:** If the *Configure Fingerprint Authentication* item is not available, the `fprintd` driver might not be configured correctly.

## Login

While `services.fprintd.enable = true;` enables fingerprint login for the majority of display manager via the corresponding \[<https://search.nixos.org/options?channel=unstable&show=security.pam.services.%3Cname%3E.fprintAuth&from=0&size=50&sort=relevance&type=packages&query=pam.services.%3Cname%3E>. PAM module\], it can sometimes disable the ability to login using a password. This is addressed in the GitHub issue [171136](https://github.com/NixOS/nixpkgs/issues/171136). In that issue, a possible workaround is addressed using a custom PAM module for the gnome display manager:

``` nixos
security.pam.services.login.fprintAuth = false;
security.pam.services.gdm-fingerprint = lib.mkIf (config.services.fprintd.enable) {
  text = ''
    auth       required                    pam_shells.so
    auth       requisite                   pam_nologin.so
    auth       requisite                   pam_faillock.so      preauth
    auth       required                    ${pkgs.fprintd}/lib/security/pam_fprintd.so
    auth       optional                    pam_permit.so
    auth       required                    pam_env.so
    auth       [success=ok default=1]      ${pkgs.gdm}/lib/security/pam_gdm.so
    auth       optional                    ${pkgs.gnome-keyring}/lib/security/pam_gnome_keyring.so

    account    include                     login

    password   required                    pam_deny.so

    session    include                     login
    session    optional                    ${pkgs.gnome-keyring}/lib/security/pam_gnome_keyring.so auto_start
  '';
};
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
