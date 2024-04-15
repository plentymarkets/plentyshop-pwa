# Deployment

This guide describes how to deploy your app on your live domain. The setup consists of three parts.

1. Register the app in your plentysystems system. Registering the app generates authentication credentials.
2. Add the credentials to your GitHub repository.
3. Upload the app to plentysystems.

The following sections describe the steps in detail.

## plentysystems system

1. Log into your plentysystems system.
2. Go to **CMS » Deployment**.
3. Click on :heavy_plus_sign: to add a new application.
4. Fill in the required information.
5. **Create** the application.

Creating the application adds a new table entry. In the next part, you'll need the **Access key**.

## GitHub

### Authentication

1. Go to your repository.
2. Go to **Settings**.
3. In the **Security** section, go to **Secrets and variables » Actions**.
4. Click on **New repository secret**.
5. Fill in the information according to the table below.

| Name      | Value |
| ----------- | ----------- |
| `URL_ENDPOINT_TOKEN` | **Access key** |

### System URL

1. Go to your repository.
2. Go to **Settings**.
3. In the **Security** section, go to **Secrets and variables » Actions**.
4. Open the **Variables** tab.
5. Click on **New repository variable**.
6. Fill in the information according to the table below.

| Name      | Value |
| ----------- | ----------- |
| `API_URL` | Your shop domain |

### API security token

1. Go to your repository.
2. Go to **Settings**.
3. In the **Security** section, go to **Secrets and variables » Actions**.
4. Open the **Variables** tab.
5. Click on **New repository variable**.
6. Fill in the information according to the table below.

| Name      | Value |
| ----------- | ----------- |
| `API_SECURITY_TOKEN` | Your secret api token |

For additional details, refer to the following guide:

* [Middleware](/guide/how-to/middleware.md)


### Config

When running the shop locally, the app utilises values from `apps/web/.env` to enable features and settings, which are then read by the Nuxt configuration.
Since we're ignoring .env files on deployment, the values from apps/web/.env need to be provided as an Action GitHub variable `CONFIG`  to be used in the upload action.

1. Go to your repository.
2. Go to **Settings**.
3. In the **Security** section, go to **Secrets and variables » Actions**.
4. Open the **Variables** tab.
5. Click on **New repository variable**.
6. Fill in the information from your apps/web/.env file based on [apps/web/.env.example](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/.env.example), example in the table below.

[supported config values](https://github.com/plentymarkets/plentyshop-pwa/blob/main/apps/web/.env.example)

| Name      | Value |
| ----------- | ----------- |
| `Config`  | CLOUDFLARE_TURNSTILE_SITE_KEY="0x4AAAAAAANx3aXDh7UR35x0" <br> NEWSLETTER_FORM_SHOW_NAMES=1 <br> USE_WEBP=0 <br> VALIDATE_RETURN_REASONS=1 |



### Upload

In your forked repository, enable the GitHub Action `Deploy PWA` from `upload.yml`. Update the trigger conditions to determine when to upload your repository to your plentysystems system.

To deploy a preview to your plentysystems system, carry out the following steps:

1. Go to your repository.
2. Go to **Actions**.
3. In the **All workflows** sections, click on **Deploy PWA**.
4. Open the **Run workflow** drop-down menu.
5. In the field **The tag version, branch name or SHA to checkout**, enter the name of the branch you want to deploy.
6. Click on **Run workflow**.

The workflow takes several minutes to complete. You can monitor the progress in the **Actions** menu.

## Activation

1. Log into your plentysystems system.
2. Go to **CMS » Deployment**.
3. For the configured domain, open the further actions menu (three dots).
4. Click on **Activate application**.

The activation makes the application reachable on the configured domain.
It can take up to 1 hour for the changes to take effect.


## Preview

1. Log into your plentysystems system.
2. Go to **CMS » Deployment**.
3. Click on the **URL** of the app you want to preview.

## References

- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)
- [Repository Variables](https://docs.github.com/en/actions/learn-github-actions/variables#creating-configuration-variables-for-a-repository)
- [Events that Trigger GitHub Workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [Manually Running a Workflow](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow)
