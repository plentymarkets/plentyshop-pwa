import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../web/.env'),
});

const config = {
  integrations: {
    plentysystems: {
      location: '@plentymarkets/shop-api/server',
      configuration: {
        api: {
          url: process.env.API_ENDPOINT,
          securityToken: process.env.API_SECURITY_TOKEN ?? '',
        },
      },
      errorHandler: ((error: any, req: any, res: any) => {
        // override the default error handler to preserve the original error response
        res.status(error.response.status).send(error.response.data);
      })
    },
  },
};

export default config;
