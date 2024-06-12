import { createServer } from '@vue-storefront/middleware';
import consola from 'consola';
import cors from 'cors';
import config from '../middleware.config';
import * as express from 'express';

const useIPV6 = process.env.USE_IPV6 === 'true';

const checkEnvironments = (integrations: any) => {
  if (!integrations.plentysystems.configuration.api.securityToken) {
    consola.warn(
      'API_SECURITY_TOKEN is not set. Please set it in your .env file https://pwa-docs.plentymarkets.com/guide/how-to/middleware#api-security-token',
    );
  }
  if (!integrations.plentysystems.configuration.api.url) {
    consola.warn(
      'API_ENDPOINT is not set. Please set it in your .env file https://pwa-docs.plentymarkets.com/guide/how-to/middleware#api-endpoint',
    );
  }
};

const setCorsMiddleware = (app: any) => {
  const CORS_MIDDLEWARE_NAME = 'corsMiddleware';
  const corsMiddleware = app._router.stack.find((middleware: any) => middleware.name === CORS_MIDDLEWARE_NAME);
  corsMiddleware.handle = cors({
    origin: ['http://localhost:3000', ...(process.env.MIDDLEWARE_ALLOWED_ORIGINS?.split(',') ?? [])],
    credentials: true,
  });
};

const setJsonMiddleware = (app: any) => {
  const jsonMiddleware = app._router.stack.find((layer: any) => layer.name === 'jsonParser');
  if (jsonMiddleware) {
    jsonMiddleware.handle = express.json({ limit: '13.5mb' }); // 13,3mb for 10mb upload file
  }
};

(async () => {
  const app = await createServer({ integrations: config.integrations });
  const host = useIPV6 ? '::' : '0.0.0.0';
  const port = Number(process.argv[3]) || 8181;

  setCorsMiddleware(app);
  setJsonMiddleware(app);
  checkEnvironments(config.integrations);

  app.listen(port, host, () => {
    consola.success(`API server listening on http://${host}:${port}`);
  });
})();
