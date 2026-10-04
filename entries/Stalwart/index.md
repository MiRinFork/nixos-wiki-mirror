<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Stalwart -->

[Stalwart](https://stalw.art) is an open-source, all-in-one mail server solution that supports JMAP, IMAP4, and SMTP protocols. It's designed to be secure, fast, robust, and scalable, with features like built-in DMARC, DKIM, SPF, and ARC support for message authentication. It also provides strong transport security through DANE, MTA-STS, and SMTP TLS reporting. Stalwart is written in Rust, ensuring high performance and memory safety.

## Setup

The following example enables the Stalwart mail server for the domain *example.org*, listening on mail delivery SMTP/Submission (`25, 465`), IMAPS (`993`) and JMAP ports (8080/443) for mail clients to connect to. Mailboxes for the accounts `postmaster@example.org` and `info@example.org` get created if they don't exist yet.

Most of the DNS entries are managed by Stalwart including TLS key generation. In this example we configure INWX as domain provider. For supported protocols and hosts see [upstream documentation](https://github.com/stalwartlabs/dns-update).

Change the user and password of your DNS provider. The password for the `info@` mailbox and admin user is stored in plain-text here for demonstration purpose, please consider using a secret-management tool <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="such as agenix or sops-nix">such as agenix or sops-nix</a>.

### DNS records

Following DNS records need to be configured manually since they are not managed by Stalwart.

| Record Type | Name        | Value / Target                    | Notes     |
|-------------|-------------|-----------------------------------|-----------|
| A           | example.org | *IPv4 address of the mail server* | Required  |
| AAAA        | example.org | *IPv6 address of the mail server* | Required  |
| CNAME       | mail        | example.org                       | Mail host |

### rDNS setup

Configure rDNS in your VPS provider configuration dashbord to the IPv4 and IPv6 addresses, used in the DNS records above.

### DNSSEC

Ensure that DNSSEC is enabled for your primary and mail server domain. It can be enabled by your domain provider.

For example, check if DNSSEC is working correctly for your new TLSA record

`# nix shell nixpkgs#dnsutils --command delv _25._tcp.mail.example.org TLSA @1.1.1.1`  
`; fully validated`  
`_25._tcp.mail.example.org. 10800 IN TLSA 3 1 1 7f59d873a70e224b184c95a4eb54caa9621e47d48b4a25d312d83d96 e3498238`  
`_25._tcp.mail.example.org. 10800 IN RRSIG  TLSA 13 5 10800 20230601000000 20230511000000 39688 example.org. He9VYZ35xTC3fNo8GJa6swPrZodSnjjIWPG6Th2YbsOEKTV1E8eGtJ2A +eyBd9jgG+B3cA/jw8EJHmpvy/buCw==`

### Running behind reverse proxy

When running behind a load balancer or reverse proxy, Stalwart will not be able to see the "real" sender IP-addresses of incoming mails in case of simple port forwarding. <a href="HAProxy" class="wikilink" title="HAProxy">HAProxy</a> or Proxy Protocol solves this problem and should be used on the reverse proxy server to forward SMTP traffic. Stalwart will start parsing the Proxy Protocol packages if correctly configured on the listener.In this example we set `proxy.trusted-networks` with an array of the gateway IP-addresses in the `smtp` listener section.

## Configuration

### Mail aliases

Considering the configuration above, we could add a mail alias for `user1@example.org` by simply adding further addresses to the `email`-array such as `user1real@example.org`

### Blocking mail sender address

If you don't want to receive any mails from a specific address, even not into your spam folder, you can add it to the spam-trap array.

## Tips and tricks

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

The following minimal configuration example is unsecure and for testing purpose only. It will run the Stalwart mail server on `localhost`, listening on port `143` (IMAP) and `587` (Submission). Users `alice@localhost.localdomain` and `bob@localhost.localdomain` are configured with the password `Dev-Mail-Test-2026!`.

## See also

- <a href="Maddy" class="wikilink" title="Maddy">Maddy</a>, a composable, modern mail server written in Go.
- [Simple NixOS Mailserver](https://nixos-mailserver.readthedocs.io/en/latest)

<a href="Category:Mail_Server" class="wikilink" title="Category:Mail Server">Category:Mail Server</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
