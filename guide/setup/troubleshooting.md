# Troubleshooting

[[toc]]

## Local development

### What debugging tools are available?

For general debugging tools, you should familiarise yourself with the development tools of the frameworks we use:

* [Vue DevTools](https://devtools.vuejs.org/)
* [Nuxt DevTools](https://devtools.nuxt.com/)

To get even more information, you can enable [debug mode](https://nuxt.com/docs/4.x/api/nuxt-config#debug) in `nuxt.config.ts`.

## Deployment

### The build failed. How can I tell what went wrong?

The build in PlentyONE uses the standard application script.
If you `npm run build` locally, you should get the same output.

:::tip :bulb: Automatic build checks
We recommend adjusting the [CI pipeline](https://github.com/plentymarkets/plentyshop-pwa/blob/main/.github/workflows/integration.yml) to your needs, so that every change you make is checked automatically.
:::
