<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: TigerVNC -->

In order to get TigerVNC to run on nixos without further hassle you can use the following config. (AI was heavily used to create it)

Here you need to replace all `YOURUSERNAME` with your user name.

Now the tigervnc file to import.

For an initial setup you need to set your password with `vncpasswd`

I had issues due to an existing .vnc folder so I did: `echo "YOUR_PW" | vncpasswd -f > ~/.vnc/passwd`
