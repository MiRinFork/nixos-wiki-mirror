<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on Amazon EC2/ja -->

<languages />

<div lang="en" dir="ltr" class="mw-content-ltr">

Amazon EC2 is a widely used cloud deployment platform that is part of Amazon Web Services (AWS). NixOS largely supports the platform through AMIs and the [nixos-generators](https://github.com/nix-community/nixos-generators) project.

</div>

<span id="Public_NixOS_AMIs"></span>

## NixOSのパブリックAMI

<div lang="en" dir="ltr" class="mw-content-ltr">

A list of NixOS AMI's available on AWS is located [here](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/virtualisation/amazon-ec2-amis.nix) and for a more up to date list: [here](https://nixos.github.io/amis/) (cf. [this discourse thread](https://discourse.nixos.org/t/ami-for-nixos-23-11/36860/7)).

</div>

これらのAMIのデフォルトユーザーは`root`です。デフォルトのパスワードはなく、EC2の作成プロセスで選択したSSHキーを使って認証が行われます。

<span id="Creating_a_NixOS_AMI"></span>

## NixOSのAMIを作成する

<div lang="en" dir="ltr" class="mw-content-ltr">

The [nixos-generators](https://github.com/nix-community/nixos-generators) project is currently the best method to create your own NixOS AMI. Follow the directions provided by `nixos-generators` & then follow the [instructions provided by AWS](https://docs.aws.amazon.com/vm-import/latest/userguide/what-is-vmimport.html).

</div>

<span id="Additional_Resources"></span>

## その他の資料

<div lang="en" dir="ltr" class="mw-content-ltr">

[Building and Importing NixOS AMIs on EC2](http://jackkelly.name/blog/archives/2020/08/30/building_and_importing_nixos_amis_on_ec2/) by Jack Kelly

</div>

<span id="Troubleshooting"></span>

## トラブルシューティング

<span id="SSH_Asks_For_Password"></span>

<div class="mw-translate-fuzzy">

## SSHがパスワードを尋ねてくる場合

</div>

新しく起動したEC2インスタンスにSSH経由で接続すると、パスワードを要求される場合があります。これは、`amazon-init`systemdサービスがまだユーザーデータを読み取っているためと思われます。現在のSSH接続試行を中止し、数分後にもう一度試してください。

<a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
