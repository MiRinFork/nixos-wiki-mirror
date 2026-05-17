<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Home Assistant -->

<figure>
<img src="New_Home_Assistant_logo.svg" title="New_Home_Assistant_logo.svg" width="250" />
<figcaption>New_Home_Assistant_logo.svg</figcaption>
</figure>

[Home Assistant](https://www.home-assistant.io/) is an open source home automation software that puts local control and privacy first. Powered by a worldwide community of tinkerers and DIY enthusiasts.

NixOS provides native support for [Home Assistant Core](https://www.home-assistant.io/faq/ha-vs-hassio/) and offers integration facilities for most pieces of its comprehensive ecosystem:

- As of the 2026.5.1 release we support 100% (1450/1450) of the built-in integrations
- We support [custom components](https://github.com/NixOS/nixpkgs/tree/master/pkgs/servers/home-assistant/custom-components) through the [`services.home-assistant.customComponents`](https://search.nixos.org/options?channel=unstable&show=services.home-assistant.customComponents&from=0&size=50&sort=relevance&type=packages&query=services.home-assistant.customComponents) option
- We support source-built [custom lovelace modules](https://github.com/NixOS/nixpkgs/tree/master/pkgs/servers/home-assistant/custom-lovelace-modules) mostly through [services.home-assistant.customLovelaceModules](https://search.nixos.org/options?channel=unstable&show=services.home-assistant.customLovelaceModules&from=0&size=50&sort=relevance&type=packages&query=services.home-assistant.customLovelaceModules) option
- We support themes through the [services.home-assistant.themes](https://search.nixos.org/options?channel=unstable&show=services.home-assistant.customLovelaceModules&from=0&size=50&sort=relevance&type=packages&query=services.home-assistant.themes) option.
- We do not support [apps](https://www.home-assistant.io/addons/) (previously addons), which are used to deploy additional services, that are configurable from Home Assistant on their operating system
  - NixOS has native support for various services, that integrate with Home Assistant, e.g. <a href="EVCC" class="wikilink" title="EVCC">EVCC</a>, <a href="Frigate" class="wikilink" title="Frigate">Frigate</a>, <a href="Mosquitto" class="wikilink" title="Mosquitto">Mosquitto</a>, <a href="Music-Assistant" class="wikilink" title="Music-Assistant">Music-Assistant</a>, <a href="Openthread" class="wikilink" title="Openthread">Openthread</a>, <a href="Wyoming" class="wikilink" title="Wyoming">Wyoming</a>, <a href="zigbee2mqtt" class="wikilink" title="zigbee2mqtt">zigbee2mqtt</a>, <a href="Z-Wave_JS" class="wikilink" title="Z-Wave JS">Z-Wave JS</a>

## Support

Depending on the installation method one of various support channels should be used.

If you rely on the NixOS package and/or module, issues should be reported on the [nixpkgs Issue tracker](https://github.com/NixOS/nixpkgs/issues/new/choose) or the [\#homeautomation:nixos.org](https://matrix.to/#/#homeautomation:nixos.org?via=lossy.network&via=matrix.org&via=kack.it) Matrix room.

Only if you rely on one of the <a href="Home_Assistant#Upstream_supported" class="wikilink" title="upstream supported">upstream supported</a> deployment methods issues can be directly reported to the upstream project. Make sure to follow their guide on [reporting issues](https://www.home-assistant.io/help/reporting_issues/).

## Upstream installation methods

If you intend for Home Assistant to be an end-user configurable experience, as opposed to the declarative configuration experience NixOS offers, then consider these setups. They have the benefit of full upstream support.

### Virtual machine

![HAOS in Virtualbox](Home_Assistant_OS_in_Virtualbox.png "HAOS in Virtualbox") Home Assistant maintains their own operating system and provides <a href="QEMU" class="wikilink" title="QEMU">QEMU</a> (qcow2) and <a href="Virtualbox" class="wikilink" title="Virtualbox">Virtualbox</a> (vdi) compatible [images](https://www.home-assistant.io/installation/linux#install-home-assistant-operating-system). NixOS supports virtualization solutions like <a href="libvirt" class="wikilink" title="libvirt">libvirt</a> and <a href="Incus" class="wikilink" title="Incus">Incus</a>, both of which wrap QEMU, and <a href="Virtualbox" class="wikilink" title="Virtualbox">Virtualbox</a>.

Example:

- [NixOS: Headless Home Assistant VM (myme.no)](https://myme.no/posts/2021-11-25-nixos-home-assistant.html) using libvirt
- [Running Home Assistant OS as a VM in a NixOS Host](https://balisong.dev/blog/running-home-assistant-os-as-a-vm-in-a-nixos-host/) using incus

### OCI container

Home Assistant also provides a [container image](https://www.home-assistant.io/installation/linux#install-home-assistant-container) for OCI compatible runtimes.

The following example configuration uses <a href="podman" class="wikilink" title="podman">podman</a> to download and run the `home-assistant:stable` image. The frontend will be available via HTTP on port `tcp/8123` in the host network namespace and can be reverse proxied from there.

``` nix
{  
  virtualisation.oci-containers = {
    backend = "podman";
    containers.homeassistant = {
      volumes = [ "home-assistant:/config" ];
      environment.TZ = "Europe/Berlin";
      # Note: The image will not be updated on rebuilds, unless the version label changes
      image = "ghcr.io/home-assistant/home-assistant:stable";
      extraOptions = [ 
        # Use the host network namespace for all sockets
        "--network=host"
        # Pass devices into the container, so Home Assistant can discover and make use of them
        "--device=/dev/ttyACM0:/dev/ttyACM0"
      ];
    };
  };
}
```

## Native installation

- There is full support for the YAML configuration through the [`services.home-assistant.config`](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=services.home-assistant.config) option.
- This is also the case for the [Lovelace YAML configuration](https://www.home-assistant.io/dashboards/dashboards/#adding-more-dashboards-with-yaml) through the [`services.home-assistant.lovelace`](https://search.nixos.org/options?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=services.home-assistant.lovelace) option.
  - Custom Lovelace modules can be configured through [`services.home-assistant.customLovelaceModules`](https://search.nixos.org/options?channel=unstable&show=services.home-assistant.customLovelaceModules&from=0&size=50&sort=relevance&type=packages&query=services.home-assistant.customLovelaceModules). The [`resources`](https://www.home-assistant.io/dashboards/dashboards/#resources) section of your Lovelace configuration will automatically be populated.
- Custom components can be enabled through the [`services.home-assistant.customComponents`](https://search.nixos.org/options?channel=unstable&show=services.home-assistant.customComponents&from=0&size=50&sort=relevance&type=packages&query=services.home-assistant.customComponents).

### Declarative configuration

Set up your home-assistant by configuring the `services.home-assistant.config` attribute set as if it were your home-assistant [YAML configuration](https://www.home-assistant.io/docs/configuration/yaml/). The module parses the root and platforms level to automatically discover integrations used and will provide their dependencies to your home-assistant package.

The following is a minimal configuration, that has all the dependencies that are required to complete the initial configuration flow, that creates your first user:

``` nix
{
  services.home-assistant = {
    enable = true;
    extraComponents = [
      # Components required to complete the onboarding
      "analytics"
      "google_translate"
      "met"
      "radio_browser"
      "shopping_list"
      # Recommended for fast zlib compression
      # https://www.home-assistant.io/integrations/isal
      "isal"
    ];
    config = {
      # Includes dependencies for a basic setup
      # https://www.home-assistant.io/integrations/default_config/
      default_config = {};
    };
  };
}
```

### Imperative configuration

Alternatively, If you would like to manage your configuration outside your NixOS configuration, you can set up the module to pass a configuration directory. This kind of setup is useful if you want to gradually migrate your existing configuration over.

Using a custom configuration has the drawback, that we cannot automatically recognize and install component dependencies, and it is unlikely that we will continue to support these kinds of setups going forward.

``` nix
{
  services.home-assistant = {
    # opt-out from declarative configuration management
    config = null;
    lovelaceConfig = null;
    # configure the path to your config directory
    configDir = "/etc/home-assistant";
    # specify list of components required by your configuration
    extraComponents = [
      "esphome"
      "met"
      "radio_browser"
    ];
  };
}
```

### Firewalling

Home Assistant by default listens on port 8123. It is customary to put services behind a <a href="Home_Assistant#Reverse_Proxying_with_nginx" class="wikilink" title="reverse-proxy">reverse-proxy</a>, which allows sharing ports 80/443 (http/https) and offers TLS termination.

If you don't plan on using a reverse-proxy, you can allow unencrypted access by opening up the port home-assistant is running on in your firewall. This is not generally recommended, since credentials will be transmitted in plain text and browsers tend to limit certain functionality (e.g. geolocation) to HTTPS.

``` nix
{
  config,
  ...
}:

{
  networking.firewall.allowedTCPPorts = [
    config.services.home-assistant.config.http.server_port
  ];
}
```

### First start

On your first start you may see multiple `ModuleNotFoundError` in Home Assistants journal log. These are dependencies required to set up devices Home Assistant already discovered on the local network.

The appropriate component to load can be looked up in the [`component-packages.nix`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/servers/home-assistant/component-packages.nix) file, that gets auto-generated as part of the packaging process.

For example, we can map the following error to

` ModuleNotFoundError: No module named 'aioesphomeapi'`

the `esphome` module quite easily.

``` nix
{
  version = "2022.8.0";
  components = {
    [...]
    "esphome" = ps: with ps; [
      aioesphomeapi
      aiohttp-cors
      ifaddr
      zeroconf
    ];
    [...]
```

#### Using components without YAML configuration

When a component offers no YAML configuration its dependencies could in theory be installed by mentioning its component name in `services.home-assistant.config.wled = {};`. This is deprecated, since Home Assistant will usually complain about the config having been migrated into the graphical user interface.

In recent versions of the home-assistant this use case has become more prominent and therefore received a more straightforward implementation, that also ensures that the component is still provided by Home Assistant.

``` nix
{
  services.home-assistant.extraComponents = [
    "wled"
  ];
}
```

#### Provide additional Python packages to Home Assistant

We control the dependencies we pass into the Home Assistant python environment through module options that make the dependencies available, when their relative component was declaratively mentioned.

For other use cases like PostgreSQL support in the recorder component or the use of custom components, we provide an option to inject arbitrary dependencies from nixpkgs available python package set.

``` nix
{
  services.home-assistant.extraPackages = python3Packages: with python3Packages; [
    # recorder postgresql support
    psycopg2

    # miele@home
    flatdict
    (callPackage ./pymiele.nix)
  ];
}
```

#### Using custom components

We provide a way to declaratively manage custom components through the NixOS module with the [services.home-assistant.customComponents](https://search.nixos.org/options?channel=unstable&show=services.home-assistant.customComponents&from=0&size=50&sort=relevance&type=packages&query=home-assistant) option.

Custom components can be found under [pkgs.home-assistant-custom-components](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=home-assistant-custom-components).

#### Using custom lovelace modules

We provide a way to declaratively manage custom lovelace modules through the NixOS module with the [services.home-assistant.customLovelaceModules](https://search.nixos.org/options?channel=unstable&show=services.home-assistant.customLovelaceModules&from=0&size=50&sort=relevance&type=packages&query=home-assistant) option.

When a custom module is configured, the generated Home Assistant configuration file (eg. `/var/lib/hass/configuration.yaml`) will list the module in the `lovelace` config section as a new resource. If your lovelace configuration mode is `yaml`, the custom module should be loaded automatically.

However, if your lovelace configuration mode is `storage` (the default), then the Home Assistant lovelace module will ignore the custom module resource. In that case you additionally need to add the custom module through the lovelace UI in the Resources tab with its path like `/local/nixos-lovelace-modules/`<module-entrypoint>.

Available custom components can be found under [pkgs.home-assistant-custom-lovelace-modules](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=home-assistant-custom-lovelace-modules).

# Tracking the latest release

Home Assistant is a fast-paced open source project, that currently features one major release every month, and a handful of minor ones in between. Firmwares and API endpoints tend to change from time to time, so Home Assistant and its bindings need to keep up to keep things work. The version we provide at the branch off is just a snapshot in time, and does not receive any updates, because there would just be too many dependencies and breaking changes to backport. But with NixOS it is still possible to use the version in nixpkgs/unstable by creating an overlay and using the module from <a href="Channel_branches" class="wikilink" title="nixos-unstable">nixos-unstable</a>.

``` nix
let
  # Track NixOS unstable via nix-channel, or replace it with something like niv at your own discretion
  # nix-channel --add http://nixos.org/channels/nixos-unstable nixos-unstable
  unstable = import <nixos-unstable> {};
in
{
  nixpkgs.overlays = [
    (self: super: {
      inherit (unstable) home-assistant;
    })
  ];

  disabledModules = [
    "services/home-automation/home-assistant.nix"
  ];

  imports = [
    <nixos-unstable/nixos/modules/services/home-automation/home-assistant.nix>
  ];
}
```

# Snippets

## Reverse Proxying with nginx

If you run a public Home Assistant instance it is a good idea to enable SSL/TLS. The following configuration generates a certificate using letsencrypt:

``` nix
  services.home-assistant.config.http = {
    server_host = "::1";
    trusted_proxies = [ "::1" ];
    use_x_forwarded_for = true;
  };

  services.nginx = {
    recommendedProxySettings = true;
    virtualHosts."home.example.com" = {
      forceSSL = true;
      enableACME = true;
      extraConfig = ''
        proxy_buffering off;
      '';
      locations."/" = {
        proxyPass = "http://[::1]:8123";
        proxyWebsockets = true;
      };
    };
  };
```

## Using PostgreSQL

Home Assistant supports PostgreSQL as a database backend for, among other things, its logger and history components. It's a lot more scalable and typically provides faster response times than the SQLite database, that is used by default.

``` nix
  services.home-assistant = {
    extraPackages = ps: with ps; [ psycopg2 ];
    config.recorder.db_url = "postgresql://@/hass";
  };

  services.postgresql = {
    enable = true;
    ensureDatabases = [ "hass" ];
    ensureUsers = [{
      name = "hass";
      ensureDBOwnership = true;
    }];
  };
```

## Updating Zigbee Firmware over the air

To allow ZHA OTA updates you need to configure the z2m_remote_index setting for ZHA. Before doing any updates, you should read the official integration documentation <https://www.home-assistant.io/integrations/zha/#ota-firmware-updates>

Before updating a device, you should do some research. Some firmware updates break certain features you might use (e.g., group binding for IKEA devices). Some updates may also require changes to ZHA. In rare cases, you can even brick devices by installing a firmware update.

``` nix
services.home-assistant.config = {
  zha.zigpy_config.ota.z2m_remote_index = "https://raw.githubusercontent.com/Koenkk/zigbee-OTA/master/index.json";
};
```

## Automations, Scenes, and Scripts from the UI

These can be created from the user interface, but the files generated from it need to be included in your configuration.

``` nixos
{
  services.home-assistant.config = {
    "automation ui" = "!include automations.yaml";
    "scene ui" = "!include scenes.yaml";
    "script ui" = "!include scripts.yaml";
  };
};
```

It is also possible to mix declarative and generated configuration for these components, by creating multiple configuration sections with the automation, scenes, or scripts prefix:

``` nix
services.home-assistant.config = {
  "automation nixos" = [
    # YAML automations go here
  ];
  "automation ui" = "!include automations.yaml";
}
```

# Examples

### Entity Customization

You can declaratively define how entities appear in the GUI with respect to their display names (friendly_name) the "show as" (`device_class`) and the icon displayed (`icon`). See this page for more documentation and how the YAML will ultimately be generated: <https://www.home-assistant.io/docs/configuration/customizing-devices/>.

``` nix
    config = {
      default_config = {};
      homeassistant = {
        # MUST be at the top or will break entire configuration
        customize = {
          # Declare all "entity_id" objects here at this level to customize them
          "binary_sensor.name" = {
            # Custom name however you want the entity to appear in the GUI
            friendly_name = "friendlyname";
            # See https://www.home-assistant.io/integrations/binary_sensor/ for documentation
            device_class = "deviceclass"; 
            # See https://www.home-assistant.io/docs/configuration/customizing-devices/#icon for documentation
            icon = "mdi:iconname";
          };
        };
      };
    };
```

### Alarm Control Panel

You can declaratively define your own Alarm Control Panel which will appear on the GUI and have entities available to be changed via declaratively created automations. See <https://www.home-assistant.io/integrations/manual/> for more documentation.

``` nix
    config = {
      default_config = {};
      homeassistant = {

      # On same level as automations
      "alarm_control_panel" = [
        {
          platform = "manual";
          name = "Home Alarm";
          code_arm_required = "false";
          arming_time = "30";
          delay_time = "20";
          trigger_time = "4";
          disarmed = {
            trigger_time = "0";
          };
          armed_home = {
            arming_time = "0";
            delay_time = "0";
          };
          armed_night = {
            arming_time = "0";
            delay_time = "0";
          };
        }
      ];
```

### Groups / Helpers

You can declaratively define groups rather than setting them up in the GUI, and customize their unique_id, platform, type, and entitiy_id's associated. See <https://www.home-assistant.io/integrations/group/> for more documentation. Can be used in conjunction with “Entity Customization” section above for additional flexibility by plugging in the `unique_id` then changing the `friendly_name`, `icon`, `device_class` etc.

#### Binary Sensor Group

Example of Door and Window Sensor Group that could be used in an Automation for triggering an alarm system if any door or window is opened.

``` nix
      # Door and Window Sensor Group
      "binary_sensor" = [
        {
          unique_id = "binary_sensor.all_door_and_window_sensors";
          platform = "group";
          device_class = "door";
          entities = [
            "binary_sensor.sensor_1"
            "binary_sensor.sensor_2"
            "binary_sensor.sensor_3"
          ];
        }
      ];
```

#### Sensor Group

Example of Sensor group using “min” mode that could be used in an Automation to trigger a Low Battery Alert across all batteries in the group.

``` nix
      # Sensor Battery Group
      "sensor" = [
        {
          unique_id = "sensor.all_batteries";
          platform = "group";
          type = "min";
          # Use this or else if any go to "unknown" the group will show unknown
          ignore_non_numeric = "true";
          device_class = "battery";
          entities = [
            "sensor.battery_1"
            "sensor.battery_2"
            "sensor.battery_3"
          ];
        }
      ];
```

### Automations

#### Automation with a Condition

``` nix
        {
          alias = "Name To Display in Automations List";
          triggers = {
            trigger = "state";
            entity_id = "binary_sensor.someid1";
            to = "off";
            for = "00:10:00";
          };
          conditions = {
            condition = "state";
            entity_id = "binary_sensor.someid2";
            state = "on";
          };
          actions = {
            action = "light.turn_off";
            entity_id = "light.someid";
          };
        }
```

#### Automation with Multiple Conditions, Multiple Actions

``` nix
        {
          alias = "Name in Automations GUI";
          triggers = {
            trigger = "state";
            entity_id = "binary_sensor.someid";
            to = "on";
          };
          conditions = [
            {
              condition = "state";
              entity_id = "sun.sun";
              state = "below_horizon";
            }
            {
              condition = "state";
              entity_id = "light.someid";
              state = "off";
            }
          ];
          actions = [
            {
              action = "notify.notify";
              data = {
                message = "Some Notification";
              };
            }
            {
              action = "siren.turn_on";
              entity_id = "siren.someid";
            }
          ];
        }
```

#### Trigger Using Numeric State

``` nix
        {
          alias = "Some Name";
          triggers = {
            trigger = "numeric_state";
            entity_id = "sensor.batteries";
            below = "45";
          };
          actions = {
            action = "notify.notify";
            data = {
              message = "Low Battery Detected";
            };
          };
        }
```

#### Trigger Checking for Entity State Missing / Changing to Unknown

``` nix
        {
          alias = "Object Went Unknown";
          triggers = {
            trigger = "state";
            entity_id = "switch.someid";
            to = "unknown";
            for = "00:5:00";
          };
          actions = {
            action = "notify.notify";
            data = {
              message = "Object Went Offline";
            };
          };
        }
```

#### Time Based Trigger, Setting Data Field On Entity Such as Thermostat

``` nix
        {
          alias = "Do Something At Certain Time";
          triggers = {
            trigger = "time";
            at = "23:00:00";
          };
          actions = {
            action = "climate.set_temperature";
            entity_id = "climate.thermostat";
            data = {
              temperature = "68";
            };
          };
        }
```

If you did not create any automations through the UI, Home Assistant will fail loading because the `automations.yaml` file does not exist yet, and it will fail including it. To avoid that, add a systemd tmpfiles.d rule:

``` nix
systemd.tmpfiles.rules = [
  "f ${config.services.home-assistant.configDir}/automations.yaml 0644 hass hass"
];
```

## Trust a private certificate authority

Home Assistant does not natively support adding a private CA to the certificate store (see [this thread](https://community.home-assistant.io/t/add-private-cas-to-certificate-store/267452) for more details).

Home Assistant trusts certificates provided by the `certifi` python package, which nix overwrites with the `cacert` package. Using overrides you can append your root CA certificate to the certificates provided by `certifi`.

``` nix
  services.home-assistant.package = (pkgs.home-assistant.override {
    extraPackages = py: with py; [ ];
    packageOverrides = final: prev: {
      certifi = prev.certifi.override {
        cacert = pkgs.cacert.override {
          extraCertificateFiles = [ ./my_custom_root_ca.crt ];
        };
      };
  }).overrideAttrs (oldAttrs: {
    doInstallCheck = false;
  });
```

# Example configurations

- [Mic92's config](https://github.com/Mic92/dotfiles/tree/393539385b0abfc3618e886cd0bf545ac24aeb67/machines/eve/modules/home-assistant)

# Misc

## Run Home Assistant from GitHub repository

When developing Home Assistant for some test dependencies additional libraries are needed. A nix-shell expression for this is available [here](https://github.com/nix-community/nix-environments/tree/master/envs/home-assistant).

# Further reading

- [Run and Auto-Update Docker (Home Assistant) Containers on NixOS](https://nixcademy.com/posts/auto-update-containers/), Nixcademy

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
