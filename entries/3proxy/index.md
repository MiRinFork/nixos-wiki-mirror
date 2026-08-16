<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: 3proxy -->

## What is 3proxy

<strong>3proxy</strong> is universal proxy server. It can be used to provide internal users with fully controllable access to external resources or to provide external users with access to internal resources. 3proxy is not developed to replace squid, but it can extend functionality of existing caching proxy. It can be used to route requests between different types of clients and proxy servers. Think about it as application level gateway with configuration like hardware router has for network layer. It can establish multiple gateways with HTTP and HTTPS proxy with FTP over HTTP support, SOCKS v4, v4.5 and v5, POP3 proxy, UDP and TCP portmappers.

## Sample configuration

Just add the following to your <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="NixOS configuration">NixOS configuration</a> i.e. the `configuration.nix` file:

``` nix
{
  services._3proxy = {
    enable = true;
    services = [
      {
        type = "socks";
        auth = [ "strong" ];
        acl = [
          {
            rule = "allow";
            users = [ "test1" ];
          }
        ];
      }
    ];
    usersFile = "/etc/3proxy.passwd";
  };

  environment.etc = {
    "3proxy.passwd".text = ''
      test1:CL:password1
      test2:CR:$1$rkpibm5J$Aq1.9VtYAn0JrqZ8M.1ME.
    '';
  };
}
```

This sample configuration runs a single instance as socks proxy with user/password auth. The password can be clear text, as indicated by the `CL` for user `test1` or it can be encrypted as indicated by the `CR` for user `test2`. You can generate md5-crypted passwords via <https://unix4lyfe.org/crypt/>

**Note**: The `htpasswd` tool generates incompatible md5-crypted passwords (see <https://github.com/z3APA3A/3proxy/wiki/How-To-(incomplete)#USERS> )

## Firewall

If not set otherwise, open port `1080` on the firewall.

## Firefox

To use in Firefox, you can install the FoxyProxy addon and create a new proxy. Give it a name, use `SOCKS5` and provide the proxy's ip address or domain name. If not set otherwise, use port `1080` and provider username and password.

<a href="Category:_Applications" class="wikilink" title="Category: Applications">Category: Applications</a> <a href="Category:_Server" class="wikilink" title="Category: Server">Category: Server</a> <a href="Category:_Networking" class="wikilink" title="Category: Networking">Category: Networking</a>
