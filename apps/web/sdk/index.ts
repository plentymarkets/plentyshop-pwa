import { PlentysystemsModuleType, plentysystemsModule, client } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';

// Maintain a reference to the interceptor
let interceptorId: number | null = null;

export const useSdk = () => {
  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: process.env.API_ENDPOINT
        ? `${process.env.API_ENDPOINT}/plentysystems`
        : 'http://localhost:8181/plentysystems',
    }),
  };

  const headers = useRequestHeaders(['cookie']);

  // If an interceptor is already set, eject it to remove it
  // this prevents headers being shared across instances
  if (interceptorId !== null) {
    client.interceptors.request.eject(interceptorId);
  }

  // Add cookie header to every request that is called during the ssr render process.
  // This ensures that the session is established and other required cookies are sent to the server.
  interceptorId = client.interceptors.request.use(
    (config) => {
      if (process.server) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.cookie = headers.cookie ?? '';
      }

      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    },
  );

  return initSDK<typeof sdkConfig>(sdkConfig);
};
