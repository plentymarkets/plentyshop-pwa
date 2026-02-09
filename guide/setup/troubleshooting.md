# Troubleshooting

[[toc]]

## Local development

### What debugging tools are available?

For general debugging tools, you should familiarise yourself with the development tools of the frameworks we use:

- [Vue DevTools](https://devtools.vuejs.org/)
- [Nuxt DevTools](https://devtools.nuxt.com/)

To get even more information, you can enable [debug mode](https://nuxt.com/docs/4.x/api/nuxt-config#debug) in `nuxt.config.ts`.

## Deployment

### The installation of production dependencies failed. What can I do about this?

By default, the shop uses the latest LTS version of NodeJS.
You may experience problems when the LTS version changes, for example because `package-lock.json` doesn't match when running `npm ci`.
You have two ways of addressing this issue.

You can either pin a more specific Node version.
To pin a version, [modify](https://github.com/nvm-sh/nvm?tab=readme-ov-file#nvmrc) `.nvmrc`.

If you want to stay on the LTS version, carry out the following steps:

```bash
# Downloads and switches to latest LTS version, may differ depending on how you manage your Node versions
fnm install

# Updates package-lock.json in line with new Node version
npm install
```

New major versions may require other changes as well. Below you can find a reference of adjustments made in the main repository:

- [v22 -> v24](https://github.com/plentymarkets/plentyshop-pwa/pull/1883)

### The build failed. How can I tell what went wrong?

The build in PlentyONE uses the standard app script.
If you `npm run build` locally, you should get the same output.

:::tip :bulb: Automatic build checks
We recommend adjusting the [CI pipeline](https://github.com/plentymarkets/plentyshop-pwa/blob/main/.github/workflows/integration.yml) to your needs, so that every change you make is checked automatically.
:::
