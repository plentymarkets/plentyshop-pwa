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
        maxFileSize: 14_155_776, // 13,3mb for 10mb upload file
        maxFiles: 5,
      },
    },
  );

  const host = useIPV6 ? '::' : '0.0.0.0';
  const port = Number(process.argv[3]) || 8181;

  checkEnvironments(config.integrations);

  app.listen(port, host, () => {
    consola.success(`API server listening on http://${host}:${port}`);
  });
})();
