<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: China -->

The nix-cache is really slow when being accessed from within china. The following substituters can be used for a faster overall experience when downloading packages:

`nix.settings.substituters = {`  
`  # status: https://mirror.sjtu.edu.cn/`  
`  "https://mirror.sjtu.edu.cn/nix-channels/store"`  
  
`  # status: https://mirrors.tuna.tsinghua.edu.cn/`  
`  "https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store"`  
  
`  # status: https://mirrors.ustc.edu.cn/status/`  
`  "https://mirrors.ustc.edu.cn/nix-channels/store"`  
`}`
