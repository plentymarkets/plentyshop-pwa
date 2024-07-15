# plentysystems system setup

::: info
To establish a local connection between the PWA and your plentysystem system, kindly reach out to us via the [forum](https://forum.plentymarkets.com/t/plentyshop-pwa-release/736055). Your PID is necessary for assistance.
:::

To run this project, you need a plentysystems system. Get a free 30-day trial [on our website](https://www.plentymarkets.com/) or choose one of the [available editions](https://www.plentymarkets.com/product/pricing/).

## Plugins

> :bulb: New systems ship with the required plugins pre-installed. If you use a new system, skip to the next step.

For plentyShop PWA to run, you have to install plugins that provide additional REST routes and providers. Carry out the following steps:

1. Log into your plentysystems system.
2. [Install](https://knowledge.plentymarkets.com/en-gb/manual/main/plugins/installing-added-plugins.html#installing-plugins) the following plugins in the latest version:
    - IO
    - plentyShop LTS
    - Customer feedback
    - PayPal
3. Set the priorities of the plugins, so that IO has the highest priority and plentyShop LTS the second highest. The priority of all other plugins remains 0.

Optionally, install additional plugins to add more payment or shipping providers to your shop.

::: details Available payment providers
- [Cash in advance](https://marketplace.plentymarkets.com/prepayment_4758)
- [Pay upon pickup](https://marketplace.plentymarkets.com/payuponpickup_4757)
:::

::: details Available shipping providers
- [DHL Shipping](https://marketplace.plentymarkets.com/dhlshipping_4871)
- [GLS Shipping](https://marketplace.plentymarkets.com/en/glsshipping_6463)
:::

::: info
:notebook: In the future, a number of plugins will become core integrations. This means the functionality will be available without installing the plugin.
:::

## System configuration

1. Log into your plentysystems system.
2. Go to **Setup » Guided Tours** and complete **Setting up plentyShop**.
3. Go to **Setup » Orders » Payment » PayPal** and set up your PayPal account.
