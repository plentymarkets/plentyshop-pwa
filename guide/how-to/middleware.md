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

## References

- [Vue Storefront: Middleware](https://docs.vuestorefront.io/middleware)