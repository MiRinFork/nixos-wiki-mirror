<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: RabbitMQ -->

[RabbitMQ](https://www.rabbitmq.com/) is a messaging broker, an intermediary for messaging. It gives your applications a common platform to send and receive messages, and your messages a safe place to live until received.

## Troubleshooting

### Upgrading RabbitMQ fails because of missing feature flag

Following error message might occur on major version upgrades

``` sh
Feature flags: `stream_filtering`: required feature flag not enabled! It must be enabled before upgrading RabbitMQ.
Failed to initialize feature flags registry: {disabled_required_feature_flag, stream_filtering}
```

One possible workaround is to downgrade RabbitMQ to the latest working version

``` nix
nixpkgs = {
  overlays = [
    (self: super: {
      rabbitmq-server = super.rabbitmq-server.overrideAttrs (oldAttrs: rec {
        version = "3.13.7";
        src = pkgs.fetchurl {
          url = "https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server-3.13.7.tar.xz";
          hash = "sha256-GDUyYudwhQSLrFXO21W3fwmH2tl2STF9gSuZsb3GZh0=";
        };
      });
    })
  ];
};
```

Adapt the version, url and hash according to your needs. Apply configuration and ensure `rabbitmq` service is running successfully.

Issue following command to enable all feature flags:

``` sh
sudo -u rabbitmq rabbitmqctl enable_feature_flag all
```

After that remove the overlay above from your system configuration and the new RabbitMQ version should successfully upgrade.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
