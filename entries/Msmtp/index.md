<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Msmtp -->

[msmtp](https://marlam.de/msmtp/) is an easy to configure basic email sender client with fairly complete sendmail compatibility.

## Installation

A minimal configuration to relay mails through an external mail server coud look like this

``` nix
programs.msmtp = {
  enable = true;
  accounts.default = {
    host = "example.org";
    from = "hello@example.org";
    user = "hello@example.org";
    password = "mypassword123";
  };
};
```

In this case *msmtp* will try to deliver mails through the smtp server `example.org` on port `25`. `user` and `password` are used for normal plaintext authentication.

This configuration will automatically set *msmtp* as the default mail delivery client on your system by overwriting the `sendmail` binary. To test mail delivery issue following command:

``` console
# echo -e "Content-Type: text/plain\r\nSubject: Test\r\n\r\nHello World" | sendmail john.doe@mail.com
```

A mail with the subject *Test* will be sent to the recipient *john.doe@mail.com* including the body text *Hello World*. A Mime-Header is added to the mail content for better compatibility.

## Configuration

Further configuration options for *msmtp* can be found [here](https://marlam.de/msmtp/msmtp.html).

### TLS connections

``` nix
{
  age.secrets.msmtp = {
    file = "${inputs.self.outPath}/secrets/msmtp.age";
  };

  # for zed enableMail, enable sendmailSetuidWrapper
  services.mail.sendmailSetuidWrapper.enable = true;

  programs.msmtp = {
    enable = true;
    setSendmail = true;
    defaults = {
      aliases = "/etc/aliases";
      port = 587;
      auth = "plain";
      tls = "on";
      tls_starttls = "on";
    };
    accounts = {
      default = {
        host = "smtp.mail.example.com";
        passwordeval = "cat ${config.age.secrets.msmtp.path}";
        user = "myname@example.com";
        from = "myname@example.com";
      };
    };
  };
}
```

Note that msmtp has no daemon and runs as the invoking user. If using `passwordeval`, the file must be readable by any user that wishes to send mail.

### Aliases

Then, configure an alias for root account. With this alias configured, all mails sent to root, such as cron job results and failed sudo login events, will be redirected to the configured email account.

``` nix
{
  environment.etc.aliases.text = ''
    root: admin@example.com
  '';
}
```

## See also

- [msmtp options list](https://search.nixos.org/options?query=programs.msmtp)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
