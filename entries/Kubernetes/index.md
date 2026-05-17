<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kubernetes -->

[Kubernetes](https://kubernetes.io/) is an open-source container orchestration system for automating software deployment, scaling, and management.

This wiki article extends the documentation in [NixOS manual](https://nixos.org/manual/nixos/stable/#sec-kubernetes).

## <a href="wikipedia:en:KISS_principle" class="wikilink" title="KISS">KISS</a>

If you are new to <a href="Kubernetes" class="wikilink" title="Kubernetes">Kubernetes</a> you might want to check out <a href="K3s" class="wikilink" title="K3s">K3s</a> first as it is easier to set up (less moving parts).

## 1 Master and 1 Node

Assumptions:

- Master and Node are on the same network (in this example `10.1.1.0/24`)
- IP of the Master: `10.1.1.2`
- IP of the first Node: `10.1.1.3`

Caveats:

- This was only tested on `20.09pre215024.e97dfe73bba (Nightingale)` (`unstable`)
- This is probably not best-practice
  - For a production-grade cluster you shouldn't use `easyCerts`
- If you experience inability to reach service CIDR from pods, disable firewall via `networking.firewall.enable = false;` or otherwise make sure that it doesn't interfere with packet forwarding.
- Make sure to set `docker0` in promiscuous mode `ip link set docker0 promisc on`

### Master

Add to your `configuration.nix`:

``` nix
{ config, pkgs, ... }:
let
  # When using 'easyCerts = true;', the IP address must resolve to the master at the time of creation. 
  # In this case, set 'kubeMasterIP = "127.0.0.1";'. Otherwise, you may encounter the following issue: https://github.com/NixOS/nixpkgs/issues/59364.
  kubeMasterIP = "10.1.1.2";
  kubeMasterHostname = "api.kube";
  kubeMasterAPIServerPort = 6443;
in
{
  # resolve master hostname
  networking.extraHosts = "${kubeMasterIP} ${kubeMasterHostname}";

  # packages for administration tasks
  environment.systemPackages = with pkgs; [
    kompose
    kubectl
    kubernetes
  ];

  services.kubernetes = {
    roles = ["master" "node"];
    masterAddress = kubeMasterHostname;
    apiserverAddress = "https://${kubeMasterHostname}:${toString kubeMasterAPIServerPort}";
    easyCerts = true;
    apiserver = {
      securePort = kubeMasterAPIServerPort;
      advertiseAddress = kubeMasterIP;
    };

    # use coredns
    addons.dns.enable = true;

    # needed if you use swap
    kubelet.extraOpts = "--fail-swap-on=false";
  };
}
```

Apply your config (e.g. `nixos-rebuild switch`).

Link your `kubeconfig` to your home directory:

``` bash
ln -s /etc/kubernetes/cluster-admin.kubeconfig ~/.kube/config
```

Now, executing `kubectl cluster-info` should yield something like this:

``` shell
Kubernetes master is running at https://10.1.1.2
CoreDNS is running at https://10.1.1.2/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

You should also see that the master is also a node using `kubectl get nodes`:

``` shell
NAME       STATUS   ROLES    AGE   VERSION
direwolf   Ready    <none>   41m   v1.16.6-beta.0
```

### Node

Add to your `configuration.nix`:

``` nix
{ config, pkgs, ... }:
let
  kubeMasterIP = "10.1.1.2";
  kubeMasterHostname = "api.kube";
  kubeMasterAPIServerPort = 6443;
in
{
  # resolve master hostname
  networking.extraHosts = "${kubeMasterIP} ${kubeMasterHostname}";

  # packages for administration tasks
  environment.systemPackages = with pkgs; [
    kompose
    kubectl
    kubernetes
  ];

  services.kubernetes = let
    api = "https://${kubeMasterHostname}:${toString kubeMasterAPIServerPort}";
  in
  {
    roles = ["node"];
    masterAddress = kubeMasterHostname;
    easyCerts = true;

    # point kubelet and other services to kube-apiserver
    kubelet.kubeconfig.server = api;
    apiserverAddress = api;

    # use coredns
    addons.dns.enable = true;

    # needed if you use swap
    kubelet.extraOpts = "--fail-swap-on=false";
  };
}
```

Apply your config (e.g. `nixos-rebuild switch`).

According to the [NixOS tests](https://github.com/NixOS/nixpkgs/blob/18ff53d7656636aa440b2f73d2da788b785e6a9c/nixos/tests/kubernetes/rbac.nix#L118), make your Node join the cluster:

On the master, grab the apitoken

``` bash
cat /var/lib/kubernetes/secrets/apitoken.secret
```

On the node, join the node with

``` bash
echo TOKEN | nixos-kubernetes-node-join
```

After that, you should see your new node using `kubectl get nodes`:

``` shell
NAME       STATUS   ROLES    AGE    VERSION
direwolf   Ready    <none>   62m    v1.16.6-beta.0
drake      Ready    <none>   102m   v1.16.6-beta.0
```

## N Masters (HA)

## Troubleshooting

``` bash
systemctl status kubelet
```

``` bash
systemctl status kube-apiserver
```

``` bash
kubectl get nodes
```

### Join Cluster not working

If you face issues while running the `nixos-kubernetes-node-join` script:

``` shell
Restarting certmgr...
Job for certmgr.service failed because a timeout was exceeded.
See "systemctl status certmgr.service" and "journalctl -xe" for details.
```

Go investigate with `journalctl -u certmgr`:

``` shell
... certmgr: loading from config file /nix/store/gj7qr7lp6wakhiwcxdpxwbpamvmsifhk-certmgr.yaml
... manager: loading certificates from /nix/store/4n41ikm7322jxg7bh0afjpxsd4b2idpv-certmgr.d
... manager: loading spec from /nix/store/4n41ikm7322jxg7bh0afjpxsd4b2idpv-certmgr.d/flannelClient.json
... [ERROR] cert: failed to fetch remote CA: failed to parse rootCA certs
```

In this case, `cfssl` could be overloaded.

Restarting cfssl on the `master` node should help: `systemctl restart cfssl`

Also, make sure that port `8888` is open on your master node.

### DNS issues

Check if coredns is running via `kubectl get pods -n kube-system`:

``` shell
NAME                       READY   STATUS    RESTARTS   AGE
coredns-577478d784-bmt5s   1/1     Running   2          163m
coredns-577478d784-bqj65   1/1     Running   2          163m
```

Run a pod to check with `kubectl run curl --restart=Never --image=radial/busyboxplus:curl -i --tty`:

If you don't see a command prompt, try pressing enter.

``` shell
[ root@curl:/ ]$ 
```

``` bash
nslookup google.com
```

``` shell
Server:    10.0.0.254
Address 1: 10.0.0.254 kube-dns.kube-system.svc.cluster.local

Name:      google.com
Address 1: 2a00:1450:4016:803::200e muc12s04-in-x0e.1e100.net
Address 2: 172.217.23.14 lhr35s01-in-f14.1e100.net
```

In case DNS is still not working I found that sometimes, restarting services helps:

``` bash
systemctl restart kube-proxy flannel kubelet
```

### Reset to a clean state

Sometimes it helps to have a clean state on all instances:

- comment kubernetes-related code in `configuration.nix`
- `nixos-rebuild switch`
- clean up filesystem
  - `rm -rf /var/lib/kubernetes/ /var/lib/etcd/ /var/lib/cfssl/ /var/lib/kubelet/`
  - `rm -rf /etc/kube-flannel/ /etc/kubernetes/`
- uncomment kubernetes-related code again
- `nixos-rebuild switch`

## Miscellaneous

### Rook Ceph storage cluster

Chances are you want to setup a storage cluster using [rook](https://rook.io/).

To do so, I found it necessary to change a few things (tested with `rook v1.2`):

- You need the `ceph` kernel module: `boot.kernelModules = [ "ceph" ];`
- Change the root dir of the kubelet: `kubelet.extraOpts = "--root-dir=/var/lib/kubelet";`
- Reboot all your nodes
- Continue with [the official quickstart guide](https://rook.io/docs/rook/v1.2/ceph-quickstart.html)
- In `operator.yaml`, help the CSI plugins find the hosts' ceph kernel modules by adding (or uncommenting -- they're in the example config) these entries:

` CSI_CEPHFS_PLUGIN_VOLUME: |`  
` - name: lib-modules`  
`   hostPath:`  
`     path: /run/current-system/kernel-modules/lib/modules/`  
` CSI_RBD_PLUGIN_VOLUME: |`  
` - name: lib-modules`  
`   hostPath:`  
`     path: /run/current-system/kernel-modules/lib/modules/`

### NVIDIA

You can use NVIDIA's [k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin).

Make `nvidia-docker` your default docker runtime:

``` nix
virtualisation.docker = {
    enable = true;

    # use nvidia as the default runtime
    enableNvidia = true;
    extraOptions = "--default-runtime=nvidia";
};
```

Apply their Daemonset:

``` bash
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/1.0.0-beta4/nvidia-device-plugin.yml
```

### `/dev/shm`

Some applications need enough shared memory to work properly. Create a new volumeMount for your Deployment:

``` bash
volumeMounts:
- mountPath: /dev/shm
  name: dshm
```

and mark its `medium` as `Memory`:

``` bash
volumes:
- name: dshm
  emptyDir:
  medium: Memory
```

### Arm64

Nix might pull in `coredns` and `etcd` images that are incompatible with arm, To resolve this add the following to your master node's configuration:

#### etcd

``` nix
  ...
  services.kubernetes = {...};
  systemd.services.etcd = {
    environment = {
      ETCD_UNSUPPORTED_ARCH = "arm64";
    };
  };
  ...
```

#### coredns

``` nix
  services.kubernetes = {
    ...
    # use coredns
    addons.dns = {
      enable = true;
      coredns = {
        finalImageTag = "1.10.1";
        imageDigest = "sha256:a0ead06651cf580044aeb0a0feba63591858fb2e43ade8c9dea45a6a89ae7e5e";
        imageName = "coredns/coredns";
        sha256 = "0c4vdbklgjrzi6qc5020dvi8x3mayq4li09rrq2w0hcjdljj0yf9";
      };
    };
   ...
  };
```

## Tooling

There are various community projects aimed at facilitating working with Kubernetes combined with Nix:

- [kubernix](https://github.com/saschagrunert/kubernix): simple setup of development clusters using Nix
- [kubenix](https://kubenix.org/): [GitHub (updated 2023)](https://github.com/hall/kubenix)
- [nixos-ha-kubernetes](https://github.com/justinas/nixos-ha-kubernetes)
- [nixhelm](https://github.com/nix-community/nixhelm): generates nix expressions from a selection of helm charts
- [helmfile-nix](https://github.com/reMarkable/helmfile-nix): wrapper around <a href="Helm_and_Helmfile" class="wikilink" title="Helmfile">Helmfile</a> to allow writing helmfiles in the nix language

## References

- [Issue \#39327](https://github.com/NixOS/nixpkgs/issues/39327): Kubernetes support is missing some documentation
- [NixOS Discourse](https://discourse.nixos.org/t/kubernetes-using-multiple-nodes-with-latest-unstable/3936): Using multiple nodes on unstable
- [Kubernetes docs](https://kubernetes.io/docs/home/)
- [NixOS e2e kubernetes tests](https://github.com/NixOS/nixpkgs/tree/master/nixos/tests/kubernetes): Node Joining etc.
- [IRC (2018-09)](https://logs.nix.samueldr.com/nixos-kubernetes/2018-09-07): issues related to DNS
- [IRC (2019-09)](https://logs.nix.samueldr.com/nixos-kubernetes/2019-09-05): discussion about `easyCerts` and general setup

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
