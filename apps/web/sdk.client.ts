import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { SdkHttpError } from '@vue-storefront/sdk';
import { updateVsfLocale } from './utils/sdkClientHelper';

// eslint-disable-next-line sonarjs/cognitive-complexity
const createHttpClient = () => {
  const client = axios.create({ withCredentials: true });

  if (tryUseNuxtApp()) {
    const { token } = useCsrfToken();
    const { $i18n } = useNuxtApp();
    const referrerId = useRoute().query?.ReferrerID?.toString() ?? '';
    const noCache = useRoute().query?.noCache?.toString() ?? '';

    client.interceptors.request.use((request) => {
      if (token.value) request.headers['x-csrf-token'] = token.value;
      if (referrerId) request.headers['referrerID'] = referrerId;
      if (noCache) request.headers['noCache'] = noCache;
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

export interface PlentyErrorParams {
  code: string;
  message: string;
  cause: any;
}

export class PlentyError {

  public code: string = '';
  public message: string = '';
  public cause: any = null
  constructor(
    errorParams: PlentyErrorParams
  ) {
    this.code = errorParams.code;
    this.message = errorParams.message;
    this.cause = errorParams.cause;
  }
}

const handleHttpError = (error: unknown) => {
  const axiosError = error as any;
  console.log(error);

  throw new PlentyError({
    code: axiosError?.response?.data?.error?.code ?? axiosError?.response?.status ?? axiosError.status,
    message: axiosError?.response?.data?.error?.message ?? axiosError?.response?.statusText ?? axiosError.message,
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
