import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({
  path: path.resolve(__dirname, '../web/.env'),
});

const errorLogPath = path.resolve(__dirname, 'error-log.json');

const storeError = (error: any) => {
  const errorData = {
    message: error.message,
    stack: error.response.data,
    timestamp: new Date().toISOString(),
  };

  let errors = [];
  if (fs.existsSync(errorLogPath)) {
    const fileContent = fs.readFileSync(errorLogPath, 'utf-8');
    errors = JSON.parse(fileContent);
  }

  errors.push(errorData);

  fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2));
};

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
        storeError(error);

        // override the default error handler to preserve the original error response
        // https://docs.alokai.com/middleware/guides/custom-error-handler#customize-the-error-handler
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