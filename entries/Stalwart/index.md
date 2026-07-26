<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Stalwart -->

[Stalwart](https://stalw.art) is an open-source, all-in-one mail server solution that supports JMAP, IMAP4, and SMTP protocols. It's designed to be secure, fast, robust, and scalable, with features like built-in DMARC, DKIM, SPF, and ARC support for message authentication. It also provides strong transport security through DANE, MTA-STS, and SMTP TLS reporting. Stalwart is written in Rust, ensuring high performance and memory safety.

## Setup

The following example enables the Stalwart mail server for the domain *example.org*, listening on mail delivery SMTP/Submission (`25, 465`), IMAPS (`993`) and JMAP ports (8080/443) for mail clients to connect to. Mailboxes for the accounts `postmaster@example.org` and `user1@example.org` get created if they don't exist yet.

TLS key generation is done using DNS-01 challenge through Cloudflare domain provider, see dns-update library for [further providers](https://github.com/stalwartlabs/dns-update) or configure [manual certificates](https://stalw.art/docs/server/tls/certificates).

### DNS records

Before adding required records to the example domain `example.org`, we need to register the domain on the Stalwart server.

``` shell
stalwart-cli --url https://webadmin.example.org domain create example.org
```

Authenticate using the fallback-admin password.

Review the list of which DNS records are required including their values for the mail server to work at <https://webadmin.example.org/manage/directory/domains/tuxtux.com.co/view>. Especially following records are essential:

| Record Type | Name | Value / Target | Notes |
|----|----|----|----|
| A | example.org | *IPv4 address of the mail server* | Required |
| AAAA | example.org | *IPv6 address of the mail server* | Required |
| CNAME | autoconfig | example.org | Mail client autoconfiguration |
| CNAME | autodiscover | example.org | Outlook / Exchange compatibility |
| CNAME | mail | example.org | Mail host |
| CNAME | mta-sts | example.org | MTA-STS |
| CNAME | webadmin | example.org | Stalwart web administration interface |
| MX | example.org | mx1.example.org | Mail delivery |
| SRV | \_imaps.\_tcp | *See Web Admin for exact values* | IMAPS service |
| SRV | \_submissions.\_tcp | *See Web Admin for exact values* | SMTP Submission service |
| TLSA | \_25.\_tcp.example.org. | 3 1 1 … | Only the record starting with `3 1 1` is required |
| TLSA | \_25.\_tcp.mx1.example.org. | 3 1 1 … | Only the record starting with `3 1 1` is required |
| TXT | 202409e.\_domainkey | *DKIM public key* | DKIM |
| TXT | 202409r.\_domainkey | *DKIM public key* | DKIM |
| TXT | \_dmarc | *DMARC policy* | DMARC |
| TXT | mx1 | *SPF or server information* | Depends on configuration |
| TXT | \_smtp.\_tls | *MTA-STS policy* | SMTP TLS reporting |
| TXT | example.org | *SPF record* | SPF |

### DNSSEC

Ensure that DNSSEC is enabled for your primary and mail server domain. It can be enabled by your domain provider.

For example, check if DNSSEC is working correctly for your new TLSA record

`# nix shell nixpkgs#dnsutils --command delv _25._tcp.mx1.example.org TLSA @1.1.1.1`  
`; fully validated`  
`_25._tcp.mx1.example.org. 10800 IN TLSA 3 1 1 7f59d873a70e224b184c95a4eb54caa9621e47d48b4a25d312d83d96 e3498238`  
`_25._tcp.mx1.example.org. 10800 IN RRSIG   TLSA 13 5 10800 20230601000000 20230511000000 39688 example.org. He9VYZ35xTC3fNo8GJa6swPrZodSnjjIWPG6Th2YbsOEKTV1E8eGtJ2A +eyBd9jgG+B3cA/jw8EJHmpvy/buCw==`

### Running behind reverse proxy

When running behind a load balancer or reverse proxy, Stalwart will not be able to see the "real" sender IP-addresses of incoming mails in case of simple port forwarding. <a href="HAProxy" class="wikilink" title="HAProxy">HAProxy</a> or Proxy Protocol solves this problem and should be used on the reverse proxy server to forward SMTP traffic. Stalwart will start parsing the Proxy Protocol packages if correctly configured on the listener.In this example we set `proxy.trusted-networks` with an array of the gateway IP-addresses in the `smtp` listener section.

## Configuration

### Mail aliases

Considering the configuration above, we could add a mail alias for `user1@example.org` by simply adding further addresses to the `email`-array such as `user1real@example.org`

### Blocking mail sender address

If you don't want to receive any mails from a specific address, even not into your spam folder, you can add it to the spam-trap array.

## Tips and tricks

### Auto update TLSA records

Stalwart [does not yet](https://github.com/stalwartlabs/stalwart/issues/1664) automatically update the TLSA record if your ACME certificate changes.

Following script is a possible workaround. It extracts the ACME cert every five minute, calculates the TLSA hash and compares it with the upstream record. If it doesn't match, it uses [gotlsaflare](https://github.com/Stenstromen/gotlsaflare) to update the TLSA record on Cloudflare.

``` nixos
systemd.services.tlsa-cloudflare-update = {
  description = "Check and update TLSA/DANE record for mx1 from Stalwart ACME Cert";
  
  after = [
    "network-online.target"
    "stalwart.service"
  ];
  wants = [
    "network-online.target"
    "stalwart.service"
  ];
  
  serviceConfig = {
    Type = "oneshot";
    User = "stalwart";
    Group = "stalwart";
    EnvironmentFile = config.age.secrets.gotlsaflare-cloudflare-token.path;
    RuntimeDirectory = "stalwart-tlsa";
  };
  environment = {
    DOMAIN = "example.org";
    SUBDOMAIN = "mail";
    PORT = "25";
    ACME_PROVIDER_ID = "cloudflare";
  };
  path = with pkgs; [
    bash
    coreutils
    openssl
    dnsutils
    gotlsaflare
    rocksdb.tools
    gawk
  ];

  script = ''
    set -eu

    TLSA_RECORD="_$PORT._tcp.$SUBDOMAIN.$DOMAIN"
    DB_PATH="/var/lib/stalwart/db"
    TEMP_RAW="/run/stalwart-tlsa/cert.bundle"
    TEMP_CRT="/run/stalwart-tlsa/cert.crt"

    echo "Starting TLSA update process for $DOMAIN"

    ldb --db="$DB_PATH" --column_family=s get "acme.$ACME_PROVIDER_ID.cert" | base64 -d > "$TEMP_RAW"

    if [ ! -s "$TEMP_RAW" ]; then
      echo "ERROR: ACME certificate extraction failed"
      exit 1
    fi

    openssl x509 -in "$TEMP_RAW" -out "$TEMP_CRT"

    LOCAL_HASH=$(openssl x509 -in "$TEMP_CRT" -pubkey -noout | openssl pkey -pubin -outform DER | openssl sha256 | awk '{print tolower($2)}')
    echo "Local hash: $LOCAL_HASH"

    UPSTREAM_HASH=$(dig +nosplit +short TLSA "$TLSA_RECORD" | awk '{print tolower($4)}' | head -n1)
    echo "Upstream hash: $UPSTREAM_HASH"

    if [ "$LOCAL_HASH" = "$UPSTREAM_HASH" ]; then
      echo "Hashes match. DNS is up to date."
      exit 0
    fi

    echo "Hashes differ! Updating Cloudflare..."
    gotlsaflare update \
      --url "$DOMAIN" \
      --subdomain "$SUBDOMAIN" \
      --tcp"$PORT" \
      --cert "$TEMP_CRT"

    echo "TLSA update completed successfully."
  '';
};

systemd.timers.tlsa-cloudflare-update = {
  description = "Run TLSA check and update every 5 minutes";
  wantedBy = [ "timers.target" ];
  timerConfig = {
    OnBootSec = "2m";
    OnUnitActiveSec = "5m";
    Unit = "tlsa-cloudflare-update.service";
  };
};
```

Adapt the variables `DOMAIN`, `SUBDOMAIN`, and `PORT` according to your needs. The variable `ACME_PROVIDER_ID` corresponds to the ACME profile name you've setup in the Stalwart webadmin interface. `EnvironmentFile` points to a file containing the secret Cloudflare api token in the format: TOKEN=12345678\[...\].

#### deSEC.io

In case you want to update your TLSA records at deSEC you can use [dyndns-tlsa-desec](https://codeberg.org/Cameo007/dyndns-tlsa-desec) (**install via flake**) which checks your existing records and updates them if necessary. The certificate and key are taken from the specified directory (like your <a href="ACME" class="wikilink" title="ACME">ACME</a> directory)

It defaults to `3 1 1` but you can choose other values as described <a href="wikipedia:DNS-based_Authentication_of_Named_Entities#RR_data_fields" class="wikilink" title="here">here</a>.

``` nixos
services.dyndns-tlsa-desec = {
  enable = true;
  api_token_file = config.age.secrets.dyndns-tlsa-desec-api-key.path;

  tlsa_zones."example.com" = {
    cert_path = "/var/lib/acme/example.com/";
    records."_25._tcp.mail" = { };
  };
};
```

The program is executed hourly per default but you can set the `interval` option to any [systemd calendar event](https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html#Calendar%20Events).

``` nixos
services.dyndns-tlsa-desec.interval = "5m"; # Every 5 minutes
```

### Sending from subaddresses

Receiving mails to subaddresses like `john+secondary@example.org` is enabled by default. Sending from subaddresses will fail with "You are not allowed to send from this address" as long as they are not an configured alias address. You can disable this check but it will allow any authenticated user to send from any other address.

A configuration option to customize the pattern of authorized sender addresses is a [planned feature](https://github.com/stalwartlabs/stalwart/issues/394#issuecomment-3705990056).

### Test mail server

You can use several online tools to test your mail server configuration:

- [en.internet.nl/test-mail](https://en.internet.nl/test-mail): Test your mail server configuration for validity and security.
- [hardenize.com](https://www.hardenize.com/): Test your mail server configuration for validity and security. Checks DANE validity even when not all MX servers support DANE.
- [mail-tester.com](https://www.mail-tester.com): Send a mail to this service and get a rating about the "spaminess" of your mail server.
- Send a mail to the echo server `echo@univie.ac.at`. You should receive a response containing your message in several seconds.

### Unsecure setup for testing environments

The following minimal configuration example is unsecure and for testing purpose only. It will run the Stalwart mail server on `localhost`, listening on port `143` (IMAP) and `587` (Submission). Users `alice` and `bob` are configured with the password `foobar`.

## See also

- <a href="Maddy" class="wikilink" title="Maddy">Maddy</a>, a composable, modern mail server written in Go.
- [Simple NixOS Mailserver](https://nixos-mailserver.readthedocs.io/en/latest)

<a href="Category:Mail_Server" class="wikilink" title="Category:Mail Server">Category:Mail Server</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
