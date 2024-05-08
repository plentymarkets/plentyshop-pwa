import { createServer } from '@vue-storefront/middleware';
import consola from 'consola';
import cors from 'cors';
import config from '../middleware.config';
import * as express from 'express';

const useIPV6 = process.env.USE_IPV6 === 'true';

(async () => {
  const app = await createServer({ integrations: config.integrations });
  const host = useIPV6 ? '::' : '0.0.0.0';
  const port = Number(process.argv[3]) || 8181;
  const CORS_MIDDLEWARE_NAME = 'corsMiddleware';

  const corsMiddleware = app._router.stack.find((middleware: any) => middleware.name === CORS_MIDDLEWARE_NAME);

  corsMiddleware.handle = cors({
    origin: ['http://localhost:3000', ...(process.env.MIDDLEWARE_ALLOWED_ORIGINS?.split(',') ?? [])],
    credentials: true,
  });

  const jsonMiddleware = app._router.stack.find((layer: any) => layer.name === 'jsonParser');
  if (jsonMiddleware) {
    jsonMiddleware.handle = express.json({ limit: '13.5mb' }); // 13,3mb for 10mb upload file
  }

  app.listen(port, host, () => {
    consola.success(`API server listening on http://${host}:${port}`);
  });
})();
