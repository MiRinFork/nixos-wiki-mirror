<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Doas/ru -->

<languages/> [doas](https://en.wikipedia.org/wiki/Doas) это утилита для выполнения команд от имени другого пользователя, обычно суперпользователя. Она часто устанавливается вместо sudo, благодаря простоте настройки и большей простоте. Не рекомендуется использовать doas из-за проблем с совместимостью с sudo. Конфигурации на основе Flake требуют установки git в качестве системного пакета для пересборки. <span id="Configuration"></span>

## Настройка

Следующая конфигурация даст пользователю `foo` возможность выполнять команды от имени суперпользователя через `doas`, при этом отключив команду `sudo`.

``` nix
security.sudo.enable = false;
security.doas.enable = true;
security.doas.extraRules = [{
  users = ["foo"];
  # Необязательно, сохраняет переменные окружения при выполнении команд
  # например, сохраняет ваш NIX_PATH при применении вашего конфига
  keepEnv = true; 
  persist = true;  # Необязательно, не запрашивать пароль в течение некоторого времени после успешной аутентификации
}];
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
