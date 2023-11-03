import { PlentysystemsModuleType, plentysystemsModule, client } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';

// Maintain a reference to the interceptor
let interceptorId: number | null = null;

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useSdk = () => {
  const { ssrLocale } = useInitialSetup();
  const config = useRuntimeConfig();
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
      if (process.server && config.baseURL?.includes('/plentysystems')) {
        if (!config.headers) {
          config.headers = {};
        }

        if (ssrLocale.value) {
          headers.cookie = headers.cookie?.includes('vsf-locale')
            ? headers.cookie.replace(/vsf-locale=[A-Za-z-]+;/, `vsf-locale=${ssrLocale.value};`)
            : `${headers.cookie ?? ''} vsf-locale=${ssrLocale.value};`;
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
