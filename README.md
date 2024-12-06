<div align="center">
  <a href="https://alokai.com//"><img src="https://camo.githubusercontent.com/b3f817d20b7d4f18247de2dbdf89756cd2348208b146f7c182fe6c9b0de39426/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f7675652d73746f726566726f6e742f696d6167652f75706c6f61642f76313731303735343532342f4c6f676f5f677265656e5f32785f7a34766d687a2e706e67" alt="Alokai" height="80px" /></a>

<a href="https://www.plentymarkets.com/"><img src="https://cdn01.plentymarkets.com/avw8j9fg70hi/frontend/plentyShop_LTS/plentysystems-logo.jpg" alt="plentysystems logo" height="160px" /></a>

  <h1 align="center">Alokai Integration With plentysystems</h1>
</div>

[![GitHub Repo stars](https://img.shields.io/github/stars/plentymarkets/plentyshop-pwa?style=social)](https://github.com/plentymarkets/plentyshop-pwa)
[![X Follow](https://img.shields.io/twitter/follow/plentymarkets?style=social)](https://twitter.com/plentymarkets)
[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCauJsvmhbPNp6ii7tCGwxMg?style=social)](https://www.youtube.com/@plentymarkets)
[![Discord](https://img.shields.io/discord/770285988244750366?label=join%20discord&logo=Discord&logoColor=white)](https://discord.vuestorefront.io)

Welcome to the plentysystems integration for Alokai.

## Development setup

This section describes how to run the project locally with the preconfigured demo system.

### Fork repository

We recommend working with a fork of this repository. A fork allows you to easily incorporate updates from this boilerplate into your own codebase.

1. [Create a fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
2. [Clone the forked repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

### Create authentication token

This project queries data from plentysystems by using other NPM packages as middleware. These packages are published on the GitHub registry. To download packages from GitHub's registry, you have to authenticate.

To enable authentication, create a [Personal Access Token](https://github.com/settings/tokens/new) (PAT) with the scope **read:packages**.

### Set up environment

Create an environment file under `apps/web/.env`. The minimum required configuration includes your PAT, the [API endpoint](https://pwa-docs.plentymarkets.com/guide/how-to/middleware#api-endpoint) of your PlentyONE system and the corresponding [API security token](https://pwa-docs.plentymarkets.com/guide/how-to/middleware#api-security-token):

```properties
# apps/web/.env

NPM_AUTH_TOKEN=
API_ENDPOINT=
API_SECURITY_TOKEN=
```

Download Node.js from the [official website](https://nodejs.org/). We recommend using [nvm](https://github.com/nvm-sh/nvm) to easily stay compatible with new versions. Then install all dependencies using Yarn.

```bash
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# downloads and installs Node.js according to the project version in .nvmrc
nvm install

# downloads and installs Yarn according to the project version, and downloads, installs, and builds all dependencies
npm run setup:unix
```

### Start the app

Run `yarn dev` to start the development server. The app will be served with hot reload at [localhost:3000](http://localhost:3000/).

## Resources

### Documentation

- [Developers Documentation](https://pwa-docs.plentymarkets.com/)
- [Technical Overview](GUIDE.md)

### Changelog

[English](./docs/changelog/changelog_en.md) | [German](./docs/changelog/changelog_de.md)

### Features

- [Turborepo](https://turbo.build/) remote cache build system, with blazingly fast execution of commands (build, lint, test etc.) on your local machine.
- [TypeScript](https://www.typescriptlang.org/) support.
- [Nuxt.js 3](https://nuxt.com/) & Server Side Rendering for great UX, loading and SEO scores.
- Beautiful components built with [TailwindCSS](https://tailwindcss.com/) and [Storefront UI](https://docs.storefrontui.io/v2/) - a lightweight, accessible, and customizable component library built for e-commerce.
- Unit tests with [Vitest](https://vitest.dev/) and [Vue Test Utils](https://test-utils.vuejs.org).
- [ESLint](https://eslint.org/) for code linting.
- [Prettier](https://prettier.io/) code formatter.
- [Husky](https://typicode.github.io/husky/) for working with Git hooks efficiently.
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard for commit messages.
- Staged code linting with [lint-staged](https://github.com/okonet/lint-staged).
- [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app) features with [Vite PWA for Nuxt](https://vite-pwa-org.netlify.app/).
- `i18n` localisation powered by [Nuxt-i18n](https://i18n.nuxtjs.org).
- [Alokai SDK](https://docs.vuestorefront.io/sdk/) ready - integrate headless E-commerce platform with your project easily.
- [Alokai Middleware](https://docs.vuestorefront.io/v2/architecture/server-middleware.html).
- Maximized lighthouse score.

### Alokai

- [Introduction to learn what is Alokai](https://docs.vuestorefront.io/v2/getting-started/introduction.html).
- [Alokai Documentation](https://docs.vuestorefront.io/v2/)
- [Storefront UI Documentation](https://docs.storefrontui.io/v2/vue/getting-started.html)
- [Community Chat](http://discord.vuestorefront.io)

## License

Distributed under the MIT License. See [LICENSE](LICENSE.md) for more information.

## Contributing

Please see our [CONTRIBUTING.md](.github/CONTRIBUTING.md) for more information.

## Support

If you have any questions about this integration we will be happy to answer them on the `plentymarkets` channel of the [Alokai Discord](http://discord.vuestorefront.io).
