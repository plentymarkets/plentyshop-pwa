import { createServer } from '@vue-storefront/middleware';
import consola from 'consola';
import config from '../middleware.config';

const useIPV6 = process.env.USE_IPV6 === 'true';

const checkEnvironments = (integrations: any) => {
  if (!integrations.plentysystems.configuration.api.securityToken) {
    consola.warn(
      'API_SECURITY_TOKEN is not set. Please set it in your .env file https://pwa-docs.plentyone.com/guide/how-to/middleware#api-security-token',
    );
  }
  if (!integrations.plentysystems.configuration.api.url) {
    consola.warn(
      'API_ENDPOINT is not set. Please set it in your .env file https://pwa-docs.plentyone.com/guide/how-to/middleware#api-endpoint',
    );
  }
};

const validateApiUrl = (url: string | undefined): string | undefined => {
  return url?.replace(/[/\\]+$/, '');
};

(async () => {
  const app = await createServer(
    { integrations: config.integrations },
    {
      cors: {
        credentials: true,
        origin: validateApiUrl(process.env.API_URL) ?? 'http://localhost:3000',
      },
      bodyParser: {
        limit: '50mb',
      },
      fileUpload: {
        enabled: true,
        maxFileSize: 14_155_776,
        maxFiles: 5,
      },
    },
  );

  const host = useIPV6 ? '::' : '0.0.0.0';
  const port = Number(process.argv[3]) || 8181;

  checkEnvironments(config.integrations);

  const server = app.listen(port, host, () => {
    consola.success(`API server listening on http://${host}:${port}`);

    if (process.send) {
      process.send('ready');
    }

    const used = process.memoryUsage();
    consola.info(
      `Memory: RSS=${Math.round(used.rss / 1024 / 1024)}MB, Heap=${Math.round(used.heapUsed / 1024 / 1024)}MB/${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    );
  });

  const connections = new Set();
  server.on('connection', (conn) => {
    connections.add(conn);
    conn.on('close', () => connections.delete(conn));
  });

  const gracefulShutdown = (signal: string) => {
    consola.info(`[${signal}] Received shutdown signal. Active connections: ${connections.size}`);

    server.close(() => {
      consola.success('HTTP server closed successfully');

      const used = process.memoryUsage();
      consola.info(
        `Final memory: RSS=${Math.round(used.rss / 1024 / 1024)}MB, Heap=${Math.round(used.heapUsed / 1024 / 1024)}MB`,
      );

      process.exit(0);
    });

    setTimeout(() => {
      consola.warn('Forcing shutdown of remaining connections');
      connections.forEach((conn: any) => conn.destroy());
      process.exit(1);
    }, 9000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    consola.error('Uncaught Exception:', error);
    const used = process.memoryUsage();
    consola.error(
      `Memory at crash: RSS=${Math.round(used.rss / 1024 / 1024)}MB, Heap=${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    );
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    consola.error('Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
  });

  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      const used = process.memoryUsage();
      const heapMB = Math.round(used.heapUsed / 1024 / 1024);
      const rssMB = Math.round(used.rss / 1024 / 1024);

      if (heapMB > 1500 || rssMB > 1700) {
        consola.warn(`High memory usage: RSS=${rssMB}MB, Heap=${heapMB}MB - restart imminent`);
      }
    }, 30000);
  }
})();
