# Middeware configuration / set api endpoint

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