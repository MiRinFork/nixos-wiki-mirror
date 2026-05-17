<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Enterprise -->

When trying to use Nix and NixOS in corporations there are a number of issues one will run into normally because of networking restrictions. This page tries to provide a solution to each of these issues.

## Private resources

Building internal projects will require fetching of internal (private) source code and other resources. These resources usually are protected by some form of credentials.

### fetchurl

`fetchurl` is used to retrieve HTTP resources, but is also used by `fetchFromGitHub`. For private resources this will usually result in an error like the following:

`curl: (22) The requested URL returned error: 401 Unauthorized`

Nix will not know about your credentials in your home directory, as the builders have no access to those files. However, Nix has a few options borrowed from `curl` that will help in this situation. A netrc file can be used that holds the credentials for all domains that require authorisation. More information on netrc can be found in the [GNU manual](https://www.gnu.org/software/inetutils/manual/html_node/The-_002enetrc-file.html). For our example, we will create the file in `/etc/nix/netrc`. The contents will look similar to the following:

`machine DOMAINNAME`  
`    login USERNAME`  
`    password SECRET`

Next the netrc file needs to be accessible in the builds. We will configure Nix to allow access to this file directly from the build sandboxes. Edit your `/etc/nix/nix.conf` file so that it includes the following lines:

`netrc-file = /etc/nix/netrc`

Lastly, the default way of fetching urls is using `curl` inside a build sandbox. This is a powerful command, but it will not use (and cannot use) a netrc file that is outside of the build sandbox. `netrc-file` is thus only applicable to fetches being done by Nix itself. In addition, we do not want to place the netrc file inside the sandbox, because that could potentially leak private credentials into builds. `fetchurlBoot` uses this builtin function and makes sure the call-sign is mostly compatible with the regular `fetchurl`. This function is used most often to bootstrap some of the more basic packages like `curl` itself, but it can also be very useful for fetching files outside of the sandbox.

Since **fetchurlBoot** is mostly compatible with **fetchurl** we can override **fetchurl** where needed:

``` nix
mypackage = callPackage <mypackage.nix> {
  fetchurl = stdenv.fetchurlBoot;
};
```

Now the package is built exactly the same way as before, but resources will be fetched using **fetchurlBoot**. **fetchurlBoot** will in turn download the resources within Nix itself, which will use the netrc-file and use the right credentials for the domain names that you have defined.

## TLS Intercepting Proxy

TLS-Intercepting proxies will intercept each and every TLS connection and replace the original certificate with it's own to be able to introspect the traffic. This of course creates validation issues with the "official" ca-certificate project. Since [nix pr \#2181](https://github.com/NixOS/nix/issues/1896) you are able to set your intercepting Proxy certificate via `NIX_SSL_CERT_FILE` to a file on your system which contains the root and intermediate certificates of your proxy. See also [the appropriate section in the nix manual](https://nixos.org/nix/manual/#sec-nix-ssl-cert-file)

The proxy itself can be set via the environment variables `HTTP_PROXY` and `HTTPS_PROXY`.

## Dynamic generation of netrc files

Sometimes you have to deal with dynamically short-lived tokens that must be generated on the fly. The above options do not cover this, so the best way forward is to use \`fetchurl\`'s \`netrcPhase\` option:

`newPkgs = pkgs.extend (`  
`   final: prev: {`  
`     fetchurl =`  
`       args:`  
`       (prev.fetchurl.override {`  
`         inherit (pkgs) cacert; # required to avoid infrec`  
`       })`  
`         (`  
`           args`  
`           // {`  
`             netrcPhase = `  
`               # do stuff here to get credentials`  
`               BAR=\'\'$(dynamic-shell-script)`  
`               cat > netrc <<EOF`  
`               machine foobar`  
`                       login FOO`  
`                       password \'\'$BAR`  
`               EOF`  
`             `*`;`*  
`           }`  
`         );`  
`   }`  
` );`

now any fetch in newPkgs will dynamically generate tokens with \`fetchurl\`.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
