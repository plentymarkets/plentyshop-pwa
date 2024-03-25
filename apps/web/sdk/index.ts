import { type PlentysystemsModuleType, plentysystemsModule, client } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';
import type { AxiosRequestHeaders } from 'axios';

// Maintain a reference to the interceptor
let interceptorIdRequest: number | null = null;
let interceptorIdResponse: number | null = null;

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useSdk = () => {
  const config = useRuntimeConfig();
  const { ssrLocale } = useInitialSetup();
  const { token } = useCsrfToken();
  const sdkConfig = {
    // @ts-ignore
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: `${config.public.apiUrl}/plentysystems`,
    }),
  };

  const headers = useRequestHeaders(['cookie', 'x-csrf-token']);

  // If an interceptor is already set, eject it to remove it
  // this prevents headers being shared across instances
  if (interceptorIdRequest !== null) {
    client.interceptors.request.eject(interceptorIdRequest);
  }

  if (interceptorIdResponse !== null) {
    client.interceptors.response.eject(interceptorIdResponse);
  }

  interceptorIdResponse = client.interceptors.response.use((response) => {
    console.log('response', response);
    if (response.config.baseURL?.includes('/plentysystems')) {
      if (process.server) {
        const cookie = useCookie('plentyID');
        const plentyId = response.headers['set-cookie']?.find((cookie) => cookie.includes('plentyID'))?.split(';')[0];
        if (plentyId) {
          const value = plentyId.split('=')[1];
          cookie.value = decodeURIComponent(value);
        }
      }

      if (response.headers['x-csrf-token'] && response.headers['x-csrf-token'].length > 0) {
        token.value = response.headers['x-csrf-token'];
      }
    }

    return response;
  });

  // Add cookie header to every request that is called during the ssr render process.
  // This ensures that the session is established and other required cookies are sent to the server.
  interceptorIdRequest = client.interceptors.request.use(
    (config) => {
      console.log('request config', config);
      if (config.baseURL?.includes('/plentysystems')) {
        if (!config.headers) {
          config.headers = {} as AxiosRequestHeaders;
        }

        if (process.server) {
          if (ssrLocale.value) {
            headers.cookie = headers.cookie?.includes('vsf-locale')
              ? headers.cookie.replaceAll(/vsf-locale=[^;]+/g, `vsf-locale=${ssrLocale.value}`)
              : `${headers.cookie ?? ''};vsf-locale=${ssrLocale.value};`;
          }

          config.headers.cookie = headers.cookie ?? '';
          if (config.headers.cookie.length > 0 && config.headers.cookie.endsWith('')) {
            config.headers.cookie += ';';
          }
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
