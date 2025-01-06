import { createServer } from '@vue-storefront/middleware';
import consola from 'consola';
import config from '../middleware.config';

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

(async () => {
  const app = await createServer(
    { integrations: config.integrations },
    {
      // CORS configuration
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      // Body parser configuration
      bodyParser: {
        limit: '50mb',
      },
      fileUpload: {
        enabled: true, // Enable/disable file upload functionality
        maxFileSize: 14_155_776, //// 13,3mb for 10mb upload file
        maxFiles: 5, // Maximum number of files per upload
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
