import dotenv from 'dotenv';
import * as path from 'path';
import * as https from 'https';
import consola from "consola";
dotenv.config({
  path: path.resolve(__dirname, '../web/.env'),
});

const tlsAgent = new https.Agent({
  // Use a protocol known to be widely supported by older enterprise systems
  minVersion: 'TLSv1.2',

  // Set SECLEVEL=0 to allow all ciphers, just in case the prior env var failed due to syntax
  // and we need to be absolutely permissive here.
  ciphers: 'DEFAULT@SECLEVEL=0',
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
          debug: true,
          httpsAgent: tlsAgent
        },
      },
      errorHandler: (error: any, req: any, res: any) => {
        // override the default error handler to preserve the original error response
        // https://docs.alokai.com/middleware/guides/custom-error-handler#customize-the-error-handler
        consola.log('error calling API');
        consola.log(error);
        if (error?.response?.status) {
          res.status(error.response.status).send(error.response?.data);
        } else {
          res.status(500).send(error);
        }
      },
    },
  },
};

export default config;
