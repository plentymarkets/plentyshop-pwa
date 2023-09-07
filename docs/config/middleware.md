# Middeware configuration

> Vue Storefront's Server Middleware is an Express.js application that provides a single place for you to connect to the multiple services that you need to run your storefront.
>
> It acts as a layer between your frontend application and the various services that you need to connect to, such as a commerce backend, CMS, or payment gateway.

[Full overview on Vue Storefront](https://docs.vuestorefront.io/middleware)

This repository is set up to connect to a plentysystems demo system by default. To connect to another plentysystems system, you have to update the API endpoint. By providing the URL of another system, you connect to this system instead.

## Setting the API endpoint

Open [`middleware.config.ts`](./apps/server/middleware.config.ts) and adjust the `integrations.plentysystems.configuration.api.url` variable.

```
api: {
    url: process.env.API_ENDPOINT ? `${process.env.API_ENDPOINT}` : 'https://mevofvd5omld.c01-14.plentymarkets.com'
};
```

This example would use `https://mevofvd5omld.c01-14.plentymarkets.com` as endpoint for your local dev environment and your livesystem url for the productive build.

If you want to manually hardcode your api endpoint to a system of you choice you can remove the API_ENDPOINT env and only supply the system url:
```
api: {
    url: 'https://mevofvd5omld.c01-14.plentymarkets.com'
};
```