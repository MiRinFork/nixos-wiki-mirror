<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rollback nixpkgs -->

It is possible some software you depend on breaks in an updated nixpkgs release. If you need to roll back to a previous version of nixpkgs here an example method of using <a href="Hydra" class="wikilink" title="Hydra">Hydra</a> to get the last tested release of nixpkgs that contains it.

This specific example is where an update to Linux 6.6.57 breaks netfilter and we need to roll back to 6.6.56.

We go to [<https://Hydra.nixos.org>](https://hydra.nixos.org) and are presented with the Projects page.

<img src="1-hydra-projects.png" title="1-hydra-projects.png" width="663" height="663" alt="1-hydra-projects.png" /> In this example we want to roll back in the nixos-unstable branch so we select the nixos Project.

<img src="2-hydria-jobsets.png" title="2-hydria-jobsets.png" width="653" height="653" alt="2-hydria-jobsets.png" /> Highlighted are the release-24.05 `jobset` for NixOS stable release and the trunk-combined `jobset` which will be relevant to most. trunk-combined is Hydra `jobset` that builds nixos-unstable.

<img src="3-hdrya-jobset-jobs-tab.png" title="3-hdrya-jobset-jobs-tab.png" width="637" height="637" alt="3-hdrya-jobset-jobs-tab.png" /> Here is the Hydra page showing the latest evaluations for trunk-combined. Highlighted is the Jobs tab where we will search for the Linux kernel we are looking for.

<figure>
<img src="4-hydra-jobs.png" title="4-hydra-jobs.png" width="827" height="827" />
<figcaption>4-hydra-jobs.png</figcaption>
</figure>

Here we are searching for the job that builds the linux_6_6 kernel and select it.

<figure>
<img src="5-hydra-job-packages.png" title="5-hydra-job-packages.png" width="735" height="735" />
<figcaption>5-hydra-job-packages.png</figcaption>
</figure>

We have found the last build that compiled the 6.6.56 kernel and select it.

<figure>
<img src="6-hydra-build-summary.png" title="6-hydra-build-summary.png" width="651" height="651" />
<figcaption>6-hydra-build-summary.png</figcaption>
</figure>

This build of the Linux 6.6.56 kernel is the first time it was built. We can see it is part of 2 other evaluations. We want to see which nixpkgs-unstable evaluations contained this build, so we click on the "2 others".

<figure>
<img src="7-hydra-build-evals.png" title="7-hydra-build-evals.png" width="709" height="709" />
<figcaption>7-hydra-build-evals.png</figcaption>
</figure>

Here we have the git commit hashes for nixpkgs that were used to generate the 3 nixpkgs-unstable evals that contained the kernel we want.

We do not want just any eval that had this kernel build in it. It could have been incomplete or failed. So we want to ensure that the build ran through the "tested" `job` that is part of the trunk-combined `jobset`. The tested `job` runs the various tests that must pass for the NixOS channels to progress.

<figure>
<img src="8-hydra-jobset-overview.png" title="8-hydra-jobset-overview.png" width="734" height="734" />
<figcaption>8-hydra-jobset-overview.png</figcaption>
</figure>

Select the Jobset dropdown. Notice that `trunk-combined` `jobset` is highligted. We select overview. But we want to open this in another windows or tab, so we have access to compare the git commit hashes we found before.

<figure>
<img src="9-hydra-jobset-jobs-tested.png" title="9-hydra-jobset-jobs-tested.png" width="753" height="753" />
<figcaption>9-hydra-jobset-jobs-tested.png</figcaption>
</figure>

First select the jobs tab to search for `jobs`. In the search field we are searching for the `tested` job. After pressing enter you see similar to the above image. Select the `tested` job. There is also a `tested` job if you are using the stable release.

<figure>
<img src="10-hydra-jobset-jobs-tested-last-successful.png" title="10-hydra-jobset-jobs-tested-last-successful.png" width="698" height="698" />
<figcaption>10-hydra-jobset-jobs-tested-last-successful.png</figcaption>
</figure>

Here we notice we are on the`tested`job of the `trunk-combined` jobset. We compare the git commit hashes of the nixpkgs evals we got from the previous step to find the tested jobs that contain the kernel we want.

In this example we see that build 275414986 successfully passed the`tested` job with the green check mark displayed.

So it is the latest nixos-unstable evaluation that has the kernel we want. We can then know that we can use `5785b6bb5eaa` git commit hash in our flake for nixpkgs to build our system and utilise the NixOS cache. (`nixpkgs.url = "github:NixOS/nixpkgs/5785b6bb5eaa";`)

We also see that the first eval that had the 6.6.56 kernel failed to pass the tested job. Good thing we took this extra step to verify!

<figure>
<img src="11-hydra-jobset-jobs-tested-last-success.png" title="11-hydra-jobset-jobs-tested-last-success.png" width="657" height="657" />
<figcaption>11-hydra-jobset-jobs-tested-last-success.png</figcaption>
</figure>

Here is the summary page of the tested build we want showing it as successful with the git commit hash.

<a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a>
