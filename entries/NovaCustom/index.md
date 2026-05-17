<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NovaCustom -->

[NovaCustom](https://novacustom.com/) is a Dutch based Systems Integrator, notable for their sale of privacy focused laptops and NUC boxes.

Their primary selling point is customization, ease of repair, and privacy conscious offerings.

Their offerings include both 14 and 16 inch whitebook based builds with options for Nvidia dGPU or Intel based iGPU configurations.

## Laptops - Hardware Configuration

### V540 Series

The V540 series consists of two offerings, the iGPU based Intel 155H offering, and the dGPU based Nvidia RTX 4060/4070 based models.

For a list of known issues with Dasharo see [the Dasharo issue tracker](https://github.com/Dasharo/dasharo-issues/issues?q=is%3Aissue%20state%3Aopen%20label%3Anovacustom_v54_mtl).

##### V540TNx (Nvidia RTX 4060/4070)

The current latest release of the Dasharo (coreboot+UEFI) firmware [supporting V540TNx is v0.9.1](https://docs.dasharo.com/variants/novacustom_v540tnx/releases/), although a v1.0 is expected in Q4 2025.

###### spd5118 Issues

The [spd5118 driver](https://docs.kernel.org/hwmon/spd5118.html) responsible for RAM temperature sensors is known to be problematic. E.g. lm_sensors will report it as failing. Likewise, there are reports of [48GB SODIMMS overheating](https://github.com/Dasharo/dasharo-issues/issues/1125).

To workaround potential issues, a temporary solution until upstream Dasharo solves the problem is to blacklist the spd5118 kernel module:

``` nixos
boot.blacklistedKernelModules = [
  # The `spd5118` drivers attempts to write configuration data casues the
  # `i801_smbus` controller to lock the RAM's SPD memory as a write-protect
  # safety feature. This creates a conflict, causing the `spd5118` driver to
  # fail and flood dmesg with non-critical errors.
  #
  # The driver offers no read-only mode. Therefore, blacklisting the module is
  # a potential temporary solution to avoid logspam.
  "spd5118"
];
```

##### Nvidia i2c bus issues

Because of the other I2C bus instability issues, an issue has been observed, specially with RTX 4070 dGPUs where the kernel reports the dGPU "failling off the bus" with lines such as `kernel: nvidia-modeset: ERROR: GPU:0: Error while waiting for GPU progress:`

One theory for this failure is issues with the Dasharo i2c/smbus firmware code. A potential soluton is to disable the nvidia gpu's i2c timeout trigger.

``` nixos
boot.blacklistedKernelModules = [ "i2c_nvidia_gpu" ];
```

Notice that this can disable thermal reading or fan control, but has been observed as stabilizing dGPU based systems.

### V560 Series
