<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ntpd-rs -->

[Ntpd-rs](https://github.com/pendulum-project/ntpd-rs) is a network time protocol implementation in Rust with NTS (Network Time Security) protocol support. It is used to synchronize time and date information through a network and set the clock of your system automatically when your computer is connected to the internet.

### Setup

For a minimal setup of ntpd-rs with five European NTS servers, add following config to your system.

``` nix
services.ntpd-rs = {
  enable = true;
  useNetworkingTimeServers = false;
  settings.source = [
    {
      mode = "nts";
      address = "ptbtime1.ptb.de";
    }
    {
      mode = "nts";
      address = "ntp3.fau.de";
    }
    {
      mode = "nts";
      address = "nts.netnod.se";
    }
    {
      mode = "nts";
      address = "ntppool1.time.nl";
    }
    {
      mode = "nts";
      address = "nts1.ntp.hr";
    }
  ];
};
```

An unofficial curated list of NTS servers can be found on [public-ntp-servers GitHub repository](https://github.com/jauderho/public-ntp-servers).

### See also

- <a href="NTP" class="wikilink" title="NTP">NTP</a> page, detailing the classical setup of network time synchronization on NIxOS.
