# Local dev setup

This section describes how to run the project locally.

## Prerequisites

- `Node.js` 20+
- [Personal Access Token](https://github.com/settings/tokens/new) with the scope **read:packages**

Download Node.js from the [official website](https://nodejs.org/) and use [nvm](https://github.com/nvm-sh/nvm) to switch to a compatible version.

## Repository fork

We recommend working with a fork of the [app repository](https://github.com/plentymarkets/plentyshop-pwa). A fork allows you to easily incorporate updates from this boilerplate into your own codebase.

1. [Create a fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
2. [Clone the forked repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

## Authentication

### PlentyONE system

1. Add your [API endpoint](/guide/how-to/middleware#api-endpoint)
2. Add your [API security token](/guide/how-to/middleware#api-security-token)

## Starting the app

1. Open the repository in your command line interface.
2. Run `npm install` to install all dependencies.
3. Run `npm run dev` to start the development server. The app will be served with hot reload at [localhost:3000](http://localhost:3000/).

## Custom configuration

By default, the app connects to a demo shop. The demo shop uses English as the default locale and German as a second locale. To connect to your own PlentyONE system, you have to update the API endpoint in the middleware and match the locale configuration in system and app.

For details, refer to the following guides:

* [Middleware](/guide/how-to/middleware.md)
* [Locales](/guide/how-to/i18n.md)
