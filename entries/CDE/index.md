<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: CDE -->

<figure>
<img src="CDE.png" title="CDE.png" />
<figcaption>CDE.png</figcaption>
</figure>

Aka **cdesktopenv** or **Common Desktop Environment** is a vintage desktop environment.

## Changing fonts

` sudo mkdir -p /etc/dt/config/xfonts`  
` sudo cp -r ${pkgs.cdesktopenv}/opt/dt/config/xfonts/$LANG /etc/dt/config/xfonts`  
` sudo sed -i '/dt-interface/d' /etc/dt/config/xfonts/$LANG/fonts.alias`

Now add the following to /etc/dt/config/xfonts/\$LANG/fonts.alias file. In this example Helvetica and Courier are used instead of fixed fonts.

` "-dt-interface system-medium-r-normal-xxs sans-10-100-72-72-p-61-iso8859-1"  "-adobe-helvetica-medium-r-normal--10-*-75-75-p-56-iso8859-1"`  
` "-dt-interface system-medium-r-normal-xs sans-11-110-72-72-p-64-iso8859-1"   "-adobe-helvetica-medium-r-normal--11-80-100-100-p-56-iso8859-1"`  
` "-dt-interface system-medium-r-normal-s sans-12-120-72-72-p-73-iso8859-1"    "-adobe-helvetica-medium-r-normal--12-120-75-75-p-67-iso8859-1"`  
` "-dt-interface system-medium-r-normal-m sans-13-130-72-72-p-87-iso8859-1"    "-adobe-helvetica-medium-r-normal--14-140-75-75-p-77-iso8859-1"`  
` "-dt-interface system-medium-r-normal-l sans-15-150-72-72-p-100-iso8859-1"   "-adobe-helvetica-medium-r-normal--14-140-75-75-p-77-iso8859-1"`  
` "-dt-interface system-medium-r-normal-xl sans-18-180-72-72-p-114-iso8859-1"  "-adobe-helvetica-medium-r-normal--18-180-75-75-p-98-iso8859-1"`  
` "-dt-interface system-medium-r-normal-xxl sans-21-210-72-72-p-123-iso8859-1" "-adobe-helvetica-medium-r-normal--20-140-100-100-p-100-iso8859-1"`  
` "-dt-interface user-medium-r-normal-xxs serif-10-100-72-72-m-60-iso8859-1"   "-adobe-courier-medium-r-normal--10-100-75-75-m-60-iso8859-1"`  
` "-dt-interface user-medium-r-normal-xs serif-11-110-72-72-m-60-iso8859-1"    "-adobe-courier-medium-r-normal--11-80-100-100-m-60-iso8859-1"`  
` "-dt-interface user-medium-r-normal-s serif-12-120-72-72-m-80-iso8859-1"     "-adobe-courier-medium-r-normal--12-120-75-75-m-70-iso8859-1"`  
` "-dt-interface user-medium-r-normal-m serif-13-130-72-72-m-90-iso8859-1"     "-adobe-courier-medium-r-normal--14-140-75-75-m-90-iso8859-1"`  
` "-dt-interface user-medium-r-normal-l serif-15-150-72-72-m-110-iso8859-1"    "-adobe-courier-medium-r-normal--14-140-75-75-m-90-iso8859-1"`  
` "-dt-interface user-medium-r-normal-xl serif-18-180-72-72-m-120-iso8859-1"   "-adobe-courier-medium-r-normal--18-180-75-75-m-110-iso8859-1"`  
` "-dt-interface user-medium-r-normal-xxl serif-21-210-72-72-m-140-iso8859-1"  "-adobe-courier-medium-r-normal-*-20-140-100-100-m-110-iso8859-1"`  
` "-dt-interface user-bold-r-normal-xxs serif-10-100-72-72-m-60-iso8859-1"     "-adobe-courier-bold-r-normal--10-100-75-75-m-60-iso8859-1"`  
` "-dt-interface user-bold-r-normal-xs serif-11-110-72-72-m-60-iso8859-1"      "-adobe-courier-bold-r-normal--11-80-100-100-m-60-iso8859-1"`  
` "-dt-interface user-bold-r-normal-s serif-12-120-72-72-m-80-iso8859-1"       "-adobe-courier-bold-r-normal--12-120-75-75-m-70-iso8859-1"`  
` "-dt-interface user-bold-r-normal-m serif-13-130-72-72-m-90-iso8859-1"       "-adobe-courier-bold-r-normal--14-140-75-75-m-90-iso8859-1"`  
` "-dt-interface user-bold-r-normal-l serif-15-150-72-72-m-110-iso8859-1"      "-adobe-courier-bold-r-normal--14-140-75-75-m-90-iso8859-1"`  
` "-dt-interface user-bold-r-normal-xl serif-18-180-72-72-m-120-iso8859-1"     "-adobe-courier-bold-r-normal--18-180-75-75-m-110-iso8859-1"`  
` "-dt-interface user-bold-r-normal-xxl serif-21-210-72-72-m-140-iso8859-1"    "-adobe-courier-bold-r-normal--20-140-100-100-m-110-iso8859-1"`

