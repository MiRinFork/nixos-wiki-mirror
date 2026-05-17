<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Writing DVDs -->

There seems to be various issues (permissions) with DVD burning programs not working out of the box. This is what I do:

You may need to set a newer packages version with `-I nixpkgs=`

and then where `QT_PLUGIN_PATH` is an appropriate store path. See also <a href="Qt#qt.qpa.plugin:_Could_not_find_the_Qt_platform_plugin_.22xcb.22_in_.22.22" class="wikilink" title="Qt#qt.qpa.plugin:_Could_not_find_the_Qt_platform_plugin_.22xcb.22_in_.22.22">Qt#qt.qpa.plugin:_Could_not_find_the_Qt_platform_plugin_.22xcb.22_in_.22.22</a>

As suggested by <https://github.com/NixOS/nixpkgs/issues/19154#issuecomment-647005545> calling `sudo mount -o remount,rw /nix/store)` and changing the program permissions in K3b (Settings -\> Configure k3b -\> programs -\> Permissions "tab") fixes the problem. (Tested with nixos 20.09 february 2021).

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
