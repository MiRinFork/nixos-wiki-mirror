<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Multipath TCP -->

Multipath TCP is a TCP (Transmission Control Protocol) extension to be able to use multiple paths for a single TCP connection (https://datatracker.ietf.org/wg/mptcp/). Applications can aggregate the troughput of a cellular and wifi link for instance.

It is backwards compatible with TCP: you don't need to modify applications but just to enable an MPTCP-aware linux kernel. 2 such kernels exist: - the historical out-of-tree featureful implementation developed at multipath-tcp.org/

` boot.kernelPackages = pkgs.linuxPackages_mptcp;`

\- use the upstream implementation (still being worked on) available starting from linux 5.6

` boot.kernelPackages = pkgs.linuxPackagesFor ( pkgs.linux_5_6.override {`  
`   structuredExtraConfig = with lib.kernel; {`  
`     MPTCP     =yes;`  
`     MPTCP_IPV6=yes;`  
`   };`  
` });`

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
