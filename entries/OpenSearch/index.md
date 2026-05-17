<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenSearch -->

\_\_TOC\_\_

## Install

``` nix>
  services.opensearch.enable = true;
</syntaxhighlight>

== Configuration ==

By default OpenSearch is configured to run as a single-node. You can modify any OpenSearch configuration using services.opensearch.settings. Example:

<syntaxhighlight lang=
```

` services.opensearch.enable = true;`  
` services.opensearch.settings = {`  
`   "cluster.name" = "my-cluster";`  
` };`

</syntaxhighlight>
