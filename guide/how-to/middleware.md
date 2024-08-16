# Middleware configuration

The middleware is an Express.js server. The server connects the web app and plentysystems system. To connect to a system, you have to provide the API endpoint. Additionally, you have add a security token for authentication.

::: info
In the local development environment, the app connects to the provided URL. In production, it connects to the system that hosts the app.
:::

## Environment file

Create a `.env` file in the `apps/web` directory.

## Endpoint information

To access the environment information of your system, carry out the following steps:

1. Log into your plentysystems system.
1. Go to **CMS » Deployment**.
1. Copy (:clipboard:) the environment information to your clipboard.
1. Paste the environment information into your `.env` file.

::: tip
To view detailed environment information in plentysystems, go to **CMS » Deployment**, open the further actions menu and click on :information_source: **View environment information**.
:::

For additional details, refer to the following guide:

* [Deployment](/guide/setup/deployment.md)

## References

- [Alokai: Middleware](https://docs.alokai.com/middleware)
