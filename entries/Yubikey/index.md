<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Yubikey -->

This article describes how you can integrate [Yubico](https://yubico.com)'s <a href="Wikipedia:YubiKey" class="wikilink" title="YubiKey">YubiKey</a> with NixOS.

## GPG and SSH

Based on [a guide](https://github.com/drduh/YubiKey-Guide) by [@drduh](https://github.com/drduh):

``` nix
services.udev.packages = [ pkgs.yubikey-personalization ];

programs.gnupg.agent = {
  enable = true;
  enableSSHSupport = true;
};
```

## Logging-in

To use your yubikey as a user login or for sudo access you'll have to install a PAM (Pluggable Authentication Module) for your yubikey.

### pam_u2f

The `pam_u2f` module implements the U2F (universal second factor) protocol. The protocol was initially developed by Yubico, Google and NXP and is nowadays hosted as an open-standard by the FIDO Alliance. All current and most legacy Yubikeys support the U2F protocol making this the preferred way to use Yubikeys for user login.

Use this page to check whether your Yubikey supports **FIDO U2F** before starting: <https://www.yubico.com/products/identifying-your-yubikey/>

1\. Connect your Yubikey

2\. Create an authorization mapping file for your user. The authorization mapping file is like `~/.ssh/known_hosts` but for Yubikeys.

1.  `nix-shell -p pam_u2f`
2.  `mkdir -p ~/.config/Yubico`
3.  `pamu2fcfg > ~/.config/Yubico/u2f_keys`
4.  add another yubikey (optional): `pamu2fcfg -n >> ~/.config/Yubico/u2f_keys`

3\. Verify that `~/.config/Yubico/u2f_keys` contains one line in the following style:

    <username>:<KeyHandle1>,<UserKey1>,<CoseType1>,<Options1>:<KeyHandle2>,<UserKey2>,<CoseType2>,<Options2>:...

4\. Enable the u2f PAM module for login and sudo requests

``` nix
security.pam.services = {
  login.u2f.enable = true;
  sudo.u2f.enable = true;
};
```

PAM U2F Docs: <https://developers.yubico.com/pam-u2f/>

5\. Verify PAM configuration

See chapter *Test PAM configuration* an the end of this page.

6\. (optional) Only allow Yubikey for login and sudo authentication

If you don't want to be able to use your password to login to your user account or access sudo, you can modify the pam service as follows.

``` nixos
  security.pam.services = {
    login = {
      u2f.enable = true;
      unixAuth = false;
    };
    sudo = {
      u2f.enable = true;
      unixAuth = false;
    };
  };
```

You can also set `security.pam.u2f.control` to "required" in order to have multi-factor authentication.

### yubico-pam

The `yubico-pam` module uses a OTP (one time password) challenge response to authenticate users.

Use this page to check whether your Yubikey supports **Yubico OTP** before starting: <https://www.yubico.com/products/identifying-your-yubikey/>

You'll first need to install the necessary udev packages to your NixOS configuration:

``` nix
services.udev.packages = [ pkgs.yubikey-personalization ];
```

You can program the Yubikey for challenge-response on slot 2 and setup the current user for logon:

1.  `nix-shell -p yubico-pam -p yubikey-manager`
2.  `ykman otp chalresp --touch --generate 2`
3.  `ykpamcfg -2 -v`

Finally, you can enable challenge-response logins with the following commands:

**1.)** run: `nix-shell --command 'ykinfo -s' -p yubikey-personalization` to get the serial code and enter it into `yubico.id = [ "12345678" ];`

**2.)**

``` nix
security.pam.yubico = {
   enable = true;
   debug = true;
   mode = "challenge-response";
   id = [ "12345678" ];
};
```

To automatically login, without having to touch the key, omit the `--touch` option.

Having that, you should be able to use your Yubikey to login and for sudo. You can also set `security.pam.yubico.control` to "required" in order to have multi-factor authentication.

See also: <https://developers.yubico.com/yubico-pam/Authentication_Using_Challenge-Response.html>.

## Smartcard mode

To use the smart card mode (CCID) of Yubikey, you will need the PCSC-Lite daemon:

``` nix
services.pcscd.enable = true;
```

Please note that the PCSC-Lite daemon [sometimes conflicts](https://ludovicrousseau.blogspot.com/2019/06/gnupg-and-pcsc-conflicts.html) with gpg-agent. This can be solved by putting the line `disable-ccid` into `~/.gnupg/scdaemon.conf`. There is also a [Home Manager Option](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.gpg.scdaemonSettings) for that.

## OTP

In order to manage OTP keys, you should install the `yubioath-flutter` package in your profile. This application will also require both the udev rules as well as pcscd enabled.

## Key generation

It is best practice to create the keys on a system without network connection to avoid leakages. This [guide](https://github.com/drduh/YubiKey-Guide) explains in depth the steps needed for that. There is also a [nix expression](https://github.com/Mic92/dotfiles/blob/ed0ac1af816a7ebb7c5d4f040b77fa88e3ec1c79/nixos/images/yubikey-image.nix) that creates a nixos live image with all necessary dependencies pre-installed. The image can be created with the [nixos-generator tool](https://github.com/nix-community/nixos-generators) and depending on the image copied onto a usb stick or executed directly using `kexec`

## Multiple keys

If you want to use GPG with multiple keys, containing the same subkeys, you have to do this routine when swapping the key

1.  `killall gpg-agent`
2.  `rm -r ~/.gnupg/private-keys-v1.d/`
3.  Plug in the new YubiKey
4.  `gpg --card-status` (optional, to see if key is visibile)

## Test PAM configuration

Test user and/or sudo authentication. Replace <username> by your users account name.

1.  `nix-shell -p pamtester`
2.  `pamtester login `<username>` authenticate`
3.  `pamtester sudo `<username>` authenticate`

If the result is `pamtester: successfully authenticated` then everything should work as expected.

## Locking the screen when a Yubikey is unplugged

This can be achieved with a `udev` rule, which can be added to your `configuration.nix`

``` nix
services.udev.extraRules = ''
      ACTION=="remove",\
       ENV{ID_BUS}=="usb",\
       ENV{ID_MODEL_ID}=="0407",\
       ENV{ID_VENDOR_ID}=="1050",\
       ENV{ID_VENDOR}=="Yubico",\
       RUN+="${pkgs.systemd}/bin/loginctl lock-sessions"
  '';
```

This will lock all sessions if any Yubikey matching the rule is unplugged.

If this does not work with your Yubikey take a look at the output of this command when you plug-in/unplug your Yubikey `udevadm monitor --udev --environment` and adjust the rule accordingly. This rule should work with most Yubikey 5 series models. The Yubikey Security series `ID_MODEL_ID` is `0402`.

## Links

- [GPG-keys for SSH authentication on NixOS](https://rzetterberg.github.io/yubikey-gpg-nixos.html)
- <a href="Yubikey_based_Full_Disk_Encryption_(FDE)_on_NixOS" class="wikilink" title="Yubikey_based_Full_Disk_Encryption_(FDE)_on_NixOS">Yubikey_based_Full_Disk_Encryption_(FDE)_on_NixOS</a>

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
