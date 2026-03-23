# Quickstart

This guide will walk you through setting up your development environment for PlentyONE shop.
Your development environment will be a minimum setup.
To access all capabilities of the shop, you need to complete additional setup steps.
For details, refer to the **Next steps** section at the end.

By the end of this guide, you will have:

- A running local shop
- Deployed your first shop inside PlentyONE

Before you begin, you need a PlentyONE system.
If you don't have one yet, you can book a 30-day trial [on our website](https://www.plentyone.com/).

## GitHub setup

First, you'll prepare your code by creating a personal copy of the shop repository.

### Fork

We recommend working with a fork of the [shop repository](https://github.com/plentymarkets/plentyshop-pwa). A fork allows you to easily incorporate updates from this boilerplate into your own codebase.

1. [Create a fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
2. [Clone the forked repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

::: warning :warning: Repository visibility
GitHub forks are always publicly visible.
If you want to maintain a private repository that's still connected to the main project, refer to our [guide on update strategies](../how-to/project-update-strategies.md).
:::

### GitHub PAT

Create a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) with `repo` scope.
You need this token to authenticate your repository in PlentyONE.

## PlentyONE setup

Now that your GitHub repository is ready, you'll connect it to PlentyONE.

### Create shop

1. Log into your PlentyONE system.
1. Go to **Shop » Management**.
1. Click on (:heavy_plus_sign:) **Add shop**.
1. Enter the information according to the table below.
1. Click on **Create**.

| Input              | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| Shop name          | Display name of the shop in PlentyONE                 |
| Select client      | Client to connect to the shop                         |
| Select shop source | GitHub Integration                                    |
| GitHub HTTPS URL   | URL of your repository                                |
| GitHub token       | Your Personal Access Token                            |
| GitHub branch      | Name of the branch you want to deploy, usually `main` |

::: tip :bulb: Edit shop
You can edit shop details by opening the additional actions in the **Actions** column and clicking on :pen: **Edit shop**.
:::

### Retrieve API credentials

1. In the **Actions** column, open the additional actions.
1. Click on :information_source: **Display environment information**.
1. In the **Development environment** section, click on **Copy to clipboard**.

You need the environment information to set up your local development environment.
This information, including your API endpoint and security token, allows your local shop to communicate with your PlentyONE system.

## Local development

### Create environment

1. Open your project.
1. In the `apps/web` directory, create a `.env` file.
1. Paste the environment information into your `.env` file.
1. Add the default language of your shop, for example `DEFAULTLANGUAGE='de'` or `DEFAULTLANGUAGE='en'`.

Your environment file should look like this:

```
# apps/web/.env

API_ENDPOINT='https://my-shop.com'
API_SECURITY_TOKEN='ABC123'
CONFIG_ID='1'
FETCH_REMOTE_CONFIG='0'
DEFAULTLANGUAGE='de'
```

### Install dependencies

The project uses Node.js.
We recommend using the latest LTS version.
Either download it from [Node.js](https://nodejs.org/en/download) or follow the installation instructions below.

::: tabs

== Linux / MacOS

```bash
# Download and install the version manager fnm:
curl -o- https://fnm.vercel.app/install | bash

# Download and install Node.js:
fnm install

# Verify the Node.js version:
node -v

# Verify npm version:
npm -v
```

== Windows

```PowerShell
# Download and install the version manager fnm:
winget install Schniz.fnm

# Download and install Node.js:
fnm install

# Verify the Node.js version:
node -v

# Verify npm version:
npm -v
```

:::

Run the following command in the project's root directory to install all necessary packages:

```bash
npm install
```

### Start the shop

To start the development server run the following command:

```bash
npm run dev
```

The shop will be served with hot reload at [localhost:3000](http://localhost:3000/).

## Deployment

::: warning :warning: SSL Certificate
To build and deploy a PlentyONE shop and to use the shop editor, you need a [valid SSL certificate](https://knowledge.plentyone.com/en-gb/manual/main/business-decisions/ssl-certificate.html).
:::

### Activate preview

This step builds your shop and deploys it to a private preview URL.
This allows you to review your changes and use the shop editor before making the site public.

1. Log into your PlentyONE system.
1. Go to **Shop » Management**.
1. Click on :arrow_forward: **Deploy the shop and activate preview mode**.

The build process downloads your GitHub repository, using the Personal Access Token you provided during setup.
If the build is successful, the shop becomes available on your client's domain in preview mode.

To access the preview and shop editor, click on (:straight_ruler:) **Open editor**.

### Go live

For the go-live option to become available, the shop has to run in preview mode.

1. In the **Actions** column, open the additional actions.
1. Click on :eye_speech_bubble: **Activate live mode**.

## Next steps

Once you have your shop running, you can begin customising it.
Here are a few places to start:

- **Theme customization**: Customize the look and feel [look and feel](/guide/how-to/theme.md) of your shop.
- **Advanced PlentyONE setup**: Complete the [setup journey](https://knowledge.plentymarkets.com/en-gb/manual/main/online-store/shop.html#shop-preparation) in PlentyONE to enable additional payment and shipping providers, bot protection, and more.
- **Project updates**: Learn about [different strategies](/guide/how-to/project-update-strategies.md) for managing updates from the main project.
