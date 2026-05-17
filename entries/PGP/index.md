<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PGP -->

From <a href="wikipedia:Pretty_Good_Privacy" class="wikilink" title="its dedicated Wikipedia article">its dedicated Wikipedia article</a> :

> **Pretty Good Privacy** (**PGP**) is an <a href="wikipedia:Encryption_software" class="wikilink" title="encryption program">encryption program</a> that provides <a href="wikipedia:Cryptographic" class="wikilink" title="cryptographic">cryptographic</a> <a href="wikipedia:Privacy" class="wikilink" title="privacy">privacy</a> and <a href="wikipedia:Authentication" class="wikilink" title="authentication">authentication</a> for <a href="wikipedia:Data_communication" class="wikilink" title="data communication">data communication</a>. PGP is used for <a href="wikipedia:Digital_signature" class="wikilink" title="signing">signing</a>, encrypting, and decrypting texts, <a href="wikipedia:Email" class="wikilink" title="e-mails">e-mails</a>, files, directories, and whole disk partitions and to increase the <a href="wikipedia:Security" class="wikilink" title="security">security</a> of e-mail communications. <a href="wikipedia:Phil_Zimmermann" class="wikilink" title="Phil Zimmermann">Phil Zimmermann</a> developed PGP in 1991.[^1]
>
> PGP and similar software follow the OpenPGP standard (<a href="wikipedia:Request_for_Comments" class="wikilink" title="RFC">RFC</a> 4880), an <a href="wikipedia:Open_standard" class="wikilink" title="open standard">open standard</a> for <a href="wikipedia:Encryption" class="wikilink" title="encrypting">encrypting</a> and decrypting <a href="wikipedia:Data" class="wikilink" title="data">data</a>. Modern versions of PGP are <a href="wikipedia:Interoperability" class="wikilink" title="interoperable">interoperable</a> with <a href="wikipedia:GnuPG" class="wikilink" title="GnuPG">GnuPG</a> and other OpenPGP-compliant systems.[^2]
>
> The OpenPGP standard has received criticism for its long-lived keys and the difficulty in learning it,[^3] as well as the <a href="wikipedia:EFAIL" class="wikilink" title="Efail">Efail</a> security vulnerability that previously arose when select e-mail programs used OpenPGP with S/MIME.[^4][^5] The new OpenPGP standard (<a href="wikipedia:Request_for_Comments" class="wikilink" title="RFC">RFC</a> 9580) has also been criticised by the maintainer of <a href="wikipedia:GnuPG" class="wikilink" title="GnuPG">GnuPG</a> <a href="wikipedia:Werner_Koch" class="wikilink" title="Werner Koch">Werner Koch</a>, who in response created his own specification LibrePGP.[^6] This response was dividing, with some embracing his alternative specification,[^7] and others considering it to be insecure.[^8]

## Sequoia PGP

