<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Neo4j -->

[Neo4j](https://neo4j.com/) is a graph database implemented in <a href="Java" class="wikilink" title="Java">Java</a>.

## NixOS

### Example configuration for local development with out SSL certs

``` nixos
services.neo4j= {
  enable = true;
  bolt = {
    tlsLevel = "DISABLED";
  };
  https = {
    enable = false;
  };
};
```

### Setting the initial password

``` bash
sudo su 
export NEO4J_HOME=/var/lib/neo4j/
neo4j-admin dbms set-initial-password mySuperSecretPassword
```

Logging in using `cypher-shell` should now function.
