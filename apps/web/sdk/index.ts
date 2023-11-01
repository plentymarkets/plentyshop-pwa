import { PlentysystemsModuleType, plentysystemsModule, client } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';

// Maintain a reference to the interceptor
let interceptorId: number | null = null;

export const useSdk = () => {
  const config = useRuntimeConfig();
  const { setCsrfHeader } = useCsrf();
  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: `${config.public.apiUrl}/plentysystems`,
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
      if (config.baseURL?.includes('/plentysystems')) {
        if (process.server) {
          if (!config.headers) {
            config.headers = {};
          }

          config.headers.cookie = headers.cookie ?? '';
        }
        else {
          config = setCsrfHeader(config);
        }

      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return initSDK<typeof sdkConfig>(sdkConfig);
};
