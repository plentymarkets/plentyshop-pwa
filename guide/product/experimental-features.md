# Experimental features

An experimental feature describes functionality that's part of the code, but not available to users yet.
For example, such functionality may not be displayed in a UI or there may be a condition that prevents code execution.

::: warning :warning: Repository forks
In your repository fork or mirror, you may decide to enable experimental features yourself.
However, note that the functionality is likely still in development and may be incomplete or not fully tested.
If you enable an experimental feature, you do so at your own risk.
:::

## New experimental feature

To create a new experimental feature, carry out the following steps:

1. Open [feature-flags.config](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/app/configuration/feature-flags.config.ts).
1. Add a new flag.
   Each flag should use an environment variable to determine whether or not it's active.
   Example: `myFlag: process.env?.MY_FLAG === '1'`
1. Add the flag as a condition to the code you want to guard.
   The flag is accessible via `useRuntimeConfig().public.<myFlag>`.

::: tip :bulb: Opt-in
If you want to allow users to opt in to the feature, create a [site setting](../how-to/editor/site-settings.md) for it.
:::

## Further reading

- [Current experimental features](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/app/configuration/feature-flags.config.ts)
