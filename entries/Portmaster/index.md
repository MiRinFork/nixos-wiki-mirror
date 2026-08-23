<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Portmaster -->

**Portmaster** is a free and open source application firewall developed by [Safing](https://safing.io).[^1] It monitors and controls network connections per application, so rules follow the program rather than the port. A package and a service module are available on the unstable channel and will ship with NixOS 26.11.

## Installation

#### System setup

Add the following to your system configuration:

``` nix
services.portmaster.enable = true;
```

This starts the `portmaster.service` daemon, installs the desktop client into the system environment, and loads the `nfnetlink_queue` kernel module. The desktop client starts in the background with graphical sessions and authenticates against the package's read-only binary directory, so it works without any further setup. When the service stops, leftover iptables rules are cleaned up automatically.

For all module options, refer to .

## Configuration

#### Basic

Global settings can be managed declaratively through :

``` nix
services.portmaster = {
  enable = true;
  settings = {
    "core/log/level" = "warning";
    "dns/nameservers" = [
      "dot://dns.quad9.net?ip=9.9.9.9&name=Quad9&blockedif=empty"
    ];
  };
};
```

Settings are merged from three sources, where later sources override earlier ones: `settings`, then `settingsFile`, then `secretsFile`. Use `secretsFile` for values that must not be copied to the world-readable Nix store.

Portmaster stores its mutable state, configuration, and logs under , which defaults to `/var/lib/portmaster`. Changing it does not migrate existing state.

Set `services.portmaster.settings.devmode` to `true` only when you need unrestricted browser or debugging access to the local API at [`http://127.0.0.1:817`](http://127.0.0.1:817). The packaged desktop client does not need it.

#### Advanced

Application profiles can be declared in your NixOS configuration. The module derives fingerprints from packages using regular expressions that ignore the Nix store hash and the package version, and that also match Nix generated `.program-wrapped` executables. Profiles therefore keep working across rebuilds and package updates. They are imported through Portmaster's local API, and rebuilds update existing profiles in place instead of creating duplicates.

``` nix
services.portmaster = {
  enable = true;
  profilePrefix = "[NixOS] ";

  profiles = {
    Firefox = {
      packages = [ pkgs.firefox ];
      settings.filter.defaultAction = "permit";
    };

    Vesktop = {
      fingerprints = [
        {
          type = "env";
          key = "CHROME_DESKTOP";
          operation = "equals";
          value = "vesktop.desktop";
        }
      ];
    };
  };
};
```

Some packages start their real executable outside `bin`. Describe those layouts explicitly:

``` nix
services.portmaster.profiles.Brave.packages = [
  {
    package = pkgs.brave;
    directory = "opt/brave.com/brave";
  }
];
```

A package entry accepts `package`, `type`, `storeNameRegex`, `directory`, `name`, `wrapped`, `strictHead`, and `strictLast` fields. Manual fingerprints support the types `path`, `cmdline`, `env`, and `tag` with the operations `equals`, `prefix`, and `regex`. The `packages` and `fingerprints` lists are merged, and at least one of them must be non-empty.

Fingerprints are alternatives: a process matches when any fingerprint matches, so broad regular expressions can match unintended applications. Removing a profile declaration does not remove a profile that Portmaster has already imported. Changing fingerprints changes the derived profile identity, which can leave the previous imported profile behind.

## Tips and tricks

- Use `profilePrefix` to make module managed profiles easy to recognize in the Portmaster UI.
- The binary self-updater is disabled in the NixOS package because Nix owns the installed files. Intelligence and filter list data updates keep working and are stored under `stateDir`.

## Troubleshooting

#### Port 53 conflicts

Portmaster runs its own local nameserver on port 53 of localhost.[^2] The module does not disable <a href="systemd-resolved" class="wikilink" title="systemd-resolved">systemd-resolved</a> or other DNS services for you. If another service already listens on port 53, resolve the conflict yourself, for example by disabling systemd-resolved or its stub listener.

DNS queries that arrive through systemd-resolved cannot be attributed to the originating process, which weakens per-application filtering.[^3] Setups using systemd-networkd have also seen VPN provided split DNS zones fail to resolve.[^4]

#### firewalld

The Portmaster service declares a systemd conflict with `firewalld.service`. The two cannot run at the same time.

#### First start

Portmaster downloads its intelligence and filter list data on first start, so the first run needs a working network connection. If the download fails, filtering can be impaired until the data is fetched. Restarting the service retries the download.

#### Declarative profiles fail to import

The import runs in a separate unit, `portmaster-managed-profiles.service`, which waits up to 60 seconds for the Portmaster API to become ready. Check its status and the reason for a rejected profile with:

``` console
# journalctl -u portmaster-managed-profiles
```

#### Logs

The daemon logs to the journal and to `logs` under `stateDir`:

``` console
# journalctl -u portmaster
```

## See also

- [Portmaster upstream](https://safing.io/portmaster/) – official website
- [Portmaster documentation](https://docs.safing.io/) – upstream manual, including OS integration details
- [safing/portmaster](https://github.com/safing/portmaster) – source repository
- [NixOS manual chapter](https://nixos.org/manual/nixos/unstable/#module-services-portmaster) – module documentation with more configuration examples
- <a href="OpenSnitch" class="wikilink" title="OpenSnitch">OpenSnitch</a> – another application firewall available on NixOS

## References

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>

[^1]: <https://safing.io/>

[^2]: <https://docs.safing.io/portmaster/architecture/os-integration>

[^3]:

[^4]: <https://github.com/safing/portmaster/issues/655>
