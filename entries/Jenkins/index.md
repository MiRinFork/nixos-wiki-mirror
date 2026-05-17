<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Jenkins -->

Jenkins is an extendable open source continuous integration server.

## services.jenkins activation

Write this into your /etc/nixos/configuration.nix

` services.jenkins = {`  
`   enable = true;`  
` };`

After a \`nixos-rebuild switch\`

Then the program is available via webbrowser at:

\<<http://localhost:8080>\>

### CI configuration

Using the multibranch pipeline one can use this Jenkinsfile in the repository to build it:

` pipeline {`  
`   agent any`  
`   environment {`  
`       PATH="/run/current-system/sw/bin"`  
`   }`  
`   stages {`  
`       stage('Build') {`  
`           steps {`  
`               echo 'Building..'`  
`               sh 'ls'`  
`               sh 'nix-shell --command "just build"'`  
`               archiveArtifacts artifacts: 'frontend/dist/*', fingerprint: true`  
`           }`  
`       }`  
`       stage('Test') {`  
`           steps {`  
`               echo 'Testing..'`  
`               sh 'nix-shell --command "just test"'`  
`           }`  
`       }`  
`       stage('Check fmt') {`  
`           steps {`  
`               echo 'Checking fmt..'`  
`                 sh 'nix-shell --command "cargo fmt --check"'`  
`                 sh 'nix-shell --command "cd frontend; cargo fmt --check"'`  
`           }`  
`       }`  
`   }`  
`   post {`  
`        changed {`  
`           script {`  
`               if (currentBuild.currentResult == 'FAILURE') {`  
`                   emailext subject: '$DEFAULT_SUBJECT',`  
`                       body: '$DEFAULT_CONTENT',`  
`                       recipientProviders: [`  
`                           [$class: 'CulpritsRecipientProvider'],`  
`                           [$class: 'DevelopersRecipientProvider'],`  
`                           [$class: 'RequesterRecipientProvider']`  
`                       ],`  
`                       replyTo: '$DEFAULT_REPLYTO',`  
`                       to: '$DEFAULT_RECIPIENTS'`  
`               }`  
`           }`  
`       }`  
`       always {`  
`           cleanWs(cleanWhenNotBuilt: false,`  
`                   deleteDirs: true,`  
`                   disableDeferredWipeout: true,`  
`                   notFailBuild: true,`  
`                   patterns: [[pattern: '.gitignore', type: 'INCLUDE'],`  
`                              [pattern: '.propsfile', type: 'EXCLUDE']])`  
`       }`  
`   }`  
` }`

## reverse proxy

` services.nginx = {`  
`   enable = true;`  
`   recommendedGzipSettings = true;`  
`   recommendedOptimisation = true;`  
`   virtualHosts = {`  
`     jenkins = {`  
`       serverName = "ci.example.com";`  
`       serverAliases = [ "ci-static.example.com" ];`  
`       forceSSL = true;`  
`       enableACME = true;`  
`       locations = {`  
`         "/" = {`  
`           proxyPass = "`[`http://127.0.0.1:8080/`](http://127.0.0.1:8080/)`";`  
`         };`  
`       };`  
`     };`  
`   };`

You might want to enable the firewall using:

` networking.firewall.enable = true;`

## using email

Use \<<https://gitlab.com/simple-nixos-mailserver>\> for email support. Can be tested using a test button from the <localhost:8080> webpage.

## building nix projects

[jenkins-nix-ci](https://github.com/juspay/jenkins-nix-ci): A NixOS module for Jenkins, optimized specifically for running projects using Nix.

[mrVanDalo](https://github.com/mrVanDalo) has a [library](https://git.ingolf-wagner.de/palo/nixos-config/src/commit/74b2eb869bdf6cf531273de925e40cf4ca914f04/nixos/library/jenkins.nix) to declare jenkins in his repository. It can be used as shown [here](https://git.ingolf-wagner.de/palo/nixos-config/src/commit/74b2eb869bdf6cf531273de925e40cf4ca914f04/nixos/configs/workhorse/jenkins.nix).

- <b>Note:</b> the above repo no longer has those sources so it is outdated, but keeping it as a reference.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
