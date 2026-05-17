<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Thumbnails -->

## **Enabling Thumbnailers**

On minimal / custom desktop environments thumbnails in file explorers may not work by default. For example:

- <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> environments with the option `services.gnome.core-utilities.enable = false;`
- Custom environments built from ground-up using window managers like <a href="Sway" class="wikilink" title="Sway">Sway</a> or <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a>

### Save yourself hours of troubleshooting!!

Thumbnailers may already be installed in your system as dependencies of image/video applications but are not activated.

Run `cd /run/current-system/sw/share/thumbnailers && ls` to list installed thumbnailers. If relevant .thumbnailer files are present and we still don't have thumbnails in our file explorer then we may need to activate them by updating symlinks to `share/thumbnailers`

``` nix
# configuration.nix
{

  environment.pathsToLink = [
    "share/thumbnailers"
  ];

}
```

### Enable Video Thumbnails

To enable thumbnails for video files use `ffmpeg-headless` to decode videos and `fmpegthumbnailer` to generate thumbnails.

Thumbnails for the following MimeTypes are enabled: *video/jpeg; video/mp4; video/mpeg; video/quicktime; video/x-ms-asf; video/x-ms-wm; video/x-ms-wmv; video/x-ms-asx; video/x-ms-wmx; video/x-ms-wvx; video/x-msvideo; video/x-flv; video/x-matroska; application/x-matroska; application/mxf; video/3gp; video/3gpp; video/dv; video/divx; video/fli; video/flv; video/mp2t; video/mp4v-es; video/msvideo; video/ogg; video/vivo; video/vnd.avi; video/vnd.divx; video/vnd.mpegurl; video/vnd.rn-realvideo; application/vnd.rn-realmedia; video/vnd.vivo; video/webm; video/x-anim; video/x-avi; video/x-flc; video/x-fli; video/x-flic; video/x-m4v; video/x-mpeg; video/x-mpeg2; video/x-nsv; video/x-ogm+ogg; video/x-theora+ogg.*

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [
    pkgs.ffmpeg-headless
    pkgs.ffmpegthumbnailer
  ];

  # 'ffmpegthumbnailer.thumbnailer' is created in '/run/current-system/sw/share/thumbnailers'
}
```

### Enable Image Thumbnails

To enable thumbnails for image files use `gdk-pixbuf` to decode images and generate thumbnails.

Thumbnails for the following MimeTypes are enabled: *image/png; image/jpeg; image/bmp; image/x-bmp; image/x-MS-bmp; image/gif; image/x-icon; image/x-ico; image/x-win-bitmap; image/vnd.microsoft.icon; application/ico; image/ico; image/icon; text/ico; image/x-portable-anymap; image/x-portable-bitmap; image/x-portable-graymap; image/x-portable-pixmap; image/tiff; image/x-xpixmap; image/x-xbitmap; image/x-tga; image/x-icns; image/x-quicktime; image/qtif.*

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [ 
    pkgs.gdk-pixbuf
  ];

  # 'gdk-pixbuf-thumbnailer.thumbnailer' is created in '/run/current-system/sw/share/thumbnailers'
}
```

#### Thumbnails for newer image formats such as AVIF and JPEG XL

For newer image formats not included in `gdk-pixbuf` you can enable thumbnails by adding their specific image libraries into the system packages as seen below

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [ 
    # For general HEIF container support (this includes the AVIF file format) 
    pkgs.libheif.bin # provides heif-thumbnailer (the program that generates HEIF thumbnails)
    pkgs.libheif.out # provides heif.thumbnailer (allows for the viewing of HEIF thumbnails)

    # For more newer AVIF specific support usually not needed if libheif is installed
    pkgs.libavif
    
    # For JXL(JPEG XL) support
    pkgs.libjxl
    
    # For WebP support
    pkgs.webp-pixbuf-loader
  ];
  # All of the thumbnailers are created in '/run/current-system/sw/share/thumbnailers'
}
```

### Enable 3D Model Thumbnails

Thumbnails for various 3D model files can be enabled by installing f3d:

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [ 
    pkgs.f3d
  ];
}
```

