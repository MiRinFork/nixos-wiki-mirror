<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fail2ban -->

[Fail2ban](https://www.fail2ban.org) is an intrusion prevention software. It scans through log files to find signs of malicious intent. In general, Fail2ban will update the firewall rules to reject the offending IP address for a set amount of time.

Fail2Ban uses the concept of a "jail" to modularize its configuration. A jail consists of an action (such as blocking a port using iptables) that is triggered when a filter (regular expression) applied to a log file triggers/matches more than a certain number of times in a certain time period. Actions that ship with Fail2Ban are defined in

``` nix
/etc/fail2ban/action.d
```

, while filters are defined in

``` nix
/etc/fail2ban/filter.d
```

.

## Basic Usage

Enable Fail2ban <a href="NixOS_modules" class="wikilink" title="NixOS module">NixOS module</a> with the expression:

NixOS comes with a pre-configured SSH jail which will observe errors in the <a href="SSH#OpenSSH_Server" class="wikilink" title="SSH daemon">SSH daemon</a> and ban offending IPs. If all you need is basic rate-limiting and only have the SSH port exposed, you don't have to setup anything else.

For additional configuration options, see the module documentation.

## Advanced Usage

The Fail2ban NixOS module exposes various parameters for adjusting the configuration. In the following, all options mentioned are implicitly prefixed with

``` nix
services.fail2ban
```

, unless specified otherwise.

- The
  ``` nix
  maxretry
  ```

  option allows you to specify how many failures are required for an IP address to be blocked.

- To prevent being locked out accidentally, use
  ``` nix
  ignoreIP
  ```

  to define IP allow lists or IP ranges to be never checked. In the example below, common LAN IP address ranges as well as the specific IP '8.8.8.8' and the address associated with the hostname "wiki.nixos.org" are excluded from any bans. Note that the loopback addresses "127.0.0.0/8" and "::1" are added by default.

- ``` nix
  bantime
  ```

  specifies for how much time an IP address is blocked after reaching the maximum number of failures. Note that the bantime can be increased for every violation by setting

  ``` nix
  bantime-increment.enable = true;
  ```

  . The bantime increment can then be customized by specifying a formula (in Python) like

  ``` python
  ban.Time * math.exp(float(ban.Count+1)*banFactor)/math.exp(1*banFactor)
  ```

  with

  ``` nix
  bantime-increment.formula
  ```

  , the multipliers with

  ``` nix
  bantime-increment.multipliers
  ```

  , the maximum bantime with

  ``` nix
  bantime-increment.maxtime
  ```

  and the indication to consider the bans issued throughout multiple jails with

  ``` nix
  bantime-increment.overalljails
  ```

- ``` nix
  banaction
  ```

  specifies which of the actions in

  ``` nix
  /etc/fail2ban/action.d
  ```

  should be the default ban action (e.g., iptables, iptables-new, iptables-multiport, iptables-ipset-proto6-allports, shorewall, etc.)

- ``` nix
  extraPackages
  ```

  contains a list of derivations whose outputs are needed by Fail2ban actions

``` nix
  services.fail2ban = {
    enable = true;
   # Ban IP after 5 failures
    maxretry = 5;
    ignoreIP = [
      # Allow list for some subnets
      "10.0.0.0/8" "172.16.0.0/12" "192.168.0.0/16"
      "8.8.8.8" # allow a specific IP
      "wiki.nixos.org" # resolve the IP via DNS
    ];
    bantime = "24h"; # Ban IPs for one day on the first ban
    bantime-increment = {
      enable = true; # Enable increment of bantime after each violation
      formula = "ban.Time * math.exp(float(ban.Count+1)*banFactor)/math.exp(1*banFactor)";
      multipliers = "1 2 4 8 16 32 64";
      maxtime = "168h"; # Do not ban for more than 1 week
      overalljails = true; # Calculate the bantime based on all the violations
    };
    jails = {
      apache-nohome-iptables.settings = {
        # Block an IP address if it accesses a non-existent
        # home directory more than 5 times in 10 minutes,
        # since that indicates that it's scanning.
        filter = "apache-nohome";
        action = ''iptables-multiport[name=HTTP, port="http,https"]'';
        logpath = "/var/log/httpd/error_log*";
        backend = "auto";
        findtime = 600;
        bantime  = 600;
        maxretry = 5;
      };
    };
  };
```

These settings are written to `/etc/fail2ban/jail.local`, where fail2ban will read them.

## Extending Fail2ban

Fail2ban capabilities can be freely extended by adding new jails, filters, and actions; the first ones of them are already covered in the "Basic usage" section, while the other two need dedicated config files to be created in the

``` nix
/etc/fail2ban/filter.d
```

and

``` nix
/etc/fail2ban/action.d
```

folders.

In order to do this, you'll have to add a

``` nix
environment.etc
```

section to your NixOS config file and specify there the contents of your custom actions and filters:

``` nix
  environment.etc = {
    # Define an action that will trigger a Ntfy push notification upon the issue of every new ban
    "fail2ban/action.d/ntfy.local".text = pkgs.lib.mkDefault (pkgs.lib.mkAfter ''
      [Definition]
      norestored = true # Needed to avoid receiving a new notification after every restart
      actionban = curl -H "Title: <ip> has been banned" -d "<name> jail has banned <ip> from accessing $(hostname) after <failures> attempts of hacking the system." https://ntfy.sh/Fail2banNotifications
    '');
    # Defines a filter that detects URL probing by reading the Nginx access log
    "fail2ban/filter.d/nginx-url-probe.local".text = pkgs.lib.mkDefault (pkgs.lib.mkAfter ''
      [Definition]
      failregex = ^<HOST>.*(GET /(wp-|admin|boaform|phpmyadmin|\.env|\.git)|\.(dll|so|cfm|asp)|(\?|&)(=PHPB8B5F2A0-3C92-11d3-A3A9-4C7B08C10000|=PHPE9568F36-D428-11d2-A769-00AA001ACF42|=PHPE9568F35-D428-11d2-A769-00AA001ACF42|=PHPE9568F34-D428-11d2-A769-00AA001ACF42)|\\x[0-9a-zA-Z]{2})
    '');
  };
```

The defined filters and actions can then be used in a new jail (created as seen above):

``` nix
  services.fail2ban = {
    # --- snip ---
    jails = {
      nginx-url-probe.settings = { 
        enabled = true;
        filter = "nginx-url-probe";
        logpath = "/var/log/nginx/access.log";
        action = ''%(action_)s[blocktype=DROP]
                 ntfy'';
        backend = "auto"; # Do not forget to specify this if your jail uses a log file
        maxretry = 5; 
        findtime = 600;
      }; 
    };
  };
```

For more details on how to develop Fail2ban filters please see [the official documentation](https://fail2ban.readthedocs.io/en/latest/filters.html).

## See also

- Linode's tutorial on how to setup Fail2ban (not NixOS-specific): <https://www.linode.com/docs/guides/using-fail2ban-to-secure-your-server-a-tutorial/>
- Solène's blog post on how to extend Fail2ban on NixOS: <https://dataswamp.org/~solene/2022-10-02-nixos-fail2ban.html>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
