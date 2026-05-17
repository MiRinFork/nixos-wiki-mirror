<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: MusicBrainz Picard -->

[Picard](https://picard.musicbrainz.org/) is a music tagger powered by the MusicBrainz database.

## Troubleshooting

### Cannot scan songs to get AcoustOD fingerprints

Error messages like this one will show in the console when scanning songs:

    E: 00:00:00 Fingerprint calculator failed error = No such file or directory (0)

MusicBrainz Picard has an optional dependency on `chromaprint`. Installing it (

    nix-env -iA nixos.chromaprint

or through `configuration.nix`) will allow AcoustID fingerprinting to work.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
