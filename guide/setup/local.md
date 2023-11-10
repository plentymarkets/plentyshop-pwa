# Local dev setup

This section describes how to run the project locally.

## Prerequisites

- `Node.js` 20+
- `Yarn` 3
- [Personal Access Token](https://github.com/settings/tokens/new) with the scope **read:packages**

Download Node.js from the [official website](https://nodejs.org/) or use [nvm](https://github.com/nvm-sh/nvm) to switch to a compatible version. For installation instructions for Yarn, refer to the [Yarn documentation](https://yarnpkg.com/getting-started/install).

## Repository fork

We recommend working with a fork of this repository. A fork allows you to easily incorporate updates from this boilerplate into your own codebase.

1. [Create a fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
2. [Clone the forked repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

## Configuration

Follow the links below for configuration instructions.

- [Middleware](./docs/config/middleware.md) (required)
- [I18N](./docs/config/i18n.md) (required)
- [PWA](./docs/config/pwa.md) (optional)
- [Theme](./docs/config/theme.md) (optional)
- [Cookies](./docs/config/cookies.md) (optional)

## Authentication

This project queries data from plentysystems by using other NPM packages as middleware. These packages are published on the GitHub registry. To download packages from GitHub's registry, you have to authenticate. To enable authentication, carry out the following steps:

1. In the root directory, create a new file called `.yarnrc.yml`.
2. Copy the contents of `.yarnrc.yml.example` to `.yarnrc.yml`.
3. In `.yarnrc.yml`, replace `<TOKEN>` with the Personal Access Token you created earlier.

Git doesn't track `.yarnrc.yml`, so you don't have to worry about exposing your token.

## Starting the app

1. Open the repository in your command line interface.
2. Run `yarn` to install all dependencies.
3. Run `yarn dev` to start the development server. The app will be served with hot reload at [localhost:3000](http://localhost:3000/).
