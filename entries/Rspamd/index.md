<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rspamd -->

[Rspamd](https://rspamd.com) is a fast, free and open-source spam filtering system.

## Installation

To enable Rspamd add following line to your system configuration

To use Rspamd with Postfix add

## Configuration

### Bayesian spam training

To enable bayesian spam training, enable a Redis instance and configure it in Rspamd as a backend

### Whitelist domain

To whitelist a specific domain (in this example the domain `example.org`) which otherwise gets rejected by Rspamd for various reasons, this custom configuration override can be added:

### DKIM key

This module verifies the authenticity of emails through the analysis of DKIM signatures. In this example, we're configure a custom DKIM key file path suitable for the mailserver <a href="Maddy" class="wikilink" title="Maddy">Maddy</a> and adjust the group permissions for the Rspamd service.

### Secrets

Sometimes you need to provide secrets which should not be kept in the public store. In this example we add an API key to GPT module. You need to have the file with a name for example \`ai.conf\` with content:

and prepare your GPT configuration - in this example it's only part of it, consult the GPT module documentation.

## Tips and tricks

### Helper script to train rspamd

The following example enables [rspamd-trainer](https://gitlab.com/onlime/rspamd-trainer) as a daemon which will run every 10 minutes to check for mails in the inbox of `myuser@example.com` which should be used for spam/ham training.

The script will look into `INBOX/report_ham` and `INBOX/report_spam` respectivley for mails which will be feed into rspamd for training. After that they get moved to `INBOX/learned_ham` and `INBOX/learned_spam`. The report directories have to be created before that. You can do this using openssl:

``` console
# openssl s_client -connect example.com:993 -crlf
A login myuser@example.com test123
A create "INBOX/report_spam"
A create "INBOX/report_ham"
A create "INBOX/report_spam_reply"
```

<a href="Category:Mail_Server" class="wikilink" title="Category:Mail Server">Category:Mail Server</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