From [its official website and code repository](https://sequoia-pgp.org/) :

> Sequoia is a complete implementation of OpenPGP as defined by [RFC 9580](https://www.rfc-editor.org/rfc/rfc9580.html) as well as the deprecated OpenPGP as defined by <a href="rfc:4880" class="wikilink" title="RFC 4880">RFC 4880</a>, and various related standards.
>
> OpenPGP is a standard by the IETF. It was derived from the PGP software, which was created by Phil Zimmermann in 1991.
>
> Sequoia consists of several crates, providing both a low-level and a high-level API for dealing with OpenPGP data.

### Nixpkgs

- 

- 

- 

- 

- 

### NixOS

There is no Nixpkgs module for Sequoia PGP yet

### Home Manager

There is no <a href="Home_Manager" class="wikilink" title="home manager">home manager</a> module for Sequoia PGP yet

A GitHub issue is opened about its featuring :

#### Git Integration

Git having hardcoded the <a href="PGP#GNU_Privacy_Guard" class="wikilink" title="GNU Privacy Guard">GNU Privacy Guard</a> command interface, you will need to use (also see [the discourse post about this](https://discourse.nixos.org/t/sequoia-pgp-on-home-manager/72938/9?u=malix))

To do this using home manager :

``` nix
{
  ...

  lib,
  pkgs,

  ...
}:
{
  ...

  home = {
    ...

    packages = with pkgs; [
      ...

      sequoia-chameleon-gnupg

      ...
    ];
  };

  programs = {
    home-manager.enable = true;

    ...

    git = {
      enable = true;
      
      ...

      signing = {
        signByDefault = true;
        format = "openpgp";
        signer = lib.getExe pkgs.sequoia-chameleon-gnupg;
        key = "<REPLACE_THIS_WITH_YOUR_KEY_FINGERPRINT>"; # Replace `<REPLACE_THIS_WITH_YOUR_KEY_FINGERPRINT>` with your key fingerprint
      };

      ...
    };
  };

  ...

  services = {
    ...

    gpg-agent = { # Dependency of `pkgs.sequoia-chameleon-gnupg`
      enable = true;

      ...
    };

    ...
  };

  ...
}
```

## GNU Privacy Guard

From <a href="wikipedia:GNU_Privacy_Guard" class="wikilink" title="its dedicated Wikipedia article">its dedicated Wikipedia article</a> :

> **GNU Privacy Guard** (**GnuPG** or **GPG**) is a <a href="wikipedia:Free-software" class="wikilink" title="free-software">free-software</a> replacement for <a href="wikipedia:Symantec_Corporation" class="wikilink" title="Symantec">Symantec</a>'s <a href="wikipedia:Cryptography" class="wikilink" title="cryptographic">cryptographic</a> software suite <a href="wikipedia:Pretty_Good_Privacy" class="wikilink" title="PGP">PGP</a>. The software is compliant with the now obsoleted[^9] <a href="wikipedia:RFC_(identifier)" class="wikilink" title="RFC">RFC</a> [4880](https://www.rfc-editor.org/rfc/rfc4880), the <a href="wikipedia:Internet_Engineering_Task_Force" class="wikilink" title="IETF">IETF</a> standards-track specification of <a href="wikipedia:OpenPGP" class="wikilink" title="OpenPGP">OpenPGP</a>. Modern versions of PGP are <a href="wikipedia:Interoperability" class="wikilink" title="interoperable">interoperable</a> with GnuPG and other OpenPGP v4-compliant systems.[^10]
>
> November 2023 saw two drafts aiming to update the 2007 OpenPGP v4 specification (RFC4880), ultimately resulting in the RFC 9580 standard in July 2024. The proposal from the GnuPG developers, which is called LibrePGP, was not taken up by the OpenPGP Working Group and future versions of GnuPG will not support the current version of OpenPGP.[^11]
>
> GnuPG is part of the <a href="wikipedia:GNU_Project" class="wikilink" title="GNU Project">GNU Project</a> and received major funding from the <a href="wikipedia:Politics_of_Germany" class="wikilink" title="German government">German government</a> in 1999.[^12]

### Nixpkgs

- 

### NixOS

Other modules have integrations for the GNU Privacy Guard

### Home Manager

Other modules have integrations for the GNU Privacy Guard

------------------------------------------------------------------------

[^1]:
    <cite id="CITEREFZimmermann1999" class="citation web cs1" data-ve-ignore=""><a href="Phil_Zimmermann" class="wikilink" title="Zimmermann, Philip R.">Zimmermann, Philip R.</a> (1999). ["Why I Wrote PGP"](https://www.philzimmermann.com/EN/essays/WhyIWrotePGP.html). *Essays on PGP*. Phil Zimmermann & Associates LLC. [Archived](https://web.archive.org/web/20180624122110/https://philzimmermann.com/EN/essays/WhyIWrotePGP.html) from the original on June 24, 2018<span class="reference-accessdate">. Retrieved <span class="nowrap">July 6,</span> 2014</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&rft.genre=unknown&rft.jtitle=Essays+on+PGP&rft.atitle=Why+I+Wrote+PGP&rft.date=1999&rft.aulast=Zimmermann&rft.aufirst=Philip+R.&rft_id=https%3A%2F%2Fwww.philzimmermann.com%2FEN%2Fessays%2FWhyIWrotePGP.html&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^2]:
    <cite class="citation web cs1" data-ve-ignore="">["Gnu Privacy Guard"](https://www.gnupg.org/faq/gnupg-faq.html#compatible). GnuPG.org. [Archived](https://web.archive.org/web/20150429192132/https://www.gnupg.org/faq/gnupg-faq.html#compatible) from the original on April 29, 2015<span class="reference-accessdate">. Retrieved <span class="nowrap">May 26,</span> 2015</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&rft.genre=unknown&rft.btitle=Gnu+Privacy+Guard&rft.pub=GnuPG.org&rft_id=https%3A%2F%2Fwww.gnupg.org%2Ffaq%2Fgnupg-faq.html%23compatible&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^3]:
    <cite id="CITEREFLatacora2019" class="citation web cs1" data-ve-ignore="">Latacora (July 16, 2019). ["The PGP Problem"](https://www.latacora.com/blog/2019/07/16/the-pgp-problem)<span class="reference-accessdate">. Retrieved <span class="nowrap">November 22,</span> 2024</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&rft.genre=unknown&rft.btitle=The+PGP+Problem&rft.date=2019-07-16&rft.au=Latacora&rft_id=https%3A%2F%2Fwww.latacora.com%2Fblog%2F2019%2F07%2F16%2Fthe-pgp-problem&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^4]:
    <cite class="citation web cs1" data-ve-ignore="">["Efail: Breaking S/MIME and OpenPGP Email Encryption using Exfiltration Channels"](https://www.usenix.org/system/files/conference/usenixsecurity18/sec18-poddebniak.pdf) <span class="cs1-format">(PDF)</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&rft.genre=unknown&rft.btitle=Efail%3A+Breaking+S%2FMIME+and+OpenPGP+Email+Encryption+using+Exfiltration+Channels&rft_id=https%3A%2F%2Fwww.usenix.org%2Fsystem%2Ffiles%2Fconference%2Fusenixsecurity18%2Fsec18-poddebniak.pdf&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^5]:
    <cite id="CITEREFYen2018" class="citation web cs1" data-ve-ignore="">Yen, Andy (May 15, 2018). ["No, PGP is not broken, not even with the Efail vulnerabilities"](https://proton.me/blog/pgp-vulnerability-efail). *Proton*<span class="reference-accessdate">. Retrieved <span class="nowrap">January 22,</span> 2025</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&rft.genre=unknown&rft.jtitle=Proton&rft.atitle=No%2C+PGP+is+not+broken%2C+not+even+with+the+Efail+vulnerabilities&rft.date=2018-05-15&rft.aulast=Yen&rft.aufirst=Andy&rft_id=https%3A%2F%2Fproton.me%2Fblog%2Fpgp-vulnerability-efail&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^6]:
    <cite id="CITEREFEdge2023" class="citation web cs1" data-ve-ignore="">Edge, Jake (December 6, 2023). ["A schism in the OpenPGP world \[LWN.net\]"](https://lwn.net/Articles/953797/). *lwn.net*. [Archived](https://web.archive.org/web/20240222124116/https://lwn.net/Articles/953797/) from the original on February 22, 2024<span class="reference-accessdate">. Retrieved <span class="nowrap">February 14,</span> 2024</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&rft.genre=unknown&rft.jtitle=lwn.net&rft.atitle=A+schism+in+the+OpenPGP+world+%5BLWN.net%5D&rft.date=2023-12-06&rft.aulast=Edge&rft.aufirst=Jake&rft_id=https%3A%2F%2Flwn.net%2FArticles%2F953797%2F&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^7]:
    <cite id="CITEREFTseOlshevsky2024" class="citation web cs1" data-ve-ignore="">Tse, Ronald; Olshevsky, Nickolay (July 22, 2024). ["RNP proudly supports LibrePGP"](https://www.rnpgp.org/blog/2024-07-22-rnp-and-librepgp). *RNP*<span class="reference-accessdate">. Retrieved <span class="nowrap">January 22,</span> 2025</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&rft.genre=unknown&rft.jtitle=RNP&rft.atitle=RNP+proudly+supports+LibrePGP&rft.date=2024-07-22&rft.aulast=Tse&rft.aufirst=Ronald&rft.au=Olshevsky%2C+Nickolay&rft_id=https%3A%2F%2Fwww.rnpgp.org%2Fblog%2F2024-07-22-rnp-and-librepgp&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^8]:
    <cite id="CITEREFGallagher2024" class="citation web cs1" data-ve-ignore="">Gallagher, Andrew (September 11, 2024). ["A Summary of Known Security Issues in LibrePGP"](https://blog.pgpkeys.eu/security-issues-librepgp-2024-08.html)<span class="reference-accessdate">. Retrieved <span class="nowrap">January 22,</span> 2025</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&rft.genre=unknown&rft.btitle=A+Summary+of+Known+Security+Issues+in+LibrePGP&rft.date=2024-09-11&rft.aulast=Gallagher&rft.aufirst=Andrew&rft_id=https%3A%2F%2Fblog.pgpkeys.eu%2Fsecurity-issues-librepgp-2024-08.html&rfr_id=info%3Asid%2Fen.wikipedia.org%3APretty+Good+Privacy" class="Z3988" data-ve-ignore=""></span>

[^9]:
    <cite id="CITEREFWoutersHuigensWinterYutaka2024" class="citation web cs1" data-ve-ignore="">Wouters, Paul; Huigens, Daniel; Winter, Justus; Yutaka, Niibe (July 2024). ["RFC 9580 OpenPGP"](https://www.rfc-editor.org/rfc/rfc9580.html). *RFC Editor*. IETF<span class="reference-accessdate">. Retrieved <span class="nowrap">2024-12-19</span></span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&rft.genre=unknown&rft.jtitle=RFC+Editor&rft.atitle=RFC+9580+OpenPGP&rft.date=2024-07&rft.aulast=Wouters&rft.aufirst=Paul&rft.au=Huigens%2C+Daniel&rft.au=Winter%2C+Justus&rft.au=Yutaka%2C+Niibe&rft_id=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc9580.html&rfr_id=info%3Asid%2Fen.wikipedia.org%3AGNU+Privacy+Guard" class="Z3988" data-ve-ignore=""></span>

[^10]:
    <cite class="citation web cs1" data-ve-ignore="">["GnuPG Frequently Asked Questions"](https://www.gnupg.org/faq/gnupg-faq.html#compatible). The GNU Privacy Guard. [Archived](https://web.archive.org/web/20150429192132/https://www.gnupg.org/faq/gnupg-faq.html#compatible) from the original on 2015-04-29<span class="reference-accessdate">. Retrieved <span class="nowrap">2015-05-26</span></span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&rft.genre=unknown&rft.btitle=GnuPG+Frequently+Asked+Questions&rft.pub=The+GNU+Privacy+Guard&rft_id=https%3A%2F%2Fwww.gnupg.org%2Ffaq%2Fgnupg-faq.html%23compatible&rfr_id=info%3Asid%2Fen.wikipedia.org%3AGNU+Privacy+Guard" class="Z3988" data-ve-ignore=""></span>

[^11]:
    <cite id="CITEREFEdge2023" class="citation web cs1" data-ve-ignore="">Edge, Jake (December 6, 2023). ["A schism in the OpenPGP world"](https://lwn.net/Articles/953797/). Linux Weekly News<span class="reference-accessdate">. Retrieved <span class="nowrap">2023-12-09</span></span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&rft.genre=unknown&rft.btitle=A+schism+in+the+OpenPGP+world&rft.pub=Linux+Weekly+News&rft.date=2023-12-06&rft.aulast=Edge&rft.aufirst=Jake&rft_id=https%3A%2F%2Flwn.net%2FArticles%2F953797%2F&rfr_id=info%3Asid%2Fen.wikipedia.org%3AGNU+Privacy+Guard" class="Z3988" data-ve-ignore=""></span>

[^12]:
    <cite class="citation web cs1 cs1-prop-foreign-lang-source" data-ve-ignore="">["Bundesregierung fördert Open Source"](http://www.heise.de/newsticker/meldung/Bundesregierung-foerdert-Open-Source-24110.html) (in German). Heise Online. 1999-11-15. [Archived](https://web.archive.org/web/20131012024601/http://www.heise.de/newsticker/meldung/Bundesregierung-foerdert-Open-Source-24110.html) from the original on October 12, 2013<span class="reference-accessdate">. Retrieved <span class="nowrap">July 24,</span> 2013</span>.</cite><span title="ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook&rft.genre=unknown&rft.btitle=Bundesregierung+f%C3%B6rdert+Open+Source&rft.pub=Heise+Online&rft.date=1999-11-15&rft_id=http%3A%2F%2Fwww.heise.de%2Fnewsticker%2Fmeldung%2FBundesregierung-foerdert-Open-Source-24110.html&rfr_id=info%3Asid%2Fen.wikipedia.org%3AGNU+Privacy+Guard" class="Z3988" data-ve-ignore=""></span>
