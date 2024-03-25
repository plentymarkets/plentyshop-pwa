import { createServer } from '@vue-storefront/middleware';
import consola from 'consola';
import cors from 'cors';
import config from '../middleware.config';
import * as express from 'express';
import { EventEmitter } from 'events';

// eslint-disable-next-line max-statements
(async () => {
  const app = await createServer({ integrations: config.integrations });
  const host = process.argv[2] ?? '0.0.0.0';
  const port = Number(process.argv[3]) || 8181;
  const CORS_MIDDLEWARE_NAME = 'corsMiddleware';
  const eventEmitter = new EventEmitter();

  const corsMiddleware = app._router.stack.find((middleware: any) => middleware.name === CORS_MIDDLEWARE_NAME);

  corsMiddleware.handle = cors({
    origin: ['http://localhost:3000', ...(process.env.MIDDLEWARE_ALLOWED_ORIGINS?.split(',') ?? [])],
    credentials: true,
  });

  const jsonMiddleware = app._router.stack.find((layer: any) => layer.name === 'jsonParser');
  if (jsonMiddleware) {
    jsonMiddleware.handle = express.json({ limit: '13.5mb' }); // 13,3mb for 10mb upload file
  }

  const allRequests = app._router.stack.find((layer: any) => layer.name.length > 0);
  if (allRequests) {
    allRequests.handle = (req: any, res: any, next: any) => {
      eventEmitter.emit('request', req, res);
      next();
    };
  }

  eventEmitter.on('request', (req: any, res: any) => {
    consola.log('request:', req?.headers?.host, req?.originalUrl);
    consola.log(res);
  });

  app.listen(port, host, async () => {
    consola.success(`API server listening on http://${host}:${port}`);
    eventEmitter.emit('request', null, null);
  });
})();
