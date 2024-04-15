# Middeware configuration

The middleware is an Express.js server. The server connects the web app and plentysystems system.

By default, the app connects to a demo system. To connect to your own plentysystems system, you have to update the API endpoint. By providing the URL of another system, you connect to this system instead.

## API endpoint

To update the API endpoint, create a `.env` file in the `apps/web` directory with the following content:

```
API_ENDPOINT=https://mevofvd5omld.c01-14.plentymarkets.com
```

Replace the URL with the shop domain of your plentyShop.

::: info
In the local development environment, the app connects to the provided URL. In production, it connects to the plentysystems system that hosts the app.
:::

## API security token

To be able to use the API endpoint generated above, an additional key must be added in the same `.env` file from `apps/web` directory:

```
API_SECURITY_TOKEN=Your-secret-api-token
```

Find your token and replace the generic key value by using the following guide:

1. Log into your plentysystems system.
2. Go to **CMS » Deployment**.
3. Copy `PWA Security Token`

For additional details, refer to the following guide:

* [Deployment](/guide/setup/deployment.md)



## References

- [Alokai: Middleware](https://docs.alokai.com/middleware)