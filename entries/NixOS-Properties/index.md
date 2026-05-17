<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS:Properties -->

Properties are used to scope option definitions with control flow statements which do not break (<a href="NixOS:config_argument#Conditional_Statements" class="wikilink" title="example">example</a>) the highly recursive process of merging modules. All properties are defined in [`lib/modules.nix`](https://github.com/NixOS/nixpkgs/blob/master/lib/modules.nix).

- `mkNotdef`: Invalidate a definition. Any attribute which has this value is considered as not defined in the current module.
- `mkIf condition definitions`: Create a conditional statements around multiple definitions. The definitions are considered only if the condition is verified.
- `mkOverrideTemplate priority template definitions`: Set a priority level to all definitions which are enumerated inside the template. Only definitions with the lower priority level are kept. The default priority level is 100. An empty template is considered as all definitions.
- `mkOverride priority template definitions`: Currently the same as `mkOverrideTemplate`.
- `mkDefaultValue definitions`: A shortcut notation to define default values (priority level of 1000) inside the configuration. This is extremely useful to avoid references to properties inside the user configuration while overriding the default value of the option. Any option define without this property will take precedence over it.
- `mkOrder rank definitions`: Add a rank value to definitions. This is useful for options where some dependences between definitions exist. A lower rank will add the definitions among the first definitions. The default rank is 1000.

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
