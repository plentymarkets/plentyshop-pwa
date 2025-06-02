---
prev: false
next: false
---
# Google Analytics
This module allows you to integrate Google Analytics into your shop. Starting from version **v1.10.0**, it comes pre-installed. Be sure that the `@plentymarkets/shop-gtag-module` package exists in your `apps/web/package.json`. If you're using an earlier version or the package isn't part of your `apps/web/package.json`, you can install it manually with:
```bash
npm install @plentymarkets/shop-gtag-module
```
Make sure to add this module at the top of the `modules` section in your `nuxt.config.ts` file. Once installed, you only need to configure the settings in the backend.

:::info
When using Google Analytics, you are obliged to inform visitors about the type of use of the data. We would like to point out that when using services that transfer personal data to a third country (e.g. USA), the conditions for permissible data transfer according to Art. 44 ff GDPR must be met. This is the case, for example, when Google Analytics is used.
:::

## Settings
You can manage Google Analytics settings in the backend, go to:

**Shop » Management** → Select your application → Click on **Settings**.

In the left sidebar, navigate to the **SEO** tab, where you'll find the Google Analytics settings.

- **Enable Google Analytics** – Activate or deactivate Google Analytics for your shop.
- **Tracking ID** – Enter your Google Analytics Tracking ID (e.g., `UA-12345678-9`). Without this, tracking won't work.
- **Send Gross Prices** – Choose whether to send gross prices to Google Analytics (default is net prices).
- **Cookie Group** – Assign a cookie group for Google Analytics. We recommend using the Marketing group.
- **Register Cookie as Opt-Out** – Mark the Google Analytics cookie as an opt-out option. (*Only available if the cookie group is not set to `Necessary`.*)

## How it works
Once enabled, properly configured, and the user granted consent, the module automatically tracks events.

## Tracked Events
By default, the module collects [automatically tracked events](https://support.google.com/analytics/answer/9234069?hl=en). Additionally, it includes the following [recommended events](https://support.google.com/analytics/answer/9267735?hl=en):

- purchase
- add_to_cart
- remove_from_cart
- begin_checkout
- add_to_wishlist
- sign_up
- login
- search