### Enable RAW (Camera) Image Thumbnails

#### gdk-pixbuf thumbnailer

gdk-pixbuf can be used to generate thumbnails for RAW camera image formats by reading the embedded jpeg. This embedded jpeg is typically generated in the camera or overwritten by your RAW editing software, and may not match what the photo looks like when opened in a viewer or editor.

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [
    pkgs.gdk-pixbuf
    # Allow gdk-pixbuf to thumbnail RAW photos by extracting the embedded jpeg
    (pkgs.writeTextFile {
      name = "raw-embedded-jpeg-thumbnailer";
      destination = "/share/thumbnailers/raw-embedded-jpeg.thumbnailer";
      text = ''
        [Thumbnailer Entry]
        TryExec=gdk-pixbuf-thumbnailer
        Exec=gdk-pixbuf-thumbnailer -s %s %u %o
        MimeType=image/x-canon-crw;image/x-canon-cr2;image/x-canon-cr3;image/x-adobe-dng;image/x-dng;
      '';
    })
    # Other MimeTypes that include embedded jpeg may work as well (e.g. Nikon .nef, Sony .arf, etc)
    # Test other formats by adding them above
  ];
}
```

**exiv2-thumbnailer**

exiv2 can as well generate thumbnails for RAW camera formats by extracting their embedded JPEG or TIFF previews, making thumbnail creation fast without full RAW decoding. It may also support a wider range of RAW formats than gdk‑pixbuf, since it works directly with metadata rather than relying on codec‑level image loaders.

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [
    # exiv2-based RAW thumbnailer (extracts embedded JPEG/TIFF)
    (pkgs.writeShellApplication {
      name = "exiv2-thumbnailer";
      runtimeInputs = [ pkgs.exiv2 pkgs.imagemagick ];
      text = ''
        #!${pkgs.bash}/bin/bash
        set -euo pipefail

        tmpdir="$(mktemp -d)"
        trap 'rm -rf "$tmpdir"' EXIT

        exiv2 -l "$tmpdir" --extract p1 "$1"

        base="$(basename "$1")"
        preview="$tmpdir/\${base%.*}-preview1.jpg"
        [ ! -f "$preview" ] && preview="${preview%.*}.tif"

        magick "$preview" -thumbnail "\${3}x\${3}>" -strip "png:$2"
      '';
    })

    (pkgs.writeTextFile {
      name = "exiv2-thumbnailer.thumbnailer";
      destination = "/share/thumbnailers/exiv2-thumbnailer.thumbnailer";
      text = ''
        [Thumbnailer Entry]
        TryExec=exiv2-thumbnailer
        Exec=exiv2-thumbnailer %i %o
        MimeType=image/x-canon-crw;image/x-canon-cr2;image/x-canon-cr3;image/x-adobe-dng;image/x-dng;
      '';
    })
  ];
}
```

