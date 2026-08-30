<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: MollySocket -->

[Molly](https://molly.im/) is an independent, fully open-source fork of the Signal Android client (available in a default and a `-FOSS` flavor, the latter with no Google binaries). **[MollySocket](https://github.com/mollyim/mollysocket)** is a lightweight Rust daemon that runs on a server and acts as a linked device without an encryption key on the Signal network. It converts Signal's push notifications into [UnifiedPush](https://unifiedpush.org/) wake-ups, so your phone no longer needs to hold a persistent connection to Signal's servers. This article documents a self-hosted setup on NixOS, using <a href="ntfy" class="wikilink" title="ntfy">ntfy</a> as the push server.

## Prerequisites

- A working <a href="ntfy" class="wikilink" title="ntfy">ntfy</a> instance with a public HTTPS endpoint.
- A phone running Molly-FOSS with the ntfy app as its UnifiedPush distributor.
- An <a href="ACME" class="wikilink" title="ACME">ACME</a> setup and the domain reachable over the public internet.

## Installation

Enable the mollysocket module and configure it together with your push server and a reverse proxy. Molly can only reach mollysocket over HTTPS, so mollysocket is listened on locally and protected by a virtual host:

is optional but recommended. You may obtain the UUID from within the Molly Android app after initial setup: Settings - Notifications - Configure UnifiedPush - Account ID.

You also should set up a virtual host via nginx or caddy in front of it:

If you haven't done so for other services, you will also need an <a href="ACME" class="wikilink" title="ACME">ACME</a> setup. A minimal working example:

Also note that you might need to restart the ACME service after first setup due to a bug:

### VAPID key

Molly only generates its setup QR code when mollysocket has a VAPID key. Generate one once and store it in the `environmentFile` above to keep the secret out of the Nix store:

## Setup on the phone

Install **Molly-FOSS** (the no-Google, UnifiedPush-capable variant) and the **ntfy** app as your UnifiedPush distributor. In Molly, go to , scan the QR code shown at [`https://molly.yourdomain.com`](https://molly.yourdomain.com), and run **Test configuration** to confirm the round-trip works.

## See also

- <a href="ntfy" class="wikilink" title="ntfy">ntfy</a> - the self-hosted push server used to deliver the wake-ups
- [UnifiedPush](https://unifiedpush.org/) - the protocol behind this setup

## Troubleshooting

- **HTTPS and Host header are mandatory.** Molly can only reach mollysocket over HTTPS, and you must pass the original `Host` through the proxy (`proxy_set_header Host $host`). Otherwise mollysocket warns "Origin doesn't seem to be correctly passed" and won't issue a QR code.
- **You must whitelist your own push server.** Add your ntfy URL to `allowed_endpoints` (self-hosted instances should be whitelisted to work reliably). This is the <em>ntfy</em> URL, not the mollysocket URL.
- **ACME certificate timing.** On first deploy NixOS serves a self-signed placeholder, which the <em>phone</em> rejects with a certificate error. The desktop browser may still load the page after clicking "ignore", but **Molly will not accept it** - restart the ACME service and confirm the cert is valid before scanning.
- **ntfy with auth blocks mollysocket with a 403.** mollysocket sends requests without credentials, so on a private (deny-all) ntfy instance you must allow the anonymous write-only `"*:up*:write-only"` ACL entry described in the <a href="ntfy" class="wikilink" title="ntfy">ntfy</a> article. Security is preserved by high-entropy topic names and end-to-end encrypted payloads.
- **Test notifications can fail silently on the phone.** Grant the ntfy distributor "unrestricted" battery / background activity, or wake-ups will be dropped while the device is idle.
- **Your server is a single point of failure.** If your homeserver is down, real-time push stops (open Molly to sync manually). However, messages are never lost, because content flows directly between Signal's servers and the phone. Thus, downtime only means that you manually have to check for new messages.
- **Your linked Signal Desktop is unaffected** by this setup; it keeps its own independent connection to Signal.

## References

- [MollySocket GitHub](https://github.com/mollyim/mollysocket)
- [Molly](https://molly.im/) - the Signal fork this bridge is built for.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
