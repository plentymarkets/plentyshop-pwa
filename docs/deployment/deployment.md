# Deployment

This guide describes how to deploy your app on your live domain. The setup consists of two parts.

1. Register the app in your plentysystems system. Registering the app generates authentication credentials.
2. Add the credentials to your GitHub repository.
3. Upload the app to plentysystems.

The following sections describe the steps in detail.

## plentysystems system

1. Log into your plentysystems system.
2. Go to **CMS » Deployment**.
3. Click on :plus: to add a new application.
4. Fill in the required information.
5. **Create** the application.

Creating the application adds a new table entry. In the next part, you'll need the following values:

- **Access key**
- **Upload Endpoint**

## GitHub

### Authentication

1. Go to your repository.
2. Go to **Settings**.
3. In the **Security** section, go to **Secrets and variables » Actions**.
4. Click on **New repository secret**.
5. Fill in the information according to the table below.
6. Repeat steps 4-5 for the second secret.

| Name                 | Value               |
| -------------------- | ------------------- |
| `URL_ENDPOINT`       | **Upload Endpoint** |
| `URL_ENDPOINT_TOKEN` | **Access key**      |

### System URL

1. Go to your repository.
2. Go to **Settings**.
3. In the **Security** section, go to **Secrets and variables » Actions**.
4. Open the **Variables** tab.
5. Click on **New repository variable**.
6. Fill in the information according to the table below.

| Name      | Value            |
| --------- | ---------------- |
| `API_URL` | Your shop domain |

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
