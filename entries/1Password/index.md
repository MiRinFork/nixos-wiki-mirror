<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: 1Password -->

[1Password](https://1password.com/) is a password manager.

## NixOS

### Installation

If you're using <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, you can enable 1Password and its GUI with:

### Unlocking browser extensions

The 1Password app can unlock your browser extension using a special [native messaging](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging) process. This streamlines your 1Password experience: Once you unlock 1Password from your tray icon, your browser extensions will be unlocked as well.

This is automatically configured for <a href="Firefox" class="wikilink" title="Firefox">Firefox</a>, <a href="Chrome" class="wikilink" title="Chrome">Chrome</a>, and <a href="Brave" class="wikilink" title="Brave">Brave</a> browsers. However, <a href="Vivaldi" class="wikilink" title="Vivaldi">Vivaldi</a> and other custom Chrome-based browsers may not unlock when you unlock 1Password. If you find this to be the case, the solution is to set the `/etc/1password/custom_allowed_browsers` file as follows:

- First, use `ps aux` to find the application name for the browser. For Vivaldi, this is `vivaldi-bin`
- Add that binary name to `/etc/1password/custom_allowed_browsers`:

``` nix
    environment.etc = {
      "1password/custom_allowed_browsers" = {
        text = ''
          vivaldi-bin
          wavebox
        '';
        mode = "0755";
      };
    };
```

### Unlocking with System Authentication

1Password allows [unlocking with system authentication](https://support.1password.com/system-authentication-linux/). This means fingerprints or login passwords may be used in addition to the master password. This must be enabled under the Security preferences tab of 1Password as outlined in the 1Password documentation, but also requires a few other system tools to work.

For the graphical authentication prompt to work, a user <a href="Polkit#Authentication_agents" class="wikilink" title="Polkit authentication agent">Polkit authentication agent</a> must be started. The authentication agent may automatically be started under Gnome, KDE, or other DE at login, but may need to be explicitly enabled for other window managers.

For fingerprint unlocking to work, <a href="Fingerprint_scanner" class="wikilink" title="fingerprint scanning">fingerprint scanning</a> to be enabled and allowed for typical system authentication.

## Home Manager

### Installation

Add the following to your <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> configuration:

``` nix
  home.packages = [
    pkgs._1password
    pkgs._1password-gui
  ];
```

### SSH key management

1Password [can manage SSH keys](https://developer.1password.com/docs/ssh/).

#### Configuring SSH

If 1Password manages your <a href="SSH" class="wikilink" title="SSH">SSH</a> keys and you use <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, you may also configure your `~/.ssh/config` file using Nix:

``` nix
let
  onePassPath = if pkgs.stdenv.isDarwin
    then "${config.home.homeDirectory}/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock"
    else "${config.home.homeDirectory}/.1password/agent.sock";
in {
  home.sessionVariables.SSH_AUTH_SOCK = onePassPath;

  # or, alternatively, set it in `.ssh/config` which has higher precedence:
  programs.ssh = {
    enable = true;
    extraConfig = ''
      Host *
          IdentityAgent ${onePassPath}
    '';
  };
}
```

#### Configuring Git

You can enable <a href="Git" class="wikilink" title="Git">Git</a>'s <a href="SSH" class="wikilink" title="SSH">SSH</a> signing with <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

``` nix
{
  programs.git = {
    enable = true;
    extraConfig = {
      gpg = {
        format = "ssh";
      };
      "gpg \"ssh\"" = {
        program = "${lib.getExe' pkgs._1password-gui "op-ssh-sign"}";
      };
      commit = {
        gpgsign = true;
      };

      user = {
        signingKey = "...";
      };
    };
  };
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
