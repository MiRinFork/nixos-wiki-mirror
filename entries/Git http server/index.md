<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Git http server -->

## Example Configuration

``` nixos
{ config, pkgs, ... }: {
    # We will be using nginx as web server. As nginx doesnt support cgi scrips
    # but fastcgi. We need fcgiwrap to forward requests
    # -(https)-> nginx -(fastcgi)-> fcgiwrap -(cgi)-> git-http-backend
    services.fcgiwrap.enable = true;
    services.fcgiwrap.user = "nginx";
    services.nginx.enable = true;

    services.nginx.virtualHosts."git.example.com" = {
        # use ssl for all requests; dissallow unencrypted requests
        enableACME = true; # If you want to use Let's Encrypt for SSL certificates
        forceSSL = true;
        # this regex is needed to catch the path the git client is requesting
        locations."~ (/.*)" = {

          # This is where the repositories live on the server
          root = "/folder/to/public/repos";

          # Setup FastCGI for Git HTTP Backend
          extraConfig = ''
            fastcgi_pass        unix:/run/fcgiwrap.sock;
            include             ${pkgs.nginx}/conf/fastcgi_params;
            # All parameters below will be forwarded to fcgiwrap which then starts
            # the git http proces with the the params as environment variables except
            # for SCRIPT_FILENAME. See "man git-http-server" for more information on them.
            fastcgi_param       SCRIPT_FILENAME     ${pkgs.git}/bin/git-http-backend;
            fastcgi_param       GIT_PROJECT_ROOT /hdd/gitolite/www-public;
            # CAREFULL! only include this option if you want all the repos in $root to
            # to be read.
            fastcgi_param       GIT_HTTP_EXPORT_ALL "";
            # use the path from the regex in the location
            fastcgi_param       PATH_INFO           $1;
            '';
        };
    };
}
```

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
