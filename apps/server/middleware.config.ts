import dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
  path: path.resolve(__dirname, '../web/.env'),
});

// TEMPORARY (AB#211712): log which client-IP headers reach the middleware. Remove after the investigation.
// Dev systems only. Logs every request header; secret-bearing values are masked.
const MASKED_HEADERS = ['cookie', 'set-cookie', 'authorization', 'x-security-token', 'x-csrf-token'];

const clientIpDebugExtension = {
  name: 'client-ip-debug',
  hooks: (req: any) => {
    const headers = Object.fromEntries(
      Object.entries(req.headers).map(([name, value]) => [name, MASKED_HEADERS.includes(name) ? '[masked]' : value]),
    );
    console.log(
      '[client-ip-debug]',
      JSON.stringify({
        path: req.path,
        socketRemoteAddress: req.socket?.remoteAddress,
        headers,
      }),
    );

    return {};
  },
};

const config = {
  logger: {
    verbosity: process.env.LOG_LEVEL ?? 'info',
  },
  integrations: {
    plentysystems: {
      location: '@plentymarkets/shop-api/server',
      extensions: (extensions: any[]) => [...extensions, clientIpDebugExtension],
      configuration: {
        api: {
          url: process.env.API_ENDPOINT,
          securityToken: process.env.API_SECURITY_TOKEN ?? '',
        },
      },
      errorHandler: (error: any, req: any, res: any) => {
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
