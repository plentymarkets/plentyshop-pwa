import { createServer } from '@vue-storefront/middleware';
import consola from 'consola';
import cors from 'cors';
import config from '../middleware.config';

(async () => {
  const app = await createServer({ integrations: config.integrations });
  const host = process.argv[2] ?? '0.0.0.0';
  const port = Number(process.argv[3]) || 8181;
  const CORS_MIDDLEWARE_NAME = 'corsMiddleware';

  const corsMiddleware = app._router.stack.find((middleware: any) => middleware.name === CORS_MIDDLEWARE_NAME);

  corsMiddleware.handle = cors({
    origin: ['http://localhost:3000', 'https://fcsgmt0e4z97.c14-01.plentymarkets.com',  ...(process.env.MIDDLEWARE_ALLOWED_ORIGINS?.split(',') ?? [])],
    credentials: true,
  });

  app.listen(port, host, () => {
    consola.success(`API server listening on http://${host}:${port}`);
  });
})();
