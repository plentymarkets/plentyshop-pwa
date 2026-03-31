# Custom API Endpoints

Extend the middleware with custom API endpoints to implement additional functionality beyond the default shop API methods. This is useful when creating a plugin within PlentyONE that provides REST routes.

## Adding a custom endpoint

Custom endpoints are defined in the middleware configuration file using the `extensions` property. Each extension can add one or more API methods.

### Configuration

Add your custom endpoint in `apps/server/middleware.config.ts`:

```typescript
// apps/server/middleware.config.ts

const config = {
  logger: {
    verbosity: process.env.LOG_LEVEL ?? 'info',
  },
  integrations: {
    plentysystems: {
      location: '@plentymarkets/shop-api/server',
      configuration: {
        api: {
          url: process.env.API_ENDPOINT,
          securityToken: process.env.API_SECURITY_TOKEN ?? '',
        },
      },
      errorHandler: (error: any, req: any, res: any) => {
        if (error?.response?.status) {
          res.status(error.response.status).send(error.response?.data);
        } else {
          res.status(500).send(error);
        }
      },
      extensions: (extensions: any) => [
        ...extensions,
        {
          name: 'example-extension',
          extendApiMethods: {
            customMethod: async (context: any) => {
              const url = `${process.env.API_ENDPOINT}/rest/myplugin/data`;
              const { data } = await context.client.get(url);
              return data;
            },
          },
        },
      ],
    },
  },
};
```

::: info
The `context` parameter provides access to the HTTP client with pre-configured session and cookie headers.
:::

## Calling custom methods

Use the `useSdk()` composable to invoke custom API methods from your components. Extend the `Endpoints` interface to include type definitions for your custom methods.

### Type definitions

To enable TypeScript support for your custom methods, extend the `Endpoints` interface:

```typescript
interface CustomEndpoints extends Endpoints {
  customMethod: () => Promise<any>;
}

const customMethod = async () => {
  const sdk = useSdk().plentysystems as CustomEndpoints;
  const data = await sdk.customMethod();
  console.log(data);
};
```

::: warning
The method name in `extendApiMethods` must match the method name used in the SDK call.
:::

## References

- [Alokai: Middleware Extensions](https://docs.alokai.com/middleware/legacy/guides/extensions#adding-an-endpoint)
