<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Creating a NixOS live CD/ru -->

<span id="Motivation"></span>

## Мотивация

Создвние модифицированного образа NixOS из имеюшийся системы имеет множество преимуществ:

<div lang="en" dir="ltr" class="mw-content-ltr">

- Ensures authenticity.

</div>

- Нет необходимости в интернет доступе.

<!-- -->

- В собстенный образ легко добавить пакеты и изменять конфигурацию.

<span id="Building"></span>

## Сборка

<div lang="en" dir="ltr" class="mw-content-ltr">

Building minimal NixOS installation CD with the `nix-build` command by creating this `iso.nix`-file. In this example with <a href="Neovim" class="wikilink" title="Neovim">Neovim</a> preinstalled.

</div>

``` nix
{ config, pkgs, ... }:
{
  imports = [
    <nixpkgs/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix>

    # Provide an initial copy of the NixOS channel so that the user
    # doesn't need to run "nix-channel --update" first.
    <nixpkgs/nixos/modules/installer/cd-dvd/channel.nix>
  ];
  environment.systemPackages = [ pkgs.neovim ];
}
```

Сборка образа с помощью:

``` bash
nix-build '<nixpkgs/nixos>' -A config.system.build.isoImage -I nixos-config=iso.nix
```

В качестве альтернативы используйте Nix <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> для создания установочного образа ISO, используя ветку `nixos-24.05` в качестве источника nixpkgs:

Следующие команды создадут ISO-образ:

``` console

# nix build path:$PWD
```

Готовый образ может быть найден а `result`:

``` console
$ ls result/iso/
nixos-24.05.20240721.63d37cc-x86_64-linux.iso
```

<span id="Testing_the_image"></span>

### Тестирование образа

Чтобы просмотреть содержимое образа ISO, выполните следующие действия:

<div lang="en" dir="ltr" class="mw-content-ltr">

To inspect the contents of the ISO image:

</div>

``` console
$ mkdir mnt
$ sudo mount -o loop result/iso/nixos-*.iso mnt
$ ls mnt
boot  EFI  isolinux  nix-store.squashfs  version.txt
$ umount mnt
```

Чтобы загрузить образ ISO в эмуляторе:

``` console
$ nix-shell -p qemu
$ qemu-system-x86_64 -enable-kvm -m 256 -cdrom result/iso/nixos-*.iso
```

<span id="SSH"></span>

### SSH

В вашем `iso.nix`:

В вашем `iso.nix`

``` nix
{
  ...
  # Enable SSH in the boot process.
  systemd.services.sshd.wantedBy = pkgs.lib.mkForce [ "multi-user.target" ];
  users.users.root.openssh.authorizedKeys.keys = [
    "ssh-ed25519 AaAeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee username@host"
  ];
  ...
}
```

<span id="Static_IP_Address"></span>

### Статический IP-адрес

Статические IP-адреса можно задать в самом образе. Это может быть полезно при установке VPS.

Статический IP-адрес может бвть установлен в образе. Это может быть полехно для установки на VPS.

``` nix
{
  ...
  networking = {
    usePredictableInterfaceNames = false;
    interfaces.eth0.ipv4.addresses = [{
      address = "64.137.201.46";
      prefixLength = 24;
    }];
    defaultGateway = "64.137.201.1";
    nameservers = [ "8.8.8.8" ];
  };
  ...
}
```

<span id="Building_faster"></span>

### Ускорение сборки

Процесс сборки может быть медленным из-за сжатия.

Процессс сборки медленный из-за сжатия.

Вот некоторые значения времени для `nix-build`:

| squashfsCompression                  | Время | Размер |
|--------------------------------------|-------|--------|
| `lz4`                                | 100s  | 59%    |
| `gzip -Xcompression-level 1`         | 105s  | 52%    |
| `gzip`                               | 210s  | 49%    |
| `xz -Xdict-size 100%` (По умолчанию) | 450s  | 43%    |

Результаты сжатия

<div lang="en" dir="ltr" class="mw-content-ltr">

See also: [mksquashfs benchmarks](https://gist.github.com/baryluk/70a99b5f26df4671378dd05afef97fce)

</div>

Если вам не важен размер файла, вы можете использовать более быстрое сжатие, добавив этот параметр к вашему `iso.nix`:

``` nix
{
  isoImage.squashfsCompression = "gzip -Xcompression-level 1";
}
```

<span id="See_also"></span>

## См. Также

- [NixOS Manual: Сборка Live-образа NixOS](https://nixos.org/manual/nixos/stable/index.html#sec-building-image).

<div lang="en" dir="ltr" class="mw-content-ltr">

- [NixOS Manual: Building a NixOS (Live) ISO](https://nixos.org/manual/nixos/stable/index.html#sec-building-image).

</div>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
