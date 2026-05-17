<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Doas/zh -->

<languages/> [doas](https://en.wikipedia.org/wiki/Doas) 是一个以其他用户（通常是超级用户）身份执行命令的实用程序。由于其配置简便、用法简单，它通常被视作 sudo 的替代品。 由于与 sudo 的兼容性问题，不建议使用 doas。 基于 Flake 的配置需要将 git 作为系统软件安装才能重新构建。 <span id="Configuration"></span>

## 配置

以下配置将使用户 `foo` 能够通过 `doas` 以超级用户身份执行命令，同时禁用 `sudo` 命令。

``` nix
security.doas.enable = true;
security.sudo.enable = false;
security.doas.extraRules = [{
  users = ["foo"];
  # 可选，在运行命令时保留环境变量 
  # 例如，在应用配置时保留你的 NIX_PATH
  keepEnv = true; 
  persist = true;  # 可选，在成功验证后，一段时间内无需询问密码
}];
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