## Adding programs to autolaunch

` chmod +x ~/.dt/sessions/sessionetc`

## Editing panel

` cp ${pkgs.cdesktopenv}/opt/dt/appconfig/types/C/dtwm.fp ~/.dt/types`  
` chmod +w ~/.dt/types/dtwm.fp`

Now edit ~/.dt/types/dtwm.fp

To disable system control, add a **delete** property like this

` CONTROL Trash`  
`{`  
` CONTAINER_NAME  Top`  
` CONTAINER_TYPE  BOX`  
` `**`DELETE True`**  
`}`

## Creating an own program icon

Icons should be in XPM or XBM format. Use the following configuration to convert from png icons For example

` cde-icons /run/current-system/sw/share/icons/hicolor/512x512/apps/qutebrowser.png`

Then select it in Desktop_Apps/Create Action tool. Save actions under ~/.dt/appmanager

## Setting icons on minimized programs

Please note that not all programs support this

## Setting wallpaper

Put .jpg or .png under ~/.dt/backdrops then select it in Style Manager / Backdrop

## Gtk and Qt theme

Add to your configuration Now copy the theme to home directory. Instead of Arizona.dp pick the palette you currently use in CDE for the match

` mkdir -p ~/.themes`  
` cp -Lr --no-preserve=mode /run/current-system/sw/share/themes/cdetheme ~/.themes/`  
` chmod +x ~/.themes/cdetheme/scripts/switchtheme`  
` cd ~/.themes/cdetheme/scripts/`  
` ./switchtheme ../palettes/Arizona.dp 8 3 22 false true false`

## Changing volume and brightness with media keys

Add the following to ~/.dt/dtwmrc

` Keys DtKeyBindings`  
` {`  
`   `<Key>`XF86AudioLowerVolume   root|icon|window|ifkey  f.exec "amixer set Master -q 5%-"`  
`   `<Key>`XF86AudioRaiseVolume   root|icon|window|ifkey  f.exec "amixer set Master -q 5%+"`  
`   `<Key>`XF86AudioMute          root|icon|window|ifkey  f.exec "amixer set Master -q toggle"`  
`   `<Key>`XF86MonBrightnessUp    root|icon|window|ifkey  f.exec "xbacklight -inc 1"`  
`   `<Key>`XF86MonBrightnessDown  root|icon|window|ifkey  f.exec "xbacklight -dec 1"`  
` }`

## Battery widget

Please read <a href="#Adding_programs_to_autolaunch" class="wikilink" title="Adding programs to autolaunch section">Adding programs to autolaunch section</a> Please read <a href="#Editing_panel" class="wikilink" title="Editing panel section">Editing panel section</a>

## Example configuration

## Useful links

- <https://sourceforge.net/p/cdesktopenv/wiki/CustomisingCDE/>

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a>
