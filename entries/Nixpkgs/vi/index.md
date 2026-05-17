<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/vi -->

<languages/> **Nixpkgs** is the largest repository of <a href="Nix" class="wikilink" title="Nix">Nix</a> packages and <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> modules.

Để tìm kiếm giữa các gói (packages) và tùy chọn (options) có sẵn, xem <a href="Tìm_kiếm_gói" class="wikilink" title="Tìm kiếm gói">Tìm kiếm gói</a>.

<div lang="en" dir="ltr" class="mw-content-ltr">

As highlighted in [the announcement](https://nixos.org/blog/announcements/2024/nixos-2411/) of the NixOS 24.11 release, *"NixOS is already known as [the most up to date distribution](https://repology.org/repositories/statistics/newest) while also being [the distribution with the most packages](https://repology.org/repositories/statistics/total)."* This is thanks to the community's continued dedication to making Nixpkgs the preeminent Linux package repository.

</div>

## Subpages

Có một số bài viết, đặc biệt liên quan đến việc làm việc với `nixpkgs`:

## Releases

Các gói và module được lưu trữ trên Nixpkgs được phân phối qua nhiều <a href="nhánh_kênh" class="wikilink" title="nhánh kênh">nhánh kênh</a> khác nhau, phục vụ cho các trường hợp sử dụng cụ thể. Trong thực tế, chúng được phân biệt bởi mức độ kiểm tra mà các bản cập nhật phải trải qua trên \[[1](https://nixos.org/hydra/manual/#idm140737315980672)(https://nixos.org/hydra/manual/#idm140737315980672) Hydra của nixos.org\] chính thức và số lượng bản cập nhật mà chúng nhận được.

Đối với người dùng <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, nhánh kênh `nixos-unstable` là bản phát hành liên tục (rolling release), nơi các gói phải vượt qua các bài kiểm tra build và <a href="NixOS_VM_tests" class="wikilink" title="kiểm tra tích hợp trên VM">kiểm tra tích hợp trên VM</a>, đồng thời được kiểm tra từ góc độ một hệ điều hành thực thụ (điều này có nghĩa là các thành phần như <a href="Xorg" class="wikilink" title="X server">X server</a>, <a href="KDE" class="wikilink" title="KDE">KDE</a>, các server khác nhau, cũng như các chi tiết thấp hơn như cài đặt <a href="Bootloader" class="wikilink" title="bootloader">bootloader</a> và thực hiện các bước cài đặt NixOS cũng được kiểm tra).

Đối với người dùng <a href="Nix" class="wikilink" title="Nix">Nix</a> độc lập, nhánh kênh `nixpkgs-unstable` là bản phát hành liên tục (rolling release), nơi các gói chỉ phải vượt qua các bài kiểm tra build cơ bản và được nâng cấp liên tục.

Cả người dùng <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> và <a href="Nix" class="wikilink" title="Nix">Nix</a> đều có thể sử dụng các nhánh kênh ổn định (xem [2](https://status.nixos.org/)(https://status.nixos.org/) để biết các kênh hiện tại) để chỉ nhận các bản cập nhật thận trọng nhằm sửa lỗi nghiêm trọng và lỗ hổng bảo mật. Các nhánh kênh ổn định được phát hành hai lần mỗi năm vào cuối tháng Năm và cuối tháng Mười Một.

Sử dụng các kênh ổn định trên NixOS tương tự trải nghiệm người dùng trên các bản phân phối Linux khác.

## Alternatives

Do Nixpkgs chỉ là một biểu thức Nix, nên có thể mở rộng hoặc thay thế logic bằng các nguồn riêng của bạn. Thực tế, có một số phần mở rộng cũng như các bộ thay thế hoàn chỉnh cho Nixpkgs, xem bài viết <a href="Alternative_Package_Sets" class="wikilink" title="Alternative Package Sets">Alternative Package Sets</a>.

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
