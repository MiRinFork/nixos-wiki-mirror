<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Klaus -->

[Klaus](https://github.com/jonashaag/klaus) is a simple, easy-to-set-up Git web viewer.

The recommended method for deploying Klaus according to the developer is using uWSGI or Gunicorn. This article provides an example deployment using uWSGI.

\<syntaxhighlight lang="nix\> services.uwsgi = {

`   enable = true;`  
`   plugins = [ "python3" ];`  
`   instance = {`  
`       type = "normal";`  
`       master = true;`  
`       http-socket = ":8080";`  
`       module = "klaus.contrib.wsgi:application";`  
`       pythonPackages = self: with self; [`  
`           klaus`  
`           markdown # adds markdown support, optional`  
`       ];`  
`       env = [`  
`           "KLAUS_REPOS=/repos/repo1 /repos/repo2"`  
`           "PATH=${pkgs.git}/bin" # klaus makes a direct call to git`  
`       ];`  
`   };`

};

</syntaxhighlight>

When loading a repository, you may encounter a 500, traced back to a `git` command call in the uWSGI logs. Try setting `services.uwsgi.user` and `services.uwsgi.group` to match the ownership of the repository.

## Autoreloading

By default, Klaus will only be able to to track the repos specified in the `KLAUS_REPOS` environment variable. In order to have it keep track of a set of unknown repos, Klaus needs to be configured to autoreload.

\<syntaxhighlight lang="nix\> services.uwsgi.instance = {

`   module = "klaus.contrib.wsgi_autoreload:application";`  
`   enable-threads = true;`  
`   lazy-apps = true;`  
`   env = [ "KLAUS_REPOS_ROOT=/repos" ];`

};

</syntaxhighlight>

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
