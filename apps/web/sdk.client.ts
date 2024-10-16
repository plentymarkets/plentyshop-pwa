import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { SdkHttpError } from '@vue-storefront/sdk';
import { updateVsfLocale } from './utils/sdkClientHelper';

// eslint-disable-next-line sonarjs/cognitive-complexity
const createHttpClient = () => {
  const client = axios.create({ withCredentials: true });

  if (tryUseNuxtApp()) {
    const { token } = useCsrfToken();
    const { $i18n } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const referrerId = useRoute().query?.ReferrerID?.toString() ?? '';
    const noCache = runtimeConfig.public.noCache || useRoute().query?.noCache?.toString() || '';
    const configId = runtimeConfig.public.configId;

    client.interceptors.request.use((request) => {
      if (token.value) request.headers['x-csrf-token'] = token.value;
      if (referrerId) request.headers['referrerID'] = referrerId;
      if (noCache) request.headers['noCache'] = noCache;
      if (configId) request.headers['x-config-id'] = configId;
      if (import.meta.server) {
        request.headers['cookie'] = updateVsfLocale(request.headers['cookie'], $i18n.locale.value);
      }
      return request;
    });

    client.interceptors.response.use((response) => {
      if (response.headers['x-csrf-token']) token.value = response.headers['x-csrf-token'];
      return response;
    });
  }

  return client;
};

const handleHttpError = (error: unknown) => {
  const axiosError = error as AxiosError;
  console.error(error);

  throw new SdkHttpError({
    statusCode: Number(axiosError?.response?.status),
    message: axiosError.response?.statusText ?? axiosError.message,
    cause: axiosError.response?.data ?? {},
  });
};

export const httpClient = async (url: string, params: unknown, config: AxiosRequestConfig<unknown> | undefined) => {
  try {
    const client = createHttpClient();
    const { data } = await client(url, { ...config, data: params });
    return data;
  } catch (error: unknown) {
    handleHttpError(error);
  }
};
