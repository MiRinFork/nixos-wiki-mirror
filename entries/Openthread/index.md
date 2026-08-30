<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Openthread -->

## Openthread

[Openthread](https://openthread.io/) is an open source implementation of the [Thread](https://threadgroup.org/What-is-Thread/Overview) IOT networking specification.

This implementation provides an openthread border router server and a small webui to monitor it. It can be used to setup a thread network on your server if it is equiped with a Thread radio device. The border router allows for routing IPv6 communication between a classic wifi or ethernet network and a Thread network.

Popular Thread radio devices include Home assistant's connect ZBT-2 and SONOFF Zigbee 3.0 USB dongles among many other.

Once your thread network is established, you can use the Matter IOT standard to control various home automation devices adhering to the standard.

The most likely configuration for NixOS users will be to use openthread in combination with the <a href="Home_Assistant" class="wikilink" title="Home Assistant">Home Assistant</a> module and the <a href="Matter_Server" class="wikilink" title="Matter Server">Matter Server</a> module.

### Basic Setup

Make sure you have the required radio USB device connected to your server and note its device path which should look something like

``` shell
/dev/serial/by-id/usb-Nabu_Casa_ZBT-2_xxxxxxxxx_ifxx
# or
/dev/serial/by-id/usb-Itead_Sonoff_Zigbee_3.0_USB_Dongle_Plus_V2_xxxxxxxxxxxxxxxxxxxxx-ifxx-portx
```

of course these are merely examples for specific devices but you will want to use the by-id path to ensure it remains stable across reboots and multiple device configurations.

Then you can enable the open thread border router service in NixOS

``` nixos
services.openthread-border-router = {
  enable = true;
  backboneInterfaces = [ "eno1" ];
  # logLevel = "notice"; controls the log levels

  radio = { 
    device = "/dev/serial/by-id/usb-Nabu_Casa_ZBT-2_xxxxxxxxxxx-if00";
    baudRate = 460800;   # This and flow control are hardware dependant
    flowControl = false; # check your device's documentation
  };

  rest = {
    # listenAddress = "::"; # Defaults to 127.0.0.1

    # It is recommended to use port 8081 as some web UI features do not work 
    # with a different port 
    # listenPort = 8081;
  };

  web = {
    enable = true; # enables the basic web interface 
    # listenAddress = "::"; # defaults to 127.0.0.1
    # listenPort = 58082;   # this port can be altered freely
  };      
};
```

once the service is started you should be able to access the web ui <img src="Openthread_border_router_web_ui.png" title="Openthread_border_router_web_ui.png" width="938" height="938" alt="Openthread_border_router_web_ui.png" /> You can use the UI to form your own network or join an existing network provided you have the credentials for it. The module also installs the `ot-ctl` CLI tool which can achieve the same actions and allows for a deeper inspection of the thread network and routing tables

Once you have formed or joined a Thread network, you should have a basic setup up and running. However at this point there is little you can do with it.

### Integrating with Home Assistant

Having a thread border router by itself it not all that useful except for the most hard core power users. You will most likely want to use this network to communicate with Thread/Matter devices. To do so the easiest option is to integrate both Thread and Matter components with <a href="Home_Assistant" class="wikilink" title="Home Assistant">Home Assistant</a>.

You will need to ensure that you have configured the relevant home assistant addons (see the <a href="Home_Assistant" class="wikilink" title="Home Assistant">Home Assistant</a> page for a more complete configuration example)

``` nixos
services = {
  home-assistant = {
    enable = true;
    extraComponents = [        
      #...
      # Components required to operate a matter-over-thread 
      # network with home-assistant
      "matter"
      "otbr"
      "thread"
      #...
    ];
  }
}
```

And you will need to enable the <a href="Matter_Server" class="wikilink" title="Matter Server">Matter Server</a> module. <img src="Home_assistant_thread_large.png" title="Home_assistant_thread_large.png" width="891" height="891" alt="Home_assistant_thread_large.png" /> Once restarted, home assistant should detect the Open thread border router, the corresponding Thread network and the matter server automatically and propose to add them as integrations.

At this point you should be ready to commission your first device.

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
