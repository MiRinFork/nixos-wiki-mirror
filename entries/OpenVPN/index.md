<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenVPN -->

## VPN Client

OpenVPN can be configured for automatic startup by enabling it in `/etc/nixos/configuration.nix`:

``` nix
{
  ...
  services.openvpn.servers = {
    officeVPN  = { config = '' config /root/nixos/openvpn/officeVPN.conf ''; };
    homeVPN    = { config = '' config /root/nixos/openvpn/homeVPN.conf ''; };
    serverVPN  = { config = '' config /root/nixos/openvpn/serverVPN.conf ''; };
  };
  ...
}
```

You will need to create the referenced configuration files. The above example will start three VPN instances; more can be added.

Ensure you use absolute paths for any files such as certificates and keys referenced from the configuration files.

Use <em>systemctl</em> to start/stop VPN service. Each generated service will have a prefix \`openvpn-\`:

    systemctl start openvpn-officeVPN.service

Should you have trouble with DNS resolution for services that should be available via the VPN, try adding the following to the config:

``` nix
{
  ...
  services.openvpn.servers = {
    officeVPN  = {
      config = '' config /root/nixos/openvpn/officeVPN.conf '';
      updateResolvConf = true;
    };
  };
  ...
}
```

### Network-Manager integration (GNOME)

If you want to allow the desktop user to manually set up and activate/deactivate VPN connections (on the GNOME desktop) you should install the OpenVPN plugin for NetworkManager, e.g.

``` nix
{ pkgs, ... }:
{
  networking.networkmanager = {
    enable = true;
    plugins = with pkgs; [
      networkmanager-openvpn
    ];
  };
}
```

NOTE: Some VPN providers (e.g. NordVPN) require you to generate and use **service credentials** (i.e. *not* your usual email+password!) for a manual setup like this. Your provider's user account should have an option to create them.

### Mounting filesystems via a VPN

If you mount filesystems through the VPN, the filesystem will not be unmounted properly because the VPN connection will be shut down prior to unmounting the filesystem. However, newer systemd versions allow you to set mount options to unmount the mount before closing the VPN connection via the mount option `x-systemd.requires=openvpn-`<em>`vpnname`</em>`.service`.

Example mount configurations:

``` nix
{
  ...
  fileSystems."/mnt/office" = {
    device = "//10.8.0.x/Share";
    fsType = "cifs";
    options = [ "noauto" "user" "uid=1000" "gid=100" "username=xxx" "password=xxx" "iocharset=utf8"
      "x-systemd.requires=openvpn-officeVPN.service" ];
  };
  fileSystems."/mnt/home" = {
    device = "//10.9.0.x/Share";
    fsType = "cifs";
    options = [ "noauto" "user" "uid=1000" "gid=100" "username=xxx" "password=xxx" "iocharset=utf8"
      "x-systemd.requires=openvpn-homeVPN.service" ];
  };
  ...
}
```

If you want to run OpenVPN clients in NixOS declarative containers, you will need to set the container option.

### Supporting legacy cipher providers

If you need to connect to servers with legacy ciphers (e.g. **BF-CBC**), one way is to override OpenVPN to use **openssl_legacy** package (which is [configured to enable legacy providers](https://github.com/NixOS/nixpkgs/blob/nixos-unstable/pkgs/development/libraries/openssl/3.0/legacy.cnf)), for example via an overlay:

``` nix
final: prev: {
  openvpn = prev.openvpn.override {
    openssl = prev.openssl_legacy;
  };
}
```

## VPN Server

### Simple one-client VPN gateway server

The following is an example of a VPN server configuration which supports a single known client.

``` nix
let
  # generate via openvpn --genkey --secret openvpn-laptop.key
  client-key = "/root/openvpn-laptop.key";
  domain = "vpn.localhost.localdomain";
  vpn-dev = "tun0";
  port = 1194;
in {
  # sudo systemctl start nat
  networking.nat = {
    enable = true;
    externalInterface = <your-server-out-if>;
    internalInterfaces  = [ vpn-dev ];
  };
  networking.firewall.trustedInterfaces = [ vpn-dev ];
  networking.firewall.allowedUDPPorts = [ port ];
  environment.systemPackages = [ pkgs.openvpn ]; # for key generation
  services.openvpn.servers.smartphone.config = ''
    dev ${vpn-dev}
    proto udp
    ifconfig 10.8.0.1 10.8.0.2
    secret ${client-key}
    port ${toString port}

    cipher AES-256-CBC
    auth-nocache

    comp-lzo
    keepalive 10 60
    ping-timer-rem
    persist-tun
    persist-key
  '';

  environment.etc."openvpn/smartphone-client.ovpn" = {
    text = ''
      dev tun
      remote "${domain}"
      ifconfig 10.8.0.2 10.8.0.1
      port ${toString port}
      redirect-gateway def1

      cipher AES-256-CBC
      auth-nocache

      comp-lzo
      keepalive 10 60
      resolv-retry infinite
      nobind
      persist-key
      persist-tun
      secret [inline]

    '';
    mode = "600";
  };
  system.activationScripts.openvpn-addkey = ''
    f="/etc/openvpn/smartphone-client.ovpn"
    if ! grep -q '<secret>' $f; then
      echo "appending secret key"
      echo "<secret>" >> $f
      cat ${client-key} >> $f
      echo "</secret>" >> $f
    fi
  '';
}
```

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:VPN" class="wikilink" title="Category:VPN">Category:VPN</a>
