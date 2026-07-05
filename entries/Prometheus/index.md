<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Prometheus -->

**[Prometheus](https://prometheus.io/)** is an open-source event monitoring and alerting application. It records metrics in a time series database built by pulling (also known as *scraping*) metrics from different services, with flexible queries and real-time alerting.

## Prometheus exporters

Prometheus works by scraping from HTTP endpoints, which are often provided by **Prometheus exporters**.

### `node_exporter`

Below is an example of [prometheus node_exporter](https://prometheus.io/docs/guides/node-exporter/) with additional collectors enabled. [`node_exporter` is documented in the NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-prometheus-exporters).

## Usage

The Prometheus service daemon can be enabled and configured by further options.

Another example:

## See also

- <a href="Grafana" class="wikilink" title="Grafana">Grafana</a>, the dashboarding tool often used with Prometheus.
- <a href="Grafana_Loki" class="wikilink" title="Grafana Loki">Grafana Loki</a>, the equivalent of Prometheus for logs.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
