<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tor -->

<strong>Tor (The Onion Router)</strong> is a free, open-source software that enables anonymous internet communication. It protects users' privacy by routing traffic through a global network of volunteer-operated servers, masking IP addresses and online activities. Tor's key features include <strong>anonymity</strong>, <strong>privacy</strong>, and <strong>censorship circumvention</strong>. It supports hidden services with <strong>.onion domains</strong> for additional anonymity.

Tor works by encrypting data multiple times and sending it through a series of nodes (entry, middle, and exit), each decrypting a layer. This process, called <strong>onion routing</strong>, ensures no single point knows both the origin and destination.

Commonly used by <strong>journalists</strong>, <strong>activists</strong>, and <strong>privacy-conscious individuals</strong>, Tor helps bypass censorship and protect against surveillance. However, it can be slower than direct connections and has been associated with illegal activities due to its anonymity.

For more information, you can visit the official [Tor Project website](https://www.torproject.org/).

## Installation

#### Using nix-shell

``` console
$ nix-shell -p tor-browser
```

#### Using Global Configuration

``` nix
environment.systemPackages = [
  pkgs.tor-browser
];
```

After modifying your configuration, apply the changes by running:

``` console
# nixos-rebuild switch
```

#### Using Home Configuration

``` nix
home.packages = [ 
  pkgs.tor-browser
];
```

After updating your configuration, apply the changes by running:

``` console
$ home-manager switch
```

## Configuration

#### Basic

``` nix
services.tor = {
  enable = true;
  openFirewall = true;
};
```

#### Advanced

``` nix
services.tor = {
  enable = true; 

  # Disable GeoIP to prevent the Tor client from estimating the locations of Tor nodes it connects to
  enableGeoIP = false;

  # Enable Torsocks for transparent proxying of applications through Tor
  torsocks.enable = true;

  # Enable the Tor client
  client = {
    enable = true;
  };

  # Enable and configure the Tor relay
  relay = {
    enable = true;
    role = "relay";  # Set the relay role (e.g., "relay", "bridge")
  };

  # Configure Tor settings
  settings = {
    Nickname = "YourNickname";  
    ContactInfo = "your-email@example.com"; 

    # obfs4 proxy, use when running a bridge. Change port as needed
    ServerTransportListenAddr = [ "obfs4 0.0.0.0:8443" ];

    # Bandwidth settings
    MaxAdvertisedBandwidth = "100 MB";  
    BandWidthRate = "50 MB";  
    RelayBandwidthRate = "50 MB";  
    RelayBandwidthBurst = "100 MB"; 

    # Restrict exit nodes to a specific country (use the appropriate country code)
    ExitNodes = "{ch} StrictNodes 1";  
    
    # Reject all exit traffic
    ExitPolicy = "reject *:*";  

    # Performance and security settings
    CookieAuthentication = true;  
    AvoidDiskWrites = 1; 
    HardwareAccel = 1;  
    SafeLogging = 1; 
    NumCPUs = 3;   

    # Network settings
    ORPort = [443];
  };
};

# Operating a Snowflake proxy helps others circumvent censorship. Safe to run.
services.snowflake-proxy = {
  enable = true;
  capacity = 10;
};
```

The Tor relay will require some days to advertise in the network, to the [relay index](https://metrics.torproject.org/rs.html) and start generating traffic. You can query metrics about your relay on the relay index page using the name or email from the settings.

In case your Tor relay is running behind a NAT network, be sure to forward the ORPort and the obfs4 Port to your server running Tor.

## Tips and Tricks

### Location of Option

The global options are listed here [services.tor.\*](https://search.nixos.org/options?channel=unstable&query=services.tor).

### Relay Management

Tor relays are servers that help anonymize internet traffic by routing it through a series of nodes. Each relay in the Tor network plays a crucial role in maintaining the privacy and security of users by ensuring that no single point can trace the origin and destination of the data. The primary purpose of Tor relays is to facilitate anonymous communication and protect users from network surveillance and traffic analysis.

**Types of Relays**

- **Entry (Guard) Relays:** These are the first relays that Tor clients connect to. They are responsible for receiving traffic from the user and passing it to the middle relays. Entry relays are chosen carefully to ensure stability and reliability.
- **Middle Relays:** These relays pass traffic between the entry and exit relays. They add an additional layer of encryption and help obscure the path of the data.
- **Exit Relays:** These are the final relays that traffic passes through before reaching its destination. Exit relays decrypt the last layer of encryption and send the data to the intended recipient. They are crucial for accessing non-Tor websites and services.

**Performance Considerations**

- **Bandwidth:** The speed and performance of the Tor network depend on the bandwidth provided by the relays. Higher bandwidth relays can handle more traffic and improve overall network performance.
- **Latency:** Due to the multiple layers of encryption and the routing through several relays, Tor can introduce latency, making it slower than direct internet connections.
- **Load Balancing:** The Tor network uses load balancing to distribute traffic evenly across relays, preventing any single relay from becoming a bottleneck.

**Security Risks**

- **Malicious Relays:** Some relays may be operated by malicious actors attempting to intercept or manipulate traffic. The Tor network mitigates this risk through its layered encryption, but users should remain cautious.
- **Exit Relay Monitoring:** Since exit relays decrypt the final layer of encryption, they can potentially monitor unencrypted traffic. Users should use end-to-end encryption (e.g., HTTPS) to protect their data.
- **Correlation Attacks:** Adversaries with the ability to monitor both the entry and exit points of the Tor network may attempt to correlate traffic patterns and de-anonymize users.

**Legal Issues**

- **Jurisdiction:** Tor relays operate in various jurisdictions, each with its own legal framework. Relay operators should be aware of local laws and regulations regarding data privacy and internet usage.
- **Liability:** Exit relay operators may face legal scrutiny if their relays are used for illegal activities. It is important for operators to understand the potential legal implications and take appropriate measures to protect themselves.

### Client Bridge

Tor can be enabled as a system service by enabling options . Configuration of tor service is an example of [Freeform module](https://nixos.org/manual/nixos/stable/index.html#sec-freeform-modules), so you can pass not only explicitly supported , but all other [torrc](https://2019.www.torproject.org/docs/tor-manual.html.en) options. For example, a client obfs4 bridge config can be set like this:

``` nix
services.tor.settings = {
  UseBridges = true;
  ClientTransportPlugin = "obfs4 exec ${pkgs.obfs4}/bin/lyrebird";
  Bridge = "obfs4 IP:ORPort [fingerprint]";
};
```

For a webtunnel bridge, use:

``` nix
services.tor.settings = {
  UseBridges = true;
  ClientTransportPlugin = "webtunnel exec ${pkgs.webtunnel}/bin/client";
  Bridge = "webtunnel IP:ORPort [fingerprint]";
};
```

By default, Tor in NixOS provides one SOCKS proxy on port 9050. Port 9050 is a "slow" SOCKS port which can be used for email, git, and pretty much any other protocol except HTTP(S). This is a safe default which complicates identity correlation attacks, although it isn't sufficient to completely thwart them.

By also enabling , an additional SOCKS service on port 9063 can be enabled. This is a "fast" SOCKS port suitable for browser use; a new circuit is established every ten minutes.

### Sandboxing

You can also run the <a href="Tor_Browser_in_a_Container" class="wikilink" title="Tor Browser in a Container">Tor Browser in a Container</a>.

Alternatively, Tor can be configured together with the <a href="Firejail#Torify_application_traffic" class="wikilink" title="Firejail">Firejail</a> sandboxing solution.

### Faster Reconnects on Network Switch

Using <a href="Systemd/networkd/dispatcher" class="wikilink" title="Systemd/networkd/dispatcher">Systemd/networkd/dispatcher</a> it is possible to restart the Tor daemon every time a network reconnect is performed. This avoids having to wait for Tor network timeouts and reestablishes a new connection faster.

**Guard Wrappers** Some applications have native support for SOCKS proxies, and it is tempting to use such support. However, it isn't unheard of for proxy support to have bugs or for application plugins to ignore proxy settings or for settings to get lost. Using a wrapper such as torsocks can be more reliable.

An alternative approach is use both a wrapper and built-in proxy support. This way, if the application's proxy support fails, the connection is likely to be caught by the wrapper and if you run the application without the wrapper by mistake, the connections are still likely to be proxied.

### KDE Integration

**KDE Proxy Configuration** In KDE, proxy server configuration is set for all applications centrally. You should set the SOCKS proxy to Tor's default SOCKS port (127.0.0.1:9050), and set the HTTP proxy to Privoxy (127.0.0.1:8118).

Without Privoxy, KDE applications using either KHTML or WebKit KPart (such as Konqueror, Rekonq, KTorrent, Akregator) would become nearly unusable and cause excessive load to the Tor network.

Another possibility is to run `tsocks kdeinit4`, which would cause kdeinit4 to respawn in a wrapped state. All KDE applications started after this will be wrapped with tsocks.

**Kopete** Kopete makes direct connections and ignores KDE settings. Kopete torification depends on what plugins you use. XMPP requires `tsocks`. ICQ requires `torsocks-faster`.

**KDE PIM** KMail respects KDE-wide proxy settings, and the "safe" SOCKS port offers good isolation between mailboxes.

### DNS over Tor

``` nix
services = {
  tor = {
    enable = true;
    client.dns.enable = true;
    settings.DNSPort = [{
      addr = "127.0.0.1";
      port = 53;
    }];
  };
  resolved = {
    enable = true; # For caching DNS requests.
    fallbackDns = [ "" ]; # Overwrite compiled-in fallback DNS servers.
  };
};

networking.nameservers = [ "127.0.0.1" ];
```

Please refer to [ArchWiki](https://wiki.archlinux.org/title/Tor#TorDNS) for details.

## References

1.  <https://support.torproject.org/tbb/tbb-9>
2.  <https://nixos.org/manual/nixos/stable/index.html#sec-freeform-modules>
3.  <https://2019.www.torproject.org/docs/tor-manual.html.en>
4.  <https://wiki.archlinux.org/title/Tor#TorDNS>
5.  <https://search.nixos.org/options?channel=unstable&query=services.tor>

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Privacy" class="wikilink" title="Category:Privacy">Category:Privacy</a>
