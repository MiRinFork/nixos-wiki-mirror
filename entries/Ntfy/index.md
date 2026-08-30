<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ntfy -->

**[ntfy](https://ntfy.sh/)** is a HTTP-based pub-sub notification service. It allows sending notifications to a phone or desktop via scripts from any computer, and/or using a REST API. It can be used for free, with a paid plan or self-hosted. The latter is documented in this article.

## Installation

Enable the ntfy module in your configuration and define some basic options:

You also should set up a virtual host via nginx or caddy:

If you haven't done so for other services, you will also need an <a href="ACME" class="wikilink" title="ACME">ACME</a> setup. A minimal working example:

Also note that you might need to restart the ACME service after first setup due to a bug:

### Authentication (optional but recommended)

For a private instance you should restrict access. Set up a user database and default to denying all access:

Define users and access tokens (tokens can be generated with ).

Define an access control list (ACL). The format is , where access is /, /, / or . The wildcard matches any number of characters in a topic pattern, and the special user means "everyone" (including anonymous):

After a , the is created automatically and the users/tokens/ACL entries are applied.

If your ntfy instance is private (), and you want to use it as a [UnifiedPush](https://unifiedpush.org/) push server (e.g. for <a href="MollySocket" class="wikilink" title="MollySocket">MollySocket</a> or Matrix/fediverse push), you must explicitly allow anonymous write access to the topic prefix as application servers such as mollysocket are not registered users and cannot authenticate:

## Use

### Publishing

Publishing is done via HTTP PUT/POST or the CLI. Topics are created on the fly by publishing or subscribing to them, so for basic use no configuration is needed at all. Because there is no sign-up, a topic name is essentially a password. That's why you should pick something not easily guessable:

If access control is enabled and the topic does not allow anonymous writes, authenticate with a token ( or ):

### Subscribing

Subscribe via the web app ([ntfy.sh/app](https://ntfy.sh/app) on your own instance), the mobile app, or the API. The subscription API supports plain HTTP streams (JSON, SSE or raw) and WebSockets:

Android (Play Store + F-Droid) and iOS apps are available, too. On Android, the app can also act as a [UnifiedPush](https://unifiedpush.org/) distributor, forwarding pushes to other apps (e.g. Molly/<a href="MollySocket" class="wikilink" title="MollySocket">MollySocket</a>). On NixOS, the package can be used to subscribe to topics and receive notifications on your desktop.

## See also

- <a href="MollySocket" class="wikilink" title="MollySocket">MollySocket</a> - Use ntfy to provide notifications for the Signal-fork [Molly](https://molly.im/)

## References

- **Full documentation:** [ntfy docs](https://docs.ntfy.sh/), [configuration](https://docs.ntfy.sh/config/), [publishing](https://docs.ntfy.sh/publish/).

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
