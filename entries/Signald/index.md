<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Signald -->

[Signald](https://signald.org) was a program that enabled users to send and receive end-to-end encrypted messages using the Signal protocol. The project has been unmaintained for a while now and the "services.signald" option by now only outputs a message to remove it from the configuration. The projects website recommends former users of Signald move towards <a href="Signald#Troubleshooting" class="wikilink" title="signal-cli">signal-cli</a>.

It served as a bridge between the [Signal messaging app](https://signal.org) and other applications or services, allowing developers to integrate secure messaging capabilities into their own projects.

## Installation

Enable signald daemon, running as the user `myuser` which should be equivalent to the user who should interact with signald

### Registration

NOTE: The registration process described here was still [broken](https://gitlab.com/signald/signald/-/issues/372) when the project was discontinued. Please refer to the <a href="Signald#Troubleshooting" class="wikilink" title="troubleshooting section">troubleshooting section</a> below for a workaround using signal-cli.

Connect and register a phone number of an existing Signal account using following command. It will print a QR code which you can scan on your mobile device. Navigate to "Settings -\> Linked devices" on your mobile app.

``` console
# signaldctl account link
```

Alternativley register a new real phone number or a virtual disposable one which can be bought with services like [sms-man.com](https://sms-man.com/).

``` console
# signaldctl account register [phone number]
```

Sometimes you'll have to generate and supply a [captcha verification code](https://signald.org/articles/captcha/) to this command by using the `--captcha` parameter.

In the last step, enter the verification number you received via SMS using this command

``` console
# signaldctl account verify [phone number] [code]
```

## Usage

### Configuration

Set profile name of account `+12025555555`

``` console
# signaldctl account set-profile -a +12025555555 "my signal user"
```

### Messaging

Send a message to the recipient number `+12026666666` using the account `+12025555555`

``` console
# signaldctl message send -a +12025555555 +12026666666 "hello, joe"
```

Send message to a group using the account `+12025555555`. You'll find the group id by generating a group link of an existing group in the settings section, for example on your mobile phone with the Signal app.

``` console
# signaldctl message send -a +12025555555 EdSqI90cS0UomDpgUXOlCoObWvQOXlH5G3Z2d3f4ayE= "hello, everyone"
```

### Group handling

Join a chat group with the account `+12025555555`

``` console
# signaldctl group join -a +12025555555 EdSqI90cS0UomDpgUXOlCoObWvQOXlH5G3Z2d3f4ayE=
```

## Troubleshooting

### Registration fails with "error registering with server"

This registration error might be related to an [unfixed bug](https://gitlab.com/signald/signald/-/issues/372) in Signald. It is possible to use the projects successor `signal-cli` to register and verify a new phone number and use Signald as a secondary "device" by linking it

``` console
# nix-shell -p nixos.signal-cli
# Register account with the phone number +12025555555. You'll most likley need to generate a captcha and specify it with a parameter. See registration section above on how to do this.
# signal-cli -a "+12025555555" register --captcha "abcd"
Enter the verification number received via SMS
# signal-cli -a "+12025555555" verify "1234"
Generate the device uri in Signald to link the existing account
# signaldctl account link --output-format json
Use the uri generated above in the following command
# signal-cli -a "+12025555555" addDevice --uri "abcd"
```

Now Signald is able to use the phone number `+12025555555`, registered with signal-cli, as a secondary device.

## Tips and tricks

### Similar projects

[signal-cli](https://github.com/AsamK/signal-cli) is the successor of Signald and the project recommended all former users to migrate towards it.

### Python chat bot

The Python module [semaphore](https://codeberg.org/lazlo/semaphore) can be used to interact with your Signald account and to create simple chat bots.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
