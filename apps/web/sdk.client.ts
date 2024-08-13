import axios, { AxiosError } from 'axios';
import { SdkHttpError } from '@vue-storefront/sdk';
import { updateVsfLocale } from './utils/sdkClientHelper';

export const httpClient = async (url: any, params: any, config: any) => {
  try {
    const client = axios.create({
      withCredentials: true,
    });
    if (tryUseNuxtApp()) {
      const { token } = useCsrfToken();
      const { $i18n } = useNuxtApp();

      client.interceptors.request.use((request) => {
        if (token.value) {
          request.headers['x-csrf-token'] = token.value;
        }

        if (process.server) {
          request.headers['cookie'] = updateVsfLocale(request.headers['cookie'], $i18n.locale.value);
        }

        return request;
      });

      client.interceptors.response.use((response) => {
        if (response.headers['x-csrf-token']) {
          token.value = response.headers['x-csrf-token'];
        }
        return response;
      });
    }
    const { data } = await client(url, {
      ...config,
      data: params,
    });

    return data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.error(error);

    throw new SdkHttpError({
      statusCode: Number(axiosError?.response?.status),
      message: axiosError.response?.statusText ?? axiosError.message,
      cause: axiosError.response?.data ?? {},
    });
  }
};
