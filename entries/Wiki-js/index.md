<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Wiki-js -->

[Wiki.js](https://js.wiki/) is a wiki engine running on Node.js.

## Cookbook

Most basic Nix to get Wiki-js running on port 3000:

` systemd.services.wiki-js = {`  
`   requires = [ "postgresql.service" ];`  
`   after    = [ "postgresql.service" ];`  
` };`  
` services.wiki-js = {`  
`   enable = true;`  
`   settings.db = {`  
`     db  = "wiki-js";`  
`     host = "/run/postgresql";`  
`     type = "postgres";`  
`     user = "wiki-js";`  
`   };`  
` };`  
` services.postgresql = {`  
`   enable = true;`  
`   ensureDatabases = [ "wiki-js" ];`  
`   ensureUsers = [{`  
`     name = "wiki-js";`  
`     ensureDBOwnership = true;`  
`   }];`  
` };`

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
