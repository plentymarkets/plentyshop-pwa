# Local dev setup

This section describes how to run the project locally.

## Prerequisites

The project uses Node.js. We recommend using a Node version manager to install Node.

- [fnm](https://github.com/Schniz/fnm)
- [nvm](https://github.com/nvm-sh/nvm)

The installation instructions below don't specify a version to install.
This is because version management is handled via the `.nvmrc` file in the project root.
The default setup uses the latest Node LTS version available.
However, you can pin a version in your project by modifying `.nvmrc`.

::: tabs
== fnm
```bash
# Download and install fnm:
curl -o- https://fnm.vercel.app/install | bash

# Download and install Node.js:
fnm install

# Verify the Node.js version:
node -v

# Verify npm version:
npm -v
```

== nvm
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install

# Verify the Node.js version:
node -v
nvm current # Should print "v22.15.0".

# Verify npm version:
npm -v
```
:::

::: details Windows
Only fnm is supported on Windows.

```PowerShell
# Download and install fnm:
winget install Schniz.fnm

# Download and install Node.js:
fnm install

# Verify the Node.js version:
node -v

# Verify npm version:
npm -v
```
:::

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
