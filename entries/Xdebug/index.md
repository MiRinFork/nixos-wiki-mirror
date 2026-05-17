<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Xdebug -->

[xdebug](https://xdebug.org) is a PHP extension that helps with debugging <a href="PHP" class="wikilink" title="PHP">PHP</a> code.

## Installation

Configure your local apache/php to have the xdebug extension installed and enabled:

\<syntaxhighlight lang="nix\>

1.  in /etc/nixos/configuration.nix (not inside systemPackages)

services.httpd.phpPackage = pkgs.php.buildEnv {

`   extensions = ({ enabled, all }: enabled ++ (with all; [`  
`       xdebug`  
`   ]));`  
`   extraConfig = ''`  
`       xdebug.mode=debug`  
`   '';`

};

</syntaxhighlight>

## Usage

In <a href="vscode" class="wikilink" title="vscode">vscode</a> open the debug panel and click "create a launch.json file" and click "PHP". The defaults work. Just click the green triangle "Listen for Xdebug".

Edit a PHP file and add `xdebug_break();` where you'd like the debugger to start.

Point your browser at apache to get that PHP file to run in apache. Once that `xdebug_break()` xdebug will connect to vscode to initiate the debugging session. Once that connection is made you can make further breakpoints in vscode in the usual way (clicking to the left of the source code).

See upstream xdebug documentation if you'd like other modes e.g. for PHP to connect to vscode and break/pause without the call to `xdebug_break()`. The extraConfig string in the above example goes into php.ini.
