<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Disko/ru -->

<languages/>

<div class="mw-translate-fuzzy">

\[Disko\] это утилита и модуль NixOS для декларативной разметки диска.

</div>

\[github.com/nix-community/disko/blob/master/docs/INDEX.md Disko\]

<span id="Usage"></span>

## Использование

Следующий пример создаёт новую таблицу разделов GPT для диска `/dev/vda` включая два раздела для EFI boot и корневой раздел файловой системы <a href="bcachefs" class="wikilink" title="bcachefs">bcachefs</a>.

Следующая команда применит расположение дисков, указанное в конфигурации, и смонтирует их после этого. Внимание: При этом все данные на диске будут удалены.

``` console
# sudo nix run github:nix-community/disko -- --mode disko ./disko-config.nix
```

В качестве альтернативы можно использовать конфигурацию разметки диска в удаленном репозитории, содержащем файл flake.nix, как точку входа.

``` console
# sudo nix run github:nix-community/disko -- --mode disko --flake github:Lassulus/flakes-testing#fnord
```

Приведенные выше команды требуют наличия в вашей системе функций <a href="Flakes" class="wikilink" title="Flake">Flake</a>.

Чтобы убедиться, что оба раздела смонтированы правильно, выполните команду

``` console
# mount | grep /mnt
```

<span id="Configuration"></span>

## Настройка

Если базовая система NixOS была установлена на макет раздела, развёртываемого с помощью Disko, сам конфиг диска может быть интегрирован в систему. Сначала скопируйте файл, например `disko-config.nix`, в каталог конфигурации системы

``` console
# cp disko-config.nix /etc/nixos/
```

Добавьте модуль Disko в систему с поддержкой Flake. Вставьте нужный входной файл и ссылайтесь на него и на ваш файл `disko-config.nix` в разделе Модулей.

Убедитесь, что в файле /etc/nixos/hardware-configuration.nix нет автоматически генерируемых записей опций `fileSystems` в `/etc/nixos/hardware-configuration.nix`. Disko автоматически сгенерирует их за вас. Пересоберите систему, чтобы применить конфигурацию Disko.

<a href="Category:Filesystem{{#translation:}}" class="wikilink" title="Category:Filesystem{{#translation:}}">Category:Filesystem{{#translation:}}</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
