import dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
  path: path.resolve(__dirname, '../web/.env'),
});

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
        // override the default error handler to preserve the original error response
        // https://docs.alokai.com/middleware/guides/custom-error-handler#customize-the-error-handler
        if (error?.response?.status) {
          res.status(error.response.status).send(error.response?.data);
        } else {
          res.status(500).send(error);
        }
      },
      extensions: (extensions: any) => [
        ...extensions,
        {
          name: 'editor-item-properties',
          extendApiMethods: {
            getEditorItemProperties: async (
              context: any,
              params?: { locale?: string; fallbackLocale?: string },
            ) => {
              const url = `${process.env.API_ENDPOINT}/rest/storefront/editor/item-properties`;
              const { data } = await context.client.get(url, {
                params: {
                  locale: params?.locale ?? 'en',
                  fallbackLocale: params?.fallbackLocale ?? 'en',
                },
              });
              return data;
            },
          },
        },
      ],
    },
  },
};

export default config;
