import { PlentysystemsModuleType, plentysystemsModule, client } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';

// Maintain a reference to the interceptor
let interceptorIdReq: number | null = null;
let interceptorIdRes: number | null = null;

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useSdk = () => {
  const config = useRuntimeConfig();
  const { ssrLocale } = useInitialSetup();
  const { token } = useCsrfToken();
  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: `${config.public.apiUrl}/plentysystems`,
    }),
  };

  const headers = useRequestHeaders(['cookie', 'x-csrf-token']);

  // If an interceptor is already set, eject it to remove it
  // this prevents headers being shared across instances
  if (interceptorIdReq !== null) {
    client.interceptors.request.eject(interceptorIdReq);
  }

  if (interceptorIdRes !== null) {
    client.interceptors.response.eject(interceptorIdRes);
  }

  interceptorIdRes = client.interceptors.response.use((response) => {
    console.log('FGE', response.headers);
    if (response.headers['x-csrf-token'] && response.headers['x-csrf-token'].length > 0) {
      token.value = response.headers['x-csrf-token'];
    }
    return response;
  });

  // Add cookie header to every request that is called during the ssr render process.
  // This ensures that the session is established and other required cookies are sent to the server.
  interceptorIdReq = client.interceptors.request.use(
    (config) => {
      if (config.baseURL?.includes('/plentysystems')) {
        if (!config.headers) {
          config.headers = {};
        }

        if (process.server) {
          if (ssrLocale.value) {
            headers.cookie = headers.cookie?.includes('vsf-locale')
              ? headers.cookie.replaceAll(/vsf-locale=[^;]+/g, `vsf-locale=${ssrLocale.value}`)
              : `${headers.cookie ?? ''};vsf-locale=${ssrLocale.value};`;
          }

          config.headers.cookie = headers.cookie ?? '';
        }

        if (token.value) {
          config.headers['x-csrf-token'] = token.value;
        }
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