For a more complete solution, see the NixOS port of [nautilus‑raw‑thumbnails](https://github.com/stackcoder/nixos-nautilus-raw-thumbnails).

#### nufraw-thumbnailer

To enable thumbnails for camera RAW format use `nufraw` to decode RAW images and `nufraw-thumbnailer` to generate thumbnails.

Thumbnails for the following MimeTypes are enabled: *image/x-canon-cr2;image/x-canon-crw;image/x-minolta-mrw;image/x-nikon-nef;image/x-pentax-pef;image/x-panasonic-rw2;image/x-panasonic-raw2;image/x-samsung-srw;image/x-olympus-orf;image/x-sony-arw.*

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [ 
    pkgs.nufraw
    pkgs.nufraw-thumbnailer
  ];

  # 'nufraw.thumbnailer' is created in '/run/current-system/sw/share/thumbnailers' 
}
```

nufraw-thumbnailer

- creates thumbnails using the embedded 'jpeg' in the camera raw files. ( `--noexif` )
- does not respect the EXIF metadata. ( `--embedded-image` )

Output of `cat /run/current-system/sw/share/thumbnailers/nufraw.thumbnailer`:

``` desktop
[Thumbnailer Entry]
TryExec=/nix/store/piss9dl8i5xnfm5yagdffgxycm8lsqpl-nufraw-0.43-3/bin/nufraw-batch
Exec=/nix/store/piss9dl8i5xnfm5yagdffgxycm8lsqpl-nufraw-0.43-3/bin/nufraw-batch --silent --size %s --out-type=png --noexif --output=%o --embedded-image %i
MimeType=image/x-canon-cr2;image/x-canon-crw;image/x-minolta-mrw;image/x-nikon-nef;image/x-pentax-pef;image/x-panasonic-rw2;image/x-panasonic-raw2;image/x-samsung-srw;image/x-olympus-orf;image/x-sony-arw
```

Additional cameras[^1] beyond those listed in the stock `nufraw.thumbnailer` file are also supported. The following additional MimeTypes are supported: *image/x-adobe-dng; image/x-dcraw; image/x-fuji-raf; image/x-kodak-dcr; image/x-kodak-k25; image/x-kodak-kdc; image/x-nikon-nrw; image/x-panasonic-raw; image/x-sigma-x3f; image/x-sony-srf; image/x-sony-sr2*

Eg: Generate thumbnails from 'raw' data (not 'embedded jpeg') + respect EXIF (eg: rotation) metadata + add support for additional camera formats

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [
    pkgs.nufraw
    pkgs.nufraw-thumbnailer
    # Thumbnails from 'raw' data and include EXIF tags for Adobe-DNG images
    (pkgs.writeTextFile {
      name = "my-custom-nufraw-thumbnailer";
      destination = "/share/thumbnailers/my-custom-nufraw.thumbnailer";
      text = ''
        [Thumbnailer Entry]
        TryExec=nufraw-batch
        Exec=nufraw-batch --silent --size %s --out-type=png --output=%o %i
        MimeType=image/x-adobe-dng;image/x-dng;
      '';
    })
    # MimeTypes not listed here but listed in the default nufraw.thumbnailer will continue displaying
    # thumbnails generated from the 'embedded jpeg' without the EXIF metadata
  ];
}
```

## **Creating Custom Thumbnailers**

Most package mangers accept the [Thumbnail Managing Standard](https://specifications.freedesktop.org/thumbnail-spec/latest/index.html), by using it you can create your own thumbnailer for any file format, this can be done by:

1.  First you need to figure out how to create a `.png` image from a file in the desired format.
2.  Create a `.thumbnailer` file in `$XDG_DATA_DIRS/thumbnailers`.
3.  Restart your thumbnailer service (This is specific to each file manager) and test if it's working.

### Example

You could create a thumbnailer for <a href="Krita" class="wikilink" title="Krita">Krita</a>'s `.kra` file format like so:

`.kra` are zip files, with a preview stored at `/preview.png`, we can use unzip to extract the preview:

``` shell
unzip -p robot-squirrel.kra preview.png > robot-squirrel.png
```

Create a `.thumbnailer` file in any `$XDG_DATA_DIRS/thumbnailers` directory.

``` desktop
# $HOME/.local/share/thumbnailers/kra.thumbnailer
[Thumbnailer Entry]
Exec=sh -c "unzip -p %i preview.png > %o"
MimeType=application/x-krita;
```

Restart your thumbnailer service (This is specific to each file manager) and test if it's working.

After you have a working definition, you can make it reproducible like so:

``` nix
# configuration.nix
{ pkgs, ... }:

{
  environment.systemPackages = [
    (pkgs.writeTextFile {
      # This can be anything, it's just the name of the derivation in the nix store
      name = "krita-thumbnailer";
      # This is the important part, the path under which this will be installed
      destination = "/share/thumbnailers/kra.thumbnailer";
      # The contents of your thumbnailer, don't forget to specify the full path to executables
      text = ''
        [Thumbnailer Entry]
        Exec=sh -c "${pkgs.unzip}/bin/unzip -p %i preview.png > %o"
        MimeType=application/x-krita;
      '';
    })
  ];
}
```

[^1]: <https://github.com/killhellokitty/nufraw-thumbnailer>
