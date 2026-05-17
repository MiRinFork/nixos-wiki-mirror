<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NNCP -->

> NNCP (Node to Node copy) is a collection of utilities simplifying secure store-and-forward files, mail and command exchanging.
>
> These utilities are intended to help build up small size (dozens of nodes) ad-hoc friend-to-friend (F2F) statically routed darknet delay-tolerant networks for fire-and-forget secure reliable files, file requests, Internet mail and commands transmission. All packets are integrity checked, end-to-end encrypted, explicitly authenticated by known participants public keys. Onion encryption is applied to relayed packets. Each node acts both as a client and server, can use push and poll behaviour model. Also there is multicasting areas support.
>
> Out-of-box offline sneakernet/floppynet, dead drops, sequential and append-only CD-ROM/tape storages, air-gapped computers support. But online TCP daemon with full-duplex resumable data transmission exists.

<cite><http://www.nncpgo.org/></cite>

## Configuration

NNCP can be installed and configured manually or via [NixOS configuration](https://nixos.org/manual/nixos/unstable/options.html#opt-programs.nncp.enable).

In any case the first step is to generate a configuration file.

``` console
$ nncp-cfgnew -nocomments > /etc/secrets/nncp.hjson
```

This generated file should be stripped down to include only the `self` and `neigh` sections:

    {
      self: {
        # DO NOT show anyone your private keys!!!
        id: HFTEI…SITTA
        exchpub: RG2SF…7JEYA
        exchprv: 4YAON…LWCMA
        signpub: ASKTA…EFVSQ
        signprv: Z6Q4R…SC2ZI
        noiseprv: ACJVW…7G7NA
        noisepub: J2W5C…SZM6Q
      }
      neigh: {
        self: {
          id: HFTEI…SITTA
          exchpub: RG2SF…7JEYA
          signpub: ASKTA…EFVSQ
          noisepub: J2W5C…SZM6Q
        }
      }
    }

The location of this file should be defined in your NixOS configuration at [programs.nncp.secrets](https://nixos.org/manual/nixos/unstable/options.html#opt-programs.nncp.secrets):

``` nix
{
  programs.nncp = {
    enable = true;
    secrets = [ "/etc/secrets/nncp.hjson" ];
  };
}
```

In this example the secret keys are stored outside the Nix store an we will add public keys for neighboring nodes in the NixOS configuration.

``` nix
{
  programs.nncp = {
    enable = true;
    secrets = [ "/etc/secrets/nncp.hjson" ];
    neigh = {
      carol = {
        # information that Carol has given us about her "self".
        id = "D6BOO…YTYWQ";
        exchpub = "V4WJ6…4VA3Q";
        signpub = "NZLTN…HCGOA";
        noisepub = "UNL2J…7FRDA";
        # We can connect directly to Carol over network.
        addr = {
          lan = "[fe80::1234%igb0]:5400";
          internet = "carol.example.com:3389";
          proxied = "|ssh remote.host nncp-daemon -ucspi";
        };
      };
      bob = {
        # information that Bob has given us about his "self".
        id = "3I3HC…F4P4Q";
        exchpub = "7VJN7…BWUTQ";
        signpub = "E6XSC…5VYRA";
        noisepub = "TAKXG…Z6MZQ";
        # We cannot connect to Bob but we can relay packets to him thru Carol.
        via = [ "carol" ];
      };
    };
  };
}
```

## Callers and Daemons

The NNCP caller and daemon can be enabled for NixOS using the options `services.nncp.caller` and `services.nncp.daemon`.

``` nix
{
  services.nncp = let
    attrs = {
      enable = true;
      extraArgs = [ "-autotoss" ];
    };
  in {
    caller = attrs;
    daemon = attrs;
  };
}
```

## Copying Nix store paths

NNCP can be use to transport the closures of Nix store paths between machines.

NNCP config:

``` nix
{
  programs.nncp.settings.neigh.${NODE}.exec.nix-store-import = "nix-store --import";
}
```

Export command:

``` console
$ nix-store --export ./result | nncp-exec "$NODE" nix-store-import
```

## Email

NNCP is an ideal transport for secure email.

### Receiving email

``` nix
# NixOS module for Alice that allows reception of mail from Bob and Carol as well as mail relayed thru her mailserver.
{
  config,
  lib,
  pkgs,
  ...
}:

{
  programs.nncp.settings.neigh =
    let
      mailer.exec.sendmail = [
        "/run/wrappers/bin/sendmail" # Pipe mail into the system sendmail.
        "alice"                      # Redirect messages to the "alice" user.
      ];
    in
    {
      bob = mailer;
      carol = mailer;
      mailserver = mailer; # This is Alice's mailserver, described later. 
    };

  # Use opensmtpd for the system sendmail command.
  services.opensmtpd = {
    enable = true;
    setSendmail = true;
    serverConfiguration = ''
      listen on lo

      # Deliver mail into Alice's home directory.
      action "inbox" maildir "%{user.directory}/mail"

      match for local action "inbox"
    '';
  };

}
```

### Sending mail

To send mail alice configures her client to relay mail to her mailserver by using nncp-exec as if it were `sendmail`.

`nncp-exec -noprogress mailserver sendmail -f alice@example.org -t`

### Relaying email

To send mail to domains via STMP a relay is required that implements the <a href="wikipedia:Sender_Policy_Framework" class="wikilink" title="SPF">SPF</a> standard. Configuring SPF and other DNS based standards is not described here.

``` nix
# NixOS module for Alice's STMP relay server.
{ config, lib, ... }:

let
  domain = "example.org";
  fqdn = "example.org";
  certCfg = config.security.acme.certs.${fqdn};
  certDir = certCfg.directory;
  smtpdCertDir = "/var/lib/smtp";
in
{
  # Allow incoming SMTP connections.
  networking.firewall.allowedTCPPorts = [
    25
    465
  ];

  # Receive mail from Alice's NNCP node and pipe it into sendmail unaltered.
  programs.nncp.settings.neigh.alice.exec.sendmail = [ 
    "/run/wrappers/bin/sendmail"
  ];

  # Get a certificate for SMTP from ACME.
  security.acme = {
    acceptTerms = true;
    certs.${fqdn} = {
      email = "admin@${domain}";
      reloadServices = [ "opensmtpd.service" ];
      postRun = ''
        mkdir -p ${smtpdCertDir}
        cp ${certDir}/cert.pem ${smtpdCertDir}/cert
        cp ${certDir}/key.pem ${smtpdCertDir}/key
        chown 0:0 ${smtpdCertDir}/*
      '';
    };
  };

  # Wrap nncp-exec so that the unpriviledged
  # smtpd can produce outgoing NNCP packets.
  security.wrappers.nncp-exec = {
    setuid = true;
    owner = "root";
    group = "uucp";
    source = "${config.programs.nncp.package}/bin/nncp-exec";
  };  

  # Configure an smtpd.
  services.opensmtpd = {
    enable = true;
    setSendmail = true; # Create the sendmail command for incoming NNCP mails.
    serverConfiguration = ''
      # Use the ACME certificate.
      pki ${fqdn} cert "${smtpdCertDir}/cert"
      pki ${fqdn} key "${smtpdCertDir}/key"

      # Configure SMTP listeners.
      # Authentication is by domain only, there are no logins here.
      listen on lo
      listen on eth0 smtps pki ${fqdn} # Classical SMTP.
      listen on eth0 tls pki ${fqdn}   # Listen with TLS.
      listen on tun0 mask-src          # Listen on a tunnel interface but
                                       # omit the details from headers.

      # Configure a NNCP Mail Delivery Agent (MDA) for local users.
      action "nncp" mda "/run/wrappers/bin/nncp-exec -quiet %{dest.user:strip} sendmail"

      # Configure SMTP relaying to external domains.
      action "relay" relay tls helo ${domain}

      # Rules for mail received at this smtpd.
      match from any for domain "${domain}" action "nncp"
      match from local for any action "relay"
    '';
  };
}
```

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:CLI" class="wikilink" title="Category:CLI">Category:CLI</a>
