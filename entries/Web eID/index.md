<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Web eID -->

eThe Web eID project enables usage of European Union electronic identity (eID) smart cards for secure authentication and digital signing of documents on the web using public-key cryptography.

Check [1](https://web-eid.eu/%7Cweb-eid.eu) for more details and an example application.

The application consists of the "Web eID" browser extension (available for Chrom{e,ium} and Firefox), and a native messaging host / application running on the system, which takes care of communication with the smart card.

NixOS Unstable (and 23.05, once released) have the native messaging host packaged. Some local system configuration is still necessary, so the browsers know the extension is allowed to execute the native host application, and where it can find it.

PCSCD also needs to be enabled:

``` nix
{
  services.pcscd.enable = true;
}
```

On the browser side, the "Web eID" browser extension needs to be installed, and the browser needs to know about the native messaging host.

## Firefox

Firefox requires an additional browser extension for Web eID to work. If Firefox is enabled with `programs.firefox.enable = true`, this can specified system-wide, as follows...

``` nix
programs.firefox.nativeMessagingHosts.packages = [ pkgs.web-eid-app ];
```

...or per user with Home Manager, as follows:

``` nix
programs.firefox.nativeMessagingHosts = [ pkgs.web-eid-app ];
```

If you're building a Firefox derivation yourself, you can override it with `extraNativeMessagingHosts = [ pkgs.web-eid-app ];`.

## Google Chrome / Chromium

Google Chrome and Chromium read JSON files from the or directories (system-wide) / or (per user).

To configure system-wide, use the following snippet:

``` nix
{
  environment.etc."chromium/native-messaging-hosts/eu.webeid.json".source = "${pkgs.web-eid-app}/share/web-eid/eu.webeid.json";
  environment.etc."opt/chrome/native-messaging-hosts/eu.webeid.json".source = "${pkgs.web-eid-app}/share/web-eid/eu.webeid.json";
}
```

For user-wide config (inside home-manager), use the following:

``` nix
{
  xdg.configFile."chromium/NativeMessagingHosts/eu.webeid.json".source = "${pkgs.web-eid-app}/share/web-eid/eu.webeid.json";
  xdg.configFile."google-chrome/NativeMessagingHosts/eu.webeid.json".source = "${pkgs.web-eid-app}/share/web-eid/eu.webeid.json";
}
```

## PKCS#11

Note some websites still use PKCS#11 instead of Web eID (e.g. for Estonian and Belgian ID cards). This requires different configuration.

We configure the browser(s) to load PKCS#11 modules via the `p11-kit-proxy` module as configured in `/etc/pkcs11/modules`, and configure `opensc-pkcs11.so` in there.

``` nix
{
  # Tell p11-kit to load/proxy opensc-pkcs11.so, providing all available slots
  # (PIN1 for authentication/decryption, PIN2 for signing).
  environment.etc."pkcs11/modules/opensc-pkcs11".text = ''
    module: ${pkgs.opensc}/lib/opensc-pkcs11.so
  '';
}
```

### Firefox

Firefox can be configured to load PKCS#11 tokens with the following snippet:

``` nix
{
  programs.firefox.policies.SecurityDevices.Add.p11-kit-proxy = "${pkgs.p11-kit}/lib/p11-kit-proxy.so";
}
```

If you're building a firefox derivation yourself, you can override it with `extraPolicies.SecurityDevices.Add.p11-kit-proxy "${pkgs.p11-kit}/lib/p11-kit-proxy.so";`.

### Google Chrome / Chromium

Unfortunately, Chrome and Chromium browsers can't be declaratively configured for PKCS#11 tokens. We need to invoke the `modutil` command on the nssdb, and render a script that'll reconfigure it:

``` nix
  environment.systemPackages = [
    # Wrapper script to tell to Chrome/Chromium to use p11-kit-proxy to load
    # security devices, so they can be used for TLS client auth.
    # Each user needs to run this themselves, it does not work on a system level
    # due to a bug in Chromium:
    #
    # https://bugs.chromium.org/p/chromium/issues/detail?id=16387
    (pkgs.writeShellScriptBin "setup-browser-eid" ''
      NSSDB="''${HOME}/.pki/nssdb"
      mkdir -p ''${NSSDB}

      ${pkgs.nssTools}/bin/modutil -force -dbdir sql:$NSSDB -add p11-kit-proxy \
        -libfile ${pkgs.p11-kit}/lib/p11-kit-proxy.so
    '')
  ];
```

Invoke `setup-browser-eid` to configure (and whenever this gets garbage-collected), and restart your browser.

## Belgian eID cards

Set up PKCS#11 as described above. The Web eID browser extension, used for authentication with Belgian eID cards, requires the PKCS#11 module `libbeidpkcs11.so.0` to be available in the directory `/usr/lib/x86_64-linux-gnu/`. Since this directory does not exist by default on NixOS, the Web eID application installed on the host system will not detect or support Belgian eID cards.

To resolve this, you can create a symlink from the Nix store version of `beidpkcs11.so`, provided by the `eid-mw` package, into `/usr/lib/x86_64-linux-gnu/`:

``` nix
system.activationScripts.web-eid-app = {
  text = ''
    mkdir -p /usr/lib/x86_64-linux-gnu
    ln -sf ${pkgs.eid-mw}/lib/pkcs11/beidpkcs11.so /usr/lib/x86_64-linux-gnu/libbeidpkcs11.so.0
  '';
};
```

This script ensures the required symlink is created at system activation time and remains up to date with the correct Nix store path for `eid-mw`.

Alternatively, systemd can be used to create the symlink, as such:

``` nix
systemd.tmpfiles.rules = [
  "L+ /usr/lib/x86_64-linux-gnu/libbeidpkcs11.so.0 - - - - ${pkgs.eid-mw}/lib/pkcs11/beidpkcs11.so"
];
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
