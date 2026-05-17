<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Jetbrains Tools -->

Various JetBrains IDEs and tools are available from nixpkgs under the `jetbrains` namespace. For instance, CLion is available as the package.

## Plugins

Some Jetbrains IDE plugins such as Github Copilot need to be patched in order to work on NixOS.

For example, a package of CLion with the Github Copilot plugin pre-installed can be obtained by adding the following line to your package list:

`     (pkgs.jetbrains.plugins.addPlugins pkgs.jetbrains.clion ["github-copilot--your-ai-pair-programmer"])`

where pkgs is a suitable version of nixpkgs.

Note that Jetbrains IDEs tend to manage their configuration and plugins statefully. For example, if you have previously attempted to install Copilot through the IDE's plugin manager, you may need to delete the IDE's state in as described in the [JetBrains documentation](https://www.jetbrains.com/help/clion/uninstall.html#linux).

#### All Marketplace plugins via nix-jetbrains-plugins

The third-party repository [theCapypara/nix-jetbrains-plugins](https://github.com/theCapypara/nix-jetbrains-plugins) provides a way to install any plugin from Jetbrains Marketplace. It is updated weekly.

Please note that these plugins are unpatched and may not work, in that case the plugin may be installable in a patched version directly via nixpkgs, see above.

## JetBrains Toolbox

If you want to eschew a fully-stateless JetBrains IDE setup, JetBrains Toolbox manages everything under but currently (Jan. 2024) needs some tweaks to get working.

1.  Install and launch it once
2.  Edit to add the line
3.  Start to log-in normally, but stop after the JetBrains webpage opens
4.  Reopen JetBrains Toolbox, navigate to Settings, and click "Troubleshoot..."
5.  Follow the manual login flow as directed

After following these steps, JetBrains Toolbox will store user credentials in an encrypted (with a static key) file at . If not followed, JetBrains Toolbox is unable to retrieve credentials via (due to bwrap sandboxing?) and persistently notifies the user to re-authorize.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
